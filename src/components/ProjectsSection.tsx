"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import { projectsData, type Project } from "@/data/projectsData";
import { translations } from "@/i18n/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function Badge({ label, tone = "neutral", isDark }: { label: string; tone?: "neutral" | "accent" | "warning"; isDark: boolean }) {
  const palette: Record<"neutral" | "accent" | "warning", { bg: string; color: string; border: string }> = isDark
    ? {
        neutral: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.9)", border: "rgba(255,255,255,0.14)" },
        accent: { bg: "rgba(126,226,255,0.12)", color: "rgba(126,226,255,0.95)", border: "rgba(126,226,255,0.3)" },
        warning: { bg: "rgba(255,199,122,0.16)", color: "rgba(255,199,122,0.95)", border: "rgba(255,199,122,0.32)" },
      }
    : {
        neutral: { bg: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.9)", border: "rgba(15,23,42,0.14)" },
        accent: { bg: "rgba(6,95,186,0.08)", color: "rgba(6,95,186,0.9)", border: "rgba(6,95,186,0.2)" },
        warning: { bg: "rgba(217,119,6,0.08)", color: "rgba(217,119,6,0.9)", border: "rgba(217,119,6,0.2)" },
      };
  const style = palette[tone];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
    >
      {label}
    </span>
  );
}

type ModalProps = {
  project: Project;
  onClose: () => void;
  isDark: boolean;
  displayType: string;
  displayStatus: string;
  copy: typeof translations["en"]["projects"];
  lang: "en" | "es";
};

