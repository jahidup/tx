import { NextRequest } from "next/server";
import { error, handleApiError, ok, readBody, requireStudent } from "@/lib/api";
import { explainWithGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    const body = await readBody<{
      question: string;
      questionImage?: string;
      studentAnswer?: string;
      correctAnswer?: string;
      subject?: string;
      className?: string;
      resultPublished?: boolean;
    }>(request);

    if (!body.resultPublished) {
      return error("ai-disabled", "AI explanations are available only after result publication", 403);
    }

    const explanation = await explainWithGemini(body);
    return ok(explanation);
  } catch (err) {
    return handleApiError(err);
  }
}
