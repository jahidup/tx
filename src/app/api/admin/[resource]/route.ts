import { NextRequest } from "next/server";
import { error, handleApiError, ok, readBody, requireAdmin } from "@/lib/api";
import { createResource, isResourceName, listResource } from "@/lib/resources";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ resource: string }> }
) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  const { resource } = await context.params;
  if (!isResourceName(resource)) return error("not-found", "Unknown admin resource", 404);

  try {
    const result = await listResource(resource, request.nextUrl.searchParams);
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ resource: string }> }
) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  const { resource } = await context.params;
  if (!isResourceName(resource)) return error("not-found", "Unknown admin resource", 404);

  try {
    const payload = await readBody<Record<string, unknown>>(request);
    const item = await createResource(resource, { ...payload, createdBy: session.adminId || session.id });
    return ok({ item }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
