"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Locale, TranslationCopy } from "@/domain/i18n";
import type { Project } from "@/domain/projects";
import ProjectBadge from "./ProjectBadge";

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
  isDark: boolean;
  isCompact: boolean;
  displayType: string;
  displayStatus: string;
  copy: TranslationCopy["projects"];
  lang: Locale;
};

export default function ProjectModal({
  project,
  onClose,
  isDark,
  isCompact,
  displayType,
  displayStatus,
  copy,
  lang,
}: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  const divider = (
    <div className="h-px w-full" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }} />
  );

  const chipStyle = {
    border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(15,23,42,0.14)",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
    color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.82)",
  };

  const disabledStyle = {
    color: isDark ? "rgba(226,232,240,0.45)" : "rgba(15,23,42,0.45)",
    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.1)",
    background: "transparent",
    cursor: "not-allowed",
  };

  const linkRow = (label: string, href?: string, disabledText?: string) => (
    <a
      href={href || "#"}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
      data-cursor={href ? "pointer" : undefined}
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
      style={href ? chipStyle : disabledStyle}
      aria-disabled={!href}
      tabIndex={href ? 0 : -1}
      onClick={href ? undefined : (event) => event.preventDefault()}
    >
      <span>{href ? label : disabledText || label}</span>
    </a>
  );

  const badgeTone = project.status === "live" ? "accent" : project.status === "paused" ? "warning" : "neutral";

  return (
    <div
      className={`fixed inset-0 z-[21000] flex ${isCompact ? "items-end" : "items-center"} justify-center px-3 sm:px-4 md:px-6`}
      style={{ background: "rgba(5,8,15,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${isCompact ? "max-w-xl max-h-[88vh] rounded-t-3xl" : "max-w-4xl rounded-2xl"} overflow-hidden`}
        style={{
          background: isDark ? "rgba(14,18,33,0.9)" : "rgba(255,255,255,0.94)",
          border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(15,23,42,0.12)",
          boxShadow: isDark ? "0 24px 70px rgba(0,0,0,0.45)" : "0 24px 70px rgba(15,23,42,0.18)",
          cursor: "none",
        }}
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
      >
        <div className="flex flex-col gap-4 p-4 sm:p-5 md:p-6 h-full overflow-y-auto">
          <div
            className="flex items-start justify-between gap-3 sticky top-0 pb-2"
            style={{ background: isDark ? "rgba(14,18,33,0.94)" : "rgba(255,255,255,0.96)" }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <ProjectBadge label={displayType} tone="neutral" isDark={isDark} />
                <ProjectBadge label={displayStatus} tone={badgeTone as "accent" | "neutral" | "warning"} isDark={isDark} />
                {project.role && <ProjectBadge label={project.role} tone="neutral" isDark={isDark} />}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                {lang === "es" ? project.titleES || project.title : project.title}
              </div>
              <p className="text-sm md:text-base" style={{ color: isDark ? "rgba(226,232,240,0.82)" : "rgba(15,23,42,0.75)" }}>
                {lang === "es" ? project.descriptionES || project.description : project.description}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              data-cursor="pointer"
              className="h-10 w-10 aspect-square p-0 leading-none rounded-full flex items-center justify-center shrink-0 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 cursor-pointer"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.15)",
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
                color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.82)",
              }}
            >
              ✕
            </button>
          </div>

          {divider}

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
                {copy.modal.whatBuilt}
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: isDark ? "rgba(226,232,240,0.86)" : "rgba(15,23,42,0.8)" }}>
                {(lang === "es" ? project.highlightsES || project.highlights : project.highlights).map((item) => (
                  <li key={item} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
                {copy.modal.architecture}
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: isDark ? "rgba(226,232,240,0.86)" : "rgba(15,23,42,0.8)" }}>
                {(lang === "es" ? project.architectureES || project.architecture : project.architecture).map((item) => (
                  <li key={item} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {divider}

          <div className="flex flex-wrap gap-2">
            {project.stack.map((stackItem) => (
              <span
                key={stackItem}
                className="text-xs font-semibold rounded-full px-3 py-1"
                style={{
                  border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.14)",
                  color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.82)",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
                }}
              >
                {stackItem}
              </span>
            ))}
          </div>

          {divider}

          <div className="flex flex-wrap gap-3">
            {linkRow(copy.cards.github, project.links.github, copy.modal.githubSoon)}
            {linkRow(copy.cards.caseStudy, project.links.caseStudy, copy.modal.caseSoon)}
            {linkRow(copy.cards.demoVideo, project.links.video, copy.modal.videoSoon)}
            {linkRow(copy.cards.liveDemo, project.links.live, copy.modal.liveOffline)}
            <Link
              href={`/projects/${project.slug}`}
              data-cursor="pointer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors cursor-pointer"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(15,23,42,0.2)",
                color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
              }}
            >
              <span>{copy.modal.openPage}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
