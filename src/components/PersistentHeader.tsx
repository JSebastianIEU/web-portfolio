"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import LanguageToggle from "@/components/LanguageToggle";
import { Sun, Moon } from "lucide-react";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type React from "react";

interface PersistentHeaderProps {
  enterLink: () => void;
  leaveLink: () => void;
}

export default function PersistentHeader({ enterLink, leaveLink }: PersistentHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { t, lang } = useI18n();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState("hero");
  const [refsReady, setRefsReady] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tickingRef = useRef(false);

  const navItems = [
    { key: "nav.home", href: "#hero", id: "hero" },
    { key: "nav.about", href: "#about", id: "about" },
    { key: "nav.skills", href: "#skills", id: "skills" },
    { key: "nav.projects", href: "#projects", id: "projects" },
    { key: "nav.contact", href: "#contact", id: "contact" },
  ];

  // Scroll spy
  useEffect(() => {
    const updateActiveSection = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(updateActiveSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger immediately and after a short delay to ensure DOM is ready
    handleScroll();
    const timeout = setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Force re-render after refs are populated
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (navLinksRef.current.every((ref) => ref !== null)) {
        setRefsReady(true);
        requestAnimationFrame(() => setIndicatorVisible(true));
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Re-calculate on language change
  useEffect(() => {
    if (refsReady) {
      const timeout = setTimeout(() => {
        setActiveSection((prev) => prev);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [lang, refsReady]);

  // Calculate indicator position
  const indicatorStyle = useMemo(() => {
        if (!refsReady) {
          return { opacity: 0, width: 0, left: 0 };
        }

    const activeIndex = navItems.findIndex((item) => item.id === activeSection);
    const activeLink = navLinksRef.current[activeIndex];
    
    if (!activeLink) {
      return { opacity: 0, width: 0, left: 0 };
    }

    const container = activeLink.parentElement;
    if (!container) {
      return { opacity: 0, width: 0, left: 0 };
    }

    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const relativeLeft = linkRect.left - containerRect.left;

    return {
      width: `${linkRect.width + 16}px`,
      left: `${relativeLeft - 8}px`,
      opacity: indicatorVisible ? 1 : 0,
      transform: indicatorVisible ? "scale(1)" : "scale(0.9)",
      transformOrigin: "left center",
    };
  }, [activeSection, lang, refsReady, indicatorVisible]);

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
            <div className="relative flex items-center gap-8 px-8 py-3 rounded-full transition-all duration-300" style={navCapsuleStyle}>
              {/* Active section indicator */}
              <div
                className="absolute top-[6px] bottom-[6px] rounded-full transition-all duration-300 ease-out pointer-events-none"
                style={{
                  ...indicatorStyle,
                  background: isDark 
                    ? "rgba(255, 255, 255, 0.08)" 
                    : "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: isDark 
                    ? "1px solid rgba(255, 255, 255, 0.12)" 
                    : "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: isDark
                    ? "0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                    : "0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  cursor: "none",
                }}
              />
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  ref={(el) => { navLinksRef.current[index] = el; }}
                  href={item.href}
                  className="relative z-10 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 whitespace-nowrap"
                  style={{ 
                    cursor: "none", 
                    color: activeSection === item.id ? navHoverColor : colors.navMuted 
                  }}
                  onMouseEnter={handleNavEnter}
                  onMouseLeave={handleNavLeave}
                >
                  <span className="inline-block transition-all duration-300" key={`${item.key}-${lang}`}>
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
              <Sun className="h-5 w-5 text-slate-300" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600 fill-slate-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
