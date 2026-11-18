"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

const FILTERS = [
  ["pending", "Pending"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
  ["", "All"],
];

export default function AdminServicesPage() {
  const [filter, setFilter] = useState("pending"); // pending services are shown first
  const { data: services, loading, error, reload } = useAsync(() => api("/api/admin/services", { query: { status: filter } }), [filter]);

  async function decide(s, approvalStatus) {
    try {
      await api(`/api/admin/services/${s._id}/approval`, { method: "PATCH", body: { approvalStatus } });
      toast.success(`Service ${approvalStatus}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      reload();
    }
  }

  const columns = [
    {
      key: "title",
      label: "Service",
      render: (s) => (
        <div className="flex items-center gap-3 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.image} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
          <div>
            <p className="font-semibold">{s.title}</p>
            <p className="text-xs text-ink-500">{s.category}</p>
          </div>
        </div>
      ),
    },
    { key: "technicianName", label: "Technician", render: (s) => <div className="text-left"><p>{s.technicianName}</p><p className="text-xs text-ink-500">{s.technicianEmail}</p></div> },
    { key: "basePrice", label: "Price", render: (s) => formatMoney(s.basePrice) },
    { key: "approvalStatus", label: "Approval", render: (s) => <StatusBadge status={s.approvalStatus} /> },
    {
      key: "actions",
      label: "Actions",
      render: (s) => (
        <div className="flex justify-end gap-2 md:justify-start">
          <button className="btn-primary btn-sm" disabled={s.approvalStatus === "approved"} onClick={() => decide(s, "approved")}>Approve</button>
          <button className="btn-outline btn-sm !border-red-200 !text-red-600 hover:!bg-red-50" disabled={s.approvalStatus === "rejected"} onClick={() => decide(s, "rejected")}>Reject</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Service approval" subtitle="Only approved and available services appear on public pages." />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by approval status">
        {FILTERS.map(([value, label]) => (
          <button key={label} role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`btn btn-sm ${filter === value ? "bg-ink text-white" : "border border-ink-200 bg-white hover:bg-ink-50"}`}>{label}</button>
        ))}
      </div>
      {loading ? <TableSkeleton /> : error ? (
        <EmptyState title="Couldn't load services" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : services.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Nothing here" text={filter === "pending" ? "No services are waiting for approval. Nice work." : "No services match this filter."} />
      ) : (
        <ResponsiveTable columns={columns} rows={services} rowKey={(s) => s._id} />
      )}
    </>
  );
}
