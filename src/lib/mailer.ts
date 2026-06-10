import nodemailer from "nodemailer";
import { env } from "@/lib/env";

export async function sendMail({
  to,
  subject,
  html,
  attachments
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content?: Buffer; path?: string }>;
}) {
  if (!env.emailUser || !env.emailPass) {
    return {
      sent: false,
      reason: "mail-not-configured"
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.emailUser,
      pass: env.emailPass
    }
  });

  const response = await transporter.sendMail({
    from: `"Sankalp Digital Pathshala" <${env.emailUser}>`,
    to,
    subject,
    html,
    attachments
  });

  return { sent: true, id: response.messageId };
}
