import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-forms";

export default function AdminLoginPage() {
  return (
    <main className="surface-grid flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Suspense>
        <LoginForm kind="admin" />
      </Suspense>
    </main>
  );
}
