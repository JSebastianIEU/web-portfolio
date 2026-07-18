"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type ProjectPreviewProps = {
  /** Screenshot of the page `href` points at. */
  src: string;
  href: string;
  /** Localized "Visit" label. */
  label: string;
  isDark: boolean;
};

/**
 * Live-site preview: a screenshot that blurs behind a subtle dot screen on
 * hover, revealing a "Visit" affordance. The blur is bounded to this element
 * and only runs on hover, so it never costs anything during scroll.
 *
 * Hidden from assistive tech on purpose: it duplicates the card's "Try it
 * live" CTA (same href), so exposing it would add a second tab stop and a
 * redundant entry in the screen-reader link list for the same destination.
 */
export default function ProjectPreview({ src, href, label, isDark }: ProjectPreviewProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="pointer"
      aria-hidden="true"
      tabIndex={-1}
      className="group/preview relative block overflow-hidden rounded-xl aspect-[16/9] w-full"
      style={{
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.10)",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)",
      }}
    >
      {/* The image is inset past the clip on every side so blur() samples real
          pixels at the frame edges instead of transparency — otherwise the
          border washes out. A 16px bleed covers blur(6px)'s ~2σ reach. */}
      <div className="absolute -inset-4">
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1023px) calc((100vw - 88px) * 0.42), (max-width: 1279px) 413px, (max-width: 1535px) 467px, 521px"
          className="preview-img object-cover object-top transition-[filter,transform] duration-300 ease-out group-hover/preview:blur-[6px] group-hover/preview:scale-105"
        />
      </div>

      {/* Dot screen — subtle translucent black dots layered over the blur. */}
      <div
        className="preview-overlay absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover/preview:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.42) 1px, transparent 1.2px), linear-gradient(0deg, rgba(0,0,0,0.28), rgba(0,0,0,0.28))",
          backgroundSize: "5px 5px, 100% 100%",
        }}
      />

      <div className="preview-overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover/preview:opacity-100">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            background: "rgba(255,255,255,0.94)",
            color: "#0f172a",
            boxShadow: "0 10px 30px -12px rgba(0,0,0,0.65)",
          }}
        >
          {label}
          <ArrowUpRight size={15} aria-hidden />
        </span>
      </div>
    </a>
  );
}
