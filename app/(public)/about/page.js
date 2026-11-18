import Link from "next/link";
import { BadgeCheck, CircleHelp, CreditCard, ListChecks, Search, SendHorizontal, Wrench } from "lucide-react";

export const metadata = { title: "How It Works" };

const flow = [
  { icon: Search, title: "Find a service", text: "Browse approved repair services. Search by title or category, filter by device type and service mode, and sort by price." },
  { icon: SendHorizontal, title: "Send a repair request", text: "Open a service, add your phone number, address, a preferred date and a short description of the problem." },
  { icon: Wrench, title: "The technician takes the job", text: "Your technician accepts the request, starts the work, and marks it completed with the final amount." },
  { icon: CreditCard, title: "Pay after completion", text: "When the job is completed, a Pay Now button appears. Pay with Stripe and get a receipt with the transaction ID." },
];

const faqs = [
  ["Do I pay before the repair?", "No. You pay only after the technician marks the job as completed."],
  ["Can I cancel a request?", "Yes, while it is still in the Requested status. After a technician accepts it, the job continues through the pipeline."],
  ["How do I know a technician is trustworthy?", "Every service is reviewed by a FixMate admin before it appears on the site."],
  ["How can I list my own repair services?", "Sign up as a Technician, add your services with a photo and price, and wait for admin approval."],
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-white">
        <div className="container-page py-16">
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">Repairs with a clear status and a fair payment rule</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-500">
            Finding a trustworthy technician is hard, and handing over a device without knowing what happens next is stressful. FixMate gives every job a trackable status and moves payment to the end of the job.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="section-title">From request to repaired</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {flow.map((f, i) => (
              <li key={f.title} className="card flex gap-5 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-white"><f.icon className="h-6 w-6" /></span>
                <div>
                  <p className="text-sm font-semibold text-brand-700">Step {i + 1}</p>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500">{f.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid gap-8 md:grid-cols-3">
          {[
            [BadgeCheck, "For customers", "Browse approved services, request repairs, follow the job, cancel while it is still requested, and pay only for finished work."],
            [Wrench, "For technicians", "List your services, accept or reject requests, update the job step by step and set the final amount when you complete it."],
            [ListChecks, "For admins", "Approve service listings, manage users and roles, monitor every booking, and track all Stripe revenue."],
          ].map(([Icon, title, text]) => (
            <div key={title}>
              <Icon className="h-8 w-8 text-brand-600" />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-ink-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <h2 className="section-title flex items-center gap-3"><CircleHelp className="h-8 w-8 text-brand-600" /> Common questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="card group p-5">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">{q}</summary>
                <p className="mt-2 text-sm text-ink-500">{a}</p>
              </details>
            ))}
          </div>
          <Link href="/services" className="btn-primary mt-10">Find a technician</Link>
        </div>
      </section>
    </>
  );
}
