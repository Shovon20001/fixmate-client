import { Suspense } from "react";
import SignInForm from "./SignInForm";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="container-page flex min-h-[75vh] items-center justify-center py-12">
      <Suspense fallback={<div className="skeleton h-96 w-full max-w-md" />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
