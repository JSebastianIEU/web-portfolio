"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import type { TranslationCopy } from "@/domain/i18n";
import { isEmailValid } from "@/lib/safe";
import { normalizeContactForm } from "@/domain/contact";

type ContactWizardProps = {
  copy: TranslationCopy["contact"];
  isDark: boolean;
  enterLink?: () => void;
  leaveLink?: () => void;
};

type Account = "company" | "individual";

// Steps that carry the progress bar (the who/goal chips auto-advance).
const TOTAL_STEPS = 4;

export default function ContactWizard({ copy, isDark, enterLink, leaveLink }: ContactWizardProps) {
  const w = copy.wizard;
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState<Account | null>(null);
  const [intentId, setIntentId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const cooldownUntil = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const intents = account ? w.intents[account] : [];
  const intentLabel = intents.find((i) => i.id === intentId)?.label ?? "";
  const accountLabel = account ? w.account[account] : "";

  const chipStyle = useMemo(
    () => ({
      base: {
        border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.14)",
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
        color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.86)",
      },
      active: {
        border: isDark ? "1px solid rgba(248,250,252,0.9)" : "1px solid #0f172a",
        background: isDark ? "#f8fafc" : "#0f172a",
        color: isDark ? "#0f172a" : "#f8fafc",
      },
    }),
    [isDark],
  );

  const inputStyle = {
    color: isDark ? "#f8fafc" : "#0f172a",
    borderBottom: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(15,23,42,0.22)",
    cursor: "none" as const,
  };
  const bigText = { color: isDark ? "#f8fafc" : "#0f172a" };
  const subtle = { color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)" };

  const goNext = () => {
    setError(null);
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };
  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const pickAccount = (a: Account) => {
    setAccount(a);
    setIntentId(null);
    setError(null);
    setStep(1);
  };
  const pickIntent = (id: string) => {
    setIntentId(id);
    setError(null);
    setStep(2);
  };

  const validateStory = () => {
    if (message.trim().length < 20) {
      setError(copy.form.messageLength);
      return false;
    }
    return true;
  };
  const validateReach = () => {
    if (!name.trim()) return setError(copy.form.required), false;
    if (!isEmailValid(email.trim())) return setError(copy.form.emailInvalid), false;
    return true;
  };

  const handleContinue = () => {
    if (step === 2 && !validateStory()) return;
    if (step === 3 && !validateReach()) return;
    goNext();
  };

  const handleSubmit = async () => {
    if (Date.now() < cooldownUntil.current) return;
    if (!validateReach()) {
      setStep(3);
      return;
    }
    const normalized = normalizeContactForm({
      name,
      email,
      company: account === "company" ? companyName : "",
      subject: `${accountLabel} · ${intentLabel}`,
      message,
      honeypot: honeypotRef.current?.value ?? "",
    });
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed");
      setStatus("success");
      cooldownUntil.current = Date.now() + 12_000;
    } catch {
      setStatus("error");
      setError(copy.form.error);
    }
  };

  const reset = () => {
    setStep(0);
    setAccount(null);
    setIntentId(null);
    setMessage("");
    setName("");
    setEmail("");
    setCompanyName("");
    setStatus("idle");
    setError(null);
  };

  const hoverProps = { onMouseEnter: enterLink, onMouseLeave: leaveLink };

  if (status === "success") {
    return (
      <div className="glass-panel rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-4">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: isDark ? "rgba(52,211,153,0.16)" : "rgba(16,185,129,0.12)" }}
        >
          <Check size={26} color={isDark ? "#34d399" : "#059669"} aria-hidden />
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold" style={bigText}>
          {w.successTitle}
        </h2>
        <p className="text-sm md:text-base max-w-md" style={subtle}>
          {w.successBody}
        </p>
        <button
          type="button"
          onClick={reset}
          data-cursor="pointer"
          className="mt-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          style={{ ...chipStyle.base, cursor: "none" }}
          {...hoverProps}
        >
          {w.another}
        </button>
      </div>
    );
  }

  const chip = (label: string, active: boolean, onClick: () => void, key?: string) => (
    <button
      key={key ?? label}
      type="button"
      onClick={onClick}
      data-cursor="pointer"
      className="rounded-2xl px-5 py-4 text-left text-sm md:text-base font-semibold transition-all duration-150 hover:scale-[1.02]"
      style={{ ...(active ? chipStyle.active : chipStyle.base), cursor: "none" }}
      aria-pressed={active}
      {...hoverProps}
    >
      {label}
    </button>
  );

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {w.steps.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col gap-1.5">
            <div
              className="h-1 rounded-full transition-colors duration-300"
              style={{
                background:
                  i <= step
                    ? isDark
                      ? "#f8fafc"
                      : "#0f172a"
                    : isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(15,23,42,0.1)",
              }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={subtle}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Steps — one big question per screen */}
      <div key={step} className="wizard-step flex flex-col gap-6 min-h-[240px]">
        {step === 0 && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold" style={bigText}>
              {w.q1}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chip(w.account.company, account === "company", () => pickAccount("company"), "company")}
              {chip(w.account.individual, account === "individual", () => pickAccount("individual"), "individual")}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold" style={bigText}>
              {w.q2}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {intents.map((i) => chip(i.label, intentId === i.id, () => pickIntent(i.id), i.id))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold" style={bigText}>
              {w.q3}
            </h2>
            <p className="text-sm" style={subtle}>
              {w.q3hint}
            </p>
            <textarea
              autoFocus
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError(null);
              }}
              placeholder={w.messagePlaceholder}
              maxLength={2000}
              className="w-full bg-transparent text-base md:text-lg leading-relaxed resize-none min-h-[140px] focus:outline-none"
              style={{ color: isDark ? "#f8fafc" : "#0f172a", cursor: "none" }}
            />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold" style={bigText}>
              {w.q4}
            </h2>
            <div className="flex flex-col gap-5 max-w-md">
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder={w.namePlaceholder}
                maxLength={120}
                className="w-full bg-transparent py-2 text-base md:text-lg focus:outline-none"
                style={inputStyle}
              />
              <input
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={w.emailPlaceholder}
                maxLength={160}
                className="w-full bg-transparent py-2 text-base md:text-lg focus:outline-none"
                style={inputStyle}
              />
              {account === "company" && (
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={w.companyPlaceholder}
                  maxLength={160}
                  className="w-full bg-transparent py-2 text-base md:text-lg focus:outline-none"
                  style={inputStyle}
                />
              )}
            </div>
          </>
        )}

        {/* Honeypot — visually hidden, must stay empty. */}
        <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden>
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}
      </div>

      {/* Review strip on the last step */}
      {step === TOTAL_STEPS - 1 && (
        <div className="mt-2 mb-6 flex flex-col gap-2 text-sm" style={subtle}>
          <div>
            <span className="font-semibold">{w.summaryWho}:</span> {accountLabel}
          </div>
          <div>
            <span className="font-semibold">{w.summaryGoal}:</span> {intentLabel}
          </div>
          <div className="line-clamp-2">
            <span className="font-semibold">{w.summaryMessage}:</span> {message}
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          data-cursor="pointer"
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-opacity"
          style={{ ...chipStyle.base, cursor: "none", opacity: step === 0 ? 0.35 : 1 }}
          {...hoverProps}
        >
          <ArrowLeft size={15} aria-hidden />
          {w.back}
        </button>

        {step === TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            data-cursor="pointer"
            disabled={status === "loading"}
            className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.04]"
            style={{ ...chipStyle.active, cursor: "none", opacity: status === "loading" ? 0.65 : 1 }}
            {...hoverProps}
          >
            {status === "loading" ? w.sending : w.send}
            <Send size={15} aria-hidden />
          </button>
        ) : (
          // Steps 0 and 1 auto-advance on chip select; show Continue on 2 and 3.
          step >= 2 && (
            <button
              type="button"
              onClick={handleContinue}
              data-cursor="pointer"
              className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.04]"
              style={{ ...chipStyle.active, cursor: "none" }}
              {...hoverProps}
            >
              {w.next}
              <ArrowRight size={15} aria-hidden />
            </button>
          )
        )}
      </div>
    </div>
  );
}
