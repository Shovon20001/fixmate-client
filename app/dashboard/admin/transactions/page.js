"use client";
import { Banknote, Receipt } from "lucide-react";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import EmptyState from "@/components/EmptyState";
import StatsCard from "@/components/StatsCard";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const { data, loading, error, reload } = useAsync(() => api("/api/admin/payments"), []);
  const columns = [
    { key: "customerName", label: "Customer", render: (p) => <div className="text-left"><p className="font-semibold">{p.customerName}</p><p className="text-xs text-ink-500">{p.customerEmail}</p></div> },
    { key: "technicianName", label: "Technician" },
    { key: "serviceTitle", label: "Service" },
    { key: "amount", label: "Amount", render: (p) => <span className="font-semibold">{formatMoney(p.amount)}</span> },
    { key: "transactionId", label: "Transaction ID", render: (p) => <span className="break-all font-mono text-xs">{p.transactionId}</span> },
    { key: "paidAt", label: "Paid on", render: (p) => formatDateTime(p.paidAt) },
  ];
  return (
    <>
      <PageHeader title="Transactions" subtitle="Every Stripe payment recorded on the platform." />
      <div className="mb-6 max-w-xs">
        <StatsCard label="Total revenue" value={formatMoney(data?.totalRevenue)} icon={Banknote} loading={loading} />
      </div>
      {loading ? <TableSkeleton /> : error ? (
        <EmptyState title="Couldn't load transactions" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" text="Payments appear here after customers pay for completed jobs." />
      ) : (
        <ResponsiveTable columns={columns} rows={data.items} rowKey={(p) => p._id} />
      )}
    </>
  );
}
