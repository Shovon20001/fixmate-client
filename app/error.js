"use client";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600"><TriangleAlert className="h-8 w-8" /></span>
      <h1 className="mt-6 text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-ink-500">{error?.message || "An unexpected error happened."} Try again, or go back to the home page.</p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-outline">Back to Home</Link>
      </div>
    </main>
  );
}
