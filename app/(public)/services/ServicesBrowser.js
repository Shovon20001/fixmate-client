"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import ServiceCard, { ServiceCardSkeleton } from "@/components/ServiceCard";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { api } from "@/lib/api";
import { CATEGORIES, MODES } from "@/lib/constants";

const LIMIT = 12;

/**
 * Challenge 1: every control below only changes the URL query string.
 * The actual search / filter / sort / pagination runs in MongoDB through GET /api/services.
 * Because the URL holds the state, filters survive a reload and /services?category=AC works.
 */
export default function ServicesBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const mode = params.get("mode") || "";
  const sort = params.get("sort") || "newest";
  const page = Math.max(1, parseInt(params.get("page")) || 1);

  const [text, setText] = useState(search);
  const [state, setState] = useState({ loading: true, error: "", items: [], total: 0, pages: 1 });

  const update = (changes) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in changes)) next.delete("page"); // any filter change goes back to page 1
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // keep the input in sync when the URL changes from outside (e.g. "Clear filters")
  useEffect(() => setText(search), [search]);

  // debounce typing
  useEffect(() => {
    if (text === search) return;
    const t = setTimeout(() => update({ search: text.trim() }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    api("/api/services", { auth: false, query: { search, category, mode, sort, page, limit: LIMIT } })
      .then((d) => !cancelled && setState({ loading: false, error: "", items: d.items, total: d.total, pages: d.pages }))
      .catch((e) => !cancelled && setState({ loading: false, error: e.message, items: [], total: 0, pages: 1 }));
    return () => {
      cancelled = true;
    };
  }, [search, category, mode, sort, page]);

  const hasFilters = search || category || mode || sort !== "newest";

  return (
    <div className="container-page py-10">
      <div className="card grid gap-3 p-4 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <label htmlFor="search" className="sr-only">Search services</label>
          <input id="search" className="input pl-10" placeholder="Search by title or category" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="category" className="sr-only">Category</label>
          <select id="category" className="input" value={category} onChange={(e) => update({ category: e.target.value })}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="mode" className="sr-only">Service mode</label>
          <select id="mode" className="input" value={mode} onChange={(e) => update({ mode: e.target.value })}>
            <option value="">Any mode</option>
            {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="sort" className="sr-only">Sort</label>
          <select id="sort" className="input" value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex min-h-[2rem] flex-wrap items-center justify-between gap-3 text-sm text-ink-500">
        <p>{state.loading ? "Loading services..." : `${state.total} service${state.total === 1 ? "" : "s"} found`}</p>
        {hasFilters && (
          <button className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline" onClick={() => router.replace(pathname, { scroll: false })}>
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>

      <div className="mt-4">
        {state.loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : state.error ? (
          <EmptyState title="We couldn't load services" text={state.error} actionLabel="Try again" onAction={() => router.refresh()} />
        ) : state.items.length === 0 ? (
          <EmptyState title="No services match your search" text="Try a different keyword, or remove a filter to see more results." actionLabel="Clear filters" onAction={() => router.replace(pathname, { scroll: false })} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {state.items.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
            <Pagination page={page} pages={state.pages} onChange={(p) => update({ page: p > 1 ? String(p) : "" })} />
          </>
        )}
      </div>
    </div>
  );
}
