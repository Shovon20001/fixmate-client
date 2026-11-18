"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageHeader from "../PageHeader";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, role, isPending, refetch } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", area: "", bio: "", image: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "", area: user.area || "", bio: user.bio || "", image: user.image || "" });
  }, [user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(ev) {
    ev.preventDefault();
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters");
    setError("");
    setBusy(true);
    try {
      await api("/api/users/profile", { method: "PATCH", body: form });
      await refetch(); // navbar + dashboard top bar update immediately, no sign-out needed
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (isPending || !user) return <div className="skeleton h-96 w-full max-w-2xl" />;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Update profile" subtitle="Your name and photo appear in the navbar and on your bookings." />
      <form onSubmit={submit} className="card space-y-5 p-6" noValidate>
        <ImageUploader label="Profile photo" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} round />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" value={form.name} onChange={set("name")} />
            {error && <p className="field-error">{error}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={user.email} readOnly disabled />
          </div>
          <div>
            <label className="label">Role</label>
            <input className="input capitalize" value={role} readOnly disabled />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" className="input" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="label" htmlFor="area">Area</label>
            <input id="area" className="input" value={form.area} onChange={set("area")} placeholder="Mirpur, Dhaka" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="bio">Bio</label>
            <textarea id="bio" rows={4} className="input" value={form.bio} onChange={set("bio")} placeholder={role === "technician" ? "Your skills and years of experience" : "A short note about you"} maxLength={400} />
          </div>
        </div>
        <div className="flex justify-end"><button className="btn-primary" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button></div>
      </form>
    </div>
  );
}
