"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPath } from "@/lib/utils";

/** Sends a logged-in user who opens another role's route back to their own dashboard. */
export default function RoleGuard({ role: required, children }) {
  const { user, role, isPending } = useAuth();
  const router = useRouter();
  const allowed = !!user && role === required;

  useEffect(() => {
    if (isPending || !user) return;
    if (role !== required) {
      toast.error("Forbidden: you don't have access to that area");
      router.replace(dashboardPath(role));
    }
  }, [isPending, user, role, required, router]);

  if (isPending || !allowed) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-24" />)}</div>
      </div>
    );
  }
  return children;
}
