export default function StatsCard({ label, value, icon: Icon, hint, loading }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon && (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm text-ink-500">{label}</p>
        {loading ? <div className="skeleton mt-1 h-7 w-16" /> : <p className="font-display text-2xl font-bold">{value}</p>}
        {hint && <p className="text-xs text-ink-500">{hint}</p>}
      </div>
    </div>
  );
}
