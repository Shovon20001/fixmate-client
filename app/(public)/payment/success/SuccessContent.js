"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { api } from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const { isPending } = useAuth();
  const [state, setState] = useState({ status: "loading", payment: null, error: "" });

  useEffect(() => {
    if (isPending) return;
    if (!sessionId) return setState({ status: "error", payment: null, error: "No payment session was found." });
    let cancelled = false;
    // safe to call more than once: the server never saves the same payment twice
    api("/api/payments/verify", { query: { session_id: sessionId } })
      .then(({ payment }) => {
        if (cancelled) return;
        setState({ status: "ok", payment, error: "" });
        toast.success("Payment received");
      })
      .catch((e) => !cancelled && setState({ status: "error", payment: null, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [sessionId, isPending]);

  if (state.status === "loading") {
    return (
      <div className="card flex max-w-md flex-col items-center p-10 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        <p className="mt-4 font-semibold">Confirming your payment...</p>
        <p className="mt-1 text-sm text-ink-500">Please don&apos;t close this page.</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="card max-w-md p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600"><TriangleAlert className="h-9 w-9" /></span>
        <h1 className="mt-5 text-2xl font-bold">We couldn&apos;t confirm the payment</h1>
        <p className="mt-2 text-sm text-ink-500">{state.error}</p>
        <Link href="/dashboard/customer/bookings" className="btn-primary mt-7">Back to My Bookings</Link>
      </div>
    );
  }

  const p = state.payment;
  return (
    <div className="card w-full max-w-md p-10 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"><CircleCheck className="h-9 w-9" /></span>
      <h1 className="mt-5 text-2xl font-bold">Payment successful</h1>
      <p className="mt-2 text-sm text-ink-500">Thank you. Your technician has been paid for the completed repair.</p>
      <dl className="mt-7 divide-y divide-ink-100 rounded-xl bg-ink-50 text-left text-sm">
        <div className="flex justify-between gap-4 p-3.5"><dt className="text-ink-500">Service</dt><dd className="text-right font-semibold">{p.serviceTitle}</dd></div>
        <div className="flex justify-between gap-4 p-3.5"><dt className="text-ink-500">Amount paid</dt><dd className="font-display text-lg font-bold">{formatMoney(p.amount)}</dd></div>
        <div className="flex justify-between gap-4 p-3.5"><dt className="text-ink-500">Transaction ID</dt><dd className="break-all text-right font-mono text-xs">{p.transactionId}</dd></div>
        <div className="flex justify-between gap-4 p-3.5"><dt className="text-ink-500">Paid on</dt><dd className="text-right font-semibold">{formatDateTime(p.paidAt)}</dd></div>
      </dl>
      <Link href="/dashboard/customer/bookings" className="btn-primary mt-7 w-full">Back to My Bookings</Link>
    </div>
  );
}
