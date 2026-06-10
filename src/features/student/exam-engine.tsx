"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock, Flag, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

type Question = {
  _id: string;
  questionType: string;
  questionText: string;
  questionImage?: string;
  options?: Array<{ text?: string }>;
  marks?: number;
};

type TestPayload = {
  test?: {
    _id: string;
    testName: string;
    duration: number;
    status?: string;
    settings?: { randomOptions?: boolean };
  };
  questions?: Question[];
};

type Answer = { questionId: string; answer: string; markedForReview?: boolean; timeSpent?: number };

export function ExamEngine({ testId }: { testId: string }) {
  const router = useRouter();
  const [payload, setPayload] = useState<TestPayload>({});
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [remaining, setRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const questions = payload.questions || [];
  const current = questions[index];

  useEffect(() => {
    fetch(`/api/student/tests/${testId}`)
      .then((response) => response.json())
      .then((body: TestPayload) => {
        setPayload(body);
        setRemaining((body.test?.duration || 30) * 60);
        const saved = localStorage.getItem(`attempt:${testId}`);
        if (saved) setAnswers(JSON.parse(saved) as Record<string, Answer>);
      });
  }, [testId]);

  useEffect(() => {
    localStorage.setItem(`attempt:${testId}`, JSON.stringify(answers));
  }, [answers, testId]);

  useEffect(() => {
    if (!remaining) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [remaining]);

  useEffect(() => {
    if (remaining === 0 && questions.length > 0 && !submitting) {
      void submit();
    }
  }, [remaining, questions.length, submitting]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((answer) => answer.answer.trim()).length,
    [answers]
  );

  function setAnswer(value: string) {
    if (!current) return;
    setAnswers((existing) => ({
      ...existing,
      [current._id]: {
        ...existing[current._id],
        questionId: current._id,
        answer: value
      }
    }));
  }

  function markForReview() {
    if (!current) return;
    setAnswers((existing) => ({
      ...existing,
      [current._id]: {
        ...existing[current._id],
        questionId: current._id,
        answer: existing[current._id]?.answer || "",
        markedForReview: !existing[current._id]?.markedForReview
      }
    }));
  }

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    const response = await fetch(`/api/student/attempts/${testId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: Object.values(answers),
        timeSpent: (payload.test?.duration || 0) * 60 - remaining
      })
    });
    setSubmitting(false);
    if (response.ok) {
      localStorage.removeItem(`attempt:${testId}`);
      router.push("/student/results");
    }
  }

  if (!payload.test || !current) {
    return <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">Loading test engine...</div>;
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{payload.test.testName}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Question {index + 1} of {questions.length}
                </p>
              </div>
              <Badge variant="warning" className="w-fit">
                <Clock className="mr-1 size-3" />
                {minutes}:{seconds.toString().padStart(2, "0")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(answeredCount / Math.max(questions.length, 1)) * 100} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="outline">{current.questionType}</Badge>
                <h2 className="mt-4 text-xl font-semibold">{current.questionText}</h2>
              </div>
              <Badge variant="secondary">{current.marks || 4} marks</Badge>
            </div>
            {current.questionImage ? (
              <div className="mt-5 overflow-hidden rounded-lg border">
                <Image
                  src={current.questionImage}
                  alt="Question"
                  width={960}
                  height={540}
                  className="max-h-96 w-full object-contain"
                />
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2 rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                <ImageIcon className="size-4" />
                No question image attached
              </div>
            )}
            <div className="mt-6 space-y-3">
              {current.options && current.options.length > 0 ? (
                current.options.map((option) => (
                  <label key={option.text} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted">
                    <input
                      type="radio"
                      name={current._id}
                      value={option.text}
                      checked={answers[current._id]?.answer === option.text}
                      onChange={(event) => setAnswer(event.target.value)}
                      className="size-4 accent-primary"
                    />
                    <span>{option.text}</span>
                  </label>
                ))
              ) : (
                <Textarea
                  value={answers[current._id]?.answer || ""}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Type your answer"
                />
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={() => setIndex((value) => Math.max(value - 1, 0))}>
            Previous Question
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={markForReview}>
              <Flag className="size-4" />
              Mark For Review
            </Button>
            <Button onClick={() => setIndex((value) => Math.min(value + 1, questions.length - 1))}>
              <CheckCircle2 className="size-4" />
              Save And Next
            </Button>
            <Button variant="secondary" onClick={submit} disabled={submitting}>
              <Send className="size-4" />
              Submit Test
            </Button>
          </div>
        </div>
      </div>
      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Question Palette</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-5 gap-2">
            {questions.map((question, questionIndex) => {
              const answer = answers[question._id];
              return (
                <button
                  key={question._id}
                  type="button"
                  onClick={() => setIndex(questionIndex)}
                  className={`grid size-10 place-items-center rounded-md border text-sm font-medium ${
                    questionIndex === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : answer?.markedForReview
                        ? "bg-secondary text-secondary-foreground"
                        : answer?.answer
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-background"
                  }`}
                >
                  {questionIndex + 1}
                </button>
              );
            })}
          </CardContent>
        </Card>
        <div className="rounded-lg border bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle className="mb-2 size-4" />
          AI assistance is disabled during live tests.
        </div>
      </aside>
    </div>
  );
}
