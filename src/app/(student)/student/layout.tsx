"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { studentNav, studentSideNav } from "@/lib/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={studentSideNav} bottomNav={studentNav} title="Sankalp Student" role="student">
      {children}
    </DashboardShell>
  );
}
