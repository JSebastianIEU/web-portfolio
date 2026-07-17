"use client";

import type { Locale } from "@/domain/i18n";

type Point = { x: number; y: number; e: number };

type Props = {
  /** Real UMAP points (x,y normalised 0..1); e=1 high engagement, e=0 low. */
  points: Point[];
  isDark: boolean;
  lang: Locale;
};

/**
 * A native redraw of the paper's UMAP figure: each dot is a real caption
 * projected to 2D from its 384-d SBERT embedding, coloured by whether its
 * engagement is above (rose) or below (sky) the corpus median.
 *
 * The point of the picture is the *absence* of a pattern — high and low
 * engagement are completely interleaved. The embedding captures what a caption
 * is about, but topic and engagement level do not line up, which is exactly why
 * no classifier beats ~60%. Coordinates are a seeded subsample of the author's
 * own run; drawn as SVG so it themes with the page.
 */
export default function EmbeddingScatter({ points, isDark, lang }: Props) {
  const es = lang === "es";
  const HIGH = "#fb7185"; // rose — above-median engagement
  const LOW = "#38bdf8"; // sky — below-median
  const pad = 6;
  const map = (v: number) => pad + v * (100 - 2 * pad);
  const muted = isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)";

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <div
        className="tk-scatter rounded-xl overflow-hidden"
        style={{
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.015)",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-auto block"
          role="img"
          aria-label={
            es
              ? "Proyección UMAP de embeddings de captions; el engagement alto y bajo aparecen totalmente mezclados"
              : "UMAP projection of caption embeddings; high and low engagement appear fully intermixed"
          }
        >
          {points.map((p, i) => (
            <circle
              key={i}
              cx={map(p.x)}
              cy={map(1 - p.y)}
              r={0.85}
              fill={p.e ? HIGH : LOW}
              fillOpacity={0.6}
            />
          ))}
        </svg>
      </div>
      <div className="flex items-center gap-4 font-mono text-[10.5px]" style={{ color: muted }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: HIGH }} />
          {es ? "engagement alto" : "high engagement"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: LOW }} />
          {es ? "bajo" : "low"}
        </span>
      </div>
    </div>
  );
}
