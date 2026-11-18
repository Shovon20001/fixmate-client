import { Suspense } from "react";
import SignUpForm from "./SignUpForm";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <div className="container-page flex min-h-[75vh] items-center justify-center py-12">
      <Suspense fallback={<div className="skeleton h-[32rem] w-full max-w-lg" />}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
