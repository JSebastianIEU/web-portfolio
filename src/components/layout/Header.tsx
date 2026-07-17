/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { usePathname } from "next/navigation";
import TransitionLink from "@/components/ui/TransitionLink";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Sun, Moon } from "lucide-react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { navLinks } from "@/data/navLinks";

interface HeaderProps {
  enterLink?: () => void;
  leaveLink?: () => void;
}

export default function Header({ enterLink, leaveLink }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { t, lang } = useI18n();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState(navLinks[0]?.id ?? "hero");
  const [refsReady, setRefsReady] = useState(false);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({ opacity: 0, width: 0, left: 0 });
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tickingRef = useRef(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const pathname = usePathname();
  // Off-home routes own their nav state; the scroll spy only applies on "/".
  const routeSection = pathname?.startsWith("/contact")
    ? "contact"
    : pathname?.startsWith("/projects")
    ? "projects"
    : null;

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (routeSection) {
      setActiveSection(routeSection);
      return;
    }
    const updateActiveSection = () => {
      const sections = navLinks.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
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
    handleScroll();
    const timeout = setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [routeSection]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (navLinksRef.current.every((ref) => ref !== null)) {
        setRefsReady(true);
        requestAnimationFrame(() => setIndicatorVisible(true));
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (refsReady) {
      const timeout = setTimeout(() => setActiveSection((prev) => prev), 150);
      return () => clearTimeout(timeout);
    }
  }, [lang, refsReady]);

  useEffect(() => {
    if (!refsReady) {
      setIndicatorStyle({ opacity: 0, width: 0, left: 0 });
      return;
    }

    const activeIndex = navLinks.findIndex((item) => item.id === activeSection);
    const activeLink = navLinksRef.current[activeIndex];
    const container = activeLink?.parentElement;

    if (!activeLink || !container) {
      setIndicatorStyle({ opacity: 0, width: 0, left: 0 });
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const relativeLeft = linkRect.left - containerRect.left;

    setIndicatorStyle({
      width: `${linkRect.width + 16}px`,
      left: `${relativeLeft - 8}px`,
      opacity: indicatorVisible ? 1 : 0,
      transform: indicatorVisible ? "scale(1)" : "scale(0.9)",
      transformOrigin: "left center",
    });
  }, [activeSection, indicatorVisible, lang, refsReady]);

  const colors = useMemo(
    () => ({
      navMuted: isDark ? "#d1d5db" : "#475569",
    }),
    [isDark],
  );

  const navHoverColor = useMemo(() => (isDark ? "#ffffff" : "#0f172a"), [isDark]);

  const handleNavEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      enterLink?.();
      e.currentTarget.style.color = navHoverColor;
    },
    [enterLink, navHoverColor],
  );

  const handleNavLeave = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      leaveLink?.();
      e.currentTarget.style.color = colors.navMuted;
    },
    [colors.navMuted, leaveLink],
  );

  const navCapsuleStyle: CSSProperties = {
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
    <div className="fixed top-4 sm:top-6 inset-x-0 z-[20000] pointer-events-none px-3 sm:px-4 md:px-6">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="pointer-events-auto">
          <LanguageToggle onEnter={enterLink} onLeave={leaveLink} />
        </div>

        {!isMobile && (
          <div className="flex-1 flex justify-center pointer-events-auto">
            <nav>
              <div
                className="relative flex items-center gap-6 px-6 py-2.5 rounded-full transition-all duration-300 max-w-full overflow-x-auto no-scrollbar"
                style={navCapsuleStyle}
              >
                <div
                  className="absolute top-[6px] bottom-[6px] rounded-full transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    ...indicatorStyle,
                    background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: isDark
                      ? "0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                      : "0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                    cursor: "none",
                  }}
                />
                {navLinks.map((item, index) => (
                  <TransitionLink
                    key={item.href}
                    ref={(el) => {
                      navLinksRef.current[index] = el;
                    }}
                    href={item.href}
                    className="relative z-10 text-[12px] md:text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 whitespace-nowrap"
                    style={{
                      cursor: "none",
                      color: activeSection === item.id ? navHoverColor : colors.navMuted,
                    }}
                    onMouseEnter={handleNavEnter}
                    onMouseLeave={handleNavLeave}
                  >
                    <span className="inline-block transition-all duration-300" key={`${item.labelKey}-${lang}`}>
                      {t(item.labelKey)}
                    </span>
                  </TransitionLink>
                ))}
              </div>
            </nav>
          </div>
        )}

        <div className="pointer-events-auto flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Cambiar tema"
            onClick={toggleTheme}
            className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-lg transition hover:-translate-y-0.5"
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
          {isMobile && (
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition"
              style={{
                background: isDark ? "rgba(16, 20, 30, 0.08)" : "rgba(255, 255, 255, 0.08)",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.16)" : "1px solid rgba(255, 255, 255, 0.16)",
                backdropFilter: "blur(10px) saturate(145%) contrast(110%)",
                WebkitBackdropFilter: "blur(10px) saturate(145%) contrast(110%)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.22)",
                color: isDark ? "rgba(255,255,255,0.9)" : "#0f172a",
                cursor: "none",
              }}
              onMouseEnter={enterLink}
              onMouseLeave={leaveLink}
            >
              <span className="text-lg leading-none">☰</span>
            </button>
          )}
        </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <div
          className="mobile-menu pointer-events-auto fixed inset-0 z-[30000] flex flex-col"
          style={{
            background: isDark ? "rgba(5, 6, 13, 0.92)" : "rgba(248, 250, 252, 0.94)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-end px-4 pt-4">
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(15,23,42,0.14)",
                color: isDark ? "rgba(255,255,255,0.9)" : "#0f172a",
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
              }}
            >
              <span className="text-xl leading-none">✕</span>
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-6 pb-16">
            {navLinks.map((item, i) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="mobile-menu-link text-4xl font-semibold uppercase tracking-[0.06em]"
                style={{
                  color: activeSection === item.id ? navHoverColor : colors.navMuted,
                  "--i": i,
                } as CSSProperties}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.labelKey)}
                {activeSection === item.id && (
                  <span
                    aria-hidden
                    className="block h-[3px] mt-1 rounded-full"
                    style={{ background: navHoverColor }}
                  />
                )}
              </TransitionLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
