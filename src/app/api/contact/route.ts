import { NextResponse } from "next/server";
import { isEmailValid, sanitizeText } from "@/lib/safe";
import { sendContactEmail } from "@/services/email";

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

const rateLimiter = {
  increment(ip: string) {
    const now = Date.now();
    const existing = rateMap.get(ip);
    if (existing && now - existing.windowStart < RATE_LIMIT_WINDOW_MS) {
      existing.count += 1;
      rateMap.set(ip, existing);
      return existing.count;
    }
    rateMap.set(ip, { count: 1, windowStart: now });
    return 1;
  },
};

function normalizePayload(body: Payload) {
  return {
    name: sanitizeText(body.name || "", 120),
    email: sanitizeText(body.email || "", 160),
    company: sanitizeText(body.company || "", 160),
    subject: sanitizeText(body.subject || "", 160),
    message: (body.message || "").trim().slice(0, 2000),
    honeypot: sanitizeText(body.honeypot || "", 16),
  };
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimiter.increment(ip) > RATE_LIMIT_MAX) {
      return NextResponse.json({ message: "Too many requests. Please wait a bit." }, { status: 429 });
    }

    const body = (await req.json().catch(() => null)) as Payload | null;
    if (!body) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const normalized = normalizePayload(body);
    if (normalized.honeypot) {
      return NextResponse.json({ message: "Blocked" }, { status: 400 });
    }

    if (
      !normalized.name ||
      !isEmailValid(normalized.email) ||
      !normalized.subject ||
      !normalized.message ||
      normalized.message.length < 20
    ) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const emailResult = await sendContactEmail({
      name: normalized.name,
      email: normalized.email,
      company: normalized.company,
      subject: normalized.subject,
      message: normalized.message,
      ip,
    });

    if (!emailResult.ok) {
      return NextResponse.json({ message: emailResult.error }, { status: 502 });
    }

    return NextResponse.json({ message: "sent" }, { status: 200 });
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
