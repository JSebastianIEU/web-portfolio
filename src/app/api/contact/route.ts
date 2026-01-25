import { NextResponse } from "next/server";

type Payload = {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  honeypot?: string;
};

type RateEntry = { count: number; windowStart: number };
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateMap = new Map<string, RateEntry>();

function sanitize(str: string, max = 500) {
  return str.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function increment(ip: string) {
  const now = Date.now();
  const existing = rateMap.get(ip);
  if (existing && now - existing.windowStart < RATE_LIMIT_WINDOW_MS) {
    existing.count += 1;
    rateMap.set(ip, existing);
    return existing.count;
  }
  rateMap.set(ip, { count: 1, windowStart: now });
  return 1;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (increment(ip) > RATE_LIMIT_MAX) {
      return NextResponse.json({ message: "Too many requests. Please wait a bit." }, { status: 429 });
    }

    const body = (await req.json()) as Payload;
    if (body.honeypot) {
      return NextResponse.json({ message: "Blocked" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const name = sanitize(body.name || "", 120);
    const email = sanitize(body.email || "", 160);
    const company = sanitize(body.company || "", 160);
    const subject = sanitize(body.subject || "", 160);
    const message = (body.message || "").trim().slice(0, 2000);

    if (!name || !emailRegex.test(email) || !subject || !message || message.length < 20) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        { message: "Email service not configured. Please try again later." },
        { status: 500 },
      );
    }

    const subjectLine = `[Portfolio] ${subject} — ${name}`;
    const textContent = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : "",
      `Message:`,
      message,
      "",
      `Timestamp: ${new Date().toISOString()}`,
      `IP: ${ip}`,
    ]
      .filter(Boolean)
      .join("\n");

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: subjectLine,
        text: textContent,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("Resend error", detail);
      return NextResponse.json({ message: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ message: "sent" }, { status: 200 });
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
