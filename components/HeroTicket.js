import { BadgeCheck, Check, Smartphone } from "lucide-react";

/** The hero visual: a repair-shop job ticket showing exactly what FixMate tracks. */
export default function HeroTicket() {
  const steps = [
    { label: "Requested", time: "Mon, 9:40 AM", done: true },
    { label: "Accepted", time: "Mon, 10:05 AM", done: true },
    { label: "In Progress", time: "Mon, 2:30 PM", done: true, current: true },
    { label: "Completed", time: "Waiting", done: false },
    { label: "Paid", time: "Pay only after the repair", done: false },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -right-3 -top-3 h-full w-full rotate-3 rounded-2xl bg-brand-100" aria-hidden="true" />
      <div className="relative rounded-2xl border border-ink-100 bg-white p-6 shadow-tag">
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-ink-200 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white"><Smartphone className="h-6 w-6" /></span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">iPhone Screen Replacement</p>
              <p className="text-sm text-ink-500">Job #FM-2048 &middot; Home visit</p>
            </div>
          </div>
          <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">In Progress</span>
        </div>

        <ol className="mt-5 space-y-4">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-3">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${s.done ? "bg-green-500 text-white" : "border-2 border-ink-200 text-transparent"} ${s.current ? "ring-4 ring-green-100" : ""}`}>
                <Check className="h-4 w-4" />
              </span>
              <div className="flex flex-1 items-center justify-between gap-2">
                <span className={`text-sm font-semibold ${s.done ? "text-ink" : "text-ink-500"}`}>{s.label}</span>
                <span className="text-xs text-ink-500">{s.time}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
          <BadgeCheck className="h-8 w-8 shrink-0 text-brand-600" />
          <p className="text-sm text-ink-700"><span className="font-semibold text-ink">Rafiq Ahmed</span> is a verified technician. You pay only when the job is done.</p>
        </div>
      </div>
    </div>
  );
}
