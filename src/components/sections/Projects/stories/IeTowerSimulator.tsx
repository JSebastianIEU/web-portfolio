"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { Locale } from "@/domain/i18n";
import evalData from "@/data/ieTowerEval.json";

/**
 * A walk-through of what the retrieval model actually does with one query
 * frame — every number here is real.
 *
 * The images are held-out query frames from the project's own dataset. The
 * Top-5 rows in src/data/ieTowerEval.json were produced by running the real
 * pipeline (DINOv2 ViT-S/14 @ 518px, frozen) over the 2,373-frame gallery and
 * letting the 30 nearest neighbours vote by cosine similarity — the same
 * retrieval the FAISS Flat-IP index performs. That run reproduced the
 * project's published metrics exactly (51.39 / 70.44 / 56.08), so these
 * distributions are the model's own output, not an illustration.
 *
 * Re-measured on the face-blurred frames the repository now publishes. The
 * previous figures (52.78 / 72.02 / 57.72) came from the same pipeline over
 * the unblurred originals; blurring cost about 1.5 pp across every metric.
 * The hallway sample flipped from a hit to a near miss in the process — it is
 * left as it came out.
 */

type Sample = {
  id: string;
  src: string;
  /** Ground-truth label exactly as it appears in dataset.csv. */
  truth: string;
  areaEN: string;
  areaES: string;
  predictions: Array<{ label: string; pct: number }>;
  /** Cosine similarity of the single nearest gallery frame. */
  nnSim: number;
};

type EvalSample = { truth: string; top5: Array<{ label: string; pct: number }>; nnSim: number };
const REAL = evalData.samples as Record<string, EvalSample>;

/** Every frame the demo offers, in order. Six frames, each visually
    unambiguous. All predictions come from the real run; the labels here are
    only what to call each area in the UI. */
const AREAS: Array<{ id: string; en: string; es: string }> = [
  { id: "hallway", en: "Hallway", es: "Pasillo" },
  { id: "central", en: "Central space", es: "Espacio central" },
  { id: "classroom", en: "Classroom", es: "Aula" },
  { id: "cafeteria", en: "Cafeteria", es: "Cafetería" },
  { id: "stairs", en: "Stairwell", es: "Escalera" },
  { id: "elevator", en: "Lift lobby", es: "Ascensores" },
];

const SAMPLES: Sample[] = AREAS.filter((a) => REAL[a.id]).map((a) => ({
  id: a.id,
  src: `/images/projects/ie-tower/q-${a.id}.webp`,
  areaEN: a.en,
  areaES: a.es,
  truth: REAL[a.id].truth,
  predictions: REAL[a.id].top5,
  nnSim: REAL[a.id].nnSim,
}));

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
  const inTop5 = sample.predictions.some((p) => p.label === sample.truth);
  // Is the wrong Top-1 a neighbouring floor, or somewhere else entirely?
  const floorNum = (l: string) => (l.startsWith("floor") ? Number(l.replace("floor", "")) : NaN);
  const gap = Math.abs(floorNum(sample.predictions[0].label) - floorNum(sample.truth));
  const nearMiss = Number.isFinite(gap) && gap <= 2;
  const margin = sample.predictions[0].pct - (sample.predictions.find((p) => p.label === sample.truth)?.pct ?? 0);

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-5">
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

      {/* Sample picker: a single scrolling row on phones (no 4-line wrap that
          shoves the run button under the nav), wraps freely on wider screens. */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar flex-nowrap md:flex-wrap -mx-1 px-1">
        {SAMPLES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(i)}
            data-cursor="pointer"
            aria-pressed={i === active}
            className="shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors whitespace-nowrap"
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
            {state === "done" && (
              <>
                {" · "}
                {es ? "vecino más cercano" : "nearest neighbour"} <strong>{sample.nnSim.toFixed(3)}</strong>
              </>
            )}
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
          <div className="flex flex-col gap-1.5 min-h-[120px] md:min-h-[190px]" aria-live="polite">
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
                      ? `✓ Top-1 correcto, con ${sample.predictions[0].pct.toFixed(1)}% del voto.`
                      : `✓ Top-1 correct, with ${sample.predictions[0].pct.toFixed(1)}% of the vote.`
                    : nearMiss
                    ? es
                      ? `✗ Falla por ${margin.toFixed(1)} puntos contra una planta vecina${inTop5 ? ", pero la verdad queda en el Top-5" : ""}.`
                      : `✗ Missed by ${margin.toFixed(1)} points to a neighbouring floor${inTop5 ? ", but the truth stays in the Top-5" : ""}.`
                    : es
                    ? `✗ Falla por ${margin.toFixed(1)} puntos contra una planta lejana${inTop5 ? ", aunque la verdad queda en el Top-5" : " y la verdad ni entra en el Top-5"}. Este tipo de espacio se repite idéntico en todo el edificio: no hay pista visual de altura.`
                    : `✗ Missed by ${margin.toFixed(1)} points to a distant floor${inTop5 ? ", though the truth stays in the Top-5" : ", and the truth isn't even in the Top-5"}. This kind of space repeats identically throughout the building: there is no visual clue to height.`}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action row: full-width on phones so it never collides with the fixed
          nav (it used to live up in the header and slid under it). */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={state === "running"}
          data-cursor="pointer"
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-60"
          style={{ background: isDark ? "#f8fafc" : "#0f172a", color: isDark ? "#0f172a" : "#f8fafc", cursor: "none" }}
        >
          {state === "running" ? (es ? "Buscando…" : "Searching…") : es ? "Ejecutar" : "Run inference"}
          <Play size={15} aria-hidden />
        </button>
        {state === "done" && (
          <button
            type="button"
            onClick={() => setState("idle")}
            data-cursor="pointer"
            aria-label={es ? "Reiniciar" : "Reset"}
            className="glass-tile inline-flex items-center justify-center rounded-full h-10 w-10 shrink-0"
            style={{ cursor: "none" }}
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        )}
      </div>

      <p className="text-[10px] leading-relaxed" style={{ color: isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)" }}>
        {es
          ? `Salida real del modelo: DINOv2 ViT-S/14 a 518px sobre una galería de 2.373 frames, votando los 30 vecinos más cercanos por similitud coseno. Esa misma corrida reproduce las métricas publicadas (${(evalData.metrics.top1 * 100).toFixed(1)}% Top-1).`
          : `Real model output: DINOv2 ViT-S/14 at 518px over a 2,373-frame gallery, with the 30 nearest neighbours voting by cosine similarity. That same run reproduces the published metrics (${(evalData.metrics.top1 * 100).toFixed(1)}% Top-1).`}
      </p>
    </div>
  );
}
