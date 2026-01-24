"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useTheme } from "@/components/providers/theme-provider";

type Point = { x: number; y: number };

const PHRASES = [
  { prefix: "I'm a ", word: "developer" },
  { prefix: "I'm a ", word: "creator" },
  { prefix: "I'm an ", word: "entrepreneur" },
  { prefix: "I'm a ", word: "problem solver" },
  { prefix: "I'm an ", word: "engineer" },
  { prefix: "I'm ", word: "Sebastian Peña" },
];

const NEON_COLORS = ["#a855f7", "#22c55e", "#38bdf8", "#fb923c", "#67e8f9", "#f472b6"];
const NAV_ITEMS = [
  { href: "#home", label: "home" },
  { href: "#about", label: "about" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<"default" | "link">("default");

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  const currentPhrase = useMemo(() => PHRASES[loopNum % PHRASES.length], [loopNum]);
  const currentIndex = useMemo(() => loopNum % PHRASES.length, [loopNum]);

  useEffect(() => {
    const fullText = currentPhrase.prefix + currentPhrase.word;

    const handleTyping = () => {
      if (!isDeleting) {
        if (text !== fullText) {
          setText(fullText.substring(0, text.length + 1));
          setTypingSpeed(150);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (text !== currentPhrase.prefix) {
          setText(fullText.substring(0, text.length - 1));
          setTypingSpeed(75);
        } else {
          const nextIndex = (loopNum + 1) % PHRASES.length;
          const nextPhrase = PHRASES[nextIndex];
          setIsDeleting(false);
          setLoopNum((prev) => prev + 1);
          setTypingSpeed(500);
          setText(nextPhrase.prefix);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentPhrase, isDeleting, loopNum, text, typingSpeed]);

  useEffect(() => {
    const handleMouseMove: (event: MouseEvent) => void = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth cursor follow with delay
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

  // Derived display values
  const prefixLength = currentPhrase.prefix.length;
  const displayPrefix = text.substring(0, prefixLength);
  const displayWord = text.substring(prefixLength);

  const colors = useMemo(
    () => ({
      background: isDark ? "#000000" : "#f9fbff",
      grid: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.04)",
      gridGlow: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(71, 85, 105, 0.22)",
      spotlight: isDark ? "rgba(255, 255, 255, 0.15)" : "transparent",
      prefix: isDark ? "#9ca3af" : "#334155",
      word: isDark ? "#ffffff" : "#0f172a",
      navMuted: isDark ? "#d1d5db" : "#475569",
      bubbleBorder: isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(15, 23, 42, 0.08)",
      bubbleBg: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.88)",
    }),
    [isDark],
  );

  const navHoverColor = useMemo(() => (isDark ? "#ffffff" : "#0f172a"), [isDark]);
  const wordColor = useMemo(
    () => (isDark ? colors.word : NEON_COLORS[currentIndex % NEON_COLORS.length]),
    [colors.word, currentIndex, isDark],
  );
  const spotlightRadius = useMemo(() => (isDark ? 800 : 360), [isDark]);
  const gridMaskRadius = useMemo(() => (isDark ? 400 : 320), [isDark]);

  const enterLink = useCallback(() => setCursorVariant("link"), []);
  const leaveLink = useCallback(() => setCursorVariant("default"), []);

  const handleNavEnter = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      enterLink();
      e.currentTarget.style.color = navHoverColor;
      e.currentTarget.style.textShadow = isDark
        ? "0 0 18px rgba(255,255,255,0.6)"
        : "0 0 12px rgba(15,23,42,0.35)";
    },
    [enterLink, isDark, navHoverColor],
  );

  const handleNavLeave = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      leaveLink();
      e.currentTarget.style.color = colors.navMuted;
      e.currentTarget.style.textShadow = "none";
    },
    [colors.navMuted, leaveLink],
  );

  return (
    <div
      className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={{ cursor: "none", background: colors.background, transition: "background 200ms ease" }}
    >
      {/* Floating Glass Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
        <div 
          className="flex items-center gap-8 px-8 py-3 rounded-full"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
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

      {/* Floating theme bubble */}
      <button
        type="button"
        aria-label="Cambiar tema"
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:-translate-y-0.5"
        style={{
          background: colors.bubbleBg,
          border: `1px solid ${colors.bubbleBorder}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          cursor: "none",
        }}
        onMouseEnter={enterLink}
        onMouseLeave={leaveLink}
      >
        {isDark ? (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5c2.79 0 5.12-2.06 5.45-4.76-1.48.6-3.21.29-4.4-.9-1.19-1.19-1.5-2.92-.9-4.4C14.06 6.38 12.79 6.5 12 6.5Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
          </svg>
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="4.5" fill="#0f172a" stroke="#0f172a" strokeWidth="0.8" />
            <g stroke="#0f172a" strokeWidth="0.8" strokeLinecap="round">
              <line x1="12" y1="2.5" x2="12" y2="4.2" />
              <line x1="12" y1="19.8" x2="12" y2="21.5" />
              <line x1="4.2" y1="12" x2="2.5" y2="12" />
              <line x1="21.5" y1="12" x2="19.8" y2="12" />
              <line x1="5.7" y1="5.7" x2="4.3" y2="4.3" />
              <line x1="18.3" y1="18.3" x2="19.7" y2="19.7" />
              <line x1="5.7" y1="18.3" x2="4.3" y2="19.7" />
              <line x1="18.3" y1="5.7" x2="19.7" y2="4.3" />
            </g>
          </svg>
        )}
      </button>

      {/* Custom cursor - Arrow pointer */}
      <div
        className="fixed pointer-events-none z-[9999]"
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
            style={{
              filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))",
            }}
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

      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(${colors.grid} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      
      {/* Gradient spotlight following cursor (dark mode only) */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at ${cursorPosition.x}px ${cursorPosition.y}px, ${colors.spotlight}, transparent 32%)`,
          }}
        />
      )}

      {/* Illuminated grid overlay (strong near cursor, fades out) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${colors.gridGlow} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.gridGlow} 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage: `radial-gradient(${gridMaskRadius}px circle at ${cursorPosition.x}px ${cursorPosition.y}px,
            rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0) 100%)`,
          WebkitMaskImage: `radial-gradient(${gridMaskRadius}px circle at ${cursorPosition.x}px ${cursorPosition.y}px,
            rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0) 100%)`,
        }}
      />

      {/* Text content */}
      <div className="text-5xl font-mono relative z-10" style={{ color: wordColor }}>
        <span style={{ color: colors.prefix }}>{displayPrefix}</span>
        <span
          className="font-bold"
          style={{
            color: wordColor,
            textShadow: isDark
              ? "0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff"
              : `0 0 18px ${wordColor}88`,
          }}
        >
          {displayWord}
        </span>
        <span className="animate-pulse" style={{ color: wordColor }}>|</span>
      </div>
    </div>
  );
}
