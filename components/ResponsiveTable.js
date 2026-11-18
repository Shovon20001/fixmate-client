/**
 * Table on md+ screens, stacked cards on phones.
 * columns: [{ key, label, render?(row), className? }]
 */
export default function ResponsiveTable({ columns, rows, rowKey }) {
  return (
    <>
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-xs font-semibold text-ink-700">
            <tr>{columns.map((c) => <th key={c.key} className="whitespace-nowrap px-4 py-3">{c.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="align-middle hover:bg-ink-50/60">
                {columns.map((c) => <td key={c.key} className={`px-4 py-3 ${c.className || ""}`}>{c.render ? c.render(row) : row[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="card space-y-2.5 p-4">
            {columns.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-4 text-sm">
                <span className="shrink-0 text-ink-500">{c.label}</span>
                <span className="min-w-0 text-right font-medium">{c.render ? c.render(row) : row[c.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="card divide-y divide-ink-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="skeleton h-10 w-14" />
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
