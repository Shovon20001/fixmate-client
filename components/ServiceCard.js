import Link from "next/link";
import { Clock, MapPin, UserRound, Wrench } from "lucide-react";
import { formatMoney } from "@/lib/utils";

/** Every card has the same height and width: image on top, content stretches, button pinned to the bottom. */
export default function ServiceCard({ service }) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={service.image} alt={service.title} className="aspect-[16/10] w-full object-cover" loading="lazy" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="rounded-full bg-ink-50 px-2.5 py-1 font-semibold text-ink-700">{service.category}</span>
          <span className="flex items-center gap-1 text-ink-500">
            <Wrench className="h-3.5 w-3.5" /> {service.serviceMode}
          </span>
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-snug">{service.title}</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-500">
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> <span className="truncate">{service.serviceArea}</span></li>
          <li className="flex items-center gap-2"><UserRound className="h-4 w-4 shrink-0" /> <span className="truncate">{service.technicianName}</span></li>
          <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /> <span className="truncate">{service.estimatedDuration}</span></li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-ink-500">Starting at</p>
            <p className="font-display text-xl font-bold">{formatMoney(service.basePrice)}</p>
          </div>
          <Link href={`/services/${service._id}`} className="btn-primary">View Details</Link>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-1/2" />
        <div className="skeleton h-6 w-4/5" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}
