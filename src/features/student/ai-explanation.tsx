"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Payload = {
  result?: { published?: boolean };
  test?: { subject?: string; testName?: string };
  questions?: Array<{ _id: string; questionText: string; correctAnswer?: string; questionImage?: string }>;
  attempt?: { answers?: Array<{ questionId: string; answer?: string }> } | null;
};

export function AiExplanationPage({ testId, questionId }: { testId: string; questionId: string }) {
  const [payload, setPayload] = useState<Payload>({});
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);
  const [followUp, setFollowUp] = useState("");

  useEffect(() => {
    fetch(`/api/student/results/${testId}`)
      .then((response) => response.json())
      .then((body: Payload) => setPayload(body))
      .finally(() => setLoading(false));
  }, [testId]);

  const question = useMemo(
    () => (payload.questions || []).find((item) => String(item._id) === questionId),
    [payload.questions, questionId]
  );
  const answer = useMemo(
    () => (payload.attempt?.answers || []).find((item) => String(item.questionId) === questionId),
    [payload.attempt?.answers, questionId]
  );

  useEffect(() => {
    if (!question || !payload.result?.published) return;
    fetch("/api/student/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question.questionText,
        questionImage: question.questionImage,
        studentAnswer: answer?.answer,
        correctAnswer: question.correctAnswer,
        subject: payload.test?.subject,
        className: "Assigned class",
        resultPublished: payload.result?.published
      })
    })
      .then((response) => response.json())
      .then((body: { explanation?: string }) => setExplanation(body.explanation || "AI explanation unavailable."))
      .catch(() => setExplanation("AI explanation unavailable."));
  }, [answer?.answer, payload.result?.published, payload.test?.subject, question]);

  function askFollowUp(event: FormEvent) {
    event.preventDefault();
    if (!followUp.trim()) return;
    setExplanation((current) => `${current}\n\nFollow-up question:\n${followUp}\n\nThe assistant can answer this live once GEMINI_API_KEY is configured.`);
    setFollowUp("");
  }

  if (loading) return <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">Loading AI page...</div>;

  return (
    <div className="space-y-5">
      <Button asChild variant="outline">
        <Link href={`/student/results/${testId}/review`}>
          <ArrowLeft className="size-4" />
          Back to Review
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="size-5 text-primary" />
            AI Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-background p-4">
            <p className="text-sm text-muted-foreground">Question</p>
            <p className="mt-2 font-medium">{question?.questionText || "Question not found"}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Info title="Student Answer" value={answer?.answer || "Not attempted"} />
            <Info title="Correct Answer" value={question?.correctAnswer || "Hidden"} />
          </div>
          <div className="min-h-64 rounded-md border bg-muted/30 p-4 whitespace-pre-wrap text-sm leading-6">
            {explanation || "Generating explanation..."}
          </div>
          <form className="space-y-3" onSubmit={askFollowUp}>
            <Textarea value={followUp} onChange={(event) => setFollowUp(event.target.value)} placeholder="Ask follow-up question" />
            <Button>
              {explanation ? <Send className="size-4" /> : <Loader2 className="size-4 animate-spin" />}
              Ask Follow-Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}
