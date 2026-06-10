import { NextRequest } from "next/server";
import { ok, requireStudent } from "@/lib/api";

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;
  return ok({ user: session });
}
