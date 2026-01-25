"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/providers/language-provider";

interface LanguageToggleProps {
  onEnter?: () => void;
  onLeave?: () => void;
}

const segments: Array<"en" | "es"> = ["en", "es"];

export default function LanguageToggle({ onEnter, onLeave }: LanguageToggleProps) {
  const { lang, setLang } = useI18n();
  const isActive = (code: "en" | "es") => lang === code;

  const handleToggle = (code: "en" | "es") => {
    setLang(code);
  };

  const capsuleStyle = useMemo(
    () => ({
      backdropFilter: "blur(10px) saturate(140%) contrast(110%)",
      WebkitBackdropFilter: "blur(10px) saturate(140%) contrast(110%)",
      border: "1px solid rgba(255, 255, 255, 0.14)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
      background: "rgba(255, 255, 255, 0.06)",
      backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22) 0, rgba(255,255,255,0) 45%)",
      cursor: "none",
    }),
    [],
  );

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-full pointer-events-auto select-none"
      style={capsuleStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label="Language switcher"
      role="group"
    >
      {segments.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={isActive(code)}
          aria-label={`Change language to ${code.toUpperCase()}`}
          onClick={() => handleToggle(code)}
          className="relative px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          style={{
            color: isActive(code) ? "#0f172a" : "rgba(255,255,255,0.82)",
            background: isActive(code) ? "rgba(255,255,255,0.9)" : "transparent",
            boxShadow: isActive(code) ? "0 6px 14px rgba(0,0,0,0.18)" : "none",
            cursor: "none",
          }}
        >
          <span className="transition-opacity duration-200">{code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
