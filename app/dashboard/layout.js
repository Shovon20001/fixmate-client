"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarCheck, ClipboardList, CreditCard, Home, LayoutDashboard, LogOut, Menu, PlusCircle, ReceiptText, ShieldCheck, UserCog, Users, Wrench, X } from "lucide-react";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const MENUS = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/technician/add-service", label: "Add a Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: ClipboardList },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: CalendarCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
  ],
};

const roleStyle = {
  customer: "bg-blue-50 text-blue-700 ring-blue-200",
  technician: "bg-brand-50 text-brand-700 ring-brand-200",
  admin: "bg-ink text-white ring-ink",
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isPending } = useAuth();
  const [open, setOpen] = useState(false);

  // not logged in (and the session has finished loading) -> sign in, then come back here
  useEffect(() => {
    if (!isPending && !user) router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
  }, [isPending, user, pathname, router]);

  useEffect(() => setOpen(false), [pathname]);

  const signOut = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          resetToken();
          toast.success("Signed out successfully");
          router.push("/");
          router.refresh();
        },
      },
    });

  // never redirect a logged-in user on reload: wait for the session, show a skeleton meanwhile
  if (isPending || !user) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden w-64 shrink-0 bg-ink lg:block" />
        <div className="flex-1 space-y-4 p-8">
          <div className="skeleton h-10 w-60" />
          <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-24" />)}</div>
        </div>
      </div>
    );
  }

  const menu = MENUS[role] || MENUS.customer;
  const isActive = (m) => (m.exact ? pathname === m.href : pathname.startsWith(m.href));

  return (
    <div className="min-h-screen lg:flex">
      {open && <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-ink-200 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`} aria-label="Dashboard menu">
        <div className="flex h-16 items-center justify-between px-5">
          <Logo light />
          <button className="rounded-lg p-1.5 hover:bg-ink-800 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {menu.map((m) => (
            <Link key={m.href} href={m.href} aria-current={isActive(m) ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(m) ? "bg-brand-600 text-white" : "hover:bg-ink-800 hover:text-white"}`}>
              <m.icon className="h-5 w-5" /> {m.label}
            </Link>
          ))}
          <div className="my-3 border-t border-ink-800" />
          <Link href="/dashboard/profile" aria-current={pathname === "/dashboard/profile" ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === "/dashboard/profile" ? "bg-brand-600 text-white" : "hover:bg-ink-800 hover:text-white"}`}>
            <UserCog className="h-5 w-5" /> Update Profile
          </Link>
        </nav>
        <div className="border-t border-ink-800 p-3">
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-ink-800 hover:text-white"><LogOut className="h-5 w-5" /> Sign Out</button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-ink-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-ink-50 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></button>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink"><Home className="h-4 w-4" /> <span className="hidden sm:inline">Back to Home</span></Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{user.name}</p>
              <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset ${roleStyle[role]}`}>{role}</span>
            </div>
            <Avatar user={user} />
          </div>
        </header>
        <main className="w-full p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
