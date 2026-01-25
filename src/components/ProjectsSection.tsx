"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import { projectsData, type Project } from "@/data/projectsData";

type ModalProps = {
  project: Project;
  onClose: () => void;
  isDark: boolean;
  displayType: string;
  displayStatus: string;
};

function Badge({
  label,
  tone = "neutral",
  isDark,
}: {
  label: string;
  tone?: "neutral" | "accent" | "warning";
  isDark: boolean;
}) {
  const palette: Record<"neutral" | "accent" | "warning", { bg: string; color: string; border: string }> = isDark
    ? {
        neutral: {
          bg: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.9)",
          border: "rgba(255,255,255,0.14)",
        },
        accent: {
          bg: "rgba(126, 226, 255, 0.12)",
          color: "rgba(126, 226, 255, 0.95)",
          border: "rgba(126, 226, 255, 0.3)",
        },
        warning: {
          bg: "rgba(255, 199, 122, 0.16)",
          color: "rgba(255, 199, 122, 0.95)",
          border: "rgba(255, 199, 122, 0.32)",
        },
      }
    : {
        neutral: {
          bg: "rgba(15,23,42,0.06)",
          color: "rgba(15,23,42,0.75)",
          border: "rgba(15,23,42,0.14)",
        },
        accent: {
          bg: "rgba(6, 182, 212, 0.14)",
          color: "rgba(6, 182, 212, 0.9)",
          border: "rgba(6, 182, 212, 0.32)",
        },
        warning: {
          bg: "rgba(245, 158, 11, 0.16)",
          color: "rgba(245, 158, 11, 0.95)",
          border: "rgba(245, 158, 11, 0.32)",
        },
      };

  const style = palette[tone];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {label}
    </span>
  );
}

function ProjectModal({ project, onClose, isDark, displayType, displayStatus }: ModalProps) {
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
    <div
      className="h-px w-full"
      style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }}
    />
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
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
      style={href ? chipStyle : disabledStyle}
      aria-disabled={!href}
      tabIndex={href ? 0 : -1}
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
                {project.title}
              </div>
              <p className="text-sm md:text-base" style={{ color: isDark ? "rgba(226,232,240,0.82)" : "rgba(15,23,42,0.75)" }}>
                {project.description}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="h-10 w-10 aspect-square p-0 leading-none rounded-full flex items-center justify-center shrink-0 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.15)",
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
                color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.82)",
                cursor: "none",
              }}
            >
              ✕
            </button>
          </div>

          {divider}

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
                What I built
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: isDark ? "rgba(226,232,240,0.86)" : "rgba(15,23,42,0.8)" }}>
                {project.highlights.map((item) => (
                  <li key={item} className="leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
                Architecture
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: isDark ? "rgba(226,232,240,0.86)" : "rgba(15,23,42,0.8)" }}>
                {project.architecture.map((item) => (
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
            {linkRow("GitHub", project.links.github, "GitHub (soon)")}
            {linkRow("Case Study", project.links.caseStudy, "Case Study (soon)")}
            {linkRow("Demo Video", project.links.video, "Demo Video (soon)")}
            {linkRow("Live Demo", project.links.live, "Offline (infra paused)")}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
  isDark,
  displayType,
  displayStatus,
}: {
  project: Project;
  onOpen: () => void;
  isDark: boolean;
  displayType: string;
  displayStatus: string;
}) {
  const badgeTone = project.status === "live" ? "accent" : project.status === "paused" ? "warning" : "neutral";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex flex-col gap-3 rounded-2xl overflow-hidden transition-all duration-200 text-left h-[360px] md:h-[380px] lg:h-[400px]"
      style={{
        border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(15,23,42,0.12)",
        background: isDark ? "rgba(14,18,33,0.72)" : "rgba(255,255,255,0.78)",
        boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.26)" : "0 12px 32px rgba(15,23,42,0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "none",
      }}
    >
      <div
        className="w-full h-[180px] md:h-[200px] lg:h-[220px] overflow-hidden relative"
        style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.04)" }}
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
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge label={displayType} tone="neutral" isDark={isDark} />
          <Badge label={displayStatus} tone={badgeTone as "accent" | "neutral" | "warning"} isDark={isDark} />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {project.title}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(226,232,240,0.78)" : "rgba(15,23,42,0.72)" }}>
            {project.subtitle}
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
          {["Case Study", "Demo Video", "GitHub"].map((cta) => {
            const href =
              cta === "Case Study"
                ? project.links.caseStudy
                : cta === "Demo Video"
                ? project.links.video
                : project.links.github;
            const enabled = Boolean(href);
            return (
              <span
                key={cta}
                className="rounded-full px-3 py-2 transition-colors"
                style={{
                  border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.12)",
                  color: enabled
                    ? isDark
                      ? "rgba(248,250,252,0.95)"
                      : "rgba(15,23,42,0.9)"
                    : isDark
                    ? "rgba(226,232,240,0.55)"
                    : "rgba(15,23,42,0.55)",
                  background: enabled ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)") : "transparent",
                }}
              >
                {enabled ? cta : `${cta} - soon`}
              </span>
            );
          })}
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-200 pointer-events-none"
        style={{ boxShadow: "0 18px 40px rgba(0,0,0,0.22)", opacity: 0, background: "rgba(255,255,255,0.02)" }}
      />
    </button>
  );
}

