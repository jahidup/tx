import { NextRequest } from "next/server";
import { handleApiError, ok, requireAdmin } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { sendMail } from "@/lib/mailer";
import { Result, Test } from "@/models";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ testId: string }> }
) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  try {
    const { testId } = await context.params;
    if (!isDatabaseConfigured()) {
      return ok({ published: true, mode: "demo" });
    }

    await connectToDatabase();
    await Promise.all([
      Result.updateMany({ testId }, { $set: { published: true } }),
      Test.findByIdAndUpdate(testId, { $set: { status: "published" } })
    ]);

    const results = (await Result.find({ testId })
      .populate("studentId", "name email")
      .populate("testId", "testName")
      .lean()) as Array<{
      studentId?: { email?: string; name?: string };
      testId?: { testName?: string };
      score?: number;
      rank?: number;
      percentage?: number;
    }>;
    const notifications = await Promise.all(
      results
        .filter((result) => {
          const student = result.studentId as { email?: string; name?: string } | undefined;
          return Boolean(student?.email);
        })
        .map((result) => {
          const student = result.studentId as { email: string; name?: string };
          const test = result.testId as { testName?: string };
          return sendMail({
            to: student.email,
            subject: "Test Result Published",
            html: `<p>Dear ${student.name || "Student"},</p><p>Your result for ${test.testName || "the test"} has been published.</p><p>Marks: ${result.score}, Rank: ${result.rank}, Percentage: ${result.percentage}%</p>`
          });
        })
    );

    return ok({ published: true, emails: notifications });
  } catch (err) {
    return handleApiError(err);
  }
}
