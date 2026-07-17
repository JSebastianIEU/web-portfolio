"use client";

import type { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

const KEY = "projects:return";

type ReturnPoint = { y: number; slug: string };

/**
 * Opening a project is a two-way trip: the card grows into its story page, and
 * Back drops you exactly where you were in the projects list.
 *
 * Next's App Router already restores scroll on browser Back, but a card can be
 * opened from the homepage *or* from /projects, and the story page needs an
 * explicit in-page Back button too — so we record the exact y ourselves and
 * replay it, rather than trusting history to have the right entry.
 */
const CAROUSEL_KEY = "projects:carousel";

export function openProject(router: Router, slug: string) {
  try {
    const point: ReturnPoint = { y: window.scrollY, slug };
    sessionStorage.setItem(KEY, JSON.stringify(point));
    // On mobile the open-source projects live in a horizontal carousel that
    // resets to its start on remount — so remember its scroll too, or Back
    // lands on the first card (QR Forge) instead of the one you tapped.
    const car = document.querySelector<HTMLElement>("[data-project-carousel]");
    if (car) sessionStorage.setItem(CAROUSEL_KEY, String(car.scrollLeft));
  } catch {
    // Private mode / storage disabled: navigation still works, Back just
    // falls back to the browser's own restoration.
  }
  morphTo(() => router.push(`/projects/${slug}`));
}

/**
 * The carousel's scroll to restore on the next mount, if we're coming back.
 *
 * Read-only on purpose: the projects section mounts the carousel twice (a
 * responsive mobile/desktop pair), and only one is laid out at a time. If this
 * *removed* the value, whichever instance mounted first — often the hidden one
 * with no layout — would swallow the restore and the visible carousel would
 * fall back to its default centre. So we peek here and let the instance that
 * actually applies it call clearCarouselScroll().
 */
export function peekCarouselScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(CAROUSEL_KEY);
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Drop the pending carousel restore once a laid-out carousel has applied it. */
export function clearCarouselScroll() {
  try {
    sessionStorage.removeItem(CAROUSEL_KEY);
  } catch {
    /* nothing to clean up */
  }
}

/** Where the visitor came from, if they arrived by clicking a card. */
export function consumeReturnPoint(slug: string): number | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const point = JSON.parse(raw) as ReturnPoint;
    if (point.slug !== slug) return null;
    return typeof point.y === "number" ? point.y : null;
  } catch {
    return null;
  }
}

export function clearReturnPoint() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clean up */
  }
}

/**
 * Runs a navigation inside a View Transition when the browser supports one.
 * Falls back to a plain navigation everywhere else and under reduced motion —
 * the trip still works, it just doesn't animate.
 */
export function morphTo(navigate: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> };
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduced) {
    navigate();
    return;
  }
  doc.startViewTransition(() => {
    navigate();
    // Give the route a beat to commit before the "new" snapshot is taken.
    return new Promise<void>((resolve) => setTimeout(resolve, 240));
  });
}
