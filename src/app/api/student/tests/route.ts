import { NextRequest } from "next/server";
import { handleApiError, ok, requireStudent } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { demoTests } from "@/lib/seed-data";
import { Student, Test } from "@/models";

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    const status = request.nextUrl.searchParams.get("status");

    if (!isDatabaseConfigured()) {
      const tests = status ? demoTests.filter((test) => test.status === status) : demoTests;
      return ok({ items: tests, total: tests.length, mode: "demo" });
    }

    await connectToDatabase();
    const student = await Student.findById(session.id).lean();
    const query = {
      classId: student?.classId,
      ...(status ? { status } : {})
    };
    const items = await Test.find(query).sort({ startTime: 1, createdAt: -1 }).lean();
    return ok({ items, total: items.length, mode: "database" });
  } catch (err) {
    return handleApiError(err);
  }
}
