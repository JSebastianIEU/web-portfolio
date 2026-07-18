"use client";

import { cn } from "@/lib/cn";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subcopy?: string;
  /** "lg" is the About/opening-statement scale; "md" is a regular chapter. */
  size?: "md" | "lg";
  className?: string;
};

/**
 * One heading treatment for every homepage chapter: a category eyebrow with a
 * hairline, the title, and a supporting line. Sections used to hand-roll these,
 * which is why Skills ended up as a bare word floating over its canvas with no
 * subcopy at all.
 *
 * Each slot is keyed by language so switching ES/EN crossfades instead of
 * snapping — the behaviour About already had, now shared.
 *
 * Contact deliberately does NOT use this: its heading is centred inside a glass
 * panel with its own tokens and no parallax, and unifying it would change five
 * things for no gain.
 */
export default function SectionHeading({ eyebrow, title, subcopy, size = "md", className }: SectionHeadingProps) {
  const { theme } = useTheme();
  const { lang } = useI18n();
  const isDark = theme === "dark";
  const isLg = size === "lg";

  return (
    <div className={cn("flex flex-col", isLg ? "gap-5 md:gap-6" : "gap-3", className)}>
      {/* t() returns "" for a missing key, and "" is falsy — so a section
          without an eyebrow renders nothing rather than an empty box. */}
      {eyebrow && (
        <div className="flex items-center gap-3">
          <div
            className="text-xs uppercase tracking-[0.32em]"
            data-parallax="title"
            data-speed="0.16"
            style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.6)" }}
          >
            <span className="transition-opacity duration-200" key={`eyebrow-${lang}`}>
              {eyebrow}
            </span>
          </div>
          <div
            aria-hidden
            className="h-px w-16"
            data-parallax="title"
            data-speed="0.12"
            style={{ background: isDark ? "rgba(255,255,255,0.16)" : "rgba(15,23,42,0.12)" }}
          />
        </div>
      )}

      <h2
        className={
          isLg
            ? "text-2xl md:text-[2rem] lg:text-4xl 2xl:text-[2.75rem] font-semibold leading-tight md:leading-[1.15] max-w-[24ch]"
            : "text-2xl md:text-3xl font-semibold"
        }
        data-parallax="title"
        data-speed={isLg ? "0.28" : "0.26"}
        style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
      >
        <span className="transition-opacity duration-200" key={`title-${lang}`}>
          {title}
        </span>
      </h2>

      {subcopy && (
        <p
          className="text-sm md:text-base max-w-[58ch]"
          style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.7)" }}
        >
          <span className="transition-opacity duration-200" key={`subcopy-${lang}`}>
            {subcopy}
          </span>
        </p>
      )}
    </div>
  );
}
