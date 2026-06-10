import { NextRequest } from "next/server";
import { handleApiError, ok, requireStudent } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { demoMaterials, demoNotifications, demoResults, demoTests } from "@/lib/seed-data";
import { Material, Notification, Result, Student, Test } from "@/models";

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    if (!isDatabaseConfigured()) {
      return ok({
        student: { name: session.name, rollNumber: session.rollNumber },
        upcomingTests: demoTests.filter((test) => test.status === "scheduled"),
        liveTests: demoTests.filter((test) => test.status === "live"),
        latestResult: demoResults[0],
        materials: demoMaterials,
        notifications: demoNotifications
      });
    }

    await connectToDatabase();
    const student = await Student.findById(session.id).lean();
    const [upcomingTests, liveTests, latestResult, materials, notifications] = await Promise.all([
      Test.find({ classId: student?.classId, status: "scheduled" }).sort({ startTime: 1 }).limit(5).lean(),
      Test.find({ classId: student?.classId, status: "live" }).sort({ startTime: 1 }).limit(5).lean(),
      Result.findOne({ studentId: session.id, published: true }).sort({ createdAt: -1 }).lean(),
      Material.find({ classId: student?.classId }).sort({ createdAt: -1 }).limit(6).lean(),
      Notification.find({ $or: [{ studentId: session.id }, { studentId: null }] }).sort({ createdAt: -1 }).limit(8).lean()
    ]);

    return ok({ student, upcomingTests, liveTests, latestResult, materials, notifications });
  } catch (err) {
    return handleApiError(err);
  }
}