export default function ProjectsSection() {
  const { theme } = useTheme();
  const { lang } = useI18n();
  const isDark = theme === "dark";
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = useMemo(() => projectsData.find((p) => p.id === openId) || null, [openId]);
  const typeLabel: Record<string, string> = {
    personal: "Personal",
    enterprise: "Enterprise",
    hackathon: "Hackathon",
    startup: "Startup",
  };
  const statusLabel: Record<string, string> = {
    "in-progress": "In progress",
    prototype: "Prototype",
    paused: "Paused",
    live: "Live",
  };

  // Carousel helpers: infinite loop + edge scaling
  const loops = 3; // render 3 copies to enable seamless looping
  const displayedIndices = useMemo(
    () => Array.from({ length: loops * projectsData.length }, (_, i) => i % projectsData.length),
    [],
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const groupWidthRef = useRef(0);
  const tickingRef = useRef(false);
  const scalesRef = useRef<number[]>([]);
  const wrapCooldownRef = useRef(0);

  // Measure group width and initialize scroll position at middle copy
  useEffect(() => {
    const measure = () => {
      if (!scrollRef.current) return;
      const total = scrollRef.current.scrollWidth;
      groupWidthRef.current = total / loops;
      // Start at middle group for bidirectional infinite scroll
      scrollRef.current.scrollLeft = groupWidthRef.current;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (scrollRef.current) ro.observe(scrollRef.current);
    return () => ro.disconnect();
  }, [lang]);

  // Update active scaling and handle infinite wrap on scroll
  useEffect(() => {
    const update = () => {
      const scroller = scrollRef.current;
      if (!scroller) {
        tickingRef.current = false;
        return;
      }
      const left = scroller.scrollLeft;
      const gw = groupWidthRef.current || 1;
      
      // Wrap seamlessly with cooldown to prevent multiple wraps per scroll
      const now = performance.now();
      if (wrapCooldownRef.current < now) {
        if (left < gw * 0.25) {
          // Hit left boundary: wrap to right copy
          scroller.scrollLeft = left + gw;
          wrapCooldownRef.current = now + 50; // 50ms cooldown
        } else if (left > gw * 2.75) {
          // Hit right boundary: wrap to left copy
          scroller.scrollLeft = left - gw;
          wrapCooldownRef.current = now + 50; // 50ms cooldown
        }
      }

      // Edge scaling using offset math + lerp for smoother animation
      const containerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
      const halfWidth = scroller.clientWidth / 2;
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const itemCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(itemCenter - containerCenter) / halfWidth; // 0 center, ~1 edge
        const t = Math.max(0, 1 - dist);
        const targetScale = 0.8 + 0.2 * t; // 0.8 at edges -> 1.0 at center
        const prev = scalesRef.current[i] ?? targetScale;
        const next = prev + (targetScale - prev) * 0.25; // lerp factor
        el.style.transform = `scale(${next})`;
        scalesRef.current[i] = next;
      });
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    const scroller = scrollRef.current;
    if (!scroller) return;
    scroller.addEventListener("scroll", onScroll, { passive: true });
    // Initial apply
    scalesRef.current = [];
    wrapCooldownRef.current = 0;
    update();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [lang]);

  return (
    <section
      id="projects"
      className="relative w-full px-4 md:px-6 lg:px-8 py-12 md:py-16"
      style={{ cursor: "none" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            Projects
          </h2>
          <p className="text-sm md:text-base" style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.7)" }}>
            Selected work across personal builds, startups, and enterprise problems.
          </p>
        </div>

        {/* Horizontal carousel with snap and infinite loop (no fade masks) */}
        <div className="relative">
          <div ref={scrollRef} className="overflow-x-auto -mx-1 px-1 hide-scrollbar">
            <div className="flex flex-row flex-nowrap gap-5 md:gap-6 snap-x snap-mandatory">
              {displayedIndices.map((idx, i) => {
                const project = projectsData[idx];
                const displayType = typeLabel[project.type] || project.type;
                const displayStatus = statusLabel[project.status] || project.status;
                const cloneIndex = Math.floor(i / projectsData.length);
                return (
                  <div
                    key={`${project.id}-${cloneIndex}-${i}`}
                    ref={(el) => (itemsRef.current[i] = el)}
                    className="snap-start shrink-0 basis-[88%] sm:basis-[75%] md:basis-[50%] lg:basis-1/3"
                    style={{ willChange: "transform" }}
                  >
                    <ProjectCard
                      project={project}
                      displayType={displayType}
                      displayStatus={displayStatus}
                      onOpen={() => setOpenId(project.id)}
                      isDark={isDark}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <ProjectModal
          project={selected}
          displayType={typeLabel[selected.type] || selected.type}
          displayStatus={statusLabel[selected.status] || selected.status}
          onClose={() => setOpenId(null)}
          isDark={isDark}
        />
      )}
    </section>
  );
}
