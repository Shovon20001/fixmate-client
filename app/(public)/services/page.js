import { Suspense } from "react";
import ServicesBrowser from "./ServicesBrowser";
import { ServiceCardSkeleton } from "@/components/ServiceCard";

export const metadata = { title: "Browse Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="container-page py-12">
          <h1 className="text-4xl font-bold">Browse repair services</h1>
          <p className="mt-3 max-w-2xl text-ink-500">Search, filter and sort approved services from verified technicians.</p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        }
      >
        <ServicesBrowser />
      </Suspense>
    </>
  );
}
