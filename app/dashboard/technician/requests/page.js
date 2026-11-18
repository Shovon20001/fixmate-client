"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Inbox } from "lucide-react";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Modal, { ConfirmModal } from "@/components/Modal";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/utils";

const FILTERS = [
  ["", "All"],
  ["requested", "Requested"],
  ["accepted", "Accepted"],
  ["in-progress", "In Progress"],
  ["completed", "Completed"],
];

export default function RequestsPage() {
  const [filter, setFilter] = useState("");
  const { data: jobs, loading, error, reload } = useAsync(() => api("/api/bookings/technician", { query: { status: filter } }), [filter]);
  const [rejecting, setRejecting] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [busy, setBusy] = useState(false);

  async function changeStatus(job, status, extra = {}) {
    setBusy(true);
    try {
      await api(`/api/bookings/${job._id}/status`, { method: "PATCH", body: { status, ...extra } });
      toast.success(
        status === "accepted" ? "Request accepted" : status === "rejected" ? "Request rejected" : status === "in-progress" ? "Work started" : "Job marked as completed. The customer can pay now."
      );
      setRejecting(null);
      setCompleting(null);
      reload();
    } catch (e) {
      toast.error(e.message);
      reload();
    } finally {
      setBusy(false);
    }
  }

  function openComplete(job) {
    setCompleting(job);
    setAmount(String(job.finalAmount ?? job.basePrice));
    setAmountError("");
  }

  function submitComplete(ev) {
    ev.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return setAmountError("Enter an amount greater than 0");
    changeStatus(completing, "completed", { finalAmount: n });
  }

  // only the buttons that are valid for the current status
  const actions = (j) => {
    if (j.status === "requested")
      return (
        <div className="flex justify-end gap-2 md:justify-start">
          <button className="btn-primary btn-sm" onClick={() => changeStatus(j, "accepted")} disabled={busy}>Accept</button>
          <button className="btn-outline btn-sm !border-red-200 !text-red-600 hover:!bg-red-50" onClick={() => setRejecting(j)} disabled={busy}>Reject</button>
        </div>
      );
    if (j.status === "accepted") return <button className="btn-dark btn-sm" onClick={() => changeStatus(j, "in-progress")} disabled={busy}>Start Work</button>;
    if (j.status === "in-progress") return <button className="btn-primary btn-sm" onClick={() => openComplete(j)} disabled={busy}>Mark Completed</button>;
    if (j.status === "completed") return <StatusBadge status={j.paymentStatus} />;
    return <span className="text-ink-300">-</span>;
  };

  const columns = [
    { key: "customerName", label: "Customer", render: (j) => <span className="font-semibold">{j.customerName}</span> },
    { key: "customerPhone", label: "Phone" },
    { key: "address", label: "Address", className: "max-w-[180px]" },
    { key: "preferredDate", label: "Preferred date", render: (j) => formatDate(j.preferredDate) },
    { key: "serviceTitle", label: "Service" },
    { key: "problemDescription", label: "Problem", className: "max-w-[240px]", render: (j) => <span className="line-clamp-3 text-left md:text-left">{j.problemDescription}</span> },
    { key: "status", label: "Status", render: (j) => <StatusBadge status={j.status} /> },
    { key: "actions", label: "Actions", render: actions },
  ];

  return (
    <>
      <PageHeader title="Manage requests" subtitle="Move each job forward one step at a time." />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {FILTERS.map(([value, label]) => (
          <button key={label} role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`btn btn-sm ${filter === value ? "bg-ink text-white" : "border border-ink-200 bg-white hover:bg-ink-50"}`}>{label}</button>
        ))}
      </div>

      {loading ? <TableSkeleton /> : error ? (
        <EmptyState title="Couldn't load requests" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : jobs.length === 0 ? (
        <EmptyState icon={Inbox} title="No requests here" text={filter ? "No jobs with this status right now." : "When a customer books one of your services it will appear here."} />
      ) : (
        <ResponsiveTable columns={columns} rows={jobs} rowKey={(j) => j._id} />
      )}

      <ConfirmModal open={!!rejecting} onClose={() => setRejecting(null)} onConfirm={() => changeStatus(rejecting, "rejected")} loading={busy} title="Reject this request?" message={`The request from ${rejecting?.customerName} will be rejected. This is final.`} confirmLabel="Reject request" />

      <Modal open={!!completing} onClose={() => !busy && setCompleting(null)} title="Mark job as completed">
        <form onSubmit={submitComplete} noValidate>
          <p className="text-sm text-ink-700">Confirm the final amount for <span className="font-semibold">{completing?.serviceTitle}</span>. The customer can pay as soon as you save.</p>
          <label className="label mt-5" htmlFor="amount">Final amount (USD)</label>
          <input id="amount" type="number" min="0.01" step="0.01" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
          {amountError && <p className="field-error">{amountError}</p>}
          {completing && <p className="mt-2 text-xs text-ink-500">Base price was {formatMoney(completing.basePrice)}.</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setCompleting(null)} disabled={busy}>Cancel</button>
            <button className="btn-primary" disabled={busy}>{busy ? "Saving..." : "Mark completed"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
