"use client";
import { useState } from "react";
import { CalendarX } from "lucide-react";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { JOB_STATUSES, STATUS_LABEL } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [status, setStatus] = useState("");
  const { data: bookings, loading, error, reload } = useAsync(() => api("/api/admin/bookings", { query: { status } }), [status]);

  const columns = [
    { key: "serviceTitle", label: "Service", render: (b) => <span className="font-semibold">{b.serviceTitle}</span> },
    { key: "customerName", label: "Customer", render: (b) => <div className="text-left"><p>{b.customerName}</p><p className="text-xs text-ink-500">{b.customerEmail}</p></div> },
    { key: "technicianName", label: "Technician" },
    { key: "preferredDate", label: "Date", render: (b) => formatDate(b.preferredDate) },
    { key: "status", label: "Status", render: (b) => <StatusBadge status={b.status} /> },
    { key: "paymentStatus", label: "Payment", render: (b) => <StatusBadge status={b.paymentStatus} /> },
    { key: "amount", label: "Amount", render: (b) => formatMoney(b.status === "completed" ? b.finalAmount : b.basePrice) },
  ];

  return (
    <>
      <PageHeader title="All bookings" subtitle="A read-only view of every repair job on the platform.">
        <div>
          <label htmlFor="status" className="sr-only">Filter by status</label>
          <select id="status" className="input !w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {JOB_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
      </PageHeader>
      {loading ? <TableSkeleton /> : error ? (
        <EmptyState title="Couldn't load bookings" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : bookings.length === 0 ? (
        <EmptyState icon={CalendarX} title="No bookings found" text="Nothing matches this filter yet." />
      ) : (
        <ResponsiveTable columns={columns} rows={bookings} rowKey={(b) => b._id} />
      )}
    </>
  );
}
