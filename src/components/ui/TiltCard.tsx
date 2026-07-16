"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max rotation in degrees at the card edges. */
  max?: number;
};

/**
 * A card that leans toward the cursor. The rotation angles are written to the
 * element's own --tilt-x / --tilt-y CSS vars on pointermove — no React state,
 * no per-frame re-render (same approach as the cursor/spotlight). Only a
 * composited transform moves, so it never triggers a repaint or scroll jank.
 *
 * Tilt is disabled for touch/coarse pointers and reduced-motion via CSS
 * (see .tilt-card media query); the JS just skips wiring listeners there.
 */
export default function TiltCard({
  children,
  className,
  style,
  max = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const rect = el.getBoundingClientRect();
    // Normalized [-1, 1] offset of the cursor from the card center.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Cursor right → rotateY positive (leans right edge back); cursor down →
    // rotateX negative (leans bottom toward viewer). Feels like the surface
    // faces the pointer.
    el.style.setProperty("--tilt-y", `${(px * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--tilt-x", `${(-py * max * 2).toFixed(2)}deg`);
  };

  const handleEnter = (e: React.PointerEvent) => {
    if (!canTilt()) return;
    ref.current?.setAttribute("data-tilting", "true");
    handleMove(e);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.removeAttribute("data-tilting");
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div className="tilt-scene">
      <div
        ref={ref}
        className={cn("tilt-card", className)}
        style={style}
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {children}
      </div>
    </div>
  );
}
