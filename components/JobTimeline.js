import { Check, X } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

/** Visual step tracker built from booking.statusHistory */
export default function JobTimeline({ booking }) {
  const history = booking.statusHistory || [];
  const when = (key) => history.find((h) => h.status === key)?.changedAt;
  const ended = ["rejected", "cancelled"].includes(booking.status);

  const steps = ended ? STEPS.slice(0, 1) : STEPS;
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => {
        const done = s.key === "requested" || !!when(s.key) || (s.key === "paid" && booking.paymentStatus === "paid");
        const last = i === steps.length - 1 && !ended;
        return (
          <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && <span className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${done ? "bg-green-500" : "bg-ink-100"}`} />}
            <span className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-green-500 text-white" : "bg-ink-100 text-ink-300"}`}>
              {done ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div>
              <p className={`text-sm font-semibold ${done ? "text-ink" : "text-ink-500"}`}>{s.label}</p>
              <p className="text-xs text-ink-500">{done ? formatDateTime(when(s.key)) : "Waiting"}</p>
            </div>
          </li>
        );
      })}
      {ended && (
        <li className="relative flex gap-4 pt-6">
          <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white"><X className="h-4 w-4" /></span>
          <div>
            <p className="text-sm font-semibold capitalize">{booking.status}</p>
            <p className="text-xs text-ink-500">{formatDateTime(when(booking.status))}</p>
          </div>
        </li>
      )}
    </ol>
  );
}
