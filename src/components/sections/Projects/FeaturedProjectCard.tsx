"use client";

import { ArrowUpRight, Lock } from "lucide-react";
import type { Locale, TranslationCopy } from "@/domain/i18n";
import type { Project } from "@/domain/projects";
import TiltCard from "@/components/ui/TiltCard";
import ProjectBadge from "./ProjectBadge";
import ProjectPreview from "./ProjectPreview";

type FeaturedProjectCardProps = {
  project: Project;
  onOpen: () => void;
  isDark: boolean;
  displayType: string;
  displayStatus: string;
  copy: TranslationCopy["projects"];
  lang: Locale;
};

export default function FeaturedProjectCard({
  project,
  onOpen,
  isDark,
  displayType,
  displayStatus,
  copy,
  lang,
}: FeaturedProjectCardProps) {
  const badgeTone = project.status === "live" ? "accent" : project.status === "paused" ? "warning" : "neutral";
  const org = lang === "es" ? project.orgES || project.org : project.org;
  const title = lang === "es" ? project.titleES || project.title : project.title;
  const liveHref = project.links.live;
  const logo = isDark ? project.logoDark || project.logo : project.logo;
  const showPreview = Boolean(project.preview && liveHref);

  return (
    <TiltCard
      max={4}
      className="glass-panel group relative flex flex-col md:flex-row md:items-stretch gap-5 md:gap-6 rounded-2xl p-5 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-1 md:min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <ProjectBadge label={displayType} tone="neutral" isDark={isDark} />
          <ProjectBadge label={displayStatus} tone={badgeTone as "accent" | "neutral" | "warning"} isDark={isDark} />
          {project.codePrivate && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.12)",
                color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.65)",
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
              }}
            >
              <Lock size={11} aria-hidden />
              {copy.cards.privateCode}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onOpen}
          data-cursor="pointer"
          className="flex flex-col gap-1.5 text-left"
          aria-label={copy.cards.viewDetails.replace("{project}", title)}
        >
          {org && (
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)" }}
            >
              {org}
            </span>
          )}
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={title} className="h-6 md:h-7 w-auto self-start" />
          ) : (
            <span className="text-xl md:text-2xl font-semibold leading-snug" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
              {title}
            </span>
          )}
          <p className="text-sm md:text-base leading-relaxed" style={{ color: isDark ? "rgba(226,232,240,0.78)" : "rgba(15,23,42,0.72)" }}>
            {lang === "es" ? project.subtitleES || project.subtitle : project.subtitle}
          </p>
        </button>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((stackItem) => (
            <span
              key={stackItem}
              className="text-[11px] font-semibold rounded-full px-2.5 py-1"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.12)",
                color: isDark ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.8)",
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
              }}
            >
              {stackItem}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 text-sm font-semibold">
          {liveHref ? (
            <a
              href={liveHref}
              target="_blank"
              rel="noreferrer"
              data-cursor="pointer"
              aria-label={`${copy.cards.tryIt} — ${title} (${copy.cards.newTab})`}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition-transform duration-150 hover:scale-[1.04]"
              style={{
                background: isDark ? "#f8fafc" : "#0f172a",
                color: isDark ? "#0f172a" : "#f8fafc",
              }}
            >
              {copy.cards.tryIt}
              <ArrowUpRight size={15} aria-hidden />
            </a>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.16)",
                color: isDark ? "rgba(226,232,240,0.6)" : "rgba(15,23,42,0.55)",
              }}
            >
              {copy.cards.liveDemo} {copy.cards.soon}
            </span>
          )}
        </div>
      </div>

      {showPreview && (
        // Nudged up-and-out with a stronger shadow so it reads as a separate
        // glass sheet floating above the card rather than a box inside a box.
        <div className="md:w-[44%] md:shrink-0 md:self-center md:-translate-y-3 md:translate-x-1 transition-transform duration-300 group-hover:md:-translate-y-4">
          <div className="float-layer rounded-xl">
            <ProjectPreview
              src={project.preview as string}
              href={liveHref as string}
              label={copy.cards.visit}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </TiltCard>
  );
}
