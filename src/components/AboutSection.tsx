"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";

export default function AboutSection() {
  const { dictionary, lang } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardStyle: CSSProperties = {
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
    background: isDark ? "rgba(14, 18, 33, 0.72)" : "rgba(255, 255, 255, 0.72)",
    boxShadow: isDark ? "0 12px 36px rgba(0,0,0,0.24)" : "0 12px 36px rgba(15,23,42,0.1)",
    backdropFilter: "blur(18px) saturate(140%)",
    WebkitBackdropFilter: "blur(18px) saturate(140%)",
  };

  const badgeStyle = (): CSSProperties => ({
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
    padding: "10px 11px",
    borderRadius: 10,
    lineHeight: 1.3,
  });

  return (
    <section
      id="about"
      className="relative min-h-[82vh] flex items-center justify-center px-4 md:px-5 py-9 md:py-12 overflow-hidden"
      style={{ cursor: "none" }}
    >
      {/* Subtle grid overlay inside the section to keep identity consistent */}
      <div
        aria-hidden
        className="absolute inset-4 rounded-[32px] pointer-events-none"
        style={{
          backgroundImage: "var(--grid-pattern)",
          backgroundSize: "var(--grid-size) var(--grid-size)",
          backgroundPosition: "var(--grid-offset-x) var(--grid-offset-y)",
          opacity: isDark ? 0.05 : 0.06,
          maskImage: "radial-gradient(120% 120% at 50% 50%, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 120% at 50% 50%, black 55%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-[20px]" style={cardStyle}>
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-8 h-12"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, rgba(14,18,33,0) 0%, rgba(14,18,33,0.35) 100%)"
                : "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.48) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "var(--grid-pattern)",
              backgroundSize: "var(--grid-size) var(--grid-size)",
              backgroundPosition: "var(--grid-offset-x) var(--grid-offset-y)",
              opacity: isDark ? 0.06 : 0.08,
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 p-5 md:p-7 items-start">
            <div className="md:col-span-8 flex flex-col gap-3.5 md:gap-4 md:pr-4">
              <div className="flex items-center gap-3">
                <div
                  className="text-xs uppercase tracking-[0.32em]"
                  style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.6)" }}
                >
                  <span className="transition-opacity duration-200" key={`label-${lang}`}>
                    {dictionary.about.label}
                  </span>
                </div>
                <div
                  className="h-px flex-1"
                  style={{ background: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)" }}
                />
              </div>

              <h2
                className="text-xl md:text-2xl font-semibold leading-tight"
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                <span className="transition-opacity duration-200" key={`headline-${lang}`}>
                  {dictionary.about.headline}
                </span>
              </h2>

              <p
                className="text-[12.8px] md:text-[13.8px] leading-[1.7] max-w-prose"
                style={{ color: isDark ? "rgba(229,231,235,0.9)" : "rgba(15,23,42,0.85)" }}
              >
                <span className="transition-opacity duration-200" key={`body-${lang}`}>
                  {dictionary.about.body}
                </span>
              </p>

              <ul className="space-y-1.5 text-sm md:text-[14px] leading-snug max-w-prose">
                {dictionary.about.bullets.map((item) => (
                  <li
                    key={`${item}-${lang}`}
                    className="flex items-start gap-2"
                    style={{ color: isDark ? "rgba(229,231,235,0.9)" : "rgba(15,23,42,0.85)" }}
                  >
                    <span
                      className="mt-[6px] h-1.5 w-1.5 rounded-full"
                      style={{ background: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.7)" }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p
                className="text-xs md:text-[12.5px] leading-[1.6] max-w-prose"
                style={{ color: isDark ? "rgba(203,213,225,0.9)" : "rgba(71,85,105,0.95)" }}
              >
                <span className="transition-opacity duration-200" key={`human-${lang}`}>
                  {dictionary.about.humanLine}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row sm:items-stretch gap-2.5 sm:gap-3 pt-1 sm:flex-nowrap sm:self-start">
                {[dictionary.about.cards.nowLabel, dictionary.about.cards.focusLabel, dictionary.about.cards.valuesLabel].map(
                  (label, idx) => {
                    const values = [
                      dictionary.about.cards.nowValue,
                      dictionary.about.cards.focusValue,
                      dictionary.about.cards.valuesValue,
                    ];
                    const value = values[idx];
                    return (
                      <div
                        key={`${label}-${lang}`}
                        className={`w-full inline-flex flex-col justify-between h-full sm:w-auto sm:flex-none ${
                          idx === 2
                            ? "sm:min-w-[190px] sm:max-w-[240px]"
                            : "sm:min-w-[150px] sm:max-w-[200px]"
                        }`}
                        style={badgeStyle()}
                      >
                        <div
                          className="text-[11px] font-semibold uppercase tracking-wide mb-0.5"
                          style={{ color: isDark ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.75)" }}
                        >
                          <span className="transition-opacity duration-200" key={`label-${label}-${lang}`}>
                            {label}
                          </span>
                        </div>
                        <div
                          className="text-[11.5px] leading-snug line-clamp-2"
                          style={{ color: isDark ? "rgba(226,232,240,0.88)" : "rgba(15,23,42,0.85)" }}
                        >
                          <span className="transition-opacity duration-200" key={`value-${value}-${lang}`}>
                            {value}
                          </span>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="md:col-span-4 flex items-start justify-end self-stretch h-full">
              <div
                className="relative w-full max-w-xs md:max-w-sm h-full min-h-[320px] max-h-[520px] rounded-lg overflow-hidden"
                style={{
                  aspectRatio: "4 / 5",
                  border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
                  boxShadow: isDark ? "0 18px 50px rgba(0,0,0,0.35)" : "0 18px 50px rgba(15,23,42,0.15)",
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <Image
                  src="/images/me.jpg"
                  alt="Portrait of Sebastián Peña"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
