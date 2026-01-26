"use client";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

type ThemeToggleProps = {
  onEnter?: () => void;
  onLeave?: () => void;
};

export default function ThemeToggle({ onEnter, onLeave }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/60 px-3 py-2 text-sm font-medium text-slate-900 shadow-lg shadow-cyan-500/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20 dark:border-white/5 dark:bg-white/10 dark:text-slate-100"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ cursor: "none" }}
    >
      {isDark ? (
        <>
          <MoonStar className="h-4 w-4" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </>
      )}
    </button>
  );
}
