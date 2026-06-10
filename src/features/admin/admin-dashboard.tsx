"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Mail,
  Medal,
  Users
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type DashboardData = {
  mode?: string;
  stats?: Record<string, number>;
  recentActivities?: Array<{ action?: string; actor?: string; createdAt?: string }>;
  recentLogins?: Array<{ name?: string; rollNumber?: string; lastLoginAt?: string }>;
  emailStatistics?: { sent: number; pending: number; failed: number };
};

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({});

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((response) => response.json())
      .then(setData)
      .catch(() => setData({}));
  }, []);

  const stats = data.stats || {};
  const cards = [
    ["Total Students", stats.totalStudents || 0, Users],
    ["Total Classes", stats.totalClasses || 0, BookOpen],
    ["Total Tests", stats.totalTests || 0, ClipboardList],
    ["Active Tests", stats.activeTests || 0, Activity],
    ["Completed Tests", stats.completedTests || 0, CheckCircle2],
    ["Total Results", stats.totalResults || 0, Medal],
    ["Average Score", `${stats.averageScore || 0}%`, BarChart3],
    ["Emails Sent", stats.emailsSent || 0, Mail]
  ] as const;

  return (
    <div className="space-y-5">
      {data.mode === "demo" ? (
        <div className="rounded-lg border bg-secondary/15 px-4 py-3 text-sm">
          Demo mode is active because MongoDB is not configured. Connect MongoDB Atlas for persistent writes.
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <StatCard key={label} label={label} value={value} icon={Icon} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data.recentActivities || []).map((activity, index) => (
              <div key={`${activity.action}-${index}`} className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div>
                  <p className="font-medium">{activity.action || "Portal activity"}</p>
                  <p className="text-sm text-muted-foreground">{activity.actor || "System"}</p>
                </div>
                <Badge variant="muted">{formatDate(activity.createdAt)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Logins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data.recentLogins || []).map((student, index) => (
              <div key={`${student.rollNumber}-${index}`} className="rounded-md border p-3">
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {student.rollNumber} · {formatDate(student.lastLoginAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
