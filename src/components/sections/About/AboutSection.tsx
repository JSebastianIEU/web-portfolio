"use client";

import SectionShell from "@/components/layout/SectionShell";
import StickerCluster from "@/components/sections/About/StickerCluster";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * About, floating edition: no panel, no box - the story and the sticker
 * cluster sit directly on the page. Type runs larger and airier so the copy
 * reads as a narrative rather than a card's caption.
 */
export default function AboutSection() {
  const { dictionary, lang } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <SectionShell
      id="about"
      ref={revealRef}
      className="reveal relative min-h-[86vh] flex items-center justify-center py-14 md:py-20"
      contentClassName="relative w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="order-2 md:order-1 md:col-span-7 flex flex-col gap-5 md:gap-6">
          <div className="flex items-center gap-3">
            <div
              className="text-xs uppercase tracking-[0.32em]"
              data-parallax="title"
              data-speed="0.16"
              style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.6)" }}
            >
              <span className="transition-opacity duration-200" key={`label-${lang}`}>
                {dictionary.about.label}
              </span>
            </div>
            <div
              className="h-px w-16"
              data-parallax="title"
              data-speed="0.12"
              style={{ background: isDark ? "rgba(255,255,255,0.16)" : "rgba(15,23,42,0.12)" }}
            />
          </div>

          <h2
            className="text-2xl md:text-[2rem] lg:text-4xl 2xl:text-[2.75rem] font-semibold leading-tight md:leading-[1.15] max-w-[24ch]"
            data-parallax="title"
            data-speed="0.28"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            <span className="transition-opacity duration-200" key={`headline-${lang}`}>
              {dictionary.about.headline}
            </span>
          </h2>

          <p
            className="text-sm md:text-[15px] 2xl:text-base leading-[1.85] max-w-prose"
            style={{ color: isDark ? "rgba(229,231,235,0.9)" : "rgba(15,23,42,0.85)" }}
          >
            <span className="transition-opacity duration-200" key={`body-${lang}`}>
              {dictionary.about.body}
            </span>
          </p>

          <p
            className="text-[13px] md:text-sm leading-[1.7] max-w-prose italic"
            style={{ color: isDark ? "rgba(203,213,225,0.85)" : "rgba(71,85,105,0.95)" }}
          >
            <span className="transition-opacity duration-200" key={`human-${lang}`}>
              {dictionary.about.humanLine}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row sm:items-stretch gap-2.5 sm:gap-3 pt-2 sm:flex-nowrap sm:self-start">
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
                    className={`glass-tile float-layer w-full inline-flex flex-col justify-between h-full sm:w-auto sm:flex-none px-3 py-2.5 rounded-xl leading-[1.3] ${
                      idx === 2 ? "sm:min-w-[190px] sm:max-w-[300px]" : "sm:min-w-[150px] sm:max-w-[200px]"
                    }`}
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

        <div className="order-1 md:order-2 md:col-span-5 flex items-center justify-center md:justify-end py-2 md:py-0">
          <StickerCluster />
        </div>
      </div>
    </SectionShell>
  );
}
