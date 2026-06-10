import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/utils";
import type { ApiError, SessionPayload } from "@/types/platform";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function error(errorCode: string, message: string, status = 400) {
  return NextResponse.json<ApiError>({ error: errorCode, message }, { status });
}

export async function readBody<T>(request: NextRequest): Promise<T> {
  const body = await request.json().catch(() => ({}));
  return sanitizeObject(body) as T;
}

export function requireAdmin(request: NextRequest): SessionPayload | NextResponse<ApiError> {
  const session = getSessionFromRequest(request, "admin");
  if (!session || session.role !== "admin") {
    return error("unauthorized", "Admin session is required", 401);
  }
  return session;
}

export function requireStudent(request: NextRequest): SessionPayload | NextResponse<ApiError> {
  const session = getSessionFromRequest(request, "student");
  if (!session || session.role !== "student") {
    return error("unauthorized", "Student session is required", 401);
  }
  return session;
}

export function requestIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export function enforceRateLimit(request: NextRequest, scope: string, limit?: number) {
  const result = rateLimit(`${scope}:${requestIp(request)}`, limit);
  if (!result.allowed) {
    return error("rate-limited", "Too many requests. Please try again soon.", 429);
  }
  return null;
}

export function handleApiError(err: unknown) {
  const message = err instanceof Error ? err.message : "Something went wrong";
  const status = message.includes("not configured") ? 503 : 500;
  return error("server-error", message, status);
}
