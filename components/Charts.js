"use client";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { STATUS_CHART_COLOR, STATUS_LABEL } from "@/lib/constants";
import { monthLabel } from "@/lib/utils";

function ChartCard({ title, children, empty }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      {empty ? <p className="flex h-[240px] items-center justify-center text-sm text-ink-500">No data yet</p> : <div className="h-[240px]">{children}</div>}
    </div>
  );
}

export function StatusPieChart({ title = "Jobs by status", data = [] }) {
  const rows = data.filter((d) => d.count > 0).map((d) => ({ ...d, name: STATUS_LABEL[d.status] }));
  return (
    <ChartCard title={title} empty={rows.length === 0}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="count" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {rows.map((r) => <Cell key={r.status} fill={STATUS_CHART_COLOR[r.status]} />)}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MonthlyBarChart({ title, data = [], color = "#d9500a", label = "Amount" }) {
  const rows = data.map((d) => ({ ...d, name: monthLabel(d.month) }));
  const empty = rows.every((r) => !r.total);
  return (
    <ChartCard title={title} empty={empty}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ left: -10, right: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3eaf0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, label]} />
          <Bar dataKey="total" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CategoryBarChart({ title = "Services by category", data = [] }) {
  return (
    <ChartCard title={title} empty={data.length === 0}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e3eaf0" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="count" name="Services" fill="#0f2a3d" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
