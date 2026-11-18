import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo({ light = false, href = "/" }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="FixMate home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Wrench className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>FixMate</span>
    </Link>
  );
}
