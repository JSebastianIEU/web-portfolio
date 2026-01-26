"use client";

import { useEffect } from "react";

export function useParallax(maxOffset: number = 16) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId: number | null = null;

    const apply = () => {
      rafId = null;
      const reduce = media.matches;
      const viewportHeight = window.innerHeight || 1;
      const mobileFactor = window.innerWidth < 768 ? 0.5 : 1;
      const effectiveMax = Math.max(0, maxOffset) * mobileFactor;
      const targets = document.querySelectorAll<HTMLElement>("[data-parallax]");

      targets.forEach((el) => {
        const speed = Number.parseFloat(el.dataset.speed || "0.25") || 0;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const normalized = Math.max(-1, Math.min(1, (center - viewportHeight / 2) / (viewportHeight * 0.7)));
        const offset = reduce ? 0 : normalized * effectiveMax * speed;
        el.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
      });
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(apply);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    if (media.addEventListener) {
      media.addEventListener("change", schedule);
    } else if (media.addListener) {
      media.addListener(schedule);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (media.removeEventListener) {
        media.removeEventListener("change", schedule);
      } else if (media.removeListener) {
        media.removeListener(schedule);
      }
    };
  }, [maxOffset]);
}
