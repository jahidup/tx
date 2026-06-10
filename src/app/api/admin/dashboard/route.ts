import { NextRequest } from "next/server";
import { handleApiError, ok, requireAdmin } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { demoClasses, demoQuestions, demoResults, demoStudents, demoTests, demoTickets } from "@/lib/seed-data";
import { Activity, Result, SdpClass, Student, Test, TestAttempt, Ticket } from "@/models";

export async function GET(request: NextRequest) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  try {
    if (!isDatabaseConfigured()) {
      return ok({
        mode: "demo",
        stats: {
          totalStudents: demoStudents.length,
          totalClasses: demoClasses.length,
          totalTests: demoTests.length,
          activeTests: demoTests.filter((test) => test.status === "live").length,
          completedTests: demoTests.filter((test) => ["completed", "published"].includes(test.status)).length,
          totalResults: demoResults.length,
          averageScore: 86,
          totalQuestions: demoQuestions.length,
          openTickets: demoTickets.filter((ticket) => ticket.status !== "closed").length,
          emailsSent: 0
        },
        recentActivities: [
          { action: "Published Science Weekly Test 02", actor: "System", createdAt: new Date().toISOString() },
          { action: "Mathematics Weekly Test 01 went live", actor: "Admin", createdAt: new Date().toISOString() }
        ],
        recentLogins: demoStudents,
        emailStatistics: { sent: 0, pending: 0, failed: 0 }
      });
    }

    await connectToDatabase();
    const [totalStudents, totalClasses, totalTests, activeTests, completedTests, totalResults, attempts, openTickets] =
      await Promise.all([
        Student.countDocuments(),
        SdpClass.countDocuments(),
        Test.countDocuments(),
        Test.countDocuments({ status: "live" }),
        Test.countDocuments({ status: { $in: ["completed", "published"] } }),
        Result.countDocuments(),
        TestAttempt.find().select("score").lean(),
        Ticket.countDocuments({ status: { $ne: "closed" } })
      ]);

    const typedAttempts = attempts as Array<{ score?: number }>;
    const averageScore =
      typedAttempts.length > 0
        ? Math.round(
            typedAttempts.reduce((sum: number, attempt: { score?: number }) => sum + Number(attempt.score || 0), 0) /
              typedAttempts.length
          )
        : 0;

    const [recentActivities, recentLogins] = await Promise.all([
      Activity.find().sort({ createdAt: -1 }).limit(8).lean(),
      Student.find().sort({ lastLoginAt: -1 }).limit(8).select("name rollNumber lastLoginAt").lean()
    ]);

    return ok({
      mode: "database",
      stats: {
        totalStudents,
        totalClasses,
        totalTests,
        activeTests,
        completedTests,
        totalResults,
        averageScore,
        openTickets,
        emailsSent: 0
      },
      recentActivities,
      recentLogins,
      emailStatistics: { sent: 0, pending: 0, failed: 0 }
    });
  } catch (err) {
    return handleApiError(err);
  }
}
