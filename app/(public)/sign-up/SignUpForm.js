"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, UserRound, Wrench } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPath, safeRedirect } from "@/lib/utils";

const roles = [
  { value: "customer", title: "Customer", text: "Book repairs and track jobs", icon: UserRound },
  { value: "technician", title: "Technician", text: "List services and manage jobs", icon: Wrench },
];

export function validatePassword(p) {
  if (p.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(p)) return "Password needs at least one uppercase letter";
  if (!/[a-z]/.test(p)) return "Password needs at least one lowercase letter";
  return "";
}

export default function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const { user, role: currentRole, isPending } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user && !busy) router.replace(redirect || dashboardPath(currentRole));
  }, [isPending, user, currentRole, redirect, router, busy]);

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    const pe = validatePassword(form.password);
    if (pe) e.password = pe;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role, // the server only accepts customer or technician (admin is never allowed)
    });
    if (error) {
      setBusy(false);
      toast.error(error.message || "Could not create the account");
      return;
    }
    resetToken();
    toast.success("Account created. Welcome to FixMate!");
    router.replace(redirect || dashboardPath(form.role));
    router.refresh();
  }

  return (
    <div className="card w-full max-w-lg p-8">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-ink-500">Join as a customer to book repairs, or as a technician to offer them.</p>

      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <fieldset>
          <legend className="label">I want to join as</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <label key={r.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${form.role === r.value ? "border-brand-600 bg-brand-50" : "border-ink-200 hover:border-ink-300"}`}>
                <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={() => setForm({ ...form, role: r.value })} className="sr-only" />
                <r.icon className={`mt-0.5 h-5 w-5 ${form.role === r.value ? "text-brand-600" : "text-ink-500"}`} />
                <span>
                  <span className="block text-sm font-semibold">{r.title}</span>
                  <span className="block text-xs text-ink-500">{r.text}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" autoComplete="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} autoComplete="new-password" className="input pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="field-error">{errors.password}</p> : <p className="mt-1 text-xs text-ink-500">At least 6 characters with one uppercase and one lowercase letter.</p>}
        </div>

        <button className="btn-primary w-full" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href={redirect ? `/sign-in?redirect=${encodeURIComponent(redirect)}` : "/sign-in"} className="font-semibold text-brand-700 underline underline-offset-4">Sign in</Link>
      </p>
    </div>
  );
}
