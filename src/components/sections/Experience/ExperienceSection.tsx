"use client";

import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/layout/SectionHeading";
import SectionShell from "@/components/layout/SectionShell";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import TransitionLink from "@/components/ui/TransitionLink";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { experience } from "@/data/experienceData";

/**
 * The track record, as a vertical timeline: role, org, dates and what was
 * actually owned. This is the section a recruiter scans to answer "does this
 * person have real experience?" — which the projects alone made them infer.
 *
 * Entries come from src/data/experienceData.ts and mirror LinkedIn, so titles
 * stay consistent with the profile the site links to.
 */
export default function ExperienceSection() {
  const { theme } = useTheme();
  const { dictionary, lang } = useI18n();
  const revealRef = useScrollReveal<HTMLElement>();
  const isDark = theme === "dark";
  const es = lang === "es";
  const copy = dictionary.experience;

  const muted = isDark ? "rgba(226,232,240,0.72)" : "rgba(15,23,42,0.66)";
  const faint = isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)";
  const rail = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)";

  return (
    <SectionShell
      id="experience"
      ref={revealRef}
      className="reveal relative w-full py-20 md:py-28"
      contentClassName="section-exit"
    >
      <div className="flex flex-col gap-6">
        <SectionHeading eyebrow={copy.label} title={copy.title} subcopy={copy.subcopy} />

        <ol className="flex flex-col gap-6 md:gap-7 pl-5 md:pl-6" style={{ borderLeft: `1px solid ${rail}` }}>
          {experience.map((item) => {
            const role = es ? item.roleES || item.role : item.role;
            const period = es ? item.periodES || item.period : item.period;
            const location = es ? item.locationES || item.location : item.location;
            const bullets = es ? item.bulletsES || item.bullets : item.bullets;

            const logo = isDark ? item.logoWhite || item.logo : item.logo;

            return (
              <li key={item.id} className="relative">
                {/* The org mark, floated into the empty space to the right of the
                    bullets (which cap at 62ch). Each sticker is anchored to its
                    own entry, so the cluster stays chronological while the tilts
                    and offsets keep it from reading as a tidy column. Hidden
                    below lg, where that space doesn't exist. */}
                {logo && item.sticker && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt=""
                    aria-hidden
                    className="exp-sticker hidden lg:block absolute pointer-events-none select-none w-auto"
                    style={{
                      ["--tilt" as string]: item.sticker.tilt,
                      ["--sticker-opacity" as string]: isDark ? 0.92 : 0.8,
                      ["--drift" as string]: `${item.sticker.drift}px`,
                      ["--tilt-delta" as string]: item.sticker.tiltDelta,
                      ["--scale-from" as string]: item.sticker.scaleFrom,
                      ["--scale-to" as string]: item.sticker.scaleTo,
                      right: item.sticker.right,
                      top: item.sticker.top,
                      height: item.sticker.height,
                      transform: `rotate(${item.sticker.tilt})`,
                      opacity: isDark ? 0.92 : 0.8,
                      // Same violet halo as the LinkedIn portrait in dark, so the
                      // white silhouettes read as lit stickers rather than holes.
                      filter: isDark
                        ? "drop-shadow(0 0 2px rgba(167,139,250,0.6)) drop-shadow(0 0 14px rgba(167,139,250,0.22)) drop-shadow(0 12px 26px rgba(0,0,0,0.5))"
                        : "drop-shadow(0 8px 18px rgba(15,23,42,0.16))",
                    }}
                  />
                )}

                {/* Rail dot */}
                <span
                  aria-hidden
                  className="absolute rounded-full"
                  style={{
                    left: "calc(-1.25rem - 4.5px)",
                    top: "0.5rem",
                    width: 9,
                    height: 9,
                    background: item.kind === "hackathon" ? faint : "#22d3ee",
                    boxShadow: item.kind === "hackathon" ? "none" : "0 0 0 3px rgba(34,211,238,0.16)",
                  }}
                />

                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-base md:text-lg font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                      {role}
                    </span>
                    <span className="text-sm md:text-base font-medium" style={{ color: muted }}>
                      · {item.org}
                    </span>
                  </div>

                  {/* exp-bullet carries motion only; colour stays inline per the
                      theming idiom. --i is the stagger index (see globals.css).
                      This span is a flex item of the wrapper above, so it is
                      blockified and the translateY actually applies — a plain
                      inline span would silently ignore it. */}
                  <span
                    className="exp-bullet font-mono text-[11px] uppercase tracking-[0.12em]"
                    style={{ color: faint, ["--i" as string]: 0 }}
                  >
                    {period} · {location}
                  </span>

                  <ul className="flex flex-col gap-1.5 mt-1 max-w-[62ch]">
                    {bullets.map((b, i) => (
                      <li
                        key={b}
                        className="exp-bullet text-[13px] md:text-sm leading-relaxed flex gap-2"
                        style={{ color: muted, ["--i" as string]: i + 1 }}
                      >
                        <span aria-hidden style={{ color: faint }}>
                          —
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {item.href && (
                    <TransitionLink
                      href={item.href}
                      data-cursor="pointer"
                      className="inline-flex items-center gap-1 text-[12.5px] font-semibold mt-1 self-start transition-transform hover:translate-x-0.5"
                      style={{ color: "#22d3ee", cursor: "none" }}
                    >
                      {es ? "Ver el caso" : "See the case"}
                      <ArrowUpRight size={14} aria-hidden />
                    </TransitionLink>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionShell>
  );
}
