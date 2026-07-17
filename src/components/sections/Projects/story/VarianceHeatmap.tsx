"use client";

import type { Locale } from "@/domain/i18n";

type Row = { label: string; labelES: string; values: number[] };

type Props = {
  /** One row per engagement metric; each value is variance reduction % at K=5,10,20. */
  rows: Row[];
  ks: number[];
  isDark: boolean;
  lang: Locale;
};

/**
 * The result, drawn to scale: variance reduction (%) of semantic neighborhoods
 * vs random baselines, one cell per engagement metric × neighborhood size.
 *
 * Every number is the author's own published run (README table): each cell is
 * positive, and all twelve Mann-Whitney U tests behind them return p ≈ 0. The
 * green→red scale is diverging on "how much tighter than chance", so the eye
 * reads the decay left-to-right (tighter neighborhoods at K=5 → looser at K=20)
 * the same way the paper's heatmap does. Rendered natively so it themes with
 * the page instead of a pasted matplotlib PNG.
 */
export default function VarianceHeatmap({ rows, ks, isDark, lang }: Props) {
  const es = lang === "es";
  const all = rows.flatMap((r) => r.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);

  // Diverging red→amber→green on the observed range, muted for the surface.
  const cell = (v: number) => {
    const t = (v - lo) / (hi - lo || 1);
    const stops = [
      [239, 68, 68], // red  (least reduction)
      [245, 158, 11], // amber
      [34, 197, 94], // green (most reduction)
    ];
    const seg = t < 0.5 ? 0 : 1;
    const f = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
    const [a, b] = [stops[seg], stops[seg + 1]];
    const rgb = a.map((c, i) => Math.round(c + (b[i] - c) * f));
    const alpha = isDark ? 0.5 : 0.72;
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  };

  const muted = isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)";

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `92px repeat(${ks.length}, 1fr)` }}>
        {/* header row */}
        <span aria-hidden />
        {ks.map((k) => (
          <span
            key={k}
            className="font-mono text-[10.5px] text-center uppercase tracking-[0.1em]"
            style={{ color: muted }}
          >
            K={k}
          </span>
        ))}

        {rows.map((row, ri) => (
          <div key={row.label} className="contents">
            <span
              className="text-[11px] flex items-center justify-end pr-1 font-medium"
              style={{ color: isDark ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.8)" }}
            >
              {es ? row.labelES : row.label}
            </span>
            {row.values.map((v, ci) => (
              <div
                key={ci}
                className="tower-band rounded-md flex items-center justify-center py-2.5 tabular-nums font-mono text-[13px] font-semibold"
                style={{
                  background: cell(v),
                  color: isDark ? "#0b1120" : "#0b1120",
                  ["--d" as string]: `${(ri * ks.length + ci) * 45}ms`,
                }}
              >
                {v.toFixed(1)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="font-mono text-[10.5px]" style={{ color: muted }}>
        {es
          ? "% menos varianza que grupos aleatorios · las 12 pruebas: p ≈ 0"
          : "% lower variance than random groups · all 12 tests: p ≈ 0"}
      </p>
    </div>
  );
}
