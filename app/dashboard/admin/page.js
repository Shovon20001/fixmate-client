"use client";
import { ShieldQuestion, UserCog, Users } from "lucide-react";
import PageHeader from "../PageHeader";
import StatsCard from "@/components/StatsCard";
import { CategoryBarChart, MonthlyBarChart, StatusPieChart } from "@/components/Charts";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";

export default function AdminOverview() {
  const { data, loading, error } = useAsync(() => api("/api/stats/admin"), []);
  return (
    <>
      <PageHeader title="Admin overview" subtitle="Platform health, moderation queue and revenue." />
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error.message}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Total Users" value={data?.totalUsers} icon={Users} loading={loading} />
        <StatsCard label="Total Technicians" value={data?.totalTechnicians} icon={UserCog} loading={loading} />
        <StatsCard label="Pending Services" value={data?.pendingServices} icon={ShieldQuestion} loading={loading} hint="Waiting for approval" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MonthlyBarChart title="Revenue (last 6 months)" data={data?.revenue || []} label="Revenue" />
        <StatusPieChart data={data?.byStatus} title="All bookings by status" />
        <div className="lg:col-span-2"><CategoryBarChart data={data?.servicesByCategory || []} /></div>
      </div>
    </>
  );
}
