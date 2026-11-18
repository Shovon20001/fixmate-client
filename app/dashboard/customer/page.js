"use client";
import Link from "next/link";
import { CalendarCheck, CircleCheck, Hammer } from "lucide-react";
import PageHeader from "../PageHeader";
import StatsCard from "@/components/StatsCard";
import { MonthlyBarChart, StatusPieChart } from "@/components/Charts";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function CustomerOverview() {
  const { user } = useAuth();
  const { data, loading, error } = useAsync(() => api("/api/stats/customer"), []);

  return (
    <>
      <PageHeader title={`Hello, ${user?.name?.split(" ")[0] || "there"}`} subtitle="Here is where your repair jobs stand.">
        <Link href="/services" className="btn-primary">Find a technician</Link>
      </PageHeader>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error.message}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Total Requests" value={data?.total} icon={CalendarCheck} loading={loading} />
        <StatsCard label="Active Jobs" value={data?.active} icon={Hammer} loading={loading} />
        <StatsCard label="Completed Jobs" value={data?.completed} icon={CircleCheck} loading={loading} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatusPieChart data={data?.byStatus} title="My jobs by status" />
        <MonthlyBarChart title="My spending (last 6 months)" data={data?.spending || []} label="Spent" />
      </div>
    </>
  );
}
