import { Suspense } from "react";
import AuthForm from "@/app/auth/AuthForm";

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm mode="new_password" />
    </Suspense>
  );
}