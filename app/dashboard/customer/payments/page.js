"use client";
import { Receipt } from "lucide-react";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import EmptyState from "@/components/EmptyState";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function CustomerPaymentsPage() {
  const { data, loading, error, reload } = useAsync(() => api("/api/payments/my"), []);
  const columns = [
    { key: "serviceTitle", label: "Service", render: (p) => <span className="font-semibold">{p.serviceTitle}</span> },
    { key: "technicianName", label: "Technician" },
    { key: "amount", label: "Amount", render: (p) => <span className="font-semibold">{formatMoney(p.amount)}</span> },
    { key: "transactionId", label: "Transaction ID", render: (p) => <span className="break-all font-mono text-xs">{p.transactionId}</span> },
    { key: "paidAt", label: "Paid on", render: (p) => formatDateTime(p.paidAt) },
  ];
  return (
    <>
      <PageHeader title="Payment history" subtitle="Every repair you have paid for." />
      {loading ? <TableSkeleton /> : error ? (
        <EmptyState title="Couldn't load payments" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : data.length === 0 ? (
        <EmptyState icon={Receipt} title="No payments yet" text="Once you pay for a completed job it will show up here." actionLabel="View my bookings" href="/dashboard/customer/bookings" />
      ) : (
        <ResponsiveTable columns={columns} rows={data} rowKey={(p) => p._id} />
      )}
    </>
  );
}
