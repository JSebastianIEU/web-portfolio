export type ResendEmailPayload = {
  from: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  text: string;
};

export async function sendResendEmail(apiKey: string, payload: ResendEmailPayload) {
  const toList = Array.isArray(payload.to) ? payload.to : [payload.to];
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: toList,
      reply_to: payload.replyTo,
      subject: payload.subject,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "Unknown error");
    return { ok: false as const, error: detail || "Failed to send email" };
  }

  return { ok: true as const };
}
