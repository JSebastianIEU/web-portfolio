"use client";

import { useTheme } from "@/components/providers/theme-provider";

/**
 * Cursor spotlight rendered as a small disc that follows the pointer via a
 * composited transform driven by the global --mx/--my CSS variables — no
 * React re-renders and no full-viewport repaints per frame.
 */
export default function SpotlightOverlay() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const radius = isDark ? 720 : 460;
  const size = radius * 2;
  const discTransform = `translate3d(calc(var(--mx) - ${radius}px), calc(var(--my) - ${radius}px), 0)`;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {isDark ? (
        // Modo oscuro: spotlight blanco que ilumina
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            transform: discTransform,
            background:
              "radial-gradient(closest-side circle at center, rgba(255, 255, 255, 0.16), transparent 45%)",
            mixBlendMode: "screen",
            willChange: "transform",
          }}
        />
      ) : (
        // Modo claro: revelar líneas del grid sin crear duplicados
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            transform: discTransform,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            // Counter the transform so the grid stays aligned to the viewport.
            backgroundPosition: `calc(${radius}px - var(--mx)) calc(${radius}px - var(--my))`,
            opacity: 0.08,
            WebkitMaskImage:
              "radial-gradient(closest-side circle at center, black 0%, rgba(0,0,0,0.5) 30%, transparent 45%)",
            maskImage:
              "radial-gradient(closest-side circle at center, black 0%, rgba(0,0,0,0.5) 30%, transparent 45%)",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}
