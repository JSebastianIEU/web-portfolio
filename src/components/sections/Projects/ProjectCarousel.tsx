"use client";

import { useEffect, useMemo, useRef } from "react";
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

/**
 * The scroll distance of one full pass through the project list.
 *
 * It has to be read off the cards' own offsets rather than divided out of
 * scrollWidth: scrollWidth also counts the rail's horizontal padding and one
 * gap fewer than the repeats actually contain, so scrollWidth/repeatCount
 * lands short of the true period (by exactly 4px at the desktop breakpoint).
 * The teleport that fakes the infinite loop shifts the scroll by one period,
 * so any error there is a sideways lurch at the seam - every single lap.
 */
function measureLoopPeriod(slider: HTMLElement, repeatCount: number): number {
  const cards = slider.querySelectorAll<HTMLElement>("[data-project-card]");
  const perLap = Math.floor(cards.length / Math.max(1, repeatCount));
  const first = cards[0];
  const nextLap = cards[perLap];
  if (perLap > 0 && first && nextLap) return nextLap.offsetLeft - first.offsetLeft;
  return repeatCount > 0 ? slider.scrollWidth / repeatCount : slider.scrollWidth;
}

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
  // Same value the style prop applies, so the loop teleport can put back
  // exactly what it took off while it jumps. It's mirrored into a ref because
  // the teleport restores it imperatively: an effect cleanup runs *after*
  // React has committed the next render's styles, so restoring the value
  // captured in the closure would overwrite the fresh one with the stale one.
  const snapType = isMobile || isTablet ? "x mandatory" : "x proximity";
  const snapTypeRef = useRef(snapType);
  useEffect(() => {
    snapTypeRef.current = snapType;
  }, [snapType]);

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
      // offsetWidth, not getBoundingClientRect().width: the rect is the
      // *transformed* box, so any depth scale on or under the card would make
      // this read the shrunk width (208px instead of 320px) and the opening
      // nudge below would silently change size with the scroll position.
      const cardWidth = firstCard ? firstCard.offsetWidth : 0;
      const width = slider.clientWidth;
      baseWidthRef.current = measureLoopPeriod(slider, repeatCount);
      if (slider.scrollWidth === 0) return;
      const positioned = slider.dataset.cxPositioned === "1";
      const resized = positioned && width !== Number(slider.dataset.cxWidth || "0");
      if (positioned && !resized) return;
      if (restore !== null && !resized && restore <= slider.scrollWidth) {
        slider.scrollLeft = restore;
        clearCarouselScroll();
      } else {
        slider.scrollLeft = baseWidthRef.current + (cardWidth ? cardWidth * 0.1 : 0);
      }
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

    /**
     * Hand the scroll position back one lap so the repeated list reads as an
     * endless one. The move has to be pixel-exact or the seam shows.
     *
     * Scroll snapping applies to programmatic scrolls too, so with snap left on
     * the browser drags the landing to the nearest snap point - measured at up
     * to 150px away, most of a card - and turns the invisible hand-off into an
     * obvious jump. So snap comes off for the teleport and goes back on once
     * the new position has settled.
     */
    const performJump = (newPosition: number) => {
      isJumping = true;
      if (jumpTimeout) clearTimeout(jumpTimeout);
      slider.style.scrollSnapType = "none";
      slider.scrollLeft = newPosition;
      jumpTimeout = setTimeout(() => {
        isJumping = false;
        jumpTimeout = null;
        slider.style.scrollSnapType = snapTypeRef.current;
      }, 100);
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const base = baseWidthRef.current;
        if (!base) return;
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
        
        // Infinite loop: hand the scroll back or forward by exactly one lap.
        // Shifting by `base` rather than rebuilding the offset out of a modulo
        // keeps the landing content-identical by construction, whatever the
        // scroll position happens to be mid-fling.
        if (isJumping || repeatCount <= 1) return;
        const startBoundary = base * 0.15;
        const endBoundary = base * (repeatCount - 1 - 0.15);
        if (left < startBoundary) performJump(left + base);
        else if (left > endBoundary) performJump(left - base);
      });
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // Only put snap back if a teleport had it off, so a plain re-run never
      // reaches in and overwrites the style React just committed.
      if (jumpTimeout) {
        clearTimeout(jumpTimeout);
        slider.style.scrollSnapType = snapTypeRef.current;
      }
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
        // auto, not smooth: the loop teleport assigns scrollLeft directly, and
        // on a smooth container that instant hand-off becomes an animated
        // slide back across the whole rail.
        scrollBehavior: "auto",
        scrollSnapType: snapType,
        WebkitOverflowScrolling: "touch",
      }}
    >
      {projects.map((project, idx) => (
        <div
          key={`${project.id}-${idx}`}
          className="flex-shrink-0"
          data-project-card
          style={widthStyles}
        >
          {/* The depth scale is CSS (see .project-depth in globals.css) and
              lives on this wrapper, never on [data-project-card] itself: a
              snap area is measured from the transformed box, so scaling the
              snap target would drag its own snap point around as it scrolls. */}
          <div className="project-depth">
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
        </div>
      ))}
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
