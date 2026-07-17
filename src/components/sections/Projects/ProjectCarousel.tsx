"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale, TranslationCopy } from "@/domain/i18n";
import type { Project } from "@/domain/projects";
import { clearCarouselScroll, peekCarouselScroll } from "./openProject";
import ProjectCard from "./ProjectCard";

type ProjectCarouselProps = {
  projects: Project[];
  copy: TranslationCopy["projects"];
  isDark: boolean;
  lang: Locale;
  typeMap: Record<string, string>;
  statusMap: Record<string, string>;
  isMobile: boolean;
  isTablet: boolean;
  repeatCount?: number;
  onOpen: (projectId: string) => void;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  totalProjects?: number;
};

export default function ProjectCarousel({
  projects,
  copy,
  isDark,
  lang,
  typeMap,
  statusMap,
  isMobile,
  isTablet,
  onOpen,
  repeatCount = 3,
  activeIndex = 0,
  onActiveIndexChange,
  totalProjects,
}: ProjectCarouselProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const baseWidthRef = useRef<number>(0);
  const [cardScales, setCardScales] = useState<number[]>([]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    // If we're returning from a project page, land on the card the visitor
    // opened, not the carousel's default start position.
    //
    // Three things make this fiddly:
    //  - React dev-mode double-invokes this effect on the SAME node. If the
    //    "already positioned" flag lived in the closure, the second setup would
    //    start fresh and re-center to the default, undoing the restore. So the
    //    flag lives on the node (dataset), shared across both invocations — the
    //    second setup sees it's positioned and leaves the scroll alone.
    //  - The section also mounts a hidden responsive twin whose scrollWidth is
    //    0, so we only act once genuinely laid out and only that instance
    //    consumes the saved value.
    //  - A laid-out carousel positions exactly once, then stays put: the
    //    ResizeObserver fires an initial echo at the same width; re-running the
    //    centering there would undo the restore. We skip it and only re-center
    //    on a genuine width change (rotate/resize).
    const restore = peekCarouselScroll();
    const measure = () => {
      const firstCard = slider.querySelector<HTMLElement>("[data-project-card]");
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
      const width = slider.clientWidth;
      baseWidthRef.current = repeatCount > 0 ? slider.scrollWidth / repeatCount : slider.scrollWidth;
      if (slider.scrollWidth === 0) return;
      const positioned = slider.dataset.cxPositioned === "1";
      const resized = positioned && width !== Number(slider.dataset.cxWidth || "0");
      if (positioned && !resized) return;
      slider.style.scrollBehavior = "auto";
      if (restore !== null && !resized && restore <= slider.scrollWidth) {
        slider.scrollLeft = restore;
        clearCarouselScroll();
      } else {
        slider.scrollLeft = baseWidthRef.current + (cardWidth ? cardWidth * 0.1 : 0);
      }
      slider.style.scrollBehavior = "";
      slider.dataset.cxPositioned = "1";
      slider.dataset.cxWidth = String(width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slider);
    return () => observer.disconnect();
  }, [repeatCount]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let rafId: number | null = null;
    let isJumping = false;
    let jumpTimeout: NodeJS.Timeout | null = null;

    const updateCardScales = (forceFreeze = false) => {
      if (isJumping || forceFreeze || isMobile) return;

      const cards = slider.querySelectorAll<HTMLElement>("[data-project-card]");
      if (!cards.length) return;

      const sliderRect = slider.getBoundingClientRect();
      const centerX = sliderRect.left + sliderRect.width / 2;

      const newScales: number[] = [];

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const distanceFromCenter = Math.abs(cardCenterX - centerX);

        const maxDistance = sliderRect.width * 0.85;
        const ratio = Math.min(distanceFromCenter / maxDistance, 1);
        const eased = 1 - ratio * ratio;
        const scale = 0.65 + eased * 0.35;

        newScales.push(Math.max(Math.min(scale, 1), 0.65));
      });

      setCardScales(newScales);
    };

    const performJump = (newPosition: number) => {
      isJumping = true;
      if (jumpTimeout) clearTimeout(jumpTimeout);
      slider.style.scrollBehavior = "auto";
      slider.scrollLeft = newPosition;
      slider.style.scrollBehavior = "";
      jumpTimeout = setTimeout(() => {
        isJumping = false;
        jumpTimeout = null;
        requestAnimationFrame(() => updateCardScales());
      }, 100);
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const base = baseWidthRef.current;
        if (!base) {
          rafId = null;
          return;
        }
        const left = slider.scrollLeft;
        
        // Calculate active index for mobile indicators
        if (isMobile && onActiveIndexChange && totalProjects) {
          const cards = slider.querySelectorAll<HTMLElement>("[data-project-card]");
          if (cards.length > 0) {
            const sliderRect = slider.getBoundingClientRect();
            const centerX = sliderRect.left + sliderRect.width / 2;
            let closestIndex = 0;
            let minDistance = Infinity;
            
            cards.forEach((card, idx) => {
              const cardRect = card.getBoundingClientRect();
              const cardCenterX = cardRect.left + cardRect.width / 2;
              const distance = Math.abs(cardCenterX - centerX);
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = idx % totalProjects;
              }
            });
            
            onActiveIndexChange(closestIndex);
          }
        }
        
        // Infinite scroll logic
        const startBoundary = base * 0.15;
        const endBoundary = repeatCount > 1 ? base * (repeatCount - 1 - 0.15) : base;

        if (!isJumping) {
          if (left < startBoundary) {
            const offset = left % base;
            performJump(base + offset);
          } else if (left > endBoundary) {
            const offset = (left - base * Math.max(1, repeatCount - 1)) % base;
            performJump(base + offset);
          } else {
            updateCardScales();
          }
        }

        rafId = null;
      });
    };

    const initTimer = setTimeout(() => {
      updateCardScales();
    }, 300);

    slider.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(initTimer);
      if (jumpTimeout) clearTimeout(jumpTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      slider.removeEventListener("scroll", handleScroll);
    };
  }, [repeatCount, isMobile, onActiveIndexChange, totalProjects]);

  const widthStyles = useMemo(() => {
    return {
      width: isMobile ? "calc(100vw - 2rem)" : isTablet ? "46vw" : "320px",
      maxWidth: isMobile ? "calc(100vw - 2rem)" : isTablet ? "360px" : "360px",
      scrollSnapAlign: isMobile ? "center" : "start",
      scrollSnapStop: isMobile ? ("always" as const) : ("normal" as const),
    };
  }, [isMobile, isTablet]);

  return (
    <>
    <div
      ref={sliderRef}
      data-project-carousel
      className={`flex ${isMobile ? "gap-4" : "gap-4 md:gap-5"} overflow-x-auto no-scrollbar ${isMobile ? "px-4" : "px-1"} py-1 cursor-default`}
      style={{
        scrollBehavior: "smooth",
        scrollSnapType: isMobile ? "x mandatory" : isTablet ? "x mandatory" : "x proximity",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {projects.map((project, idx) => {
        const scale = !isMobile && cardScales[idx] !== undefined ? cardScales[idx] : 1;
        return (
          <div
            key={`${project.id}-${idx}`}
            className="flex-shrink-0"
            data-project-card
            style={{
              ...widthStyles,
              transform: isMobile ? "none" : `scale(${scale})`,
              transition: isMobile ? "none" : "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: isMobile ? "auto" : "transform",
            }}
          >
            <ProjectCard
              project={project}
              displayType={typeMap[project.type]}
              displayStatus={statusMap[project.status]}
              copy={copy}
              onOpen={() => onOpen(project.id)}
              isDark={isDark}
              lang={lang}
            />
          </div>
        );
      })}
    </div>
    {isMobile && totalProjects && totalProjects > 1 && (
      <div className="flex items-center justify-center gap-2 mt-4 pb-1">
        {Array.from({ length: totalProjects }).map((_, idx) => (
          <div
            key={idx}
            className="transition-all duration-150 ease-out rounded-full"
            style={{
              width: activeIndex === idx ? "24px" : "6px",
              height: "6px",
              background: isDark
                ? activeIndex === idx
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.25)"
                : activeIndex === idx
                ? "rgba(15,23,42,0.75)"
                : "rgba(15,23,42,0.2)",
              cursor: "none",
            }}
          />
        ))}
      </div>
    )}
  </>
  );
}
