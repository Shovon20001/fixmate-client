"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck, Info } from "lucide-react";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { todayString } from "@/lib/utils";

export default function RequestPanel({ service }) {
  const { user, role, isPending } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ phone: "", address: "", date: "", problem: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (isPending) return <div className="skeleton mt-5 h-11 w-full" />;

  if (!user) {
    return (
      <Link href={`/sign-in?redirect=${encodeURIComponent(pathname)}`} className="btn-primary mt-5 w-full">
        Request Repair
      </Link>
    );
  }

  if (role !== "customer") {
    return (
      <div className="mt-5">
        <button className="btn-primary w-full" disabled>Request Repair</button>
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-ink-50 p-3 text-xs text-ink-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> Only customers can request a repair.
        </p>
      </div>
    );
  }

  function validate() {
    const e = {};
    if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number";
    if (form.address.trim().length < 5) e.address = "Enter the service or pickup address";
    if (!form.date) e.date = "Choose a preferred date";
    else if (form.date < todayString()) e.date = "Choose today or a future date";
    if (form.problem.trim().length < 20) e.problem = `Describe the problem in at least 20 characters (${form.problem.trim().length}/20)`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: { serviceId: service._id, customerPhone: form.phone, address: form.address, preferredDate: form.date, problemDescription: form.problem },
      });
      toast.success("Repair request sent", {
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      setDone(true);
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {done ? (
        <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800">
          <p className="flex items-center gap-2 font-semibold"><CircleCheck className="h-5 w-5" /> Request sent</p>
          <p className="mt-1">The technician will review it shortly.</p>
          <Link href="/dashboard/customer/bookings" className="mt-3 inline-block font-semibold underline underline-offset-4">Go to My Bookings</Link>
        </div>
      ) : (
        <button className="btn-primary mt-5 w-full" onClick={() => setOpen(true)}>Request Repair</button>
      )}

      <Modal open={open} onClose={() => !busy && setOpen(false)} title={`Request: ${service.title}`} wide>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" value={user.name} readOnly disabled />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={user.email} readOnly disabled />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" className="input" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" inputMode="tel" />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>
            <div>
              <label className="label" htmlFor="date">Preferred date</label>
              <input id="date" type="date" min={todayString()} className="input" value={form.date} onChange={set("date")} />
              {errors.date && <p className="field-error">{errors.date}</p>}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="address">Address</label>
            <input id="address" className="input" value={form.address} onChange={set("address")} placeholder="House, road, area" />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>
          <div>
            <label className="label" htmlFor="problem">Problem description</label>
            <textarea id="problem" rows={4} className="input" value={form.problem} onChange={set("problem")} placeholder="What is wrong with the device? When did it start?" />
            {errors.problem && <p className="field-error">{errors.problem}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</button>
            <button className="btn-primary" disabled={busy}>{busy ? "Sending..." : "Send request"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
