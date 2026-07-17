"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { Locale } from "@/domain/i18n";

/**
 * A walk-through of what the retrieval model does with one query frame.
 *
 * The images are real held-out query frames from the project's own dataset
 * (data/processed_frames, recorded by the team) and the label space is the
 * real one from dataset.csv: floor3..floor23 plus basement0/2/3/4 = 25
 * classes. The Top-5 distributions are ILLUSTRATIVE — shaped to match the
 * model's measured behaviour (52.8% Top-1, errors landing on adjacent floors)
 * rather than copied from a specific eval row. Swap in real rows from
 * outputs/results/evaluation.json once it is regenerated.
 */

type Sample = {
  id: string;
  src: string;
  /** Ground-truth label exactly as it appears in dataset.csv. */
  truth: string;
  areaEN: string;
  areaES: string;
  predictions: Array<{ label: string; pct: number }>;
};

const SAMPLES: Sample[] = [
  {
    id: "hallway",
    src: "/images/projects/ie-tower/q-hallway.webp",
    truth: "floor10",
    areaEN: "Hallway",
    areaES: "Pasillo",
    // The classic failure mode: right zone, neighbouring floor.
    predictions: [
      { label: "floor10", pct: 34.1 },
      { label: "floor11", pct: 21.7 },
      { label: "floor9", pct: 16.2 },
      { label: "floor12", pct: 9.4 },
      { label: "floor17", pct: 5.1 },
    ],
  },
  {
    id: "central",
    src: "/images/projects/ie-tower/q-central.webp",
    truth: "floor10",
    areaEN: "Central space",
    areaES: "Espacio central",
    // Distinctive furniture and artwork: an easy, confident hit.
    predictions: [
      { label: "floor10", pct: 71.3 },
      { label: "floor9", pct: 8.8 },
      { label: "floor11", pct: 6.2 },
      { label: "floor22", pct: 3.9 },
      { label: "floor6", pct: 2.4 },
    ],
  },
  {
    id: "stairs",
    src: "/images/projects/ie-tower/q-stairs.webp",
    truth: "floor10",
    areaEN: "Stairwell",
    areaES: "Escalera",
    // Stairwells are identical by design: the Top-1 misses by one floor.
    predictions: [
      { label: "floor13", pct: 18.4 },
      { label: "floor10", pct: 17.9 },
      { label: "floor14", pct: 15.1 },
      { label: "floor11", pct: 12.6 },
      { label: "floor9", pct: 10.2 },
    ],
  },
  {
    id: "auditorium",
    src: "/images/projects/ie-tower/q-auditorium.webp",
    truth: "basement4",
    areaEN: "Auditorium",
    areaES: "Auditorio",
    // A unique room: the model is never in doubt.
    predictions: [
      { label: "basement4", pct: 88.6 },
      { label: "basement3", pct: 4.1 },
      { label: "basement2", pct: 2.7 },
      { label: "floor3", pct: 1.5 },
      { label: "basement0", pct: 1.1 },
    ],
  },
];

/** Renders a dataset label the way a person reads it. */
function pretty(label: string, es: boolean) {
  if (label.startsWith("basement")) {
    const n = label.replace("basement", "");
    return es ? `Sótano ${n}` : `Basement ${n}`;
  }
  const n = label.replace("floor", "");
  return es ? `Planta ${n}` : `Floor ${n}`;
}

type Props = { isDark: boolean; lang: Locale };

