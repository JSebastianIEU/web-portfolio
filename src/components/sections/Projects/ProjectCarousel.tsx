"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale, TranslationCopy } from "@/domain/i18n";
import type { Project } from "@/domain/projects";
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
}: ProjectCarouselProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const baseWidthRef = useRef<number>(0);
  const [cardScales, setCardScales] = useState<number[]>([]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const measure = () => {
      const firstCard = slider.querySelector<HTMLElement>("[data-project-card]");
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
      baseWidthRef.current = repeatCount > 0 ? slider.scrollWidth / repeatCount : slider.scrollWidth;
      slider.style.scrollBehavior = "auto";
      slider.scrollLeft = baseWidthRef.current + (cardWidth ? cardWidth * 0.1 : 0);
      slider.style.scrollBehavior = "";
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
      slider.scrollLeft = newPosition;
      jumpTimeout = setTimeout(() => {
        isJumping = false;
        jumpTimeout = null;
        requestAnimationFrame(() => updateCardScales());
      }, 150);
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
  }, [repeatCount]);

  const widthStyles = useMemo(() => {
    return {
      width: isMobile ? "calc(100vw - 2rem)" : isTablet ? "46vw" : "320px",
      maxWidth: isMobile ? "calc(100vw - 2rem)" : isTablet ? "360px" : "360px",
      scrollSnapAlign: isMobile ? "center" : "start",
      scrollSnapStop: "always" as const,
    };
  }, [isMobile, isTablet]);

  return (
    <div
      ref={sliderRef}
      className={`flex ${isMobile ? "gap-4" : "gap-4 md:gap-5"} overflow-x-auto no-scrollbar ${isMobile ? "px-4" : "px-1"} py-1 cursor-default`}
      style={{
        scrollBehavior: "smooth",
        scrollSnapType: isMobile || isTablet ? "x mandatory" : "x proximity",
        scrollPaddingLeft: isMobile ? "50%" : "0px",
        scrollPaddingRight: isMobile ? "50%" : "0px",
      }}
    >
      {projects.map((project, idx) => {
        const scale = cardScales[idx] !== undefined ? cardScales[idx] : 0.9;
        return (
          <div
            key={`${project.id}-${idx}`}
            className="flex-shrink-0"
            data-project-card
            style={{
              ...widthStyles,
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
              onOpen={() => onOpen(project.id)}
              isDark={isDark}
              lang={lang}
            />
          </div>
        );
      })}
    </div>
  );
}
