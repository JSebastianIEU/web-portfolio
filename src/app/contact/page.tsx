"use client";

import ContactSection from "@/components/ContactSection";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/providers/theme-provider";

type Point = { x: number; y: number };

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [cursorVariant, setCursorVariant] = useState<"default" | "link">("default");
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 });

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  const enterLink = () => setCursorVariant("link");
  const leaveLink = () => setCursorVariant("default");

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
      <main className="relative z-[10]" style={{ cursor: "none" }}>
        <ContactSection variant="page" enterLink={enterLink} leaveLink={leaveLink} />
      </main>

      <div
        className="fixed pointer-events-none z-[25000]"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: "translate(-4px, -4px)",
        }}
      >
        {cursorVariant === "default" ? (
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
        ) : (
          <div
            className="w-4 h-4 rounded-full border border-white/70 bg-white/10"
            style={{
              borderColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.6)",
              background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)",
              boxShadow: isDark
                ? "0 0 12px rgba(255,255,255,0.35)"
                : "0 0 10px rgba(15,23,42,0.25)",
            }}
          />
        )}
      </div>
    </>
  );
}
