"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Brain, FileCheck2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

type ResultRow = {
  _id: string;
  testId?: string;
  test?: { _id?: string; testName?: string; subject?: string };
  score?: number;
  rank?: number;
  percentile?: number;
  percentage?: number;
};

export function ResultsList() {
  const [rows, setRows] = useState<ResultRow[]>([]);

  useEffect(() => {
    fetch("/api/student/results")
      .then((response) => response.json())
      .then((body: { items?: ResultRow[] }) => setRows(body.items || []))
      .catch(() => setRows([]));
  }, []);

  if (!rows.length) {
    return <EmptyState icon="Medal" title="No published results" description="Published results will appear here after tests are evaluated." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => {
        const testId = row.test?._id || row.testId || row._id;
        return (
          <Card key={row._id}>
            <CardContent className="p-5">
              <FolderOpen className="size-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{row.test?.testName || "Published Test Result"}</h3>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-md bg-muted p-3">
                  <p className="font-semibold">{row.score ?? 0}</p>
                  <p className="text-muted-foreground">Marks</p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <p className="font-semibold">{row.rank ?? "NA"}</p>
                  <p className="text-muted-foreground">Rank</p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <p className="font-semibold">{row.percentage ?? 0}%</p>
                  <p className="text-muted-foreground">Score</p>
                </div>
              </div>
              <Button asChild className="mt-5 w-full">
                <Link href={`/student/results/${testId}`}>Open Folder</Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

type ResultDetailPayload = {
  result?: {
    score?: number;
    rank?: number;
    percentile?: number;
    percentage?: number;
    correctCount?: number;
    wrongCount?: number;
    notAttemptedCount?: number;
    published?: boolean;
  };
  test?: {
    _id?: string;
    testName?: string;
    subject?: string;
    answerKeyPdfUrl?: string;
    solutionPdfUrl?: string;
    settings?: {
      enableRankList?: boolean;
      enableQuestionReview?: boolean;
      enableAIReview?: boolean;
      showCorrectAnswers?: boolean;
      showStudentAnswers?: boolean;
    };
  };
  questions?: Array<{
    _id: string;
    questionText: string;
    questionImage?: string;
    correctAnswer?: string;
    solutionText?: string;
  }>;
  attempt?: {
    answers?: Array<{ questionId: string; answer?: string; marksAwarded?: number; isCorrect?: boolean }>;
  } | null;
};

export function ResultDetail({ testId, defaultTab = "overview" }: { testId: string; defaultTab?: string }) {
  const [payload, setPayload] = useState<ResultDetailPayload>({});
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    fetch(`/api/student/results/${testId}`)
      .then((response) => response.json())
      .then(setPayload)
      .catch(() => setPayload({}));
  }, [testId]);

  const answers = useMemo(() => new Map((payload.attempt?.answers || []).map((answer) => [String(answer.questionId), answer])), [payload.attempt?.answers]);
  const tabs = ["overview", "rank-list", "question-review", "answer-key-pdf", "solution-pdf", "ai-review"];

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-5">
          <Badge variant="success">Published Result</Badge>
          <h2 className="mt-3 text-2xl font-semibold">{payload.test?.testName || "Result Folder"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{payload.test?.subject || "Subject"}</p>
        </CardContent>
      </Card>
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {tabs.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                tab === item ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              {item.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")}
            </button>
          ))}
        </div>
      </div>
      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Score", payload.result?.score ?? 0],
            ["Rank", payload.result?.rank ?? "NA"],
            ["Percentile", payload.result?.percentile ?? 0],
            ["Percentage", `${payload.result?.percentage ?? 0}%`]
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
      {tab === "rank-list" ? <LeaderboardCard /> : null}
      {tab === "question-review" || defaultTab === "review" ? (
        <div className="space-y-4">
          {(payload.questions || []).map((question, questionIndex) => {
            const answer = answers.get(String(question._id));
            return (
              <Card key={question._id}>
                <CardContent className="p-5">
                  <Badge variant="outline">Question {questionIndex + 1}</Badge>
                  <h3 className="mt-3 font-semibold">{question.questionText}</h3>
                  {question.questionImage ? (
                    <Image
                      src={question.questionImage}
                      alt="Question"
                      width={960}
                      height={540}
                      className="mt-4 max-h-80 rounded-md border object-contain"
                    />
                  ) : null}
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <Info label="Student Answer" value={answer?.answer || "Not attempted"} />
                    <Info label="Correct Answer" value={question.correctAnswer || "Hidden"} />
                    <Info label="Marks Awarded" value={String(answer?.marksAwarded ?? 0)} />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{question.solutionText || "Solution will appear after publication settings allow it."}</p>
                  <Button asChild className="mt-5">
                    <Link href={`/student/results/${testId}/question/${question._id}/ai`}>
                      <Brain className="size-4" />
                      Solve With AI
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
      {tab === "answer-key-pdf" ? <PdfCard title="Answer Key PDF" url={payload.test?.answerKeyPdfUrl} /> : null}
      {tab === "solution-pdf" ? <PdfCard title="Solution PDF" url={payload.test?.solutionPdfUrl} /> : null}
      {tab === "ai-review" ? (
        <Card>
          <CardContent className="p-5">
            <Brain className="size-8 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">AI Review</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Open Question Review and choose Solve With AI for a dedicated full-page explanation.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function PdfCard({ title, url }: { title: string; url?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <FileCheck2 className="size-8 text-primary" />
        <h3 className="mt-3 text-lg font-semibold">{title}</h3>
        {url ? (
          <Button asChild className="mt-4">
            <a href={url} target="_blank" rel="noreferrer">
              Open PDF
            </a>
          </Button>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No PDF uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function LeaderboardCard() {
  const rows = [
    ["1", "Aarav Sharma", "SDP1001", "4"],
    ["2", "Ananya Verma", "SDP1002", "3"]
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-muted-foreground">
              {["Rank", "Student Name", "Roll Number", "Marks"].map((heading) => (
                <th key={heading} className="px-3 py-3">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[1]} className="border-b last:border-0">
                {row.map((cell) => (
                  <td key={cell} className="px-3 py-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
