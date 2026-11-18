"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPath, safeRedirect } from "@/lib/utils";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const { user, role, isPending } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  // a logged-in user never needs this page
  useEffect(() => {
    if (!isPending && user && !busy) router.replace(redirect || dashboardPath(role));
  }, [isPending, user, role, redirect, router, busy]);

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { data, error } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    if (error) {
      setBusy(false);
      toast.error(error.message || "Wrong email or password");
      return;
    }
    resetToken();
    toast.success("Welcome back!");
    router.replace(redirect || dashboardPath(data?.user?.role));
    router.refresh();
  }

  const google = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: redirect || "/dashboard" });
  };

  return (
    <div className="card w-full max-w-md p-8">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="mt-2 text-sm text-ink-500">Welcome back. Pick up your repair jobs where you left them.</p>

      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="input pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in..." : "Sign In"}</button>
      </form>

      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-ink-500"><span className="h-px flex-1 bg-ink-100" /> or <span className="h-px flex-1 bg-ink-100" /></div>
          <button type="button" onClick={google} className="btn-outline w-full">Continue with Google</button>
        </>
      )}

      <p className="mt-6 text-center text-sm text-ink-500">
        New to FixMate?{" "}
        <Link href={redirect ? `/sign-up?redirect=${encodeURIComponent(redirect)}` : "/sign-up"} className="font-semibold text-brand-700 underline underline-offset-4">Create an account</Link>
      </p>
    </div>
  );
}
