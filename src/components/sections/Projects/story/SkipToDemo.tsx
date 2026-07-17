"use client";

import { Play } from "lucide-react";

type Props = {
  /** Id of the chapter to jump to. */
  target: string;
  label: string;
  isDark: boolean;
};

/**
 * An escape hatch for visitors who came to poke at the thing, not to read
 * about it: jumps straight to the interactive demo.
 *
 * It is a real anchor, so it is keyboard reachable, shows its destination on
 * hover and survives without JS. The scroll is smoothed by the document's own
 * scroll-behavior; we only intercept to honour reduced motion, where an
 * instant jump is the correct behaviour.
 */
export default function SkipToDemo({ target, label, isDark }: Props) {
  const jump = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(target);
    if (!el) return; // let the browser handle the anchor
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    // Keep the URL shareable and the back button meaningful.
    history.replaceState(null, "", `#${target}`);
  };

  return (
    <a
      href={`#${target}`}
      onClick={jump}
      data-cursor="pointer"
      className="skip-to-demo inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold self-start transition-transform hover:scale-[1.03]"
      style={{
        background: isDark ? "#f8fafc" : "#0f172a",
        color: isDark ? "#0f172a" : "#f8fafc",
        cursor: "none",
      }}
    >
      <Play size={13} aria-hidden />
      {label}
    </a>
  );
}
