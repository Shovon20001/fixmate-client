import { STATUS_LABEL, STATUS_STYLE } from "@/lib/constants";

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLE[status] || STATUS_STYLE.cancelled}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}
