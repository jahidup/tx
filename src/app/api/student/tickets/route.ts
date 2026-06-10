import { NextRequest } from "next/server";
import { z } from "zod";
import { error, handleApiError, ok, readBody, requireStudent } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { demoTickets } from "@/lib/seed-data";
import { Ticket } from "@/models";

const ticketSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(10)
});

export async function GET(request: NextRequest) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    if (!isDatabaseConfigured()) {
      return ok({ items: demoTickets, mode: "demo" });
    }

    await connectToDatabase();
    const items = await Ticket.find({ studentId: session.id }).sort({ createdAt: -1 }).lean();
    return ok({ items, mode: "database" });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  const session = requireStudent(request);
  if (session instanceof Response) return session;

  try {
    const parsed = ticketSchema.safeParse(await readBody(request));
    if (!parsed.success) return error("invalid-input", "Ticket title and message are required", 422);

    if (!isDatabaseConfigured()) {
      return ok({ created: false, reason: "database-not-configured" }, { status: 503 });
    }

    await connectToDatabase();
    const ticket = await Ticket.create({ ...parsed.data, studentId: session.id });
    return ok({ item: ticket.toObject() }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
