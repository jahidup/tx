import { NextRequest } from "next/server";
import { handleApiError, ok, requireStudent } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { demoResults, demoTests } from "@/lib/seed-data";
import { Result } from "@/models";

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    if (!isDatabaseConfigured()) {
      return ok({
        items: demoResults.map((result) => ({
          ...result,
          test: demoTests.find((test) => test._id === result.testId)
        })),
        mode: "demo"
      });
    }

    await connectToDatabase();
    const items = await Result.find({ studentId: session.id, published: true })
      .populate("testId")
      .sort({ createdAt: -1 })
      .lean();
    return ok({ items, mode: "database" });
  } catch (err) {
    return handleApiError(err);
  }
}
