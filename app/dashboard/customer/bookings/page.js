"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarX, CreditCard, Route } from "lucide-react";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Modal, { ConfirmModal } from "@/components/Modal";
import JobTimeline from "@/components/JobTimeline";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/utils";

export default function MyBookingsPage() {
  const { data: bookings, loading, error, reload } = useAsync(() => api("/api/bookings/my"), []);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [trackTarget, setTrackTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState(null);

  async function confirmCancel() {
    setBusy(true);
    try {
      await api(`/api/bookings/${cancelTarget._id}/cancel`, { method: "PATCH" });
      toast.success("Request cancelled");
      setCancelTarget(null);
      reload();
    } catch (e) {
      toast.error(e.message);
      setCancelTarget(null);
      reload();
    } finally {
      setBusy(false);
    }
  }

  async function payNow(b) {
    setPayingId(b._id);
    try {
      const { url } = await api("/api/payments/create-checkout-session", { method: "POST", body: { bookingId: b._id } });
      window.location.href = url; // Stripe Checkout
    } catch (e) {
      toast.error(e.message);
      setPayingId(null);
    }
  }

  const columns = [
    {
      key: "service",
      label: "Service",
      render: (b) => (
        <div className="flex items-center gap-3 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.serviceImage} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
          <span className="font-semibold">{b.serviceTitle}</span>
        </div>
      ),
    },
    { key: "technicianName", label: "Technician" },
    { key: "preferredDate", label: "Preferred date", render: (b) => formatDate(b.preferredDate) },
    {
      key: "amount",
      label: "Price",
      render: (b) => (b.status === "completed" ? <span className="font-semibold">{formatMoney(b.finalAmount)}</span> : <span className="text-ink-500">from {formatMoney(b.basePrice)}</span>),
    },
    { key: "status", label: "Status", render: (b) => <StatusBadge status={b.status} /> },
    { key: "payment", label: "Payment", render: (b) => (b.status === "completed" ? <StatusBadge status={b.paymentStatus} /> : <span className="text-ink-300">-</span>) },
    {
      key: "actions",
      label: "Actions",
      render: (b) => (
        <div className="flex flex-wrap justify-end gap-2 md:justify-start">
          <button className="btn-outline btn-sm" onClick={() => setTrackTarget(b)}><Route className="h-3.5 w-3.5" /> Track</button>
          {b.status === "requested" && <button className="btn-outline btn-sm !border-red-200 !text-red-600 hover:!bg-red-50" onClick={() => setCancelTarget(b)}>Cancel</button>}
          {b.status === "completed" && b.paymentStatus === "unpaid" && (
            <button className="btn-primary btn-sm" onClick={() => payNow(b)} disabled={payingId === b._id}>
              <CreditCard className="h-3.5 w-3.5" /> {payingId === b._id ? "Redirecting..." : "Pay Now"}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My bookings" subtitle="Track every repair request. Pay Now appears once the job is completed." />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <EmptyState title="Couldn't load your bookings" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : bookings.length === 0 ? (
        <EmptyState icon={CalendarX} title="No bookings yet" text="Find a technician and send your first repair request." actionLabel="Browse services" href="/services" />
      ) : (
        <ResponsiveTable columns={columns} rows={bookings} rowKey={(b) => b._id} />
      )}

      <ConfirmModal open={!!cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={confirmCancel} loading={busy} title="Cancel this request?" message={`Your request for "${cancelTarget?.serviceTitle}" will be cancelled. This cannot be undone.`} confirmLabel="Yes, cancel request" />

      <Modal open={!!trackTarget} onClose={() => setTrackTarget(null)} title={trackTarget ? `Job progress: ${trackTarget.serviceTitle}` : ""}>
        {trackTarget && <JobTimeline booking={trackTarget} />}
      </Modal>
    </>
  );
}
