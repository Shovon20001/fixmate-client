import { ServiceCardSkeleton } from "@/components/ServiceCard";

export default function Loading() {
  return (
    <div className="container-page py-16" role="status" aria-label="Loading">
      <div className="skeleton h-9 w-72" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
