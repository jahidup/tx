import { NextRequest } from "next/server";
import { error, handleApiError, ok, readBody, requireStudent } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { scoreAttempt } from "@/lib/exam";
import { isDatabaseConfigured } from "@/lib/env";
import { demoQuestions, demoTests } from "@/lib/seed-data";
import { Question, Result, Test, TestAttempt } from "@/models";
import type { StudentAnswer } from "@/types/platform";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ testId: string }> }
) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    const { testId } = await context.params;
    const body = await readBody<{ answers: StudentAnswer[]; timeSpent: number }>(request);

    if (!isDatabaseConfigured()) {
      const test = demoTests.find((item) => item._id === testId);
      if (!test) return error("not-found", "Test not found", 404);
      const questions = demoQuestions.filter((question) => test.questionIds.includes(question._id));
      const scored = scoreAttempt(questions, body.answers || [], test.markingScheme);
      return ok({ submitted: true, result: { ...scored, rank: 1, percentile: 98 }, mode: "demo" });
    }

    await connectToDatabase();
    const test = await Test.findById(testId).lean();
    if (!test) return error("not-found", "Test not found", 404);
    if (test.status !== "live" && test.status !== "scheduled") {
      return error("test-closed", "This test is not accepting submissions", 409);
    }

    const questions = (await Question.find({ _id: { $in: test.questionIds } }).lean()) as Array<{
      _id: string;
      correctAnswer: string;
      marks?: number;
    }>;
    const scored = scoreAttempt(
      questions.map((question) => ({
        _id: String(question._id),
        correctAnswer: String(question.correctAnswer),
        marks: Number(question.marks || test.markingScheme.correctMarks)
      })),
      body.answers || [],
      test.markingScheme
    );

    const attempt = await TestAttempt.findOneAndUpdate(
      { studentId: session.id, testId },
      {
        $set: {
          answers: scored.gradedAnswers,
          score: scored.score,
          correctCount: scored.correctCount,
          wrongCount: scored.wrongCount,
          notAttemptedCount: scored.notAttemptedCount,
          timeSpent: body.timeSpent || 0,
          submittedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    const result = await Result.findOneAndUpdate(
      { studentId: session.id, testId },
      {
        $set: {
          score: scored.score,
          percentage: scored.percentage,
          correctCount: scored.correctCount,
          wrongCount: scored.wrongCount,
          notAttemptedCount: scored.notAttemptedCount,
          published: false
        }
      },
      { upsert: true, new: true }
    );

    return ok({ submitted: true, attempt, result });
  } catch (err) {
    return handleApiError(err);
  }
}
