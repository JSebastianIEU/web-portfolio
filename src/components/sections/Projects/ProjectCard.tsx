"use client";

import Image from "next/image";
import type { Locale, TranslationCopy } from "@/domain/i18n";
import type { Project } from "@/domain/projects";
import ProjectBadge from "./ProjectBadge";

type ProjectCardProps = {
  project: Project;
  onOpen: () => void;
  isDark: boolean;
  displayType: string;
  displayStatus: string;
  copy: TranslationCopy["projects"];
  lang: Locale;
};

export default function ProjectCard({ project, onOpen, isDark, displayType, displayStatus, copy, lang }: ProjectCardProps) {
  const badgeTone = project.status === "live" ? "accent" : project.status === "paused" ? "warning" : "neutral";

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-2xl overflow-hidden transition-all duration-200 h-full cursor-default"
      style={{
        border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(15,23,42,0.12)",
        background: isDark ? "rgba(14,18,33,0.72)" : "rgba(255,255,255,0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        data-cursor="pointer"
        className="aspect-[16/9] w-full overflow-hidden relative cursor-pointer"
        style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.04)" }}
        aria-label={`View details for ${project.titleES || project.title}`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: project.thumbnail
              ? `url(${project.thumbnail})`
              : "linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.12))",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: project.thumbnail ? "grayscale(12%)" : "none",
            opacity: 0.95,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.45) 100%)",
          }}
        />
      </button>

      <div className="px-3 pb-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <ProjectBadge label={displayType} tone="neutral" isDark={isDark} />
          <ProjectBadge label={displayStatus} tone={badgeTone as "accent" | "neutral" | "warning"} isDark={isDark} />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-base md:text-lg font-semibold leading-snug" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {lang === "es" ? project.titleES || project.title : project.title}
          </div>
          <p className="text-xs md:text-sm leading-relaxed" style={{ color: isDark ? "rgba(226,232,240,0.78)" : "rgba(15,23,42,0.72)" }}>
            {lang === "es" ? project.subtitleES || project.subtitle : project.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((stackItem) => (
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

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            {[
              { href: project.links.github, label: copy.cards.github },
              { href: project.links.caseStudy, label: copy.cards.caseStudy },
            ].map((link) => {
              const hasLink = Boolean(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href || "#"}
                  target={hasLink ? "_blank" : undefined}
                  rel={hasLink ? "noreferrer" : undefined}
                  data-cursor={hasLink ? "pointer" : undefined}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(120,120,120,0.4)",
                    background: isDark ? "rgba(100,100,100,0.3)" : "rgba(140,140,140,0.5)",
                    opacity: hasLink ? 1 : 0.4,
                    cursor: hasLink ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (!hasLink) return;
                    e.currentTarget.style.background = isDark ? "rgba(100,100,100,0.5)" : "rgba(140,140,140,0.7)";
                    e.currentTarget.style.transform = "scale(1.15)";
                    e.currentTarget.style.boxShadow = isDark ? "0 8px 16px rgba(0,0,0,0.3)" : "0 8px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    if (!hasLink) return;
                    e.currentTarget.style.background = isDark ? "rgba(100,100,100,0.3)" : "rgba(140,140,140,0.5)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label={hasLink ? link.label : `${link.label} not available`}
                  onClick={hasLink ? undefined : (e) => e.preventDefault()}
                >
                  <Image
                    src={link.label === copy.cards.github ? "/logos/github.svg" : "/logos/medium.svg"}
                    alt={link.label}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                    style={{ filter: "grayscale(100%) brightness(0.2) invert(1)" }}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
