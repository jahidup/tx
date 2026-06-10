"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Calendar, KeyRound, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthKind = "admin" | "student";

export function LoginForm({ kind }: { kind: AuthKind }) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload =
      kind === "admin"
        ? {
            adminId: String(formData.get("adminId") || ""),
            password: String(formData.get("password") || "")
          }
        : {
            rollNumber: String(formData.get("rollNumber") || ""),
            dob: String(formData.get("dob") || "")
          };

    const response = await fetch(`/api/auth/${kind}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message || "Login failed");
      return;
    }

    router.push(params.get("next") || (kind === "admin" ? "/admin" : "/student"));
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="mb-2 grid size-12 place-items-center rounded-md bg-primary/10 text-primary">
          {kind === "admin" ? <ShieldCheck className="size-6" /> : <UserRound className="size-6" />}
        </div>
        <CardTitle>{kind === "admin" ? "Admin Login" : "Student Login"}</CardTitle>
        <CardDescription>
          {kind === "admin"
            ? "Use your admin ID and password to manage classes, tests and results."
            : "Students sign in with roll number and date of birth. No self-registration."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          {kind === "admin" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input id="adminId" name="adminId" className="pl-9" autoComplete="username" defaultValue="admin" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  defaultValue="Sankalp@2026"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  autoComplete="username"
                  defaultValue="SDP1001"
                  placeholder="SDP1001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date Of Birth</Label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input id="dob" name="dob" className="pl-9" defaultValue="15-08-2010" placeholder="DD-MM-YYYY" />
                </div>
              </div>
            </>
          )}
          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          <Button className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {kind === "admin" ? "Enter Admin Portal" : "Enter Student Portal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
