import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-forms";

export default function StudentLoginPage() {
  return (
    <main className="surface-grid flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Suspense>
        <LoginForm kind="student" />
      </Suspense>
    </main>
  );
}
