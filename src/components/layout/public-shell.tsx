import Link from "next/link";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicNav } from "@/lib/navigation";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="truncate">Sankalp Digital Pathshala</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {publicNav.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/student-login">
                <LogIn className="size-4" />
                Student
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin-login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t bg-card">
        <div className="container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <GraduationCap className="size-5 text-primary" />
              Sankalp Digital Pathshala Test Portal
            </div>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Secure online tests, instant results, rank lists, AI-assisted learning explanations and
              administrator-ready workflows for modern coaching operations.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Portal</h3>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <Link href="/student-login">Student Login</Link>
              <Link href="/admin-login">Admin Login</Link>
              <Link href="/contact">Contact Support</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Operations</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              MongoDB Atlas, Cloudinary, Gmail SMTP and Gemini are supported through environment
              variables for production deployment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
