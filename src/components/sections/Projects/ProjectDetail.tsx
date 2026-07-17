"use client";

import Link from "next/link";
import SectionShell from "@/components/layout/SectionShell";
import type { Locale, TranslationCopy } from "@/domain/i18n";
import type { Project } from "@/domain/projects";
import BackToProjects from "./BackToProjects";
import ProjectBadge from "./ProjectBadge";
import SkipToDemo from "./story/SkipToDemo";
import { projectScrollytelling } from "./stories";

type ProjectDetailProps = {
  project: Project;
  lang: Locale;
  copy: TranslationCopy["projects"];
  typeLabel: string;
  statusLabel: string;
  isDark: boolean;
};

export default function ProjectDetail({ project, lang, copy, typeLabel, statusLabel, isDark }: ProjectDetailProps) {
  const highlights = lang === "es" ? project.highlightsES || project.highlights : project.highlights;
  const architecture = lang === "es" ? project.architectureES || project.architecture : project.architecture;
  const description = lang === "es" ? project.descriptionES || project.description : project.description;
  const title = lang === "es" ? project.titleES || project.title : project.title;
  const subtitle = lang === "es" ? project.subtitleES || project.subtitle : project.subtitle;
  const badgeTone = project.status === "live" || project.status === "published" ? "accent" : project.status === "paused" ? "warning" : "neutral";
  // Projects with a story tell it instead of listing bullets; the rest keep
  // the generic highlights/architecture layout.
  const Story = projectScrollytelling[project.id];

  const chipStyle = {
    border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.14)",
    color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.82)",
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
  };

  const linkChipStyle = {
    border: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(15,23,42,0.2)",
    color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
  };

  return (
    <SectionShell id={project.slug} className="relative w-full py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <BackToProjects slug={project.slug} label={copy.cards.back} isDark={isDark} />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <ProjectBadge label={typeLabel} tone="neutral" isDark={isDark} />
            <ProjectBadge label={statusLabel} tone={badgeTone as "accent" | "neutral" | "warning"} isDark={isDark} />
            {project.role && <ProjectBadge label={project.role} tone="neutral" isDark={isDark} />}
          </div>
          <div className="text-2xl md:text-3xl font-semibold leading-tight" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {title}
          </div>
          <p className="text-sm md:text-base" style={{ color: isDark ? "rgba(226,232,240,0.82)" : "rgba(15,23,42,0.78)" }}>
            {subtitle}
          </p>
          {Story && <SkipToDemo target="try-it" label={copy.cards.skipToDemo} isDark={isDark} />}
        </div>

        {Story ? (
          <Story isDark={isDark} lang={lang} />
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
                {copy.detail.overview}
              </h3>
              <p style={{ color: isDark ? "rgba(226,232,240,0.86)" : "rgba(15,23,42,0.82)" }}>{description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
                  {copy.detail.highlights}
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: isDark ? "rgba(226,232,240,0.86)" : "rgba(15,23,42,0.8)" }}>
                  {highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
                  {copy.detail.architecture}
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: isDark ? "rgba(226,232,240,0.86)" : "rgba(15,23,42,0.8)" }}>
                  {architecture.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
            {copy.detail.stack}
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((stackItem) => (
              <span key={stackItem} className="text-xs font-semibold rounded-full px-3 py-1" style={chipStyle}>
                {stackItem}
              </span>
            ))}
          </div>
        </div>

        {!Story && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
            {copy.detail.media}
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div
              className="rounded-xl border border-dashed p-4 text-sm text-center"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.2)",
                color: isDark ? "rgba(226,232,240,0.72)" : "rgba(15,23,42,0.72)",
              }}
            >
              {copy.detail.videoPlaceholder}
            </div>
            <div
              className="rounded-xl border border-dashed p-4 text-sm text-center"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.2)",
                color: isDark ? "rgba(226,232,240,0.72)" : "rgba(15,23,42,0.72)",
              }}
            >
              {copy.detail.imagePlaceholder}
            </div>
          </div>
        </div>
        )}

        <div className="flex flex-wrap gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
              style={linkChipStyle}
              data-cursor="pointer"
            >
              {copy.cards.github}
            </a>
          )}
          {project.links.caseStudy && (
            <a
              href={project.links.caseStudy}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
              style={linkChipStyle}
              data-cursor="pointer"
            >
              {copy.cards.caseStudy}
            </a>
          )}
          {project.links.video && (
            <a
              href={project.links.video}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
              style={linkChipStyle}
              data-cursor="pointer"
            >
              {copy.cards.demoVideo}
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
              style={linkChipStyle}
              data-cursor="pointer"
            >
              {copy.cards.liveDemo}
            </a>
          )}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
            style={linkChipStyle}
            data-cursor="pointer"
          >
            {copy.detail.nextProject}
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
