"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon } from "lucide-react";
import { useCallback, useMemo } from "react";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "home", href: "#hero" },
  { label: "about", href: "#about" },
  { label: "skills", href: "#skills" },
  { label: "projects", href: "#projects" },
  { label: "contact", href: "#contact" },
];

interface PersistentHeaderProps {
  enterLink: () => void;
  leaveLink: () => void;
}

export default function PersistentHeader({ enterLink, leaveLink }: PersistentHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const colors = useMemo(
    () => ({
      navMuted: isDark ? "#d1d5db" : "#475569",
    }),
    [isDark]
  );

  const navHoverColor = useMemo(() => (isDark ? "#ffffff" : "#0f172a"), [isDark]);

  const handleNavEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      enterLink();
      e.currentTarget.style.color = navHoverColor;
    },
    [enterLink, navHoverColor]
  );

  const handleNavLeave = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      leaveLink();
      e.currentTarget.style.color = colors.navMuted;
    },
    [colors.navMuted, leaveLink]
  );

  return (
    <>
      {/* Floating Glass Navbar (siempre visible, máxima prioridad) */}
      <nav className="fixed top-6 inset-x-0 z-[20000] flex justify-center pointer-events-auto">
        <div
          className="flex items-center gap-8 px-8 py-3 rounded-full"
          style={{
            background: isDark ? "rgba(12, 16, 26, 0.06)" : "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(10px) saturate(140%) contrast(110%)",
            WebkitBackdropFilter: "blur(10px) saturate(140%) contrast(110%)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.14)" : "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
            backgroundImage: isDark
              ? "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0, rgba(255,255,255,0) 45%)"
              : "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.26) 0, rgba(255,255,255,0) 45%)",
            cursor: "none",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ cursor: "none", color: colors.navMuted }}
              onMouseEnter={handleNavEnter}
              onMouseLeave={handleNavLeave}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Floating theme bubble (siempre visible, máxima prioridad) */}
      <button
        type="button"
        aria-label="Cambiar tema"
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-[20000] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:-translate-y-0.5 pointer-events-auto"
        style={{
          background: isDark ? "rgba(16, 20, 30, 0.06)" : "rgba(255, 255, 255, 0.06)",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.14)" : "1px solid rgba(255, 255, 255, 0.14)",
          backdropFilter: "blur(10px) saturate(145%) contrast(110%)",
          WebkitBackdropFilter: "blur(10px) saturate(145%) contrast(110%)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.22)",
          backgroundImage: isDark
            ? "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.16) 0, rgba(255,255,255,0) 55%)"
            : "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3) 0, rgba(255,255,255,0) 55%)",
          cursor: "none",
        }}
        onMouseEnter={enterLink}
        onMouseLeave={leaveLink}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-slate-400" />
        ) : (
          <Moon className="h-5 w-5 text-slate-600 fill-slate-600" />
        )}
      </button>
    </>
  );
}
