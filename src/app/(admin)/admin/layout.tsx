"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNav } from "@/lib/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={adminNav} title="Sankalp Admin" role="admin">
      {children}
    </DashboardShell>
  );
}
