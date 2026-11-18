import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import XIcon from "./XIcon";
import { CATEGORIES } from "@/lib/constants";

export default function Footer() {
  const social = [
    { label: "X", href: "https://x.com", icon: <XIcon /> },
    { label: "Facebook", href: "https://facebook.com", icon: <Facebook className="h-4 w-4" /> },
    { label: "Instagram", href: "https://instagram.com", icon: <Instagram className="h-4 w-4" /> },
    { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin className="h-4 w-4" /> },
  ];
  return (
    <footer className="bg-ink text-ink-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
            Verified technicians, a clear job status at every step, and payment only after the repair is done.
          </p>
          <div className="mt-5 flex gap-2">
            {social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 text-white transition-colors hover:bg-brand-600">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/about" className="hover:text-white">How It Works</Link></li>
            <li><Link href="/sign-up" className="hover:text-white">Become a technician</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Popular categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/services?category=${encodeURIComponent(c.name)}`} className="hover:text-white">{c.name} repair</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> support@fixmate.dev</li>
            <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> +880 1700-000000</li>
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> Level 4, Mirpur DOHS, Dhaka 1216</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800 py-5 text-center text-xs text-ink-300">
        &copy; {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </footer>
  );
}
