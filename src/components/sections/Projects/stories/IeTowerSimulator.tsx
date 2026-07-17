"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { Locale } from "@/domain/i18n";

type Props = { isDark: boolean; lang: Locale };

const ASSET_DIR = "/images/projects/ie-tower";

/**
 * Sample queries for the inference demo. The percentages are illustrative
 * (crafted to behave like the real model would on each kind of input) and the
 * widget says so; the real aggregate metrics shown in the footer ARE real.
 * When JS runs the actual model on these images, drop the outputs here.
 */
const SAMPLES = [
  {
    id: "tower",
    src: `${ASSET_DIR}/tower.webp`,
    label: { en: "The tower itself", es: "La torre en persona" },
    results: [
      { floor: { en: "Floor 0 — Lobby / plaza", es: "Planta 0 — Lobby / plaza" }, pct: 46.2 },
      { floor: { en: "Floor 1 — Auditorium", es: "Planta 1 — Auditorio" }, pct: 21.7 },
      { floor: { en: "Basement B1", es: "Sótano B1" }, pct: 9.8 },
      { floor: { en: "Floor 5 — Classrooms", es: "Planta 5 — Aulas" }, pct: 6.4 },
      { floor: { en: "Floor 12 — Study areas", es: "Planta 12 — Salas de estudio" }, pct: 4.1 },
    ],
    verdict: {
      en: "Out-of-distribution: the gallery only has indoor frames, so an exterior shot lands on the closest thing it knows — the entrance level.",
      es: "Fuera de distribución: la galería solo tiene frames interiores, así que una foto exterior cae en lo más parecido que conoce — la planta de entrada.",
    },
  },
  {
    id: "sketch-street",
    src: `${ASSET_DIR}/sketch-street.webp`,
    label: { en: "Ink sketch, street view", es: "Boceto a tinta, vista de calle" },
    results: [
      { floor: { en: "Floor 0 — Lobby / plaza", es: "Planta 0 — Lobby / plaza" }, pct: 18.9 },
      { floor: { en: "Floor 20 — Terrace", es: "Planta 20 — Terraza" }, pct: 14.3 },
      { floor: { en: "Basement B2", es: "Sótano B2" }, pct: 11.6 },
      { floor: { en: "Floor 8 — Classrooms", es: "Planta 8 — Aulas" }, pct: 9.2 },
      { floor: { en: "Floor 3 — Offices", es: "Planta 3 — Oficinas" }, pct: 7.7 },
    ],
    verdict: {
      en: "Domain shift in action: pen strokes share almost no texture statistics with photos, so confidence collapses and the ranking flattens.",
      es: "Cambio de dominio en vivo: los trazos a tinta no comparten casi nada con las fotos, así que la confianza se derrumba y el ranking se aplana.",
    },
  },
  {
    id: "sketch-aerial",
    src: `${ASSET_DIR}/sketch-aerial.webp`,
    label: { en: "Ink sketch, aerial", es: "Boceto a tinta, aéreo" },
    results: [
      { floor: { en: "Floor 20 — Terrace", es: "Planta 20 — Terraza" }, pct: 16.4 },
      { floor: { en: "Floor 0 — Lobby / plaza", es: "Planta 0 — Lobby / plaza" }, pct: 13.8 },
      { floor: { en: "Floor 17 — Labs", es: "Planta 17 — Laboratorios" }, pct: 10.9 },
      { floor: { en: "Basement B1", es: "Sótano B1" }, pct: 8.5 },
      { floor: { en: "Floor 12 — Study areas", es: "Planta 12 — Salas de estudio" }, pct: 6.3 },
    ],
    verdict: {
      en: "An aerial view exists nowhere in the gallery — the retrieval spreads thin across floors with big windows.",
      es: "Una vista aérea no existe en la galería — la búsqueda se dispersa entre plantas con ventanales.",
    },
  },
];

const PIPELINE = [
  { en: "Frame", es: "Frame" },
  { en: "DINOv2 ViT-S/14", es: "DINOv2 ViT-S/14" },
  { en: "FAISS Flat-IP", es: "FAISS Flat-IP" },
  { en: "Top-K", es: "Top-K" },
];

const SKETCHES = [
  { src: `${ASSET_DIR}/sketch-campus.webp`, rot: "-2.5deg" },
  { src: `${ASSET_DIR}/sketch-skyline.webp`, rot: "1.8deg" },
  { src: `${ASSET_DIR}/sketch-street.webp`, rot: "-1.2deg" },
  { src: `${ASSET_DIR}/sketch-aerial.webp`, rot: "2.2deg" },
];

/**
 * Interactive story for the IE Tower VPR project: a hand-drawn strip of the
 * building plus a small "inference simulator" that walks through the real
 * pipeline stages and shows the kind of Top-5 ranking the model produces.
 */
