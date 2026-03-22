import { Suspense } from "react";
import AuthForm from "@/app/auth/AuthForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm mode="login" />
    </Suspense>
  );
}