import { readEnv } from "@/lib/env";
import { sendResendEmail } from "./resendClient";

export type ContactMessage = {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  ip?: string;
};

export async function sendContactEmail(payload: ContactMessage) {
  const apiKey = readEnv("RESEND_API_KEY");
  const toEmail = readEnv("CONTACT_TO_EMAIL");
  const fromEmail = readEnv("CONTACT_FROM_EMAIL");

  if (!apiKey || !toEmail || !fromEmail) {
    return { ok: false as const, error: "Email service not configured. Please try again later." };
  }

  const subjectLine = `[Portfolio] ${payload.subject} — ${payload.name}`;
  const textContent = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : "",
    `Message:`,
    payload.message,
    "",
    `Timestamp: ${new Date().toISOString()}`,
    payload.ip ? `IP: ${payload.ip}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return sendResendEmail(apiKey, {
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email,
    subject: subjectLine,
    text: textContent,
  });
}
