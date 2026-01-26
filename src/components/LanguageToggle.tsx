"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";

interface LanguageToggleProps {
  onEnter?: () => void;
  onLeave?: () => void;
}

const segments: Array<"en" | "es"> = ["en", "es"];

export default function LanguageToggle({ onEnter, onLeave }: LanguageToggleProps) {
  const { lang, setLang } = useI18n();
  const { theme } = useTheme();
  const isActive = (code: "en" | "es") => lang === code;
  const activeIndex = lang === "es" ? 1 : 0;
  const isDark = theme === "dark";

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
      className="relative inline-flex rounded-full pointer-events-auto select-none p-1"
      style={capsuleStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label="Language switcher"
      role="group"
    >
      {/* Sliding thumb background */}
      <div
        className="absolute top-1 bottom-1 rounded-full transition-transform duration-300 ease-out"
        style={{
          left: 4,
          right: 4,
          width: "calc(50% - 4px)",
          transform: activeIndex === 0 ? "translateX(0)" : "translateX(100%)",
          background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.3)",
          boxShadow: isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
            : "0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(255, 255, 255, 0.4)",
          cursor: "none",
        }}
      />
      {/* Equal-width buttons */}
      {segments.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={isActive(code)}
          aria-label={`Change language to ${code.toUpperCase()}`}
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          className="relative z-10 w-10 h-8 sm:w-12 flex items-center justify-center text-[11px] sm:text-xs font-semibold uppercase tracking-wide transition-colors duration-200 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          style={{
            color: isActive(code)
              ? isDark
                ? "rgba(255,255,255,0.96)"
                : "#0f172a"
              : isDark
                ? "rgba(255,255,255,0.82)"
                : "rgba(71,85,105,0.7)",
            background: "transparent",
            boxShadow: "none",
            cursor: "none",
          }}
        >
          <span className="transition-opacity duration-200">{code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
