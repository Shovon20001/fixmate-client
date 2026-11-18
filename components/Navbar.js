"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPath } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

const roleStyle = {
  customer: "bg-blue-50 text-blue-700 ring-blue-200",
  technician: "bg-brand-50 text-brand-700 ring-brand-200",
  admin: "bg-ink text-white ring-ink",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isPending } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenu(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

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

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="skeleton h-9 w-9 rounded-full" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenu((v) => !v)} aria-label="Open account menu" aria-expanded={menu} className="rounded-full ring-2 ring-transparent hover:ring-brand-200">
                <Avatar user={user} />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-tag">
                  <div className="border-b border-ink-100 p-4">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${roleStyle[role]}`}>{role}</span>
                  </div>
                  <div className="p-1.5 text-sm">
                    <Link href={dashboardPath(role)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-ink-50">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-ink-50">
                      <UserCog className="h-4 w-4" /> Update Profile
                    </Link>
                    <button onClick={signOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="btn-outline">Sign In</Link>
              <Link href="/sign-up" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 hover:bg-ink-50 md:hidden" aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <div className="container-page space-y-1 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink-700"}`}>
                {l.label}
              </Link>
            ))}
            <div className="border-t border-ink-100 pt-3">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 pb-2">
                    <Avatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${roleStyle[role]}`}>{role}</span>
                    </div>
                  </div>
                  <Link href={dashboardPath(role)} className="block rounded-lg px-3 py-2.5 text-sm font-medium">Dashboard</Link>
                  <Link href="/dashboard/profile" className="block rounded-lg px-3 py-2.5 text-sm font-medium">Update Profile</Link>
                  <button onClick={signOut} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600">Sign Out</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/sign-in" className="btn-outline flex-1">Sign In</Link>
                  <Link href="/sign-up" className="btn-primary flex-1">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
