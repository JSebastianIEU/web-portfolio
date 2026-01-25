"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useTheme } from "@/components/providers/theme-provider";

const info = [
  { label: "Now", value: "Based in Madrid" },
  { label: "Focus", value: "Software · AI · Product" },
  { label: "Values", value: "Human-centered · Responsible · Clear execution" },
];

export default function AboutSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardStyle: CSSProperties = {
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
    background: isDark ? "rgba(14, 18, 33, 0.72)" : "rgba(255, 255, 255, 0.72)",
    boxShadow: isDark ? "0 30px 90px rgba(0,0,0,0.55)" : "0 30px 90px rgba(15,23,42,0.18)",
    backdropFilter: "blur(18px) saturate(140%)",
    WebkitBackdropFilter: "blur(18px) saturate(140%)",
  };

  const badgeStyle = (): CSSProperties => ({
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
    padding: "10px",
    borderRadius: 10,
    lineHeight: 1.35,
  });

  return (
    <section
      id="about"
      className="relative min-h-[68vh] flex items-center justify-center px-4 md:px-5 py-10 md:py-14 overflow-hidden"
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
          opacity: isDark ? 0.05 : 0.07,
          maskImage: "radial-gradient(120% 120% at 50% 50%, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 120% at 50% 50%, black 55%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-5xl mx-auto">
        <div
          className="relative overflow-hidden rounded-[22px] shadow-xl"
          style={cardStyle}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "var(--grid-pattern)",
              backgroundSize: "var(--grid-size) var(--grid-size)",
              backgroundPosition: "var(--grid-offset-x) var(--grid-offset-y)",
              opacity: isDark ? 0.06 : 0.08,
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 p-6 md:p-8 items-start">
            <div className="md:col-span-8 flex flex-col gap-4 md:gap-5 md:pr-4">
              <div className="flex items-center gap-3">
                <div
                  className="text-xs uppercase tracking-[0.32em]"
                  style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.6)" }}
                >
                  About
                </div>
                <div
                  className="h-px flex-1"
                  style={{ background: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)" }}
                />
              </div>

              <h2
                className="text-2xl md:text-3xl font-semibold leading-tight"
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                Building clear systems where software, design, and data meet.
              </h2>

              <p
                className="text-sm md:text-[15px] leading-relaxed max-w-prose"
                style={{ color: isDark ? "rgba(229,231,235,0.9)" : "rgba(15,23,42,0.85)" }}
              >
                I’m Sebastián Peña, a Colombian builder based in Madrid, pursuing a degree in Computer Science and
                Artificial Intelligence. I design and build clear, useful systems with a bias for clarity—because
                technical excellence matters most when it improves outcomes for real people and real contexts.
              </p>

              <ul className="space-y-1.5 text-sm md:text-[15px] leading-snug max-w-prose">
                {[
                  "Software engineering with product judgment",
                  "Data-aware systems and practical AI",
                  "Human-centered thinking in complex environments",
                ].map((item) => (
                  <li
                    key={item}
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
                className="text-xs md:text-sm max-w-prose"
                style={{ color: isDark ? "rgba(203,213,225,0.9)" : "rgba(71,85,105,0.95)" }}
              >
                Outside of work, salsa and bachata shape how I think about adaptability, collaboration, and connection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {info.map((item) => (
                  <div key={item.label} style={badgeStyle()}>
                    <div
                      className="text-[11px] font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: isDark ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.75)" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-sm leading-snug line-clamp-2"
                      style={{ color: isDark ? "rgba(226,232,240,0.88)" : "rgba(15,23,42,0.85)" }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex items-start justify-end self-stretch h-full">
              <div
                className="relative w-full max-w-xs md:max-w-sm aspect-[3/4] rounded-xl overflow-hidden h-full max-h-[520px]"
                style={{
                  border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
                  boxShadow: isDark ? "0 18px 50px rgba(0,0,0,0.35)" : "0 18px 50px rgba(15,23,42,0.15)",
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <Image
                  src="/images/me.jpeg"
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
