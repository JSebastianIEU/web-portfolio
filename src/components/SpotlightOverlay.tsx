"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/providers/theme-provider";

type Point = { x: number; y: number };

type SpotlightOverlayProps = {
  cursorPosition: Point;
  showSpotlight: boolean;
};

export default function SpotlightOverlay({ cursorPosition, showSpotlight }: SpotlightOverlayProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const spotlightRadius = useMemo(() => (isDark ? 720 : 460), [isDark]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        opacity: showSpotlight ? 1 : 0,
        transition: "opacity 200ms ease",
      }}
    >
      {isDark ? (
        // Modo oscuro: spotlight blanco que ilumina
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(${spotlightRadius}px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255, 255, 255, 0.16), transparent 45%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      ) : (
        // Modo claro: revelar líneas del grid sin crear duplicados
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0",
            opacity: 0.08,
            WebkitMaskImage: `radial-gradient(${spotlightRadius}px circle at ${cursorPosition.x}px ${cursorPosition.y}px, black 0%, rgba(0,0,0,0.5) 30%, transparent 45%)`,
            maskImage: `radial-gradient(${spotlightRadius}px circle at ${cursorPosition.x}px ${cursorPosition.y}px, black 0%, rgba(0,0,0,0.5) 30%, transparent 45%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
