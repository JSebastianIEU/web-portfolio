"use client";

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Trigger entry animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
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

    // Lock body scroll without altering scroll position (prevents jump in mobile/tablet)
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscrollY = document.documentElement.style.overscrollBehaviorY;
    const originalHtmlOverscrollX = document.documentElement.style.overscrollBehaviorX;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehaviorY = "contain";
    document.documentElement.style.overscrollBehaviorX = "contain";

    window.addEventListener("keydown", handleKey);
    return () => {
      // Restore body/html scroll settings
      document.body.style.overflow = originalBodyOverflow || "";
      document.documentElement.style.overflow = originalHtmlOverflow || "";
      document.documentElement.style.overscrollBehaviorY = originalHtmlOverscrollY || "";
      document.documentElement.style.overscrollBehaviorX = originalHtmlOverscrollX || "";
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  // Swipe down to close gesture (mobile/tablet only)
  useEffect(() => {
    if (!isCompact) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    let initialScrollTop = 0;
    let canPreventDefault = false;

    const handleTouchStart = (e: TouchEvent) => {
      const scrollContainer = dialog.querySelector('[data-scroll-container]') as HTMLElement;
      if (!scrollContainer) return;
      
      initialScrollTop = scrollContainer.scrollTop;
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = false;
      canPreventDefault = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrollContainer = dialog.querySelector('[data-scroll-container]') as HTMLElement;
      if (!scrollContainer) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      
      // Check if at top and swiping down
      const isAtTop = scrollTop <= 5;
      const isSwipingDown = deltaY > 0;
      
      // Check if at bottom and trying to scroll further down
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      const isTryingToScrollPastBottom = isAtBottom && scrollTop <= initialScrollTop && isSwipingDown;
      
      // Enable dragging if at top OR at bottom trying to scroll past
      if ((isAtTop && isSwipingDown) || isTryingToScrollPastBottom) {
        if (deltaY > 0) {
          isDragging.current = true;
          setDragY(deltaY);
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      
      // Close if dragged more than 100px
      if (dragY > 100) {
        handleClose();
      } else {
        setDragY(0);
      }
    };

    dialog.addEventListener("touchstart", handleTouchStart, { passive: true });
    dialog.addEventListener("touchmove", handleTouchMove, { passive: true });
    dialog.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      dialog.removeEventListener("touchstart", handleTouchStart);
      dialog.removeEventListener("touchmove", handleTouchMove);
      dialog.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isCompact, dragY]);

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

  const badgeTone = project.status === "live" || project.status === "published" ? "accent" : project.status === "paused" ? "warning" : "neutral";

  if (!isMounted) return null;

  return createPortal(
    <div
      role="presentation"
      className={`fixed inset-0 z-[21000] flex ${isCompact ? "items-end" : "items-center"} justify-center transition-all duration-150`}
      style={{
        background: isVisible ? `rgba(5,8,15,${Math.max(0.55 - dragY / 400, 0.1)})` : "rgba(5,8,15,0)",
        backdropFilter: isVisible ? "blur(8px)" : "blur(0px)",
        opacity: isVisible ? 1 : 0,
        padding: isCompact ? "0 0 0 0" : "2rem",
        overflow: "hidden",
        overscrollBehavior: "none",
      }}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${
          isCompact ? "max-w-xl rounded-t-3xl" : "max-w-4xl rounded-2xl"
        } flex flex-col transition-all duration-150 ease-out no-scrollbar`}
        style={{
          background: isDark ? "rgba(14,18,33,0.9)" : "rgba(255,255,255,0.94)",
          border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(15,23,42,0.12)",
          boxShadow: isDark 
            ? "0 0 0 1px rgba(255,255,255,0.05), 0 32px 90px rgba(0,0,0,0.65), 0 12px 40px rgba(0,0,0,0.5)" 
            : "0 0 0 1px rgba(15,23,42,0.05), 0 32px 90px rgba(15,23,42,0.25), 0 12px 40px rgba(15,23,42,0.15)",
          cursor: "none",
          transform: isVisible
            ? `scale(1) translateY(${dragY}px)`
            : isCompact
            ? "scale(0.95) translateY(20px)"
            : "scale(0.95) translateY(-20px)",
          opacity: isVisible ? Math.max(1 - dragY / 300, 0.5) : 0,
          maxHeight: isCompact ? "85vh" : "90vh",
          transition: dragY > 0 ? "none" : "all 0.2s ease-out",
        }}
        onClick={(event) => event.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <div 
          data-scroll-container
          className="flex flex-col gap-4 overflow-y-auto no-scrollbar" 
          style={{ flex: "1 1 auto", minHeight: 0, overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
        >
          <div
            className="flex items-start justify-between gap-3 sticky top-0 pb-3 pt-4 px-4 sm:px-5 md:px-6 z-10"
            style={{ 
              background: isDark ? "rgba(14,18,33,0.75)" : "rgba(255,255,255,0.75)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: "0 1px 0 " + (isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"),
              marginLeft: "-1px",
              marginRight: "-1px",
              marginTop: isCompact ? "-1px" : "0",
              paddingTop: isCompact ? "calc(1rem + env(safe-area-inset-top, 0px))" : "1rem",
              borderTopLeftRadius: isCompact ? "1.5rem" : "0",
              borderTopRightRadius: isCompact ? "1.5rem" : "0",
            }}
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
              onClick={handleClose}
              data-cursor="pointer"
              className="h-10 w-10 aspect-square p-0 leading-none rounded-full flex items-center justify-center shrink-0 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 cursor-pointer"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.15)",
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
                color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.82)",
              }}
            >
              ×
            </button>
          </div>

          <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 flex flex-col gap-4">
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
            {linkRow(copy.cards.github, project.links.github, project.codePrivate ? copy.cards.privateCode : copy.modal.githubSoon)}
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
    </div>,
    document.body
  );
}
