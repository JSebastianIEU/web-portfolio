"use client";

import { useEffect, useRef } from "react";

type ScrollRevealOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

export function useScrollReveal<T extends HTMLElement>(options?: ScrollRevealOptions) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.dataset.revealState = "visible";
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        target.dataset.revealState = entry.isIntersecting ? "visible" : "hidden";
      });
    }, {
      root: null,
      rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      threshold: options?.threshold ?? [0, 0.12, 0.25, 0.4, 0.6, 0.8, 1],
    });

    el.dataset.revealState = "hidden";
    observer.observe(el);

    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold]);

  return elementRef;
}
