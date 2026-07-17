"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type StoryChapterProps = {
  /** Two-digit beat number shown in the rail. */
  index: string;
  eyebrow: string;
  /** Anchor, so a chapter can be jumped to (e.g. skipping to the demo). */
  id?: string;
  children: ReactNode;
};

/**
 * One beat of a project story. The visual sticks to the viewport while the
 * prose scrolls past it, then releases at the end of the chapter — the classic
 * scrollytelling rhythm, done with position:sticky rather than scroll handlers.
 */
export function StoryChapter({ index, eyebrow, id, children }: StoryChapterProps) {
  return (
    <section id={id} className="story-chapter relative w-full">
      <div className="story-rail" aria-hidden>
        <span className="story-rail-num">{index}</span>
        <span className="story-rail-line" />
        <span className="story-rail-label">{eyebrow}</span>
      </div>
      {children}
    </section>
  );
}

/** Sticky half: holds the visual while its sibling prose scrolls. */
export function StoryStage({ children }: { children: ReactNode }) {
  return <div className="story-stage">{children}</div>;
}

/** The scrolling half: narrative blocks that reveal as they enter. */
export function StoryProse({ children }: { children: ReactNode }) {
  return <div className="story-prose">{children}</div>;
}

type StoryBeatProps = {
  title?: string;
  children: ReactNode;
};

/** A single paragraph-sized beat that reveals on entry. */
export function StoryBeat({ title, children }: StoryBeatProps) {
  return (
    <div className="story-beat">
      {title && <h3 className="story-beat-title">{title}</h3>}
      <div className="story-beat-body">{children}</div>
    </div>
  );
}

type StatProps = {
  value: string;
  label: string;
  accent?: boolean;
};

/** Splits "2,877" or "52.8%" into a number and whatever wraps it. */
function parseValue(value: string) {
  const match = value.match(/^([^\d-]*)([\d.,]+)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  const grouped = digits.includes(",");
  const n = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  return { prefix, suffix, n, decimals, grouped };
}

function format(n: number, decimals: number, grouped: boolean) {
  const s = n.toFixed(decimals);
  if (!grouped) return s;
  const [int, dec] = s.split(".");
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dec ? `.${dec}` : "");
}

/**
 * A headline number that counts up once, when it scrolls into view.
 *
 * The final value is rendered as plain text on the server, so it is correct
 * before hydration, copyable and indexable; the count-up only overwrites it
 * while it runs, then hands the text back. Reduced motion skips straight to
 * the number.
 *
 * The whole animation lives in a ref-guarded effect keyed on `value` (a
 * string). Depending on a parsed *object* here would re-run the effect on
 * every tick — cancelling and restarting the count forever, so it never
 * landed on the number.
 */
export function StoryStat({ value, label, accent }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parsed = parseValue(value);
    if (!parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;
    const DURATION = 1000;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          // Fast out of the gate, gentle landing.
          const eased = 1 - Math.pow(1 - t, 3);
          if (t < 1) {
            setDisplay(format(parsed.n * eased, parsed.decimals, parsed.grouped));
            raf = requestAnimationFrame(tick);
          } else {
            // Land on the real string, not a re-formatted float.
            setDisplay(null);
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const parsed = display !== null ? parseValue(value) : null;

  return (
    <div className="story-stat" data-accent={accent ? "true" : undefined} ref={ref}>
      <span className="story-stat-value tabular-nums">
        {parsed ? `${parsed.prefix}${display}${parsed.suffix}` : value}
      </span>
      <span className="story-stat-label">{label}</span>
    </div>
  );
}
