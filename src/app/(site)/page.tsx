"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import SiteChrome from "@/components/layout/SiteChrome";
import BetweenSectionsCta from "@/components/sections/Common/BetweenSectionsCta";
import { AboutSection } from "@/components/sections/About";
import ContactInvite from "@/components/sections/Contact/ContactInvite";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { CustomCursorDot, useCustomCursor } from "@/components/ui/CustomCursor";
import { useParallax } from "@/hooks/useParallax";

const SkillsSection = dynamic(() => import("@/components/sections/Skills").then((mod) => mod.SkillsSection), {
  ssr: true,
  loading: () => null,
});

const ProjectsSection = dynamic(() => import("@/components/sections/Projects").then((mod) => mod.ProjectsSection), {
  ssr: true,
  loading: () => null,
});

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
  const showSpotlight = true;
  const { enableCustomCursor, cursorVariant, enterLink, leaveLink } = useCustomCursor();

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
      } else if (text.length > baselineLen) {
        setText(text.substring(0, text.length - 1));
        setTypingSpeed(SPEEDS.delete);
      } else {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
        setTypingSpeed(SPEEDS.type);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentPhrase, isDeleting, loopNum, phrases, text, typingSpeed]);

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

  useParallax(16);

  return (
    <>
      <SiteChrome
        showSpotlight={enableCustomCursor && showSpotlight}
        onEnterLink={enterLink}
        onLeaveLink={leaveLink}
        mainClassName="relative z-[10] overflow-x-hidden"
      >
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-6 lg:px-8"
        >
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
        <ContactInvite enterLink={enterLink} leaveLink={leaveLink} />
      </SiteChrome>

      {enableCustomCursor && <CustomCursorDot variant={cursorVariant} isDark={isDark} />}
    </>
  );
}
