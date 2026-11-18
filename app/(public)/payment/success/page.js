import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export const metadata = { title: "Payment successful" };

export default function PaymentSuccessPage() {
  return (
    <div className="container-page flex min-h-[65vh] items-center justify-center py-16">
      <Suspense fallback={<div className="skeleton h-72 w-full max-w-md" />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
