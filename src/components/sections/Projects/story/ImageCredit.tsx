"use client";

/* eslint-disable @next/next/no-img-element */
import { Info } from "lucide-react";
import type { ReactNode } from "react";

export type Credit = {
  /** Who made the work (architect, photographer, illustrator). */
  author: string;
  /** Where it came from, shown as the link text. */
  source: string;
  href: string;
  /** Optional rights line, e.g. "All rights reserved". */
  rights?: string;
};

type Props = {
  credit: Credit;
  children: ReactNode;
  isDark: boolean;
  /** Localized "Image by" prefix. */
  label: string;
  className?: string;
};

/**
 * Wraps third-party media with a persistent, machine-readable credit.
 *
 * The badge is always in the DOM (screen readers and no-hover devices get it
 * too) and rises into view on hover/focus. Attribution is a courtesy, not a
 * licence: only wrap media you actually have the right to publish.
 */
export default function CreditedMedia({ credit, children, isDark, label, className }: Props) {
  return (
    <figure className={`credited relative overflow-hidden rounded-xl m-0 ${className ?? ""}`}>
      {children}

      <figcaption
        className="credited-badge absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-3 py-2 text-[10.5px] leading-tight"
        style={{
          background: isDark
            ? "linear-gradient(to top, rgba(2,4,10,0.92), rgba(2,4,10,0))"
            : "linear-gradient(to top, rgba(15,23,42,0.86), rgba(15,23,42,0))",
          color: "rgba(248,250,252,0.92)",
        }}
      >
        <Info size={11} aria-hidden className="shrink-0" />
        <span className="truncate">
          {label} <strong className="font-semibold">{credit.author}</strong>
          {credit.rights ? ` · ${credit.rights}` : ""} ·{" "}
          <a
            href={credit.href}
            target="_blank"
            rel="noreferrer nofollow"
            data-cursor="pointer"
            className="underline underline-offset-2"
            style={{ color: "inherit" }}
          >
            {credit.source}
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
