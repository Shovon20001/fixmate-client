import Link from "next/link";
import { SearchX } from "lucide-react";

export default function EmptyState({ title, text, actionLabel, href, onAction, icon: Icon = SearchX }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-ink-500">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1.5 max-w-md text-sm text-ink-500">{text}</p>}
      {actionLabel && href && <Link href={href} className="btn-primary mt-5">{actionLabel}</Link>}
      {actionLabel && onAction && <button onClick={onAction} className="btn-primary mt-5">{actionLabel}</button>}
    </div>
  );
}
