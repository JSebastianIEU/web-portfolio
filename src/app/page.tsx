"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import BackgroundGridSpotlight from "@/components/BackgroundGridSpotlight";
import AboutSection from "@/components/AboutSection";
import SpotlightOverlay from "@/components/SpotlightOverlay";
import PersistentHeader from "@/components/PersistentHeader";

type Point = { x: number; y: number };

const PHRASES = [
  { prefix: "I build ", highlight: "intelligent systems", suffix: "" },
  { prefix: "I turn ideas into ", highlight: "real products", suffix: "" },
  { prefix: "I solve ", highlight: "problems", suffix: " through technology" },
  { prefix: "I care about ", highlight: "design and impact", suffix: "" },
  { prefix: "I'm ", highlight: "Sebastián Peña", suffix: "" },
];

const HIGHLIGHT_LIGHT_COLORS = [
  "#a855f7",
  "#22c55e",
  "#38bdf8",
  "#fb923c",
  "#67e8f9",
  "#f472b6",
];

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
  const isDark = theme === "dark";
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<"default" | "link">("default");
  const showSpotlight = true;

  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  const currentPhrase = useMemo(() => PHRASES[loopNum % PHRASES.length], [loopNum]);
  const currentIndex = useMemo(() => loopNum % PHRASES.length, [loopNum]);
  const currentFullText = useMemo(() => getFullText(currentPhrase), [currentPhrase]);

  useEffect(() => {
    const fullText = getFullText(currentPhrase);
    const nextIndex = (loopNum + 1) % PHRASES.length;
    const nextPhrase = PHRASES[nextIndex];
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
  }, [currentPhrase, isDeleting, loopNum, text, typingSpeed]);

  useEffect(() => {
    const handleMouseMove: (event: MouseEvent) => void = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
  const displayHighlight = text.substring(
    prefixLength,
    Math.min(prefixLength + highlightLength, text.length),
  );
  const displaySuffix = text.substring(
    Math.min(prefixLength + highlightLength, text.length),
    text.length,
  );
  const typedLen = text.length;
  const cursorInHighlight =
    typedLen > prefixLength && typedLen <= prefixLength + highlightLength;
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

  return (
    <>
      <BackgroundGridSpotlight />
      <PersistentHeader enterLink={enterLink} leaveLink={leaveLink} />
      <SpotlightOverlay cursorPosition={cursorPosition} showSpotlight={showSpotlight} />

      <main className="relative z-[10]" style={{ cursor: "none" }}>
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 text-5xl font-mono">
            <span style={{ color: colors.word, opacity: 0.75 }}>{displayPrefix}</span>
            <span
              style={{
                color: currentIndex === PHRASES.length - 1 ? colors.word : highlightColor,
                opacity: 1,
                filter: currentIndex === PHRASES.length - 1 ? "none" : "brightness(1.06)",
                textShadow:
                  currentIndex === PHRASES.length - 1
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
                  currentIndex === PHRASES.length - 1
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
    </>
  );
}
