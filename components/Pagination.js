import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button className="btn-outline btn-sm" disabled={page === 1} onClick={() => onChange(page - 1)}><ChevronLeft className="h-4 w-4" /> Previous</button>
      {numbers.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - numbers[i - 1] > 1 && <span className="px-1 text-ink-500">…</span>}
          <button onClick={() => onChange(n)} aria-current={n === page ? "page" : undefined} className={`btn btn-sm ${n === page ? "bg-ink text-white" : "border border-ink-200 bg-white hover:bg-ink-50"}`}>{n}</button>
        </span>
      ))}
      <button className="btn-outline btn-sm" disabled={page === pages} onClick={() => onChange(page + 1)}>Next <ChevronRight className="h-4 w-4" /></button>
    </nav>
  );
}
