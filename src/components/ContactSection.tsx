"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { siteConfig } from "@/config/siteConfig";

type Variant = "section" | "page";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  honeypot: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const contactCopy = {
  en: {
    title: "Contact",
    tagline: "Let's talk.",
    subcopy: "Reach out for collaborations, product conversations, or quick questions.",
    actions: {
      email: "Email me",
      linkedin: "LinkedIn",
      calendly: "Book a call",
    },
    form: {
      name: "Name",
      email: "Email",
      company: "Company (optional)",
      subject: "Subject",
      message: "Message",
      submit: "Send message",
      sent: "Message sent. I'll get back to you soon.",
      error: "Something went wrong. Please try again.",
    },
    validation: {
      required: "This field is required",
      email: "Enter a valid email",
      messageLength: "Message should be at least 20 characters",
    },
  },
  es: {
    title: "Contacto",
    tagline: "Hablemos.",
    subcopy: "Escríbeme para colaborar, hablar de producto o resolver dudas rápidas.",
    actions: {
      email: "Envíame un correo",
      linkedin: "LinkedIn",
      calendly: "Agenda una llamada",
    },
    form: {
      name: "Nombre",
      email: "Correo",
      company: "Empresa (opcional)",
      subject: "Asunto",
      message: "Mensaje",
      submit: "Enviar mensaje",
      sent: "Mensaje enviado. Te responderé pronto.",
      error: "Algo salió mal. Intenta de nuevo.",
    },
    validation: {
      required: "Este campo es obligatorio",
      email: "Ingresa un correo válido",
      messageLength: "El mensaje debe tener al menos 20 caracteres",
    },
  },
};

function validate(form: FormState, copy: (typeof contactCopy)["en"]): FieldErrors {
  const errors: FieldErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed: FormState = {
    ...form,
    name: form.name.trim(),
    email: form.email.trim(),
    company: form.company.trim(),
    subject: form.subject.trim(),
    message: form.message.trim(),
    honeypot: form.honeypot.trim(),
  };

  if (!trimmed.name) errors.name = copy.validation.required;
  if (!trimmed.email || !emailRegex.test(trimmed.email)) errors.email = copy.validation.email;
  if (!trimmed.subject) errors.subject = copy.validation.required;
  if (!trimmed.message || trimmed.message.length < 20) errors.message = copy.validation.messageLength;
  return errors;
}

export default function ContactSection({ variant = "section", enterLink, leaveLink }: { variant?: Variant; enterLink?: () => void; leaveLink?: () => void }) {
  const { lang } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const copy = lang === "es" ? contactCopy.es : contactCopy.en;

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);

  const containerStyles = useMemo(
    () => ({
      border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.1)",
      background: isDark ? "rgba(14,18,33,0.72)" : "rgba(255,255,255,0.78)",
      boxShadow: isDark ? "0 14px 40px rgba(0,0,0,0.32)" : "0 14px 40px rgba(15,23,42,0.12)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    }),
    [isDark],
  );

  const inputStyle = useMemo(
    () => ({
      border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.12)",
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
      color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
    }),
    [isDark],
  );

  const labelStyle = { color: isDark ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.75)" };
  const subtle = { color: isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.9)" };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < cooldownUntil) return;

    const trimmed: FormState = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      honeypot: form.honeypot.trim(),
    };

    const validation = validate(trimmed, copy);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...trimmed, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed");

      setStatus("success");
      setCooldownUntil(Date.now() + 12_000);
      setForm({ name: "", email: "", company: "", subject: "", message: "", honeypot: "" });
    } catch {
      setStatus("error");
    }
  };

  const actions = [
    {
      label: copy.actions.email,
      href: `mailto:${siteConfig.email}`,
      show: Boolean(siteConfig.email),
    },
    {
      label: copy.actions.linkedin,
      href: siteConfig.linkedin,
      show: Boolean(siteConfig.linkedin),
    },
    {
      label: copy.actions.calendly,
      href: siteConfig.calendly,
      show: Boolean(siteConfig.calendly),
    },
  ].filter((a) => a.show);

  return (
    <section
      id={variant === "section" ? "contact" : undefined}
      className="relative w-full px-4 md:px-6 py-12 md:py-16"
      style={{ cursor: "none" }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {copy.title}
          </h2>
          <div className="text-lg font-semibold" style={{ color: isDark ? "#e2e8f0" : "#111827" }}>
            {copy.tagline}
          </div>
          <p className="text-sm md:text-base" style={subtle}>
            {copy.subcopy}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.href.startsWith("http") ? "_blank" : undefined}
              rel={action.href.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              data-cursor="pointer"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.18)",
                color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
                cursor: "none",
              }}
              onMouseEnter={enterLink}
              onMouseLeave={leaveLink}
            >
              {action.label}
            </a>
          ))}
        </div>

        <div className="relative rounded-2xl p-5 md:p-6" style={containerStyles}>
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              backgroundImage: "var(--grid-pattern)",
              backgroundSize: "var(--grid-size) var(--grid-size)",
              backgroundPosition: "var(--grid-offset-x) var(--grid-offset-y)",
              opacity: isDark ? 0.06 : 0.08,
            }}
          />

          <form className="relative z-10 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={labelStyle}>
                  {copy.form.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                  style={inputStyle}
                  maxLength={120}
                  onMouseEnter={() => enterLink?.()}
                  onMouseLeave={() => leaveLink?.()}
                />
                {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={labelStyle}>
                  {copy.form.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                  style={inputStyle}
                  maxLength={160}
                  inputMode="email"
                  onMouseEnter={() => enterLink?.()}
                  onMouseLeave={() => leaveLink?.()}
                />
                {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={labelStyle}>
                  {copy.form.company}
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                  style={inputStyle}
                  maxLength={160}
                  onMouseEnter={() => enterLink?.()}
                  onMouseLeave={() => leaveLink?.()}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={labelStyle}>
                  {copy.form.subject}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                  style={inputStyle}
                  maxLength={160}
                  onMouseEnter={() => enterLink?.()}
                  onMouseLeave={() => leaveLink?.()}
                />
                {errors.subject && <p className="text-xs text-rose-400">{errors.subject}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={labelStyle}>
                {copy.form.message}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm min-h-[140px] focus:outline-none focus:ring-2 focus:ring-slate-300/60"
                style={inputStyle}
                maxLength={2000}
                onMouseEnter={() => enterLink?.()}
                onMouseLeave={() => leaveLink?.()}
              />
              {errors.message && <p className="text-xs text-rose-400">{errors.message}</p>}
            </div>

            {/* Honeypot */}
            <div style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
              <label>
                Do not fill
                <input
                  type="text"
                  name="website"
                  value={form.honeypot}
                  onChange={(e) => handleChange("honeypot", e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={status === "loading" || Date.now() < cooldownUntil}
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                data-cursor="pointer"
                style={{
                  border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(15,23,42,0.18)",
                  color: isDark ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.9)",
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
                  opacity: status === "loading" || Date.now() < cooldownUntil ? 0.65 : 1,
                  cursor: "none",
                }}
                onMouseEnter={enterLink}
                onMouseLeave={leaveLink}
              >
                {status === "loading" ? "..." : copy.form.submit}
              </button>
              {status === "success" && <span className="text-sm text-emerald-400">{copy.form.sent}</span>}
              {status === "error" && <span className="text-sm text-rose-400">{copy.form.error}</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
