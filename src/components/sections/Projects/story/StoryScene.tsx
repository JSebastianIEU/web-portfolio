"use client";

import type { ReactNode } from "react";

type StoryChapterProps = {
  /** Two-digit beat number shown in the rail. */
  index: string;
  eyebrow: string;
  children: ReactNode;
};

/**
 * One beat of a project story. The visual sticks to the viewport while the
 * prose scrolls past it, then releases at the end of the chapter — the classic
 * scrollytelling rhythm, done with position:sticky rather than scroll handlers.
 */
export function StoryChapter({ index, eyebrow, children }: StoryChapterProps) {
  return (
    <section className="story-chapter relative w-full">
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

/**
 * A headline number. The digits are plain text (no JS counter) so they are
 * copyable, indexable and correct before hydration; only the reveal animates.
 */
export function StoryStat({ value, label, accent }: StatProps) {
  return (
    <div className="story-stat" data-accent={accent ? "true" : undefined}>
      <span className="story-stat-value tabular-nums">{value}</span>
      <span className="story-stat-label">{label}</span>
    </div>
  );
}