export default function IeTowerSimulator({ isDark, lang }: Props) {
  const t = (v: { en: string; es: string }) => (lang === "es" ? v.es : v.en);
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stage, setStage] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sample = SAMPLES.find((s) => s.id === sampleId) ?? SAMPLES[0];

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = () => {
    clearTimers();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStage(PIPELINE.length - 1);
      setPhase("done");
      return;
    }
    setPhase("running");
    setStage(0);
    PIPELINE.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStage(i), i * 340));
    });
    timers.current.push(
      setTimeout(() => setPhase("done"), PIPELINE.length * 340 + 240),
    );
  };

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setStage(-1);
  };

  const pick = (id: string) => {
    setSampleId(id);
    reset();
  };

  useEffect(() => clearTimers, []);

  const subtle = { color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)" };
  const strong = { color: isDark ? "#f8fafc" : "#0f172a" };
  const tileBorder = isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(15,23,42,0.12)";

  return (
    <div className="flex flex-col gap-5">
      {/* Inference simulator */}
      <div className="glass-tile rounded-2xl p-4 md:p-5 flex flex-col gap-4" style={{ border: tileBorder }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(148,163,184,0.9)" }}>
            {lang === "es" ? "Pruébalo: ¿en qué planta estoy?" : "Try it: which floor am I on?"}
          </h4>
          {phase === "done" ? (
            <button
              type="button"
              onClick={reset}
              data-cursor="pointer"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
              style={{ border: tileBorder, ...strong }}
            >
              <RotateCcw size={12} aria-hidden />
              {lang === "es" ? "Otra vez" : "Again"}
            </button>
          ) : (
            <button
              type="button"
              onClick={run}
              disabled={phase === "running"}
              data-cursor="pointer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-transform hover:scale-[1.04]"
              style={{
                background: isDark ? "#f8fafc" : "#0f172a",
                color: isDark ? "#0f172a" : "#f8fafc",
                opacity: phase === "running" ? 0.6 : 1,
              }}
            >
              <Play size={12} aria-hidden />
              {lang === "es" ? "Ejecutar inferencia" : "Run inference"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          {/* Query side */}
          <div className="flex flex-col gap-2.5">
            <div className="relative overflow-hidden rounded-xl" style={{ border: tileBorder }}>
              <img
                src={sample.src}
                alt={t(sample.label)}
                loading="lazy"
                className="w-full h-44 sm:h-52 object-cover bg-white"
              />
              {phase === "running" && <div className="vpr-scanline" aria-hidden />}
            </div>
            <div className="flex gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pick(s.id)}
                  data-cursor="pointer"
                  aria-pressed={s.id === sampleId}
                  aria-label={t(s.label)}
                  className="relative h-12 w-16 rounded-md overflow-hidden transition-transform hover:scale-105"
                  style={{
                    border: s.id === sampleId ? (isDark ? "2px solid #f8fafc" : "2px solid #0f172a") : tileBorder,
                    opacity: s.id === sampleId ? 1 : 0.65,
                  }}
                >
                  <img src={s.src} alt="" loading="lazy" className="h-full w-full object-cover bg-white" />
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-snug" style={subtle}>
              {t(sample.label)}
            </p>
          </div>

          {/* Pipeline + results side */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {PIPELINE.map((step, i) => (
                <span key={step.en} className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-1 transition-all duration-200"
                    style={{
                      border: tileBorder,
                      color:
                        stage >= i
                          ? isDark
                            ? "#0f172a"
                            : "#f8fafc"
                          : subtle.color,
                      background: stage >= i ? (isDark ? "#f8fafc" : "#0f172a") : "transparent",
                    }}
                  >
                    {t(step)}
                  </span>
                  {i < PIPELINE.length - 1 && (
                    <span className="text-[10px]" style={subtle} aria-hidden>
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>

            {phase === "done" ? (
              <div className="flex flex-col gap-2" aria-live="polite">
                {sample.results.map((r, i) => (
                  <div key={r.floor.en} className="flex items-center gap-2">
                    <span className="text-[11px] w-40 shrink-0 truncate" style={i === 0 ? { ...strong, fontWeight: 600 } : subtle}>
                      {t(r.floor)}
                    </span>
                    <span className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)" }}>
                      <span
                        className="block h-full rounded-full vpr-bar"
                        style={{
                          width: `${Math.min(100, r.pct * 1.6)}%`,
                          background: i === 0 ? (isDark ? "#67e8f9" : "#0f172a") : isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.35)",
                          animationDelay: `${i * 90}ms`,
                        }}
                      />
                    </span>
                    <span className="text-[11px] tabular-nums w-11 text-right" style={i === 0 ? strong : subtle}>
                      {r.pct.toFixed(1)}%
                    </span>
                  </div>
                ))}
                <p className="text-[11.5px] leading-relaxed pt-1" style={subtle}>
                  {t(sample.verdict)}
                </p>
              </div>
            ) : (
              <p className="text-xs leading-relaxed" style={subtle}>
                {lang === "es"
                  ? "El modelo real recibe una foto interior, la convierte en un embedding con DINOv2 congelado y busca los frames más parecidos en un índice FAISS de 2,877 imágenes para votar la planta."
                  : "The real model takes an indoor photo, turns it into an embedding with frozen DINOv2 and searches a 2,877-frame FAISS index for the closest gallery frames to vote the floor."}
              </p>
            )}
          </div>
        </div>

        <p className="text-[10.5px] leading-snug" style={{ ...subtle, opacity: 0.8 }}>
          {lang === "es"
            ? "Demo ilustrativa del pipeline — estas fotos no están en la galería del modelo. Métricas reales del sistema: 52.8% Top-1 · 72.0% Top-5 · 57.7% mAP sobre ~430 queries."
            : "Illustrative pipeline demo — these photos aren't in the model's gallery. Real system metrics: 52.8% Top-1 · 72.0% Top-5 · 57.7% mAP over ~430 held-out queries."}
        </p>
      </div>
    </div>
  );
}
