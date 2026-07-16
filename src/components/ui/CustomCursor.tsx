"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type CursorVariant = "default" | "link" | "text";

const interactiveSelector =
  "a, button, [role='button'], input, textarea, select, summary, [data-cursor='pointer']";
const textSelector =
  "input[type='text'], input[type='email'], input[type='search'], input[type='tel'], input[type='url'], input[type='password'], textarea, [contenteditable='true']";

/**
 * Shared custom-cursor behavior. The smoothed position is written to the
 * global --mx/--my CSS variables and consumed by the cursor dot, spotlight
 * disc, and grid spotlight via composited transforms — no React re-renders
 * per frame. Only the variant (arrow/link/text) is React state.
 */
export function useCustomCursor() {
  const enableCustomCursor = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (enableCustomCursor) {
      root.classList.remove("custom-cursor-disabled");
    } else {
      root.classList.add("custom-cursor-disabled");
    }
    return () => root.classList.remove("custom-cursor-disabled");
  }, [enableCustomCursor]);

  useEffect(() => {
    if (!enableCustomCursor) return;

    const detect = (target: EventTarget | null): CursorVariant => {
      if (!(target instanceof Element)) return "default";
      if (target.closest(textSelector)) return "text";
      return target.closest(interactiveSelector) ? "link" : "default";
    };

    const handlePointer = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
      setCursorVariant(detect(event.target));
    };
    const handlePointerCancel = () => setCursorVariant("default");

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("pointerup", handlePointer, { passive: true });
    window.addEventListener("pointercancel", handlePointerCancel, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("pointerup", handlePointer);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [enableCustomCursor]);

  useEffect(() => {
    if (!enableCustomCursor) return;
    const root = document.documentElement.style;
    const pos = { x: mouseRef.current.x, y: mouseRef.current.y };
    const tick = () => {
      pos.x += (mouseRef.current.x - pos.x) * 0.4;
      pos.y += (mouseRef.current.y - pos.y) * 0.4;
      root.setProperty("--mx", `${pos.x.toFixed(1)}px`);
      root.setProperty("--my", `${pos.y.toFixed(1)}px`);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [enableCustomCursor]);

  const enterLink = useCallback(() => setCursorVariant("link"), []);
  const leaveLink = useCallback(() => setCursorVariant("default"), []);

  return { enableCustomCursor, cursorVariant, enterLink, leaveLink };
}

type CustomCursorDotProps = {
  variant: CursorVariant;
  isDark: boolean;
};

export function CustomCursorDot({ variant, isDark }: CustomCursorDotProps) {
  return (
    <div
      className="fixed pointer-events-none z-[25000]"
      style={{
        left: 0,
        top: 0,
        transform: "translate3d(calc(var(--mx, -100px) - 4px), calc(var(--my, -100px) - 4px), 0)",
        willChange: "transform",
      }}
    >
      {variant === "default" ? (
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
      ) : variant === "link" ? (
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
      ) : (
        <div
          className="w-0.5 h-6 rounded-full"
          style={{
            background: isDark ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.9)",
            boxShadow: isDark
              ? "0 0 10px rgba(255,255,255,0.35)"
              : "0 0 8px rgba(15,23,42,0.22)",
          }}
        />
      )}
    </div>
  );
}
