"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function DashboardShell({
  children,
  nav,
  title,
  role,
  bottomNav
}: {
  children: React.ReactNode;
  nav: NavItem[];
  title: string;
  role: "admin" | "student";
  bottomNav?: NavItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch(`/api/auth/${role}/logout`, { method: "POST" });
    router.push(role === "admin" ? "/admin-login" : "/student-login");
    router.refresh();
  }

  const sidebar = (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-card transition-[width]",
        collapsed ? "w-[76px]" : "w-72"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href={role === "admin" ? "/admin" : "/student"} className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            SD
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{title}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {role === "admin" ? "Super Admin" : "Student Portal"}
              </span>
            </span>
          ) : null}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={() => setCollapsed((value) => !value)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          {!collapsed ? "Logout" : "Exit"}
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">{sidebar}</div>
      <div className={cn("min-h-screen transition-[padding]", collapsed ? "lg:pl-[76px]" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/92 px-4 backdrop-blur lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm text-muted-foreground">
                {role === "admin" ? "Administration" : "Learning workspace"}
              </p>
              <h1 className="truncate text-lg font-semibold">{title}</h1>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </header>
        <main className="px-4 py-5 pb-24 lg:px-6 lg:pb-8">{children}</main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="absolute inset-y-0 left-0 w-[86vw] max-w-80 bg-card shadow-soft">{sidebar}</div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>
      ) : null}

      {bottomNav ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card lg:hidden">
          {bottomNav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
