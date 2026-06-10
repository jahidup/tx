import { NextRequest } from "next/server";
import { error, handleApiError, ok, readBody, requireAdmin } from "@/lib/api";
import { deleteResource, getResource, isResourceName, updateResource } from "@/lib/resources";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  const { resource, id } = await context.params;
  if (!isResourceName(resource)) return error("not-found", "Unknown admin resource", 404);

  try {
    const item = await getResource(resource, id);
    if (!item) return error("not-found", "Record not found", 404);
    return ok({ item });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  const { resource, id } = await context.params;
  if (!isResourceName(resource)) return error("not-found", "Unknown admin resource", 404);

  try {
    const payload = await readBody<Record<string, unknown>>(request);
    const item = await updateResource(resource, id, payload);
    if (!item) return error("not-found", "Record not found", 404);
    return ok({ item });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> }
) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  const { resource, id } = await context.params;
  if (!isResourceName(resource)) return error("not-found", "Unknown admin resource", 404);

  try {
    return ok(await deleteResource(resource, id));
  } catch (err) {
    return handleApiError(err);
  }
}
