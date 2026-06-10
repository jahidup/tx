import { NextRequest } from "next/server";
import { handleApiError, ok, readBody, requireAdmin } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const session = requireAdmin(request);
  if (session instanceof Response) return session;

  try {
    const body = await readBody<{ dataUri: string; folder?: string }>(request);
    const result = await uploadToCloudinary(body.dataUri, body.folder);
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
