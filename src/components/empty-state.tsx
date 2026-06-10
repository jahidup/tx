"use client";

import { PortalIcon, type IconName } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: IconName;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-12 text-center">
        <div className="grid size-12 place-items-center rounded-md bg-muted text-muted-foreground">
          <PortalIcon name={Icon} className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        {action ? (
          <Button asChild className="mt-5">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
