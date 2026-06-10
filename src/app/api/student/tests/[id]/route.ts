import { NextRequest } from "next/server";
import { error, handleApiError, ok, requireStudent } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { demoQuestions, demoTests } from "@/lib/seed-data";
import { Question, Test } from "@/models";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    const { id } = await context.params;
    if (!isDatabaseConfigured()) {
      const test = demoTests.find((item) => item._id === id);
      if (!test) return error("not-found", "Test not found", 404);
      const questions = demoQuestions
        .filter((question) => test.questionIds.includes(question._id))
        .map((question) =>
          test.status === "live"
            ? { ...question, correctAnswer: undefined, solutionText: undefined }
            : question
        );
      return ok({ test, questions, mode: "demo" });
    }

    await connectToDatabase();
    const test = await Test.findById(id).lean();
    if (!test) return error("not-found", "Test not found", 404);
    const questions = (await Question.find({ _id: { $in: test.questionIds } }).lean()) as Array<Record<string, unknown>>;
    const safeQuestions =
      test.status === "live"
        ? questions.map((question) => ({ ...question, correctAnswer: undefined, solutionText: undefined }))
        : questions;
    return ok({ test, questions: safeQuestions, mode: "database" });
  } catch (err) {
    return handleApiError(err);
  }
}
