"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PackageOpen, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import Modal, { ConfirmModal } from "@/components/Modal";
import ServiceForm from "@/components/ServiceForm";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

function Switch({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-green-500" : "bg-ink-200"}`}>
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function MyServicesPage() {
  const { user } = useAuth();
  const { data: services, loading, error, reload } = useAsync(() => api("/api/services/mine"), []);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  async function toggle(s) {
    try {
      await api(`/api/services/${s._id}/availability`, { method: "PATCH", body: { isAvailable: !s.isAvailable } });
      toast.success(s.isAvailable ? "Service hidden from public pages" : "Service is now visible");
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function saveEdit(data) {
    try {
      await api(`/api/services/${editing._id}`, { method: "PATCH", body: data });
      toast.success("Service updated and sent back for approval");
      setEditing(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await api(`/api/services/${deleting._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleting(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
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
          <span className="font-semibold">{s.title}</span>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    { key: "basePrice", label: "Price", render: (s) => formatMoney(s.basePrice) },
    { key: "approvalStatus", label: "Approval", render: (s) => <StatusBadge status={s.approvalStatus} /> },
    {
      key: "isAvailable",
      label: "Available",
      render: (s) => (
        <div className="flex items-center justify-end gap-2 md:justify-start">
          <Switch checked={s.isAvailable} onChange={() => toggle(s)} label={`Toggle availability of ${s.title}`} />
          <span className="text-xs text-ink-500">{s.isAvailable ? "On" : "Off"}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (s) => (
        <div className="flex justify-end gap-2 md:justify-start">
          <button className="btn-outline btn-sm" onClick={() => setEditing(s)}><Pencil className="h-3.5 w-3.5" /> Edit</button>
          <button className="btn-outline btn-sm !border-red-200 !text-red-600 hover:!bg-red-50" onClick={() => setDeleting(s)}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="My services" subtitle="Editing a service sends it back to the admin for approval.">
        <Link href="/dashboard/technician/add-service" className="btn-primary">Add a service</Link>
      </PageHeader>
      {loading ? <TableSkeleton /> : error ? (
        <EmptyState title="Couldn't load your services" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : services.length === 0 ? (
        <EmptyState icon={PackageOpen} title="You haven't added a service yet" text="List your first repair service so customers can find you." actionLabel="Add a service" href="/dashboard/technician/add-service" />
      ) : (
        <ResponsiveTable columns={columns} rows={services} rowKey={(s) => s._id} />
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit service" wide>
        {editing && <ServiceForm initial={editing} user={user} onSubmit={saveEdit} submitLabel="Save changes" onCancel={() => setEditing(null)} />}
      </Modal>

      <ConfirmModal open={!!deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} loading={busy} title="Delete this service?" message={`"${deleting?.title}" will be removed permanently. Existing bookings keep their own copy of the details.`} confirmLabel="Delete service" />
    </>
  );
}
