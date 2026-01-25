"use client";

import { useEffect, useMemo } from "react";
import { useTheme } from "@/components/providers/theme-provider";

/**
 * BackgroundGridSpotlight: Single global grid + spotlight system.
 * Z-0: solid base background
 * Z-1: grid pattern + cursor-reactive spotlight mask
 *
 * All sections reuse the same CSS variables so the grid stays aligned and
 * responds to the shared cursor spotlight.
 */
export default function BackgroundGridSpotlight() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const baseColor = useMemo(() => (isDark ? "#05060d" : "#ffffff"), [isDark]);
  const gridColor = useMemo(
    () => (isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.04)"),
    [isDark],
  );
  const gridGlowColor = useMemo(
    () => (isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(71, 85, 105, 0.22)"),
    [isDark],
  );
  const plateGridColor = useMemo(
    () => (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"),
    [isDark],
  );
  const maskRadius = useMemo(() => (isDark ? 420 : 340), [isDark]);

  // Sync CSS custom properties so every surface reuses the exact same grid definition.
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty(
      "--grid-pattern",
      `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
    );
    root.setProperty(
      "--grid-glow-pattern",
      `linear-gradient(${gridGlowColor} 1px, transparent 1px), linear-gradient(90deg, ${gridGlowColor} 1px, transparent 1px)`,
    );
    root.setProperty(
      "--plate-grid-pattern",
      `linear-gradient(${plateGridColor} 1px, transparent 1px), linear-gradient(90deg, ${plateGridColor} 1px, transparent 1px)`,
    );
    root.setProperty("--grid-base", baseColor);
    root.setProperty("--grid-size", "50px");
    root.setProperty("--grid-mask-radius", `${maskRadius}px`);
    root.setProperty(
      "--grid-mask",
      `radial-gradient(${maskRadius}px circle at var(--mx) var(--my),
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.65) 40%,
        rgba(0,0,0,0.25) 70%,
        rgba(0,0,0,0) 100%)`
    );
  }, [baseColor, gridColor, gridGlowColor, maskRadius, plateGridColor]);

  // Keep grid pattern moving with scroll so it feels world-locked, not viewport-locked.
  useEffect(() => {
    const root = document.documentElement.style;
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const y = window.scrollY;
      root.setProperty("--grid-offset-x", "0px");
      root.setProperty("--grid-offset-y", `${-y}px`);
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="grid-base-layer" aria-hidden="true" />
      <div className="grid-pattern-layer" aria-hidden="true" />
      <div className="grid-spotlight-layer" aria-hidden="true" />
    </>
  );
}
