"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionShell from "@/components/layout/SectionShell";
import SiteChrome from "@/components/layout/SiteChrome";
import { useTheme } from "@/components/providers/theme-provider";

type Point = { x: number; y: number };

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 });

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      setCursorPosition((prev) => ({
        x: prev.x + (mouseRef.current.x - prev.x) * 0.4,
        y: prev.y + (mouseRef.current.y - prev.y) * 0.4,
      }));
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <SiteChrome cursorPosition={cursorPosition} showSpotlight mainClassName="relative z-[10]">
        <SectionShell className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
              Page not found
            </h1>
            <p style={{ color: isDark ? "rgba(226,232,240,0.8)" : "rgba(15,23,42,0.7)" }}>
              The page you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold"
              data-cursor="pointer"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(15,23,42,0.2)",
                color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
              }}
            >
              Go home
            </Link>
          </div>
        </SectionShell>
      </SiteChrome>

      <div
        className="fixed pointer-events-none z-[25000]"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: "translate(-4px, -4px)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))" }}
        >
          <path
            d="M3 2 L3 17 L7.5 12.5 L10 18 L12 17 L9.5 11.5 L16 11.5 L3 2Z"
            fill={isDark ? "#ffffff" : "#0f172a"}
            stroke={isDark ? "#0b1224" : "#ffffff"}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
