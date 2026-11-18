"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPath } from "@/lib/utils";

/** /dashboard -> the right dashboard for the logged-in role */
export default function DashboardIndex() {
  const { user, role, isPending } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isPending && user) router.replace(dashboardPath(role));
  }, [isPending, user, role, router]);
  return <div className="skeleton h-24 w-full" />;
}
