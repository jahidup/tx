"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/utils";

type ResultRow = Record<string, unknown> & {
  _id?: string;
  testId?: string | { _id?: string; testName?: string };
  studentId?: string | { name?: string; rollNumber?: string; email?: string };
  score?: number;
  rank?: number;
  percentile?: number;
  percentage?: number;
  published?: boolean;
  createdAt?: string;
};

function idFor(value: unknown) {
  if (typeof value === "object" && value !== null && "_id" in value) return String((value as { _id?: string })._id || "");
  return String(value || "");
}

function studentName(value: unknown) {
  if (typeof value === "object" && value !== null && "name" in value) return String((value as { name?: string }).name || "Student");
  return String(value || "Student");
}

export function ResultsAdminDetail({ testId }: { testId: string }) {
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/results?limit=200")
      .then((response) => response.json())
      .then((body: { items?: ResultRow[] }) => setRows(body.items || []))
      .catch(() => setRows([]));
  }, []);

  const visibleRows = useMemo(() => {
    const exact = rows.filter((row) => idFor(row.testId) === testId);
    return exact.length ? exact : rows.filter((row) => row._id === testId || idFor(row.testId).includes(testId));
  }, [rows, testId]);

  async function publish() {
    const confirmed = window.confirm("Publish results and send notifications?");
    if (!confirmed) return;
    setPublishing(true);
    const response = await fetch(`/api/admin/results/${testId}/publish`, { method: "POST" });
    setPublishing(false);
    setMessage(response.ok ? "Results published. Email notifications were attempted." : "Publish failed.");
  }

  return (
    <div>
      <PageHeader
        title="Result Publish Module"
        description="Publish results, control visibility and send email notifications from a dedicated page."
        icon="Medal"
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/admin/results">
            <ArrowLeft className="size-4" />
            Back to Results
          </Link>
        </Button>
        <Button onClick={publish} disabled={publishing}>
          <Send className="size-4" />
          {publishing ? "Publishing" : "Publish Results"}
        </Button>
      </div>
      {message ? <div className="mb-4 rounded-lg border bg-secondary/15 px-4 py-3 text-sm">{message}</div> : null}
      <Card>
        <CardHeader>
          <CardTitle>Student Result Rows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3">Rank</th>
                  <th className="px-3 py-3">Percentile</th>
                  <th className="px-3 py-3">Percentage</th>
                  <th className="px-3 py-3">Published</th>
                  <th className="px-3 py-3">Created</th>
                  <th className="px-3 py-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={String(row._id)} className="border-b last:border-0">
                    <td className="px-3 py-3 font-medium">{studentName(row.studentId)}</td>
                    <td className="px-3 py-3">{row.score ?? 0}</td>
                    <td className="px-3 py-3">{row.rank ?? "Pending"}</td>
                    <td className="px-3 py-3">{row.percentile ?? 0}</td>
                    <td className="px-3 py-3">{row.percentage ?? 0}%</td>
                    <td className="px-3 py-3">
                      <Badge variant={row.published ? "success" : "warning"}>{row.published ? "Published" : "Draft"}</Badge>
                    </td>
                    <td className="px-3 py-3">{formatDate(row.createdAt)}</td>
                    <td className="px-3 py-3">
                      <Button variant="ghost" size="icon" title="Email notification">
                        <Mail className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
