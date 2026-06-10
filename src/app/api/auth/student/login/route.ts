import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit, error, handleApiError, readBody } from "@/lib/api";
import { setSessionCookie, signSession, verifyStudentCredentials } from "@/lib/auth";

const loginSchema = z.object({
  rollNumber: z.string().min(1),
  dob: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, "student-login", 20);
  if (limited) return limited;

  try {
    const parsed = loginSchema.safeParse(await readBody(request));
    if (!parsed.success) {
      return error("invalid-input", "Roll number and date of birth are required", 422);
    }

    const student = await verifyStudentCredentials(parsed.data.rollNumber, parsed.data.dob);
    if (!student) {
      return error("invalid-credentials", "Invalid roll number or date of birth", 401);
    }

    const token = signSession(student);
    const response = NextResponse.json({ user: student });
    setSessionCookie(response, "student", token);
    return response;
  } catch (err) {
    return handleApiError(err);
  }
}
