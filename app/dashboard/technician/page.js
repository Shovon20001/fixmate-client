"use client";
import Link from "next/link";
import { BadgeCheck, Clock3, Wrench } from "lucide-react";
import PageHeader from "../PageHeader";
import StatsCard from "@/components/StatsCard";
import { MonthlyBarChart, StatusPieChart } from "@/components/Charts";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function TechnicianOverview() {
  const { user } = useAuth();
  const { data, loading, error } = useAsync(() => api("/api/stats/technician"), []);
  return (
    <>
      <PageHeader title={`Welcome, ${user?.name?.split(" ")[0] || "technician"}`} subtitle="Your services and incoming jobs at a glance.">
        <Link href="/dashboard/technician/add-service" className="btn-primary">Add a service</Link>
      </PageHeader>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error.message}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Total Services" value={data?.totalServices} icon={Wrench} loading={loading} />
        <StatsCard label="Approved Services" value={data?.approvedServices} icon={BadgeCheck} loading={loading} />
        <StatsCard label="Pending Requests" value={data?.pendingRequests} icon={Clock3} loading={loading} hint="Waiting for your reply" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatusPieChart data={data?.byStatus} title="My jobs by status" />
        <MonthlyBarChart title="My earnings (last 6 months)" data={data?.earnings || []} color="#0f2a3d" label="Earned" />
      </div>
    </>
  );
}
