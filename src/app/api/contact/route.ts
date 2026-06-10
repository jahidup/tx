import { NextRequest } from "next/server";
import { z } from "zod";
import { enforceRateLimit, error, handleApiError, ok, readBody } from "@/lib/api";
import { sendMail } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, "contact", 12);
  if (limited) return limited;

  try {
    const parsed = contactSchema.safeParse(await readBody(request));
    if (!parsed.success) return error("invalid-input", "Please send name, email and message", 422);

    const mail = await sendMail({
      to: process.env.EMAIL_USER || parsed.data.email,
      subject: "New portal inquiry",
      html: `<p><strong>${parsed.data.name}</strong> (${parsed.data.email}) sent:</p><p>${parsed.data.message}</p>`
    });

    return ok({ received: true, mail });
  } catch (err) {
    return handleApiError(err);
  }
}
