"use client";

import { useMemo } from "react";
import { cvFiles } from "@/data/contactCopy";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";

type Props = {
  onEnterLink?: () => void;
  onLeaveLink?: () => void;
};

export default function BetweenSectionsCta({ onEnterLink, onLeaveLink }: Props) {
  const { dictionary, lang } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cvFile = cvFiles[lang] ?? cvFiles.en;
  const cvHref = `/documents/${encodeURIComponent(cvFile)}`;

  const styles = useMemo(
    () => ({
      primaryBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
      primaryBorder: isDark ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.35)",
      primaryText: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.82)",
      secondaryBorder: isDark ? "rgba(248, 250, 252, 0.45)" : "rgba(15, 23, 42, 0.3)",
      secondaryText: isDark ? "rgba(248, 250, 252, 0.8)" : "rgba(15, 23, 42, 0.72)",
      hoverBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
    }),
    [isDark],
  );

  return (
    <section
      aria-label="About to Skills transition"
      className="relative w-full py-5 md:py-6 flex justify-center"
      style={{ cursor: "none" }}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-col sm:flex-row text-center sm:text-left">
        <a
          href={cvHref}
          onMouseEnter={onEnterLink}
          onFocus={onEnterLink}
          onMouseLeave={onLeaveLink}
          onBlur={onLeaveLink}
          download
          className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
          style={{
            color: styles.primaryText,
            border: `1px solid ${styles.primaryBorder}`,
            background: styles.primaryBg,
            cursor: "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-y-[1px]"
            style={{
              filter: isDark
                ? "drop-shadow(0 2px 6px rgba(0,0,0,0.45))"
                : "drop-shadow(0 1px 4px rgba(0,0,0,0.15))",
            }}
          >
            <path
              d="M10 3.75v8.25m0 0 3.25-3.25M10 12l-3.25-3.25M4.5 14.5h11"
              stroke={styles.primaryText}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{dictionary.cta.downloadCv}</span>
        </a>

        <a
          href="#contact"
          onMouseEnter={onEnterLink}
          onFocus={onEnterLink}
          onMouseLeave={onLeaveLink}
          onBlur={onLeaveLink}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
          style={{
            color: styles.secondaryText,
            border: `1px solid ${styles.secondaryBorder}`,
            cursor: "none",
          }}
        >
          <span>{dictionary.cta.contactMe}</span>
        </a>
      </div>
    </section>
  );
}
