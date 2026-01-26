"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import BackgroundGridSpotlight from "@/components/BackgroundGridSpotlight";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import SpotlightOverlay from "@/components/SpotlightOverlay";
import PersistentHeader from "@/components/PersistentHeader";
import SocialRail from "@/components/SocialRail";
import BetweenSectionsCta from "@/components/BetweenSectionsCta";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import { useParallax } from "@/hooks/useParallax";

type Point = { x: number; y: number };

const HIGHLIGHT_LIGHT_COLORS = ["#a855f7", "#22c55e", "#38bdf8", "#fb923c", "#67e8f9", "#f472b6"];

const SPEEDS = {
  type: 110,
  delete: 50,
  pause: 1200,
};

function getFullText(p: { prefix: string; highlight: string; suffix: string }) {
  return p.prefix + p.highlight + p.suffix;
}

function lcpLength(a: string, b: string) {
  const len = Math.min(a.length, b.length);
  let i = 0;
  while (i < len && a[i] === b[i]) i++;
  return i;
}

export default function Home() {
  const { theme } = useTheme();
  const { dictionary, lang } = useI18n();
  const isDark = theme === "dark";
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<"default" | "link" | "text">("default");
  const showSpotlight = true;

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  const phrases = dictionary.hero.phrases;
  const currentPhrase = useMemo(() => phrases[loopNum % phrases.length], [phrases, loopNum]);
  const currentIndex = useMemo(() => loopNum % phrases.length, [phrases, loopNum]);
  const currentFullText = useMemo(() => getFullText(currentPhrase), [currentPhrase]);

  useEffect(() => {
    const fullText = getFullText(currentPhrase);
    const nextIndex = (loopNum + 1) % phrases.length;
    const nextPhrase = phrases[nextIndex];
    const nextFullText = getFullText(nextPhrase);
    const baselineLen = lcpLength(fullText, nextFullText);

    const handleTyping = () => {
      if (!isDeleting) {
        if (text !== fullText) {
          setText(fullText.substring(0, text.length + 1));
          setTypingSpeed(SPEEDS.type);
        } else {
          setTimeout(() => setIsDeleting(true), SPEEDS.pause);
        }
      } else {
        if (text.length > baselineLen) {
          setText(text.substring(0, text.length - 1));
          setTypingSpeed(SPEEDS.delete);
        } else {
          setIsDeleting(false);
          setLoopNum((prev) => prev + 1);
          setTypingSpeed(SPEEDS.type);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentPhrase, isDeleting, loopNum, phrases.length, text, typingSpeed]);

  useEffect(() => {
    setText("");
    setIsDeleting(false);
    setLoopNum(0);
  }, [lang]);

  useEffect(() => {
    const originalRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => {
      history.scrollRestoration = originalRestoration;
    };
  }, []);

  useEffect(() => {
    const detectInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest(interactiveSelector));
    };

    const detectText = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest(textSelector));
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
      if (detectText(event.target)) {
        setCursorVariant("text");
      } else {
        setCursorVariant(detectInteractive(event.target) ? "link" : "default");
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (detectText(event.target)) {
        setCursorVariant("text");
      } else {
        setCursorVariant(detectInteractive(event.target) ? "link" : "default");
      }
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (detectText(event.target)) {
        setCursorVariant("text");
      } else {
        setCursorVariant(detectInteractive(event.target) ? "link" : "default");
      }
    };
    const handlePointerCancel = () => setCursorVariant("default");

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerCancel, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, []);

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

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--mx", `${cursorPosition.x}px`);
    root.setProperty("--my", `${cursorPosition.y}px`);
  }, [cursorPosition]);

  const prefixLength = currentPhrase.prefix.length;
  const highlightLength = currentPhrase.highlight.length;
  const displayPrefix = text.substring(0, Math.min(prefixLength, text.length));
  const displayHighlight = text.substring(prefixLength, Math.min(prefixLength + highlightLength, text.length));
  const displaySuffix = text.substring(Math.min(prefixLength + highlightLength, text.length), text.length);
  const typedLen = text.length;
  const cursorInHighlight = typedLen > prefixLength && typedLen <= prefixLength + highlightLength;
  const isEndLine = !isDeleting && text === currentFullText;

  const colors = useMemo(
    () => ({
      word: isDark ? "#ffffff" : "#0f172a",
    }),
    [isDark],
  );

  const highlightColor = useMemo(
    () => (isDark ? colors.word : HIGHLIGHT_LIGHT_COLORS[currentIndex % HIGHLIGHT_LIGHT_COLORS.length]),
    [colors.word, currentIndex, isDark],
  );

  const enterLink = useCallback(() => setCursorVariant("link"), []);
  const leaveLink = useCallback(() => setCursorVariant("default"), []);

  const interactiveSelector =
    "a, button, [role='button'], input, textarea, select, summary, [data-cursor='pointer']";
  const textSelector = "input[type='text'], input[type='email'], input[type='search'], input[type='tel'], input[type='url'], input[type='password'], textarea, [contenteditable='true']";

  useParallax(16);

  return (
    <>
      <BackgroundGridSpotlight />
      <PersistentHeader enterLink={enterLink} leaveLink={leaveLink} />
      <SocialRail onEnter={enterLink} onLeave={leaveLink} />
      <SpotlightOverlay cursorPosition={cursorPosition} showSpotlight={showSpotlight} />

      <main className="relative z-[10] overflow-x-hidden">
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-6 lg:px-8">
          <div
            className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono transition-opacity duration-200 text-center leading-tight md:leading-snug"
            key={`hero-${lang}`}
          >
            <span style={{ color: colors.word, opacity: 0.75 }}>{displayPrefix}</span>
            <span
              style={{
                color: currentIndex === phrases.length - 1 ? colors.word : highlightColor,
                opacity: 1,
                filter: currentIndex === phrases.length - 1 ? "none" : "brightness(1.06)",
                textShadow:
                  currentIndex === phrases.length - 1
                    ? "none"
                    : isDark
                    ? "0 0 16px rgba(255,255,255,0.28)"
                    : "0 0 12px rgba(15,23,42,0.22)",
                transition: "opacity 200ms ease, text-shadow 200ms ease",
              }}
            >
              {displayHighlight}
            </span>
            <span style={{ color: colors.word, opacity: 0.75 }}>{displaySuffix}</span>
            <span
              className={isEndLine ? "cursor-blink" : ""}
              style={{
                color:
                  currentIndex === phrases.length - 1
                    ? colors.word
                    : cursorInHighlight
                    ? highlightColor
                    : colors.word,
              }}
            >
              |
            </span>
          </div>
        </section>

        <AboutSection />
        <BetweenSectionsCta onEnterLink={enterLink} onLeaveLink={leaveLink} />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      <div
        className="fixed pointer-events-none z-[25000]"
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
        ) : cursorVariant === "link" ? (
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
              boxShadow: isDark ? "0 0 10px rgba(255,255,255,0.35)" : "0 0 8px rgba(15,23,42,0.22)",
            }}
          />
        )}
      </div>
    </>
  );
}
