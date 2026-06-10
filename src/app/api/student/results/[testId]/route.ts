import { NextRequest } from "next/server";
import { error, handleApiError, ok, requireStudent } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { demoQuestions, demoResults, demoTests } from "@/lib/seed-data";
import { Question, Result, Test, TestAttempt } from "@/models";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ testId: string }> }
) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    const { testId } = await context.params;
    if (!isDatabaseConfigured()) {
      const result = demoResults.find((item) => item.testId === testId);
      const test = demoTests.find((item) => item._id === testId);
      if (!result || !test) return error("not-found", "Result not found or not published", 404);
      const questions = demoQuestions.filter((question) => test.questionIds.includes(question._id));
      return ok({ result, test, questions, attempt: null, mode: "demo" });
    }

    await connectToDatabase();
    const result = await Result.findOne({ studentId: session.id, testId, published: true }).lean();
    if (!result) return error("not-found", "Result not found or not published", 404);
    const [test, attempt] = await Promise.all([
      Test.findById(testId).lean(),
      TestAttempt.findOne({ studentId: session.id, testId }).lean()
    ]);
    const questions = test ? await Question.find({ _id: { $in: test.questionIds } }).lean() : [];
    return ok({ result, test, questions, attempt, mode: "database" });
  } catch (err) {
    return handleApiError(err);
  }
}
