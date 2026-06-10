"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

const steps = ["Basic Information", "Marking Scheme", "Question Selection", "Settings", "Review & Publish"];

type WizardState = {
  testName: string;
  description: string;
  classId: string;
  subject: string;
  duration: number;
  startTime: string;
  endTime: string;
  correctMarks: number;
  wrongMarks: number;
  notAttemptedMarks: number;
  questionIds: string;
  randomQuestions: boolean;
  randomOptions: boolean;
  enableRankList: boolean;
  enableAIReview: boolean;
  enableQuestionReview: boolean;
  showStudentAnswers: boolean;
  showCorrectAnswers: boolean;
  status: string;
};

const initialState: WizardState = {
  testName: "",
  description: "",
  classId: "",
  subject: "",
  duration: 30,
  startTime: "",
  endTime: "",
  correctMarks: 4,
  wrongMarks: -1,
  notAttemptedMarks: 0,
  questionIds: "",
  randomQuestions: false,
  randomOptions: false,
  enableRankList: true,
  enableAIReview: true,
  enableQuestionReview: true,
  showStudentAnswers: true,
  showCorrectAnswers: true,
  status: "draft"
};

export function TestWizard({ id }: { id?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const totalQuestions = useMemo(
    () => state.questionIds.split(",").map((item) => item.trim()).filter(Boolean).length,
    [state.questionIds]
  );

  function setValue<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const questionIds = state.questionIds
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const payload = {
      testName: state.testName,
      description: state.description,
      classId: state.classId || undefined,
      subject: state.subject,
      duration: Number(state.duration),
      startTime: state.startTime || undefined,
      endTime: state.endTime || undefined,
      totalQuestions: questionIds.length,
      totalMarks: questionIds.length * Number(state.correctMarks),
      markingScheme: {
        correctMarks: Number(state.correctMarks),
        wrongMarks: Number(state.wrongMarks),
        notAttemptedMarks: Number(state.notAttemptedMarks)
      },
      questionIds,
      settings: {
        randomQuestions: state.randomQuestions,
        randomOptions: state.randomOptions,
        enableRankList: state.enableRankList,
        enableQuestionReview: state.enableQuestionReview,
        enableAIReview: state.enableAIReview,
        showStudentAnswers: state.showStudentAnswers,
        showCorrectAnswers: state.showCorrectAnswers,
        showFullRanking: true
      },
      status: state.status
    };

    const response = await fetch(id ? `/api/admin/tests/${id}` : "/api/admin/tests", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(body?.message || "Test could not be saved. Confirm MongoDB is configured for writes.");
      return;
    }
    router.push("/admin/tests");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <PageHeader
        title={id ? "Edit Test" : "Create Test"}
        description="Multi-step wizard page for basic details, marking scheme, questions, settings and publish review."
      />
      <Card>
        <CardContent className="grid gap-2 p-4 sm:grid-cols-5">
          {steps.map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => setStep(index)}
              className={`rounded-md border px-3 py-3 text-left text-sm transition ${
                index === step ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
              }`}
            >
              <span className="block text-xs opacity-80">Step {index + 1}</span>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Test Name</Label>
                <Input value={state.testName} onChange={(event) => setValue("testName", event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={state.subject} onChange={(event) => setValue("subject", event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Class ID</Label>
                <Input value={state.classId} onChange={(event) => setValue("classId", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Duration In Minutes</Label>
                <Input
                  type="number"
                  value={state.duration}
                  onChange={(event) => setValue("duration", Number(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="datetime-local" value={state.startTime} onChange={(event) => setValue("startTime", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="datetime-local" value={state.endTime} onChange={(event) => setValue("endTime", event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea value={state.description} onChange={(event) => setValue("description", event.target.value)} />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Correct Marks</Label>
                <Input type="number" value={state.correctMarks} onChange={(event) => setValue("correctMarks", Number(event.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Wrong Marks</Label>
                <Input type="number" value={state.wrongMarks} onChange={(event) => setValue("wrongMarks", Number(event.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Not Attempted Marks</Label>
                <Input type="number" value={state.notAttemptedMarks} onChange={(event) => setValue("notAttemptedMarks", Number(event.target.value))} />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                {["Manual Selection", "Question Bank Selection", "Excel Import"].map((mode) => (
                  <div key={mode} className="rounded-lg border bg-background p-4">
                    <p className="font-medium">{mode}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use question IDs now; Excel parsing can be handled through the import endpoint.
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Question IDs</Label>
                <Textarea
                  value={state.questionIds}
                  onChange={(event) => setValue("questionIds", event.target.value)}
                  placeholder="Comma-separated question ObjectIds"
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["randomQuestions", "Random Questions"],
                ["randomOptions", "Random Options"],
                ["enableRankList", "Enable Rank List"],
                ["enableAIReview", "Enable AI Review"],
                ["enableQuestionReview", "Enable Question Review"],
                ["showStudentAnswers", "Show Student Answers"],
                ["showCorrectAnswers", "Show Correct Answers"]
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between rounded-md border bg-background p-4 text-sm">
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(state[key as keyof WizardState])}
                    onChange={(event) => setValue(key as keyof WizardState, event.target.checked as never)}
                    className="size-4 accent-primary"
                  />
                </label>
              ))}
              <div className="space-y-2 md:col-span-2">
                <Label>Status</Label>
                <Select
                  value={state.status}
                  onChange={(event) => setValue("status", event.target.value)}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Scheduled", value: "scheduled" },
                    { label: "Live", value: "live" },
                    { label: "Completed", value: "completed" },
                    { label: "Published", value: "published" }
                  ]}
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Test", state.testName || "Not set"],
                ["Subject", state.subject || "Not set"],
                ["Duration", `${state.duration} minutes`],
                ["Questions", String(totalQuestions)],
                ["Total Marks", String(totalQuestions * state.correctMarks)],
                ["Status", state.status]
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border bg-background p-4">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 font-medium">{value}</p>
                </div>
              ))}
              <div className="md:col-span-2">
                <Badge variant={state.status === "published" ? "success" : "warning"}>
                  Publish button below saves with selected status
                </Badge>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {message ? <div className="rounded-lg border bg-secondary/15 px-4 py-3 text-sm">{message}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={() => setStep((value) => Math.max(value - 1, 0))}>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}>
            Next
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : state.status === "published" ? <Rocket className="size-4" /> : <CheckCircle2 className="size-4" />}
            Save Test
          </Button>
        )}
      </div>
    </form>
  );
}