function ProjectModal({ project, onClose, isDark, displayType, displayStatus, copy, lang }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
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
      onClick={href ? undefined : (e) => e.preventDefault()}
    >
      <span>{href ? label : disabledText || label}</span>
    </a>
  );

  const badgeTone = project.status === "live" ? "accent" : project.status === "paused" ? "warning" : "neutral";

  return (
    <div
      className="fixed inset-0 z-[21000] flex items-center justify-center px-4 md:px-6"
      style={{ background: "rgba(5,8,15,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{
          background: isDark ? "rgba(14,18,33,0.82)" : "rgba(255,255,255,0.9)",
          border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(15,23,42,0.12)",
          boxShadow: isDark ? "0 24px 70px rgba(0,0,0,0.45)" : "0 24px 70px rgba(15,23,42,0.18)",
          cursor: "none",
        }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <div className="flex flex-col gap-4 p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge label={displayType} tone="neutral" isDark={isDark} />
                <Badge label={displayStatus} tone={badgeTone as "accent" | "neutral" | "warning"} isDark={isDark} />
                {project.role && <Badge label={project.role} tone="neutral" isDark={isDark} />}
              </div>
              <div className="text-2xl md:text-3xl font-semibold leading-tight" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                {lang === "es" ? (project.titleES || project.title) : project.title}
              </div>
              <p className="text-sm md:text-base" style={{ color: isDark ? "rgba(226,232,240,0.82)" : "rgba(15,23,42,0.75)" }}>
                {lang === "es" ? (project.descriptionES || project.description) : project.description}
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
                {(lang === "es" ? (project.highlightsES || project.highlights) : project.highlights).map((item) => (
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
                {(lang === "es" ? (project.architectureES || project.architecture) : project.architecture).map((item) => (
                  <li key={item} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {divider}

          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="text-xs font-semibold rounded-full px-3 py-1"
                style={{
                  border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.14)",
                  color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.82)",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
                }}
              >
                {s}
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

function ProjectCard({ project, onOpen, isDark, displayType, displayStatus, copy, lang }: { project: Project; onOpen: () => void; isDark: boolean; displayType: string; displayStatus: string; copy: typeof translations["en"]["projects"]; lang: "en" | "es" }) {
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
          <Badge label={displayType} tone="neutral" isDark={isDark} />
          <Badge label={displayStatus} tone={badgeTone as "accent" | "neutral" | "warning"} isDark={isDark} />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-base md:text-lg font-semibold leading-snug" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {lang === "es" ? (project.titleES || project.title) : project.title}
          </div>
          <p className="text-xs md:text-sm leading-relaxed" style={{ color: isDark ? "rgba(226,232,240,0.78)" : "rgba(15,23,42,0.72)" }}>
            {lang === "es" ? (project.subtitleES || project.subtitle) : project.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((s) => (
            <span
              key={s}
              className="text-[11px] font-semibold rounded-full px-2.5 py-1"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.12)",
                color: isDark ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.8)",
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <a
              href={project.links.github || "#"}
              target={project.links.github ? "_blank" : undefined}
              rel={project.links.github ? "noreferrer" : undefined}
              data-cursor={project.links.github ? "pointer" : undefined}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(120,120,120,0.4)",
                background: isDark ? "rgba(100,100,100,0.3)" : "rgba(140,140,140,0.5)",
                opacity: project.links.github ? 1 : 0.4,
                cursor: project.links.github ? "pointer" : "default",
              }}
              onMouseEnter={(e) => {
                if (project.links.github) {
                  e.currentTarget.style.background = isDark ? "rgba(100,100,100,0.5)" : "rgba(140,140,140,0.7)";
                  e.currentTarget.style.transform = "scale(1.15)";
                  e.currentTarget.style.boxShadow = isDark ? "0 8px 16px rgba(0,0,0,0.3)" : "0 8px 16px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (project.links.github) {
                  e.currentTarget.style.background = isDark ? "rgba(100,100,100,0.3)" : "rgba(140,140,140,0.5)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
              aria-label={project.links.github ? "View on GitHub" : "GitHub link not available"}
              onClick={project.links.github ? undefined : (e) => e.preventDefault()}
            >
              <img src="/logos/github.svg" alt="GitHub" className="w-5 h-5" style={{ filter: "grayscale(100%) brightness(0.2) invert(1)" }} />
            </a>
            <a
              href={project.links.caseStudy || "#"}
              target={project.links.caseStudy ? "_blank" : undefined}
              rel={project.links.caseStudy ? "noreferrer" : undefined}
              data-cursor={project.links.caseStudy ? "pointer" : undefined}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(120,120,120,0.4)",
                background: isDark ? "rgba(100,100,100,0.3)" : "rgba(140,140,140,0.5)",
                opacity: project.links.caseStudy ? 1 : 0.4,
                cursor: project.links.caseStudy ? "pointer" : "default",
              }}
              onMouseEnter={(e) => {
                if (project.links.caseStudy) {
                  e.currentTarget.style.background = isDark ? "rgba(100,100,100,0.5)" : "rgba(140,140,140,0.7)";
                  e.currentTarget.style.transform = "scale(1.15)";
                  e.currentTarget.style.boxShadow = isDark ? "0 8px 16px rgba(0,0,0,0.3)" : "0 8px 16px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (project.links.caseStudy) {
                  e.currentTarget.style.background = isDark ? "rgba(100,100,100,0.3)" : "rgba(140,140,140,0.5)";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
              aria-label={project.links.caseStudy ? "Read case study" : "Case study coming soon"}
              onClick={project.links.caseStudy ? undefined : (e) => e.preventDefault()}
            >
              <img src="/logos/medium.svg" alt="Case Study" className="w-5 h-5" style={{ filter: "grayscale(100%) brightness(0.2) invert(1)" }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { theme } = useTheme();
  const { lang } = useI18n();
  const revealRef = useScrollReveal<HTMLElement>();
  const dict = translations[lang];
  const copy = dict.projects;
  const typeMap = dict.types;
  const statusMap = dict.statuses;
  const isDark = theme === "dark";
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = useMemo(() => projectsData.find((p) => p.id === openId) || null, [openId]);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const baseWidthRef = useRef<number>(0);
  const cardWidthRef = useRef<number>(0);
  const loopProjects = useMemo(() => [...projectsData, ...projectsData, ...projectsData], []);
  const [cardScales, setCardScales] = useState<number[]>([]);

  // measure and center to middle segment
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const measure = () => {
      const firstCard = slider.querySelector<HTMLElement>("[data-project-card]");
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
      cardWidthRef.current = cardWidth || cardWidthRef.current || 0;
      baseWidthRef.current = slider.scrollWidth / 3;
      // Set initial position to middle segment without smooth scroll
      slider.style.scrollBehavior = 'auto';
      slider.scrollLeft = baseWidthRef.current;
      slider.style.scrollBehavior = '';
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slider);
    return () => observer.disconnect();
  }, []);

  // loop correction and scale update
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    let rafId: number | null = null;
    let isJumping = false;
    let jumpTimeout: NodeJS.Timeout | null = null;
    let lastKnownScales: number[] = [];
    
    const updateCardScales = (forceFreeze = false) => {
      // Don't update scales if we're jumping or forced freeze
      if (isJumping || forceFreeze) return;
      
      const cards = slider.querySelectorAll<HTMLElement>("[data-project-card]");
      if (!cards.length) return;
      
      const sliderRect = slider.getBoundingClientRect();
      const centerX = sliderRect.left + sliderRect.width / 2;
      
      const newScales: number[] = [];
      
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = Math.abs(cardCenterX - centerX);
        
        // Smooth progressive scaling
        const maxDistance = sliderRect.width * 0.85;
        const ratio = Math.min(distanceFromCenter / maxDistance, 1);
        
        // Ease-out quadratic
        const eased = 1 - (ratio * ratio);
        const scale = 0.65 + (eased * 0.35);
        
        newScales.push(Math.max(Math.min(scale, 1), 0.65));
      });
      
      // Store the scales before updating
      lastKnownScales = [...newScales];
      setCardScales(newScales);
    };
    
    const performJump = (newPosition: number) => {
      isJumping = true;
      
      // Clear any pending jump timeout
      if (jumpTimeout) clearTimeout(jumpTimeout);
      
      // Perform the jump instantly
      slider.scrollLeft = newPosition;
      
      // Keep scales frozen for longer to ensure smooth transition
      jumpTimeout = setTimeout(() => {
        isJumping = false;
        jumpTimeout = null;
        // Force an update after unfreezing
        requestAnimationFrame(() => {
          updateCardScales();
        });
      }, 150);
    };
    
    const handleScroll = () => {
      // Prevent overlapping RAF calls
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const base = baseWidthRef.current;
        if (!base) {
          rafId = null;
          return;
        }
        
        const left = slider.scrollLeft;
        
        // Define safe zones - we only jump when crossing these boundaries
        const startBoundary = base * 0.15; // 15% into first section
        const endBoundary = base * 1.85;   // 85% into third section
        
        if (!isJumping) {
          if (left < startBoundary) {
            // Jumped too far left - reposition to middle section
            const offset = left % base;
            performJump(base + offset);
          } else if (left > endBoundary) {
            // Jumped too far right - reposition to middle section
            const offset = (left - base * 2) % base;
            performJump(base + offset);
          } else {
            // Normal scroll - safe to update scales
            updateCardScales();
          }
        }
        
        rafId = null;
      });
    };
    
    // Initial setup with proper delay
    const initTimer = setTimeout(() => {
      updateCardScales();
    }, 300);
    
    // Listen to scroll events
    slider.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      clearTimeout(initTimer);
      if (jumpTimeout) clearTimeout(jumpTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      slider.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="projects"
      ref={revealRef}
      className="reveal relative w-full px-4 md:px-6 lg:px-8 py-12 md:py-16"
      style={{ cursor: "none" }}
    >
      <div className="absolute inset-0 pointer-events-none" />
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2
            className="text-2xl md:text-3xl font-semibold"
            data-parallax="title"
            data-speed="0.26"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            {copy.title}
          </h2>
          <p className="text-sm md:text-base" style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.7)" }}>
            {copy.subcopy}
          </p>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar px-1 py-1 cursor-default"
            style={{ scrollBehavior: "auto" }}
          >
              {loopProjects.map((project, idx) => {
                const scale = cardScales[idx] !== undefined ? cardScales[idx] : 0.9;
                
                return (
                  <div
                    key={`${project.id}-${idx}`}
                    className="flex-shrink-0 w-[240px] md:w-[280px]"
                    data-project-card
                    style={{
                      transform: `scale(${scale})`,
                      transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                      willChange: "transform",
                    }}
                  >
                    <ProjectCard
                      project={project}
                      displayType={typeMap[project.type]}
                      displayStatus={statusMap[project.status]}
                      copy={copy}
                      onOpen={() => setOpenId(project.id)}
                      isDark={isDark}
                      lang={lang}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      {selected && (
        <ProjectModal
          project={selected}
          displayType={typeMap[selected.type]}
          displayStatus={statusMap[selected.status]}
          copy={copy}
          onClose={() => setOpenId(null)}
          isDark={isDark}
          lang={lang}
        />
      )}
    </section>
  );
}
