"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PageHeader from "../../PageHeader";
import ServiceForm from "@/components/ServiceForm";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function AddServicePage() {
  const { user } = useAuth();
  const router = useRouter();

  async function onSubmit(data) {
    try {
      await api("/api/services", { method: "POST", body: data });
      toast.success("Service added. It is waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Add a service" subtitle="New services stay pending until an admin approves them." />
      <div className="card p-6">
        <ServiceForm user={user} onSubmit={onSubmit} submitLabel="Add service" />
      </div>
    </div>
  );
}
