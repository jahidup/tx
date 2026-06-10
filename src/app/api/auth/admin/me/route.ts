import { NextRequest } from "next/server";
import { ok, requireAdmin } from "@/lib/api";

export async function GET(request: NextRequest) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;
  return ok({ user: session });
}
