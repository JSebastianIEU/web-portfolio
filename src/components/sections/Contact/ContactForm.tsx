"use client";

import { useMemo, useState } from "react";
import type { TranslationCopy } from "@/domain/i18n";
import type { ContactFormErrors, ContactFormValues } from "@/domain/contact";
import { normalizeContactForm, validateContactForm } from "@/domain/contact";

type ContactFormProps = {
  copy: TranslationCopy["contact"];
  isDark: boolean;
  enterLink?: () => void;
  leaveLink?: () => void;
};

export default function ContactForm({ copy, isDark, enterLink, leaveLink }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormValues>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
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

  const handleChange = (field: keyof ContactFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() < cooldownUntil) return;

    const normalized = normalizeContactForm(form);
    const validation = validateContactForm(normalized, copy);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...normalized }),
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

  return (
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
          />
          {errors.message && <p className="text-xs text-rose-400">{errors.message}</p>}
        </div>

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
  );
}
