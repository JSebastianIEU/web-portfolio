"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import type { Locale } from "@/domain/i18n";

type Props = {
  /** Dataset labels, one gallery frame each. */
  labels: string[];
  isDark: boolean;
  lang: Locale;
};

function pretty(label: string, es: boolean) {
  if (label.startsWith("basement")) return `${es ? "Sótano" : "Basement"} ${label.replace("basement", "")}`;
  return `${es ? "Planta" : "Floor"} ${label.replace("floor", "")}`;
}

/**
 * A draggable strip of real gallery frames — one per class, so 25 of the
 * 2,877. Enough to feel the scale and the sameness without shipping the
 * dataset.
 *
 * Drag is implemented on top of native overflow scrolling rather than
 * replacing it: the pointer handlers only add click-and-drag for mice, so
 * touch panning, trackpads, wheel and keyboard all keep working for free.
 */
export default function DatasetGallery({ labels, isDark, lang }: Props) {
  const es = lang === "es";
  const scroller = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  // `dragging` drives the cursor/snap classes, so it has to be state — the ref
  // holds the per-move numbers that must not trigger a re-render.
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    // Mouse only: touch already pans natively, and hijacking it breaks scroll.
    if (e.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: scroller.current.scrollLeft };
    setDragging(true);
    scroller.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !scroller.current) return;
    const dx = e.clientX - drag.current.startX;
    scroller.current.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    scroller.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between gap-3">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)" }}
        >
          {es ? `${labels.length} de 2.877 frames` : `${labels.length} of 2,877 frames`}
        </span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          data-cursor="pointer"
          className="glass-tile inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
          style={{ cursor: "none", color: isDark ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.8)" }}
          aria-expanded={expanded}
        >
          {expanded ? <Minimize2 size={11} aria-hidden /> : <Maximize2 size={11} aria-hidden />}
          {expanded ? (es ? "Contraer" : "Collapse") : es ? "Expandir" : "Expand"}
        </button>
      </div>

      <div
        ref={scroller}
        className={`dataset-strip no-scrollbar ${expanded ? "is-expanded" : ""} ${dragging ? "is-dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-label={es ? "Muestra del dataset, una imagen por planta" : "Dataset sample, one frame per floor"}
        tabIndex={0}
      >
        {labels.map((label, i) => (
          <figure
            key={label}
            className="dataset-frame"
            style={{ ["--d" as string]: `${Math.min(i, 12) * 45}ms` }}
          >
            <img
              src={`/images/projects/ie-tower/gallery/${label}.webp`}
              alt={
                es
                  ? `Fotograma de la galería en ${pretty(label, true)}`
                  : `Gallery frame on ${pretty(label, false)}`
              }
              width={420}
              height={236}
              loading="lazy"
              draggable={false}
            />
            <figcaption
              className="font-mono text-[9.5px] mt-1"
              style={{ color: isDark ? "rgba(148,163,184,0.75)" : "rgba(71,85,105,0.75)" }}
            >
              {pretty(label, es)}
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="text-[10px]" style={{ color: isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)" }}>
        {es
          ? "Arrastra para recorrer. Una imagen por clase — busca la diferencia entre la 12 y la 13."
          : "Drag to pan. One frame per class — try telling floor 12 from floor 13."}
      </p>
    </div>
  );
}
