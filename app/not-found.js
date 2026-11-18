import Link from "next/link";
import { Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <div className="relative">
          <svg viewBox="0 0 200 200" className="h-48 w-48" aria-hidden="true">
            <circle cx="100" cy="100" r="88" fill="#e3eaf0" />
            <path d="M120 40a34 34 0 0 0-31 47L38 138a12 12 0 0 0 17 17l51-51a34 34 0 0 0 47-31l-21 21-18-4-4-18z" fill="#0f2a3d" />
            <circle cx="150" cy="150" r="22" fill="#f26b1d" />
            <path d="M142 142l16 16M158 142l-16 16" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <Wrench className="absolute -right-2 top-4 h-8 w-8 rotate-12 text-brand-600" />
        </div>
        <h1 className="mt-6 text-4xl font-bold">This page needs repair</h1>
        <p className="mt-3 max-w-md text-ink-500">We couldn&apos;t find what you were looking for. It may have moved, or the service is no longer available.</p>
        <Link href="/" className="btn-primary mt-8">Back to Home</Link>
      </main>
      <Footer />
    </>
  );
}
