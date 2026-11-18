import Link from "next/link";
import { CircleX } from "lucide-react";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-page flex min-h-[65vh] items-center justify-center py-16">
      <div className="card max-w-md p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600"><CircleX className="h-9 w-9" /></span>
        <h1 className="mt-5 text-2xl font-bold">Payment cancelled</h1>
        <p className="mt-2 text-sm text-ink-500">No money was taken and your booking has not changed. You can pay whenever you are ready.</p>
        <Link href="/dashboard/customer/bookings" className="btn-primary mt-7">Try Again</Link>
      </div>
    </div>
  );
}
