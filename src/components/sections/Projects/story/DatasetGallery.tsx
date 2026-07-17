"use client";

/* eslint-disable @next/next/no-img-element */
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
 * A mosaic of real gallery frames that pans as the chapter scrolls.
 *
 * Tiles are laid out on a dense 3-row grid where every 4th and 7th frame takes
 * a double cell, so the packing breaks up the grid the way an Apple Photos
 * wall does instead of reading as a filmstrip. The pan is driven by the page's
 * own scroll position (animation-timeline: view()), not by dragging: the
 * visitor moves through it by scrolling, and the motion is a composited
 * transform, so it costs nothing per frame.
 */
export default function DatasetGallery({ labels, isDark, lang }: Props) {
  const es = lang === "es";

  return (
    <div className="dataset-mosaic-wrap">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)" }}
      >
        {es ? `${labels.length} de 2.877 frames` : `${labels.length} of 2,877 frames`}
      </span>

      {/* --mosaic-view hands the viewport's own width to the pan keyframe, so
          the slide stops exactly when the last tile is flush. */}
      <div
        className="dataset-mosaic-viewport"
        role="region"
        aria-label={es ? "Muestra del dataset, una imagen por planta" : "Dataset sample, one frame per floor"}
        style={{ ["--mosaic-view" as string]: "100cqw", containerType: "inline-size" }}
      >
        <div className="dataset-mosaic">
          {labels.map((label, i) => (
            <figure
              key={label}
              className="dataset-tile"
              data-wide={i % 4 === 0 ? "true" : undefined}
              data-tall={i % 7 === 3 ? "true" : undefined}
            >
              <img
                src={`/images/projects/ie-tower/gallery/${label}.webp`}
                alt={es ? `Fotograma en ${pretty(label, true)}` : `Frame on ${pretty(label, false)}`}
                width={420}
                height={236}
                loading="lazy"
                draggable={false}
              />
              <figcaption className="dataset-tile-cap font-mono">{pretty(label, es)}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <p className="text-[10px]" style={{ color: isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)" }}>
        {es
          ? "El mosaico avanza con el scroll. Una imagen por clase — busca la diferencia entre la 12 y la 13."
          : "The mosaic pans as you scroll. One frame per class — try telling floor 12 from floor 13."}
      </p>
    </div>
  );
}
