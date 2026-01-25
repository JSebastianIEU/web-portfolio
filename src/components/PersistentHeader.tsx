"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import LanguageToggle from "@/components/LanguageToggle";
import { Sun, Moon } from "lucide-react";
import { useCallback, useMemo } from "react";
import type React from "react";

interface PersistentHeaderProps {
  enterLink: () => void;
  leaveLink: () => void;
}

export default function PersistentHeader({ enterLink, leaveLink }: PersistentHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { t, lang } = useI18n();
  const isDark = theme === "dark";

  const colors = useMemo(
    () => ({
      navMuted: isDark ? "#d1d5db" : "#475569",
    }),
    [isDark],
  );

  const navHoverColor = useMemo(() => (isDark ? "#ffffff" : "#0f172a"), [isDark]);

  const handleNavEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      enterLink();
      e.currentTarget.style.color = navHoverColor;
    },
    [enterLink, navHoverColor],
  );

  const handleNavLeave = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      leaveLink();
      e.currentTarget.style.color = colors.navMuted;
    },
    [colors.navMuted, leaveLink],
  );

  const navCapsuleStyle: React.CSSProperties = {
    background: isDark ? "rgba(12, 16, 26, 0.06)" : "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px) saturate(140%) contrast(110%)",
    WebkitBackdropFilter: "blur(10px) saturate(140%) contrast(110%)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.14)" : "1px solid rgba(255, 255, 255, 0.14)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
    backgroundImage: isDark
      ? "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0, rgba(255,255,255,0) 45%)"
      : "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.26) 0, rgba(255,255,255,0) 45%)",
    cursor: "none",
  };

  return (
    <div className="fixed top-6 inset-x-0 z-[20000] pointer-events-none px-4 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="pointer-events-auto">
          <LanguageToggle onEnter={enterLink} onLeave={leaveLink} />
        </div>

        <div className="flex-1 flex justify-center pointer-events-auto">
          <nav>
            <div className="flex items-center gap-8 px-8 py-3 rounded-full transition-opacity duration-200" style={navCapsuleStyle}>
              {[
                { key: "nav.home", href: "#hero" },
                { key: "nav.about", href: "#about" },
                { key: "nav.skills", href: "#skills" },
                { key: "nav.projects", href: "#projects" },
                { key: "nav.contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ cursor: "none", color: colors.navMuted }}
                  onMouseEnter={handleNavEnter}
                  onMouseLeave={handleNavLeave}
                >
                  <span className="transition-opacity duration-200" key={`${item.key}-${lang}`}>
                    {t(item.key)}
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="pointer-events-auto flex items-center justify-center">
          <button
            type="button"
            aria-label="Cambiar tema"
            onClick={toggleTheme}
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:-translate-y-0.5"
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
        </div>
      </div>
    </div>
  );
}
