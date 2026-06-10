import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit, error, handleApiError, readBody } from "@/lib/api";
import { setSessionCookie, signSession, verifyAdminCredentials } from "@/lib/auth";

const loginSchema = z.object({
  adminId: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, "admin-login", 10);
  if (limited) return limited;

  try {
    const parsed = loginSchema.safeParse(await readBody(request));
    if (!parsed.success) {
      return error("invalid-input", "Admin ID and password are required", 422);
    }

    const admin = await verifyAdminCredentials(parsed.data.adminId, parsed.data.password);
    if (!admin) {
      return error("invalid-credentials", "Invalid admin credentials", 401);
    }

    const token = signSession(admin);
    const response = NextResponse.json({ user: admin });
    setSessionCookie(response, "admin", token);
    return response;
  } catch (err) {
    return handleApiError(err);
  }
}
