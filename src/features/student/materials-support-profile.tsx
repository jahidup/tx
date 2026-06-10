"use client";

import { FormEvent, useEffect, useState } from "react";
import { BookOpen, Loader2, Send, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";

type Material = { _id: string; title: string; description?: string; subject?: string; pdfUrl?: string };
type Ticket = { _id: string; title: string; message: string; status: string };

export function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((response) => response.json())
      .then((body: { materials?: Material[] }) => setMaterials(body.materials || []))
      .catch(() => setMaterials([]));
  }, []);

  if (!materials.length) {
    return <EmptyState icon="BookOpen" title="No materials" description="PDF study materials uploaded by admin will appear here." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {materials.map((material) => (
        <Card key={material._id}>
          <CardContent className="p-5">
            <BookOpen className="size-8 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">{material.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{material.description || material.subject}</p>
            {material.pdfUrl ? (
              <Button asChild className="mt-5 w-full">
                <a href={material.pdfUrl} target="_blank" rel="noreferrer">
                  Preview PDF
                </a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StudentSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/student/tickets")
      .then((response) => response.json())
      .then((body: { items?: Ticket[] }) => setTickets(body.items || []))
      .catch(() => setTickets([]));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/student/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: data.get("title"), message: data.get("message") })
    });
    setSaving(false);
    setMessage(response.ok ? "Ticket created." : "Ticket creation needs MongoDB configuration.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create Support Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" required />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea name="message" required />
            </div>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            <Button disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Submit Ticket
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="rounded-md border p-4">
              <p className="font-medium">{ticket.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{ticket.message}</p>
              <p className="mt-2 text-xs uppercase text-primary">{ticket.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ProfilePage() {
  const [student, setStudent] = useState<{ name?: string; rollNumber?: string; email?: string; mobile?: string }>({});

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((response) => response.json())
      .then((body: { student?: typeof student }) => setStudent(body.student || {}))
      .catch(() => setStudent({}));
  }, []);

  return (
    <Card>
      <CardContent className="grid gap-5 p-5 md:grid-cols-[160px_1fr]">
        <div className="grid size-32 place-items-center rounded-lg bg-primary/10 text-primary">
          <UserRound className="size-16" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="text-2xl font-semibold">{student.name || "Student Profile"}</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Roll Number", student.rollNumber || "SDP1001"],
              ["Email", student.email || "Not set"],
              ["Mobile", student.mobile || "Not set"],
              ["DOB", "Protected credential"],
              ["Father Name", "Configured by admin"],
              ["Mother Name", "Configured by admin"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border bg-background p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
