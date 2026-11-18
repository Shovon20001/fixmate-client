import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, MapPin, Wrench } from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import { formatMoney } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import RequestPanel from "./RequestPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { data } = await serverFetch(`/api/services/${params.id}`);
  return { title: data?.title || "Service details" };
}

export default async function ServiceDetailsPage({ params }) {
  const { ok, data: service, status } = await serverFetch(`/api/services/${params.id}`);
  if (status === 404 || status === 400) notFound(); // missing / not approved / not available
  if (!ok || !service) throw new Error("The service could not be loaded right now. Please try again.");

  const t = service.technician;
  const facts = [
    { icon: Clock, label: "Estimated duration", value: service.estimatedDuration },
    { icon: Wrench, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Service area", value: service.serviceArea },
  ];

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-500" aria-label="Breadcrumb">
        <Link href="/services" className="hover:text-ink">Services</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/services?category=${encodeURIComponent(service.category)}`} className="hover:text-ink">{service.category}</Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt={service.title} className="aspect-[16/9] w-full rounded-2xl border border-ink-100 object-cover" />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">{service.category}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{service.title}</h1>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="card flex items-start gap-3 p-4">
                <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div className="min-w-0">
                  <dt className="text-xs text-ink-500">{f.label}</dt>
                  <dd className="text-sm font-semibold">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 text-xl font-semibold">What&apos;s included</h2>
          <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-ink-700">{service.description}</p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-sm text-ink-500">Starting price</p>
            <p className="font-display text-4xl font-bold">{formatMoney(service.basePrice)}</p>
            <p className="mt-1 text-xs text-ink-500">The technician confirms the final amount when the job is completed. You pay only after that.</p>
            <RequestPanel service={service} />
          </div>

          <div className="card p-6">
            <h2 className="text-base font-semibold">Your technician</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar user={{ name: t.name, image: t.image }} size="h-14 w-14" text="text-lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{t.name}</p>
                <p className="flex items-center gap-1 text-sm text-ink-500"><MapPin className="h-3.5 w-3.5" /> {t.area}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-700">{t.bio || "This technician has not added a bio yet."}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