export default function IeTowerSimulator({ isDark, lang }: Props) {
  const es = lang === "es";
  const [active, setActive] = useState(0);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const sample = SAMPLES[active];

  const run = () => {
    setState("running");
    // Long enough to read as work happening, short enough not to annoy.
    setTimeout(() => setState("done"), 1100);
  };

  const pick = (i: number) => {
    setActive(i);
    setState("idle");
  };

  const correct = state === "done" && sample.predictions[0].label === sample.truth;

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base md:text-lg font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {es ? "Pásale una foto al modelo" : "Hand the model a photo"}
          </h3>
          <p className="text-[11.5px]" style={{ color: isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)" }}>
            {es
              ? "Frames reales del dataset, apartados de la galería para validar."
              : "Real dataset frames, held out from the gallery for validation."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={run}
            disabled={state === "running"}
            data-cursor="pointer"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.03] disabled:opacity-60"
            style={{ background: isDark ? "#f8fafc" : "#0f172a", color: isDark ? "#0f172a" : "#f8fafc", cursor: "none" }}
          >
            {state === "running" ? (es ? "Buscando…" : "Searching…") : es ? "Ejecutar" : "Run inference"}
            <Play size={14} aria-hidden />
          </button>
          {state === "done" && (
            <button
              type="button"
              onClick={() => setState("idle")}
              data-cursor="pointer"
              aria-label={es ? "Reiniciar" : "Reset"}
              className="glass-tile inline-flex items-center justify-center rounded-full h-9 w-9"
              style={{ cursor: "none" }}
            >
              <RotateCcw size={14} aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Sample picker */}
      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(i)}
            data-cursor="pointer"
            aria-pressed={i === active}
            className="rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors"
            style={{
              cursor: "none",
              border:
                i === active
                  ? `1px solid ${isDark ? "#f8fafc" : "#0f172a"}`
                  : isDark
                  ? "1px solid rgba(255,255,255,0.16)"
                  : "1px solid rgba(15,23,42,0.14)",
              background: i === active ? (isDark ? "#f8fafc" : "#0f172a") : "transparent",
              color:
                i === active
                  ? isDark
                    ? "#0f172a"
                    : "#f8fafc"
                  : isDark
                  ? "rgba(226,232,240,0.9)"
                  : "rgba(15,23,42,0.8)",
            }}
          >
            {es ? s.areaES : s.areaEN}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        {/* Query */}
        <div className="flex flex-col gap-2">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)" }}
          >
            {es ? "Consulta" : "Query"}
          </span>
          <div className={`vpr-query relative overflow-hidden rounded-xl ${state === "running" ? "is-scanning" : ""}`}>
            <img
              src={sample.src}
              alt={
                es
                  ? `${sample.areaES} en ${pretty(sample.truth, true)} de la torre`
                  : `${sample.areaEN} on ${pretty(sample.truth, false)} of the tower`
              }
              width={760}
              height={428}
              loading="lazy"
              className="w-full h-auto block"
            />
            <span className="vpr-scanline" aria-hidden />
          </div>
          <span className="text-[10.5px]" style={{ color: isDark ? "rgba(148,163,184,0.75)" : "rgba(71,85,105,0.75)" }}>
            {es ? "Verdad" : "Truth"}: <strong>{pretty(sample.truth, es)}</strong>
          </span>
        </div>

        {/* Prediction */}
        <div className="flex flex-col gap-2">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)" }}
          >
            {es ? "Top-5 recuperado" : "Retrieved Top-5"}
          </span>
          <div className="flex flex-col gap-1.5 min-h-[190px]" aria-live="polite">
            {state !== "done" ? (
              <p className="text-[12px] my-auto" style={{ color: isDark ? "rgba(148,163,184,0.7)" : "rgba(71,85,105,0.7)" }}>
                {state === "running"
                  ? es
                    ? "Comparando contra 2.373 frames de galería…"
                    : "Matching against 2,373 gallery frames…"
                  : es
                  ? "Pulsa Ejecutar para ver qué plantas vota el índice."
                  : "Hit Run to see which floors the index votes for."}
              </p>
            ) : (
              <>
                {sample.predictions.map((p, i) => {
                  const hit = p.label === sample.truth;
                  return (
                    <div key={p.label} className="vpr-row flex items-center gap-2" style={{ ["--d" as string]: `${i * 70}ms` }}>
                      <span
                        className="text-[11.5px] w-[86px] shrink-0 font-medium"
                        style={{ color: hit ? "#22d3ee" : isDark ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.8)" }}
                      >
                        {pretty(p.label, es)}
                      </span>
                      <span
                        className="flex-1 h-[6px] rounded-full overflow-hidden"
                        style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)" }}
                      >
                        <span
                          className="vpr-bar block h-full rounded-full"
                          style={{
                            ["--w" as string]: `${Math.round(p.pct)}%`,
                            background: hit ? "#22d3ee" : isDark ? "rgba(226,232,240,0.42)" : "rgba(15,23,42,0.32)",
                            ["--d" as string]: `${i * 70 + 90}ms`,
                          }}
                        />
                      </span>
                      <span
                        className="font-mono text-[10.5px] w-[42px] text-right tabular-nums"
                        style={{ color: isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)" }}
                      >
                        {p.pct.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
                <p
                  className="text-[11px] mt-1.5"
                  style={{ color: correct ? "#22d3ee" : isDark ? "rgba(251,146,60,0.95)" : "rgba(180,83,9,0.95)" }}
                >
                  {correct
                    ? es
                      ? "✓ Top-1 correcto."
                      : "✓ Top-1 correct."
                    : es
                    ? "✗ Falla el Top-1 — pero la verdad está en el Top-5. Ese es el error típico: planta vecina."
                    : "✗ Top-1 miss — but the truth is in the Top-5. That's the typical error: a neighbouring floor."}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-[10px] leading-relaxed" style={{ color: isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)" }}>
        {es
          ? "Fotogramas reales del dataset del proyecto; los porcentajes ilustran el comportamiento medido del modelo, no una fila concreta de la evaluación."
          : "Real frames from the project's dataset; the percentages illustrate the model's measured behaviour rather than one specific eval row."}
      </p>
    </div>
  );
}
