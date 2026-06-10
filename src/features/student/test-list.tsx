"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FolderOpen, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/utils";

type TestRow = {
  _id: string;
  testName: string;
  description?: string;
  subject?: string;
  duration?: number;
  status?: string;
  startTime?: string;
  endTime?: string;
};

export function TestList({ status, folderMode = false }: { status?: string; folderMode?: boolean }) {
  const [tests, setTests] = useState<TestRow[]>([]);

  useEffect(() => {
    fetch(`/api/student/tests${status ? `?status=${status}` : ""}`)
      .then((response) => response.json())
      .then((body: { items?: TestRow[] }) => setTests(body.items || []))
      .catch(() => setTests([]));
  }, [status]);

  if (tests.length === 0) {
    return <EmptyState icon="FolderOpen" title="No tests found" description="Tests assigned to your class will appear here." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tests.map((test) => {
        const href = folderMode || test.status === "published" ? `/student/results/${test._id}` : `/student/test/${test._id}`;
        return (
          <Card key={test._id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant={test.status === "live" ? "success" : test.status === "published" ? "secondary" : "muted"}>
                    {test.status || "scheduled"}
                  </Badge>
                  <h3 className="mt-3 text-lg font-semibold">{test.testName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{test.description || test.subject}</p>
                </div>
                {folderMode ? <FolderOpen className="size-6 text-primary" /> : <PlayCircle className="size-6 text-primary" />}
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <span>Subject: {test.subject || "General"}</span>
                <span>Duration: {test.duration || 0} minutes</span>
                <span>Start: {formatDate(test.startTime)}</span>
              </div>
              <Button asChild className="mt-5 w-full">
                <Link href={href}>{folderMode ? "Open Folder" : test.status === "live" ? "Start Test" : "Open"}</Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
