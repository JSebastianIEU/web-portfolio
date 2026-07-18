"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useSyncExternalStore, type MouseEvent } from "react";
import { ArrowDown, Download } from "lucide-react";
import SiteChrome from "@/components/layout/SiteChrome";
import BetweenSectionsCta from "@/components/sections/Common/BetweenSectionsCta";
import { AboutSection } from "@/components/sections/About";
import { ExperienceSection } from "@/components/sections/Experience";
import ContactInvite from "@/components/sections/Contact/ContactInvite";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { CustomCursorDot, useCustomCursor } from "@/components/ui/CustomCursor";
import TransitionLink from "@/components/ui/TransitionLink";
import { cvFiles } from "@/data/contactCopy";
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

// Reactive "prefers-reduced-motion" read via an external store (lint-clean; no
// setState-in-effect). SSR reports false, the client resolves the real value.
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReducedSnapshot = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedServerSnapshot = () => false;

export default function Home() {
  const { theme } = useTheme();
  const { dictionary, lang } = useI18n();
  const isDark = theme === "dark";
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  // Under reduced motion the typewriter freezes on the first phrase (no loop,
  // no blinking caret) — the static eyebrow + tagline carry the message.
  const reduced = useSyncExternalStore(subscribeReduced, getReducedSnapshot, getReducedServerSnapshot);
  const showSpotlight = true;
  const { enableCustomCursor, cursorVariant, enterLink, leaveLink } = useCustomCursor();

  const phrases = dictionary.hero.phrases;
  const currentPhrase = useMemo(() => phrases[loopNum % phrases.length], [phrases, loopNum]);
  const currentIndex = useMemo(() => loopNum % phrases.length, [phrases, loopNum]);
  const currentFullText = useMemo(() => getFullText(currentPhrase), [currentPhrase]);
  // The widest line the typewriter can ever render. Used as an invisible
  // spacer so a phrase wrapping to a second line never shoves the tagline and
  // CTAs down. The hero is monospaced, so longest-by-characters is also widest.
  const longestPhrase = useMemo(
    () => phrases.reduce((longest, p) => (getFullText(p).length > longest.length ? getFullText(p) : longest), ""),
    [phrases],
  );

  useEffect(() => {
    if (reduced) return; // no typing loop under reduced motion
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
  }, [currentPhrase, isDeleting, loopNum, phrases, reduced, text, typingSpeed]);

  // Reduced motion shows the first phrase in full; otherwise the live typed text.
  const shown = reduced ? currentFullText : text;
  const prefixLength = currentPhrase.prefix.length;
  const highlightLength = currentPhrase.highlight.length;
  const displayPrefix = shown.substring(0, Math.min(prefixLength, shown.length));
  const displayHighlight = shown.substring(prefixLength, Math.min(prefixLength + highlightLength, shown.length));
  const displaySuffix = shown.substring(Math.min(prefixLength + highlightLength, shown.length), shown.length);
  const typedLen = shown.length;
  const cursorInHighlight = typedLen > prefixLength && typedLen <= prefixLength + highlightLength;
  const isEndLine = !reduced && !isDeleting && shown === currentFullText;

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

  const muted = isDark ? "rgba(226,232,240,0.72)" : "rgba(15,23,42,0.62)";
  const cvHref = `/documents/${encodeURIComponent(cvFiles[lang] ?? cvFiles.en)}`;
  const pillOutline = {
    border: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(15,23,42,0.2)",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
    color: colors.word,
    cursor: "none",
  } as const;

  const goToProjects = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("projects");
    if (!el) return; // no target → let the browser handle the #projects anchor
    e.preventDefault();
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#projects");
  };

  useParallax(16);

  return (
    <>
      <SiteChrome
        showSpotlight={enableCustomCursor && showSpotlight}
        onEnterLink={enterLink}
        onLeaveLink={leaveLink}
        mainClassName="relative z-[10] overflow-x-clip"
      >
        <section
          id="hero"
          className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-4 md:px-6 lg:px-8 py-24 md:py-20"
        >
          <div
            className="relative z-10 flex flex-col items-center text-center gap-5 md:gap-7 max-w-3xl"
            key={`hero-${lang}`}
          >
            {/* Eyebrow: instant identity — name + role, so a 30s scan gets it
                without waiting for the typewriter to cycle to the name. */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-base md:text-lg font-semibold tracking-tight" style={{ color: colors.word }}>
                {dictionary.hero.name}
              </span>
              <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.18em]" style={{ color: muted }}>
                {dictionary.hero.role}
              </span>
            </div>

            {/* Animated headline — the typewriter, kept as the flourish.
                The box is sized by an invisible copy of the longest phrase, so
                the line count (and everything below it) never moves as it types. */}
            <div className="relative w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono leading-tight md:leading-snug">
              <span aria-hidden className="invisible select-none block">{longestPhrase}|</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="block transition-opacity duration-200">
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
                </span>
              </span>
            </div>

            {/* Positioning subline with proof — lands the substance instantly. */}
            <p className="text-sm md:text-base max-w-[46ch] leading-relaxed" style={{ color: muted }}>
              {dictionary.hero.tagline}
            </p>

            {/* CTAs: primary drives to the proof (#projects); then contact + CV. */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <a
                href="#projects"
                onClick={goToProjects}
                data-cursor="pointer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold transition-transform hover:scale-[1.04]"
                style={{ background: isDark ? "#f8fafc" : "#0f172a", color: isDark ? "#0f172a" : "#f8fafc", cursor: "none" }}
              >
                {dictionary.hero.ctaProjects}
                <ArrowDown size={17} aria-hidden />
              </a>
              <TransitionLink
                href="/contact"
                data-cursor="pointer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm md:text-base font-semibold transition-transform hover:scale-[1.04]"
                style={pillOutline}
              >
                {dictionary.hero.ctaContact}
              </TransitionLink>
              <a
                href={cvHref}
                download
                data-cursor="pointer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm md:text-base font-semibold transition-transform hover:scale-[1.04]"
                style={pillOutline}
              >
                {dictionary.cta.downloadCv}
                <Download size={16} aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <AboutSection />
        <ExperienceSection />
        <BetweenSectionsCta onEnterLink={enterLink} onLeaveLink={leaveLink} />
        <SkillsSection />
        <ProjectsSection />
        <ContactInvite enterLink={enterLink} leaveLink={leaveLink} />
      </SiteChrome>

      {enableCustomCursor && <CustomCursorDot variant={cursorVariant} isDark={isDark} />}
    </>
  );
}
