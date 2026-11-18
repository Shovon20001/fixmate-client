"use client";
import { toast } from "sonner";
import PageHeader from "../../PageHeader";
import ResponsiveTable, { TableSkeleton } from "@/components/ResponsiveTable";
import EmptyState from "@/components/EmptyState";
import Avatar from "@/components/Avatar";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const { data: users, loading, error, reload } = useAsync(() => api("/api/admin/users"), []);

  async function changeRole(u, role) {
    try {
      await api(`/api/admin/users/${u._id}/role`, { method: "PATCH", body: { role } });
      toast.success(`${u.name} is now a ${role}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      reload();
    }
  }

  const columns = [
    {
      key: "name",
      label: "User",
      render: (u) => (
        <div className="flex items-center gap-3 text-left">
          <Avatar user={u} size="h-9 w-9" />
          <span className="font-semibold">{u.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (u) => {
        const self = String(u._id) === me?.id;
        return (
          <select aria-label={`Role of ${u.name}`} className="input !w-auto !py-1.5 capitalize" value={u.role || "customer"} disabled={self} title={self ? "You cannot change your own role" : undefined} onChange={(e) => changeRole(u, e.target.value)}>
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
    { key: "createdAt", label: "Joined", render: (u) => formatDate(u.createdAt) },
  ];

  return (
    <>
      <PageHeader title="Manage users" subtitle="Change a user's role. You cannot change your own." />
      {loading ? <TableSkeleton /> : error ? (
        <EmptyState title="Couldn't load users" text={error.message} actionLabel="Try again" onAction={reload} />
      ) : (
        <ResponsiveTable columns={columns} rows={users} rowKey={(u) => String(u._id)} />
      )}
    </>
  );
}
