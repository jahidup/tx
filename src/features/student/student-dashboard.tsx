"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Brain, CalendarClock, Medal, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";

type Dashboard = {
  student?: { name?: string; rollNumber?: string };
  upcomingTests?: Array<{ _id: string; testName: string; subject: string }>;
  liveTests?: Array<{ _id: string; testName: string; subject: string }>;
  latestResult?: { score?: number; rank?: number; percentage?: number; testId?: string };
  materials?: Array<{ _id: string; title: string; subject?: string }>;
  notifications?: Array<{ _id: string; title: string; message: string }>;
};

export function StudentDashboard() {
  const [data, setData] = useState<Dashboard>({});

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((response) => response.json())
      .then(setData)
      .catch(() => setData({}));
  }, []);

  const latest = data.latestResult;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold">{data.student?.name || "Student"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{data.student?.rollNumber || "Roll number"}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Upcoming Tests" value={data.upcomingTests?.length || 0} icon={CalendarClock} />
        <StatCard label="Live Tests" value={data.liveTests?.length || 0} icon={BookOpen} />
        <StatCard label="Latest Result" value={latest ? `${latest.percentage || 0}%` : "NA"} icon={Medal} />
        <StatCard label="Current Rank" value={latest?.rank || "NA"} icon={Trophy} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Take Test", "/student/live-tests", BookOpen],
            ["View Results", "/student/results", Medal],
            ["AI Assistant", "/student/results", Brain],
            ["Study Material", "/student/materials", CalendarClock]
          ].map(([label, href, Icon]) => (
            <Button key={String(label)} asChild variant="outline" className="h-auto justify-between p-4">
              <Link href={String(href)}>
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {String(label)}
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data.liveTests || []).map((test) => (
              <Link key={test._id} href={`/student/test/${test._id}`} className="block rounded-md border p-4 hover:bg-muted">
                <Badge variant="success">Live</Badge>
                <p className="mt-2 font-medium">{test.testName}</p>
                <p className="text-sm text-muted-foreground">{test.subject}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data.notifications || []).map((item) => (
              <div key={item._id} className="rounded-md border p-4">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
