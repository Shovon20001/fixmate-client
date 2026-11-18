import Link from "next/link";
import { ArrowRight, CreditCard, ListChecks, Search, SendHorizontal, ShieldCheck, Wallet, Wrench } from "lucide-react";
import HeroTicket from "@/components/HeroTicket";
import ServiceCard from "@/components/ServiceCard";
import EmptyState from "@/components/EmptyState";
import { serverFetch } from "@/lib/server-api";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const steps = [
  { icon: Search, title: "Find a service", text: "Search verified technicians by device, area and price." },
  { icon: SendHorizontal, title: "Send a request", text: "Share the problem, your address and a preferred date." },
  { icon: Wrench, title: "Technician fixes it", text: "Follow the job from accepted to in progress to completed." },
  { icon: CreditCard, title: "Pay after completion", text: "Pay securely online only when the repair is delivered." },
];

const trust = [
  { icon: ShieldCheck, title: "Verified technicians", text: "Every service listing is reviewed and approved by our admins before it goes live." },
  { icon: ListChecks, title: "A status for every job", text: "No more guessing. See exactly where your device is, step by step." },
  { icon: Wallet, title: "Pay after service", text: "The Pay Now button only appears once your technician marks the job completed." },
];

export default async function HomePage() {
  const [latest, stats] = await Promise.all([serverFetch("/api/services?limit=6&sort=newest"), serverFetch("/api/stats/public")]);
  const services = latest.data?.items || [];
  const s = stats.data || { technicians: 0, completedJobs: 0, activeServices: 0 };

  return (
    <>
      {/* HERO */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Broken device? Get it fixed by verified technicians.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-500">
              Book phone, laptop, AC, fridge, TV and washing machine repairs. Follow the job at every step and pay only after the work is done.
            </p>
            <form action="/services" method="get" className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">Search repair services</label>
              <input id="hero-search" name="search" className="input flex-1 py-3" placeholder="Try &quot;screen replacement&quot; or &quot;AC&quot;" />
              <button className="btn-primary py-3">Find a technician</button>
            </form>
            <p className="mt-4 text-sm text-ink-500">
              Are you a technician?{" "}
              <Link href="/sign-up" className="font-semibold text-brand-700 underline underline-offset-4">List your services</Link>
            </p>
          </div>
          <HeroTicket />
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Latest repair services</h2>
              <p className="section-sub">Freshly approved listings from technicians near you.</p>
            </div>
            <Link href="/services" className="btn-outline">Browse all services <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10">
            {services.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((svc) => <ServiceCard key={svc._id} service={svc} />)}
              </div>
            ) : (
              <EmptyState title="No services yet" text="Approved services will appear here as soon as technicians add them." actionLabel="Browse services" href="/services" />
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section bg-white">
        <div className="container-page">
          <h2 className="section-title">How FixMate works</h2>
          <p className="section-sub">Four steps from a broken device to a working one.</p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <li key={st.title} className="relative rounded-xl border border-ink-100 bg-mist p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white"><st.icon className="h-6 w-6" /></span>
                <p className="mt-5 text-sm font-semibold text-brand-700">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold">{st.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CATEGORIES + WHY US */}
      <section className="section">
        <div className="container-page">
          <h2 className="section-title">Popular categories</h2>
          <p className="section-sub">Pick a device type to see only the services that match.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/services?category=${encodeURIComponent(c.name)}`} className="group card flex items-center gap-4 p-4 transition-colors hover:border-brand-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/services/${c.slug}.svg`} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold group-hover:text-brand-700">{c.name}</h3>
                  <p className="line-clamp-2 text-xs text-ink-500">{c.blurb}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 grid gap-10 rounded-2xl bg-ink p-8 text-white sm:p-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold !text-white sm:text-4xl">Why people choose FixMate</h2>
              <dl className="mt-8 grid grid-cols-3 gap-4">
                {[
                  [s.technicians, "Technicians"],
                  [s.completedJobs, "Jobs completed"],
                  [s.activeServices, "Live services"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="text-xs text-ink-300">{l}</dt>
                    <dd className="font-display text-3xl font-bold text-brand-500">{n}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ul className="space-y-6 lg:col-span-3">
              {trust.map((t) => (
                <li key={t.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-800 text-brand-500"><t.icon className="h-5 w-5" /></span>
                  <div>
                    <h3 className="text-lg font-semibold !text-white">{t.title}</h3>
                    <p className="mt-1 text-sm text-ink-300">{t.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
