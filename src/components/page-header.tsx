"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  Brain,
  Database,
  FileQuestion,
  FolderOpen,
  GraduationCap,
  KeyRound,
  LifeBuoy,
  Mail,
  Medal,
  Plus,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  BarChart3,
  BookOpen,
  Brain,
  Database,
  FileQuestion,
  FolderOpen,
  GraduationCap,
  KeyRound,
  LifeBuoy,
  Mail,
  Medal,
  Plus,
  Settings,
  ShieldCheck,
  Users
};

export type IconName = keyof typeof iconMap;

export function PortalIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}

export function PageHeader({
  title,
  description,
  action,
  icon
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string; icon?: IconName };
  icon?: IconName;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {icon ? (
            <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
              <PortalIcon name={icon} className="size-5" />
            </span>
          ) : null}
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            {description ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </div>
      </div>
      {action ? (
        <Button asChild>
          <Link href={action.href}>
            {action.icon ? <PortalIcon name={action.icon} className="size-4" /> : null}
            {action.label}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
