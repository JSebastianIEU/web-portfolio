"use client";

import type { CSSProperties } from "react";

import type { Locale } from "@/domain/i18n";
import BranchFanDiagram from "../story/BranchFanDiagram";
import { StoryBeat, StoryChapter, StoryProse, StoryStage, StoryStat } from "../story/StoryScene";

type Props = { isDark: boolean; lang: Locale };

/**
 * Held-out evaluation, 89 test queries against the 620-row candidate pool.
 * All three metric families, both passes, k = 5 / 10 / 20.
 */
const KS = [5, 10, 20] as const;

const METRICS = [
  { key: "NDCG", dir: "up" as const, retrieval: [0.303, 0.368, 0.431], full: [0.429, 0.478, 0.555] },
  { key: "MRR", dir: "down" as const, retrieval: [0.546, 0.565, 0.567], full: [0.526, 0.546, 0.557] },
  { key: "Recall", dir: "down" as const, retrieval: [0.305, 0.463, 0.647], full: [0.165, 0.331, 0.629] },
];

// One shared x layout for all three panels: same viewBox width, same LEFT and
// RIGHT, so the dashed k guides line up column-wise down the stack even though
// each panel is its own <svg>. Three separate elements rather than one SVG with
// three <g>: `animation-timeline: view()` needs a principal CSS box, and SVG
// children do not have one, so an animated <g> can sit stuck at opacity 0.
const VB_W = 210;
const LEFT = 50;
const RIGHT = 168;
const TITLE_BASE = 9;
const PLOT_TOP = 16;
const PLOT_H = 40;
const PLOT_BOTTOM = PLOT_TOP + PLOT_H;
// Fixed pixel headroom inside the plot, top and bottom, so every series has
// room for its printed delta no matter how narrow its spread is.
const INSET = 8;
const PANEL_H = 60;
const AXIS_BASE = 68;
const LAST_PANEL_H = 74;

const xOf = (j: number) => LEFT + (j * (RIGHT - LEFT)) / (KS.length - 1);
const signed = (d: number) => `${d > 0 ? "+" : "-"}${Math.abs(d).toFixed(3)}`;

/**
 * Mean wall-clock per branch, six representative videos, CPU-only. `s` is the
 * bar length in seconds; `label` is what gets printed, because the fourth row
 * is a ceiling ("every other branch under 10 s"), not a measured mean.
 */
type Branch = {
  key: string;
  en: string;
  es: string;
  s: number;
  label: string;
  p95?: number;
  approx?: boolean;
};

const BRANCHES: Branch[] = [
  { key: "blip", en: "BLIP captioning", es: "BLIP (descripción de fotogramas)", s: 78.6, label: "78.6 s", p95: 90.4 },
  { key: "ocr", en: "EasyOCR", es: "EasyOCR", s: 64.8, label: "64.8 s" },
  { key: "whisper", en: "Whisper", es: "Whisper", s: 57.2, label: "57.2 s" },
  { key: "rest", en: "every other branch", es: "todas las demás ramas", s: 10, label: "< 10 s", approx: true },
];

type Split = "train" | "val" | "test";

/**
 * A hand-drawn sketch of what a random split looks like laid on a time axis.
 * Illustrative only: it carries no counts, and the SVG says so on its face.
 * The only real numbers in this chapter are in SPLIT_ROWS. Do not let a
 * later edit attach a figure to this array.
 */
const SHUFFLED_SKETCH: Split[] = [
  "train", "train", "val", "train", "train",
  "train", "val", "train", "train", "train",
  "val", "test", "train", "train", "val",
  "test", "train", "train", "test", "train",
  "val", "train", "test", "train", "train",
];

/** The held-out datamart, split chronologically. 731 rows in total. */
const SPLIT_ROWS = { train: 511, val: 109, test: 111 };

/** The four cuts, in the order they were made. */
const CUTS = [
  { en: "per-frame face detection", es: "detección de caras por fotograma" },
  { en: "timeline 20 → 10 frames", es: "timeline 20 → 10 fotogramas" },
  { en: "OCR 5 → 3 frames", es: "OCR 5 → 3 fotogramas" },
  { en: "Whisper small → base", es: "Whisper small → base" },
];

/**
 * GCP billing export, April 2026. EUR 100.40 billed for the month, and the
 * seven days the instance was kept warm (17-23 Apr) cost EUR 13.23 each — 92%
 * of the bill. The export is only trustworthy at week granularity, so the 23
 * off-plateau days are not hand-authored: they carry the month's residual
 * spread evenly, derived below. The chart says so in its footnote.
 */
const APRIL = { total: 100.4, warmDay: 13.23, warmFrom: 17, warmTo: 23, days: 30 };
const WARM_DAYS = APRIL.warmTo - APRIL.warmFrom + 1;
const QUIET_DAY = (APRIL.total - APRIL.warmDay * WARM_DAYS) / (APRIL.days - WARM_DAYS);

/** Plot box inside the 200x128 viewBox: room for the euro axis and the bracket. */
const PLOT = { x0: 26, x1: 194, top: 10, base: 88, max: 15.5 };
const PITCH = (PLOT.x1 - PLOT.x0) / APRIL.days;
const BAR_W = PITCH - 1.6;
const yAt = (v: number) => PLOT.base - (v / PLOT.max) * (PLOT.base - PLOT.top);
const xAt = (i: number) => PLOT.x0 + i * PITCH + (PITCH - BAR_W) / 2;

const COST_COLS = Array.from({ length: APRIL.days }, (_, i) => {
  const day = i + 1;
  const warm = day >= APRIL.warmFrom && day <= APRIL.warmTo;
  // Floor of 2.5 user units: at ~0.34 EUR the quiet days would otherwise be a
  // 1.7-unit smear that reads as a dashed axis rule rather than as data.
  const h = Math.max(PLOT.base - yAt(warm ? APRIL.warmDay : QUIET_DAY), 2.5);
  return { i, warm, x: xAt(i), y: PLOT.base - h, h };
});

const PLATEAU_Y = yAt(APRIL.warmDay);
const WARM_X0 = COST_COLS[APRIL.warmFrom - 1].x;
const WARM_X1 = COST_COLS[APRIL.warmTo - 1].x + BAR_W;

/**
 * Fourteen outcome trajectories fanning out of a single publish event.
 *
 * Deliberately a *sketch*: no per-video engagement figure was measured on this
 * project, so the diagram commits to the shape (almost everything stays low,
 * one takes off) and says so in its caption rather than inventing numbers.
 *
 * Geometry derives from ORIGIN / END_X and the FAN array, so adding or
 * removing a trajectory can never break the frame. Each trace is normalised
 * with pathLength="1" so one dash pattern draws every path regardless of its
 * real arc length, and the animated class sits on the <path> itself, so
 * nothing depends on SVG property inheritance.
 */
function OutcomeFan({ isDark, es }: { isDark: boolean; es: boolean }) {
  const accent = "#22d3ee";
  const rose = "#fb7185";
  const traceColor = isDark ? "rgba(148,163,184,0.38)" : "rgba(71,85,105,0.34)";
  const axis = isDark ? "rgba(148,163,184,0.35)" : "rgba(71,85,105,0.3)";
  const label = isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)";
  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

  const ORIGIN = { x: 26, y: 96 };
  const END_X = 170;
  const SPAN = END_X - ORIGIN.x;

  /* Where each trajectory lands, ordered floor-first so the single outlier is
     the last line to leave the ground as the reader scrolls. */
  const FAN = [95, 93.4, 91.8, 90.2, 88.6, 87, 85.2, 83.2, 80.8, 77.6, 73, 66, 50, 20];

  /* Flat out of the gate, steep at the end: divergence reads as late rather
     than predestined. */
  const traceOf = (endY: number) => {
    const rise = ORIGIN.y - endY;
    const c1x = ORIGIN.x + SPAN * 0.34;
    const c1y = ORIGIN.y - rise * 0.06;
    const c2x = ORIGIN.x + SPAN * 0.72;
    const c2y = endY + rise * 0.42;
    return `M${ORIGIN.x} ${ORIGIN.y} C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${END_X} ${endY}`;
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <svg
        viewBox="0 0 200 118"
        className="w-full h-auto block"
        role="img"
        aria-label={
          es
            ? "Esquema: desde un unico momento de publicacion se abren catorce trayectorias de resultado. Casi todas se quedan cerca del suelo y una sola se dispara. A la derecha, un corchete discontinuo abarca todo el rango de llegadas y marca donde puede acabar tu video."
            : "Sketch: fourteen outcome trajectories fan out from a single publish event. Nearly all of them stay near the floor and exactly one takes off. On the right, a dashed bracket spans the whole range of landings and marks where your own video could end up."
        }
      >
        {/* Ground line, and the vertical at the moment of publishing. */}
        <line x1={16} y1={101} x2={196} y2={101} stroke={axis} strokeWidth={0.7} strokeDasharray="3 3" />
        <line x1={ORIGIN.x} y1={12} x2={ORIGIN.x} y2={101} stroke={axis} strokeWidth={0.7} strokeDasharray="3 2.5" />

        {/* The trajectories. Path and landing dot animate separately: the dash
            pattern draws the line, the dot is a fill and only fades. */}
        {FAN.map((endY, i) => {
          const hero = i === FAN.length - 1;
          return (
            <g key={endY}>
              <path
                className="blind-trace"
                style={{ ["--i" as string]: i }}
                d={traceOf(endY)}
                fill="none"
                stroke={hero ? rose : traceColor}
                strokeWidth={hero ? 1.5 : 1}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
              />
              <circle
                className="blind-dot"
                style={{ ["--i" as string]: i }}
                cx={END_X}
                cy={endY}
                r={hero ? 2.2 : 1}
                fill={hero ? rose : traceColor}
              />
            </g>
          );
        })}

        {/* The publish event itself. */}
        <circle cx={ORIGIN.x} cy={ORIGIN.y} r={2.6} fill={accent} />
        <circle cx={ORIGIN.x} cy={ORIGIN.y} r={5.4} fill="none" stroke={accent} strokeWidth={0.7} opacity={0.45} />

        {/* Your video: a bracket over the whole range of landings, never a point. */}
        <g className="blind-marker">
          <line x1={182} y1={18} x2={182} y2={97} stroke={accent} strokeWidth={0.8} strokeDasharray="3 2.5" />
          <line x1={178} y1={18} x2={186} y2={18} stroke={accent} strokeWidth={0.8} />
          <line x1={178} y1={97} x2={186} y2={97} stroke={accent} strokeWidth={0.8} />
          <text x={191} y={61} textAnchor="middle" fontSize={9} fontFamily={mono} fill={accent}>
            ?
          </text>
        </g>

        {/* Axis labels, in the scaled coordinate space so they never desync. */}
        <text transform="rotate(-90 9 56)" x={9} y={56} textAnchor="middle" fontSize={7} fontFamily={mono} fill={label}>
          engagement
        </text>
        <text x={18} y={110} fontSize={7} fontFamily={mono} fill={label}>
          {es ? "publicas" : "you publish"}
        </text>
        <text x={196} y={110} textAnchor="end" fontSize={7} fontFamily={mono} fill={accent}>
          {es ? "tu vídeo" : "your video"}
        </text>
      </svg>

      <p className="text-[10px] leading-relaxed font-mono" style={{ color: label }}>
        {es
          ? "Esquema, no datos: la forma. Casi todo se queda abajo, algo se dispara, y en el momento de decidir no sabes cuál de esas llegadas es la tuya."
          : "A sketch, not data: the shape. Nearly everything stays low, something takes off, and at the moment you decide you cannot tell which landing is yours."}
      </p>
    </div>
  );
}

/**
 * The three metric families plotted one under another so the divergence is
 * visible before it is explained: NDCG rises at every k while MRR and Recall
 * fall at every k.
 *
 * Each panel is scaled to its own range, because MRR's entire spread is 0.041
 * and would be a flat line on an axis shared with Recall. The panel therefore
 * prints its own measured extremes on the left, and the signed change is
 * printed next to every full-pipeline point: the numbers carry the magnitude,
 * the geometry only carries the direction.
 */
function MetricDivergence({ isDark, es }: { isDark: boolean; es: boolean }) {
  const accent = "#22d3ee";
  const rose = "#fb7185";
  const grid = isDark ? "rgba(148,163,184,0.18)" : "rgba(71,85,105,0.18)";
  const baseline = isDark ? "rgba(148,163,184,0.5)" : "rgba(71,85,105,0.45)";
  const dim = isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.55)";
  const label = isDark ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.85)";
  const tick = isDark ? "rgba(148,163,184,0.7)" : "rgba(71,85,105,0.65)";

  return (
    <div className="w-full max-w-[360px] flex flex-col gap-2">
      {METRICS.map((m, i) => {
        const last = i === METRICS.length - 1;
        const values = [...m.retrieval, ...m.full];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const span = max - min || 1;
        const yOf = (v: number) =>
          PLOT_BOTTOM - INSET - ((v - min) / span) * (PLOT_H - 2 * INSET);

        const up = m.dir === "up";
        const tone = up ? accent : rose;
        const retrPts = m.retrieval.map((v, j) => `${xOf(j)},${yOf(v)}`).join(" ");
        const fullPts = m.full.map((v, j) => `${xOf(j)},${yOf(v)}`).join(" ");

        const nums = (a: number[]) => a.map((v) => v.toFixed(3)).join(", ");
        const aria = es
          ? `${m.key}: sólo recuperación ${nums(m.retrieval)} en k=5, 10 y 20; pipeline completo ${nums(m.full)}. ${up ? "Sube" : "Baja"} en los tres cortes.`
          : `${m.key}: retrieval only ${nums(m.retrieval)} at k=5, 10 and 20; full pipeline ${nums(m.full)}. ${up ? "Rises" : "Falls"} at all three cut-offs.`;

        return (
          <div key={m.key} className="tk-panel" style={{ "--i": i } as CSSProperties}>
            <svg
              viewBox={`0 0 ${VB_W} ${last ? LAST_PANEL_H : PANEL_H}`}
              className="w-full h-auto block"
              role="img"
              aria-label={aria}
            >
              {/* k guides. Confined to this panel's plot band, but at the same
                  x in every panel, so the column reads as one axis. */}
              {KS.map((k, j) => (
                <line
                  key={`guide-${k}`}
                  x1={xOf(j)}
                  x2={xOf(j)}
                  y1={PLOT_TOP}
                  y2={PLOT_BOTTOM}
                  stroke={grid}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              ))}

              <text x={4} y={TITLE_BASE} className="font-mono" fill={label} fontSize={9} fontWeight={600}>
                {m.key}
              </text>
              {/* Direction mark: the panel says which way it went before you
                  read a single value. */}
              <path
                d={up ? "M-3 2 L3 2 L0 -3 Z" : "M-3 -2 L3 -2 L0 3 Z"}
                fill={tone}
                transform={`translate(${4 + m.key.length * 5.4 + 5}, ${TITLE_BASE - 3})`}
              />

              {/* The panel's own measured extremes, hung off the points they
                  belong to. Stated because the scale is per panel. */}
              <text
                x={LEFT - 6}
                y={yOf(max) + 2.5}
                className="font-mono"
                fill={tick}
                fontSize={7}
                textAnchor="end"
              >
                {max.toFixed(3)}
              </text>
              <text
                x={LEFT - 6}
                y={yOf(min) + 2.5}
                className="font-mono"
                fill={tick}
                fontSize={7}
                textAnchor="end"
              >
                {min.toFixed(3)}
              </text>

              <line
                x1={LEFT - 4}
                x2={RIGHT + 4}
                y1={PLOT_BOTTOM}
                y2={PLOT_BOTTOM}
                stroke={baseline}
                strokeWidth={0.6}
              />

              {/* Retrieval only: dashed, muted - the reference line. */}
              <polyline
                points={retrPts}
                fill="none"
                stroke={dim}
                strokeWidth={1.2}
                strokeDasharray="3 2.5"
                strokeLinejoin="round"
              />
              {m.retrieval.map((v, j) => (
                <circle key={`r-${j}`} cx={xOf(j)} cy={yOf(v)} r={1.6} fill={dim} />
              ))}

              {/* Full pipeline: solid, coloured by direction. */}
              <polyline
                points={fullPts}
                fill="none"
                stroke={tone}
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
              {m.full.map((v, j) => (
                <circle key={`f-${j}`} cx={xOf(j)} cy={yOf(v)} r={1.8} fill={tone} />
              ))}

              {/* The delta, printed, on the far side of the point from the
                  reference line. The fixed inset guarantees the room. */}
              {m.full.map((v, j) => {
                const d = v - m.retrieval[j];
                return (
                  <text
                    key={`d-${j}`}
                    x={xOf(j) + 4}
                    y={yOf(v) + (d > 0 ? -4 : 7)}
                    className="font-mono"
                    fill={tone}
                    fontSize={7}
                  >
                    {signed(d)}
                  </text>
                );
              })}

              {last &&
                KS.map((k, j) => (
                  <text
                    key={`k-${k}`}
                    x={xOf(j)}
                    y={AXIS_BASE}
                    className="font-mono"
                    fill={tick}
                    fontSize={8}
                    textAnchor="middle"
                  >
                    {`k=${k}`}
                  </text>
                ))}
            </svg>
          </div>
        );
      })}

      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono mt-1"
        style={{ color: dim }}
      >
        <span className="inline-flex items-center gap-1.5">
          <svg width="16" height="4" aria-hidden="true" focusable="false">
            <line x1="0" y1="2" x2="16" y2="2" stroke={dim} strokeWidth="1.2" strokeDasharray="3 2.5" />
          </svg>
          {es ? "sólo recuperación" : "retrieval only"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="16" height="4" aria-hidden="true" focusable="false">
            <line x1="0" y1="2" x2="8" y2="2" stroke={accent} strokeWidth="1.6" />
            <line x1="8" y1="2" x2="16" y2="2" stroke={rose} strokeWidth="1.6" />
          </svg>
          {es ? "pipeline completo (cian sube, rosa baja)" : "full pipeline (cyan up, rose down)"}
        </span>
      </div>

      <p className="text-[10px] leading-snug" style={{ color: dim }}>
        {es
          ? "89 consultas de test, pool de 620 candidatos. Cada panel está escalado a su propio rango (el recorrido completo de MRR es 0,041) y muestra sus extremos reales a la izquierda; los números con signo son la magnitud."
          : "89 test queries, 620-row candidate pool. Each panel is scaled to its own range (MRR's entire spread is 0.041) and prints its real extremes on the left; the signed numbers are the magnitude."}
      </p>
    </div>
  );
}

/**
 * The TikTok recommender told as a vertical story, same system as the IE Tower
 * and semantic-engagement pages: a sticky visual per chapter with prose
 * scrolling past it.
 *
 * Every number here comes from the author's own measurements on this project —
 * the held-out evaluation table, the per-branch profiling run and the GCP
 * billing export. Where a figure is a limitation rather than a win (recall
 * traded for ranking quality, the engagement proxy, the cost that took it
 * offline) it is stated as one.
 */
export default function TikTokRecommenderStory({ isDark, lang }: Props) {
  const es = lang === "es";
  const accent = "#22d3ee";
  const rose = "#fb7185";
  const muted = isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)";
  const faint = isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)";
  const tileText = isDark ? "#f8fafc" : "#0f172a";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.025)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)";

  return (
    <div className="flex flex-col">
      {/* 00 — Demo. First, because it is the thing worth seeing: the story
          that follows explains what the recording shows. */}
      <StoryChapter index="00" eyebrow={es ? "El demo" : "The demo"} id="demo">
        <div className="w-full flex flex-col gap-4 py-6">
          <div className="rounded-2xl overflow-hidden" style={{ border: cardBorder, background: cardBg }}>
            <video
              className="w-full h-auto block"
              controls
              muted
              playsInline
              preload="none"
              poster="/images/projects/tiktok-recommender/poster.webp"
            >
              <source src="/videos/tiktok-recommender-demo.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="text-[12px] leading-relaxed max-w-[68ch]" style={{ color: muted }}>
            {es
              ? "Grabación del sistema en funcionamiento: se sube un vídeo, se analiza, y devuelve comparables con su desglose de puntuación, hashtags sugeridos y recomendaciones concretas de edición. El servicio ya no está desplegado, por el coste que se explica más abajo."
              : "A recording of the system running: upload a video, it gets analysed, and it returns comparables with their score breakdown, suggested hashtags and concrete editing recommendations. The service is no longer deployed, for the cost reason explained further down."}
          </p>
        </div>
      </StoryChapter>

      {/* 01 — The problem */}
      <StoryChapter index="01" eyebrow={es ? "El problema" : "The problem"}>
        <StoryStage>
          <OutcomeFan isDark={isDark} es={es} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Publicar es apostar a ciegas" : "Publishing is a blind bet"}>
            {es
              ? "Un creador decide caption, hashtags y los primeros dos segundos sin ninguna señal de si funcionarán. El feedback llega cuando ya no se puede cambiar nada."
              : "A creator picks the caption, the hashtags and the first two seconds with no signal about whether any of it works. The feedback arrives once nothing can be changed."}
          </StoryBeat>
          <StoryBeat title={es ? "El resultado se abre en abanico" : "The outcome fans out"}>
            {es
              ? "Y se abre mucho. Entre un vídeo que no se mueve y uno que se dispara hay órdenes de magnitud, así que la media no describe a ningún vídeo concreto. Antes de publicar no estás eligiendo un número: estás eligiendo una posición dentro de ese rango, sin poder verla."
              : "And it fans out wide. Between a video that never moves and one that takes off there are orders of magnitude, so the average describes no particular video. Before publishing you aren't picking a number — you're picking a position inside that range, without being able to see it."}
          </StoryBeat>
          <StoryBeat title={es ? "La pregunta del proyecto" : "The question this project asked"}>
            {es
              ? "Si el resultado concreto no se puede predecir, ¿se puede al menos decir algo útil antes de publicar? Comparando un vídeo nuevo con los que ya existen y midiendo en qué se parecen de verdad."
              : "If the exact outcome can't be predicted, can anything useful still be said before publishing — by comparing a new video against ones that already exist, and measuring what they actually share?"}
          </StoryBeat>
          <StoryStat
            value="731"
            label={es ? "vídeos ya publicados, con su resultado conocido" : "videos already published, outcome known"}
            accent
          />
        </StoryProse>
      </StoryChapter>

      {/* 02 — Understanding the video */}
      <StoryChapter index="02" eyebrow={es ? "Entender el vídeo" : "Understanding the video"}>
        <StoryStage>
          <BranchFanDiagram isDark={isDark} lang={lang} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Ocho ramas en paralelo" : "Eight branches in parallel"}>
            {es
              ? "Un vídeo no es una cosa: es audio, texto en pantalla, imagen y ritmo. El analizador abre ocho ramas en un thread pool y las lanza a la vez, no una detrás de otra."
              : "A video isn't one thing: it's audio, on-screen text, imagery and pacing. The analyzer opens eight branches in a thread pool and fires them at the same time, not one after another."}
          </StoryBeat>
          <StoryBeat title={es ? "Dónde se iba el tiempo" : "Where the time was going"}>
            {es
              ? "El perfilado dijo dónde mirar: tres ramas dominan. BLIP con 78,6 s de media (p95 90,4 s), EasyOCR con 64,8 s y Whisper con 57,2 s; las otras cinco terminan por debajo de 10 s cada una. Son medias por rama de aquella tanda de perfilado, no el reloj del sistema que se acabó desplegando. Qué hacer con ellas es el capítulo siguiente."
              : "Profiling said where to look: three branches dominate. BLIP at a 78.6 s mean (p95 90.4 s), EasyOCR at 64.8 s and Whisper at 57.2 s; the other five each finish under 10 s. These are per-branch means from that profiling run, not the wall clock of the system that shipped. What to do about them is the next chapter."}
          </StoryBeat>
          <StoryBeat title={es ? "Ocho salidas, una representación" : "Eight outputs, one representation"}>
            {es
              ? "Todo vuelve a converger: transcripción, OCR, captions, keywords, cortes, color, movimiento y fotogramas se juntan en la representación sobre la que corre la comparación con los vídeos que ya existen."
              : "Everything converges back: transcript, OCR, captions, keywords, cuts, colour, motion and frames come together into the representation the comparison against existing videos actually runs on."}
          </StoryBeat>
          <StoryStat value="1,236" label={es ? "líneas en el analizador" : "lines in the analyzer"} />
        </StoryProse>
      </StoryChapter>

      {/* 03 — Making it fast */}
      <StoryChapter index="03" eyebrow={es ? "Hacerlo rápido" : "Making it fast"}>
        <StoryStage>
          {/* max-width inline, not as a Tailwind utility: globals.css sets
              `.story-stage > * { max-width: 100% }` at equal specificity and
              later in the cascade, so `max-w-[Npx]` on a direct stage child is
              silently dead here. */}
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: 400 }}>
            {(() => {
              /* Every coordinate is derived from these constants, so adding a
                 branch row or moving the marker can never break the frame. */
              const T_MAX = 300; // seconds spanned by the axis
              const X0 = 10; // left edge of every bar
              const X_AXIS_END = 230; // x of the 300 s tick
              const X_EDGE = 240; // viewBox width: v1 runs clean off it
              const xs = (s: number) => X0 + (s / T_MAX) * (X_AXIS_END - X0);
              const X60 = xs(60);
              /* Where the v1 fill has to stop so it lands flush on the 60 s
                 marker. Derived, never typed in. */
              const COLLAPSE_END = (X60 - X0) / (X_EDGE - X0);

              const V1_Y = 16;
              const V1_H = 12;
              const CUT_TOP = 52; // baseline of the first cut
              const CUT_H = 12;
              const DIVIDER_Y = 100;
              const ROW_TOP = 126; // baseline of the first branch label
              const ROW_H = 22;
              const BAR_H = 9;
              const AXIS_Y = 212;
              const VB_H = 230;

              const hairline = isDark ? "rgba(148,163,184,0.35)" : "rgba(71,85,105,0.32)";
              const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
              const ticks = [0, 60, 120, 180, 240, 300];

              return (
                <svg
                  viewBox={`0 0 240 ${VB_H}`}
                  className="w-full h-auto block"
                  role="img"
                  aria-label={
                    es
                      ? "Un eje de 0 a 300 segundos. La barra de la primera versión se sale del gráfico, más de cinco minutos por vídeo, y al avanzar se repliega hasta la marca de 60 segundos mientras se apagan los cuatro recortes: detección de caras por fotograma, timeline de 20 a 10 fotogramas, OCR de 5 a 3 fotogramas y Whisper de small a base. Debajo, en el mismo eje, el perfil por rama: BLIP 78,6 segundos con p95 de 90,4, EasyOCR 64,8, Whisper 57,2 y el resto por debajo de 10."
                      : "A 0 to 300 second axis. The first version's bar runs off the chart at over five minutes per video, and on scroll it retreats to the 60 second marker while the four cuts fade back: per-frame face detection, timeline 20 to 10 frames, OCR 5 to 3 frames, and Whisper small to base. Below, on the same axis, the per-branch profile: BLIP 78.6 seconds with a p95 of 90.4, EasyOCR 64.8, Whisper 57.2, and every other branch under 10."
                  }
                >
                  {/* 60 s reference, drawn in two segments so it never runs
                      through the list of cuts in the middle. */}
                  <line
                    x1={X60}
                    y1={13}
                    x2={X60}
                    y2={31}
                    stroke={accent}
                    strokeWidth={1}
                    strokeDasharray="3 2.5"
                  />
                  <line
                    x1={X60}
                    y1={DIVIDER_Y + 4}
                    x2={X60}
                    y2={AXIS_Y}
                    stroke={accent}
                    strokeWidth={1}
                    strokeDasharray="3 2.5"
                    strokeOpacity={0.55}
                  />

                  {/* --- v1: the bar that does not fit the chart ---------- */}
                  <text x={X0} y={10} fontSize={7.5} fill={muted}>
                    {es ? "reloj de pared, v1" : "v1 wall clock"}
                  </text>
                  <text
                    x={X_EDGE - 2}
                    y={10}
                    fontSize={7.5}
                    fontFamily={mono}
                    textAnchor="end"
                    fill={rose}
                  >
                    {es ? "> 5 min por vídeo" : "> 5 min per video"}
                  </text>

                  {/* Ghost of where the bar started: open on the right, so it
                      reads as continuing past the frame. Stays put forever. */}
                  <path
                    d={`M${X_EDGE} ${V1_Y} H${X0} V${V1_Y + V1_H} H${X_EDGE}`}
                    fill="none"
                    stroke={hairline}
                    strokeWidth={0.9}
                    strokeDasharray="3 2.5"
                  />
                  {/* Fill: retreats onto the 60 s marker as the chapter scrolls. */}
                  <rect
                    className="tkf-collapse"
                    x={X0}
                    y={V1_Y}
                    width={X_EDGE - X0}
                    height={V1_H}
                    fill={rose}
                    style={{ ["--tkf-end" as string]: String(COLLAPSE_END) }}
                  />

                  {/* --- the four cuts, fading back one after another ----- */}
                  <text x={X0} y={40} fontSize={7.5} fill={muted}>
                    {es ? "lo que se quitó, en orden" : "what came out, in order"}
                  </text>
                  {CUTS.map((c, i) => (
                    <g key={c.en} className="tkf-cut" style={{ ["--i" as string]: i }}>
                      <circle cx={X0 + 2} cy={CUT_TOP + i * CUT_H - 2.4} r={1.5} fill={rose} />
                      <text
                        x={X0 + 9}
                        y={CUT_TOP + i * CUT_H}
                        fontSize={7.5}
                        fontFamily={mono}
                        fill={tileText}
                      >
                        {es ? c.es : c.en}
                      </text>
                    </g>
                  ))}

                  <line
                    x1={X0}
                    y1={DIVIDER_Y}
                    x2={X_AXIS_END}
                    y2={DIVIDER_Y}
                    stroke={hairline}
                    strokeWidth={0.8}
                  />
                  <text x={X0} y={112} fontSize={7.5} fill={muted}>
                    {es ? "perfil por rama, hoy" : "per-branch profile, today"}
                  </text>

                  {/* --- the profile, on the same axis ------------------- */}
                  {BRANCHES.map((b, i) => {
                    const y = ROW_TOP + i * ROW_H;
                    const barY = y + 3.5;
                    const end = xs(b.s);
                    const whisker = b.p95 === undefined ? null : xs(b.p95);
                    return (
                      <g key={b.key} className="tower-band">
                        <text x={X0} y={y} fontSize={7.5} fill={muted}>
                          {es ? b.es : b.en}
                        </text>
                        {/* Split at the 60 s marker rather than drawing the
                            marker over the bars: the overshoot is the point,
                            and a line on top of a fill of the same colour
                            would not read. */}
                        <rect
                          x={X0}
                          y={barY}
                          width={Math.min(end, X60) - X0}
                          height={BAR_H}
                          rx={1.5}
                          fill={accent}
                          fillOpacity={0.85}
                        />
                        {end > X60 && (
                          <rect
                            x={X60}
                            y={barY}
                            width={end - X60}
                            height={BAR_H}
                            rx={1.5}
                            fill={accent}
                            fillOpacity={0.32}
                          />
                        )}
                        {b.approx && (
                          /* A ceiling, not a measurement: the bar ends in a
                             dashed cap. */
                          <line
                            x1={end}
                            y1={barY}
                            x2={end}
                            y2={barY + BAR_H}
                            stroke={accent}
                            strokeWidth={1}
                            strokeDasharray="2 2"
                          />
                        )}
                        {whisker !== null && (
                          <>
                            <line
                              x1={end}
                              y1={barY + BAR_H / 2}
                              x2={whisker}
                              y2={barY + BAR_H / 2}
                              stroke={accent}
                              strokeWidth={0.8}
                            />
                            <line
                              x1={whisker}
                              y1={barY + 1}
                              x2={whisker}
                              y2={barY + BAR_H - 1}
                              stroke={accent}
                              strokeWidth={1.2}
                            />
                          </>
                        )}
                        <text
                          x={(whisker ?? end) + 4}
                          y={barY + BAR_H - 1.5}
                          fontSize={7.5}
                          fontFamily={mono}
                          fill={tileText}
                        >
                          {b.p95 === undefined
                            ? b.label
                            : `${b.label} / p95 ${b.p95} s`}
                        </text>
                      </g>
                    );
                  })}

                  {/* --- axis -------------------------------------------- */}
                  <line
                    x1={X0}
                    y1={AXIS_Y}
                    x2={X_AXIS_END}
                    y2={AXIS_Y}
                    stroke={hairline}
                    strokeWidth={0.8}
                  />
                  {ticks.map((t) => (
                    <g key={t}>
                      <line
                        x1={xs(t)}
                        y1={AXIS_Y}
                        x2={xs(t)}
                        y2={AXIS_Y + 3}
                        stroke={hairline}
                        strokeWidth={0.8}
                      />
                      <text
                        x={xs(t)}
                        y={AXIS_Y + 11}
                        fontSize={7}
                        fontFamily={mono}
                        textAnchor={t === T_MAX ? "end" : "middle"}
                        fill={t === 60 ? accent : faint}
                      >
                        {t === T_MAX ? "300 s" : t === 60 ? "60 s" : t}
                      </text>
                    </g>
                  ))}
                </svg>
              );
            })()}
            <p className="text-[11px] leading-snug" style={{ color: faint }}>
              {es
                ? "Media por rama sobre seis vídeos, sólo CPU; la marca p95 es la de BLIP. Todo contra el mismo eje de 0 a 300 s."
                : "Mean per branch over six videos, CPU-only; the p95 tick is BLIP's. Everything against the same 0 to 300 s axis."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "La primera versión no cabía en el gráfico" : "The first version didn't fit the chart"}>
            {es
              ? "Más de cinco minutos por vídeo. Bajarlo a menos de sesenta segundos no salió de la intuición: salió de varias rondas de profiling, midiendo rama por rama en vez de optimizar lo que parecía caro."
              : "Over five minutes per video. Getting it under sixty seconds did not come from intuition; it came from several rounds of profiling, measuring branch by branch instead of optimising whatever looked expensive."}
          </StoryBeat>
          <StoryBeat title={es ? "El cuello de botella no estaba donde parecía" : "The bottleneck wasn't where it looked"}>
            {es
              ? "El coste dominante era la detección de caras por fotograma, una rama que no sospechaba nadie. Quitarla fue el recorte grande. Después vinieron tres más pequeños: timeline de 20 a 10 fotogramas, OCR de 5 a 3, y Whisper de small a base."
              : "The dominant cost was per-frame face detection, a branch nobody suspected. Removing it was the big cut. Three smaller ones followed: the timeline from 20 frames to 10, OCR from 5 frames to 3, and Whisper from small to base."}
          </StoryBeat>
          <StoryBeat title={es ? "Qué mide y qué no mide esta tabla" : "What this table does and doesn't measure"}>
            {es
              ? "El desglose de abajo es su propia corrida de profiling, sólo CPU sobre seis vídeos, y tres ramas cruzan por sí solas la línea de los 60 s: es una descomposición del coste, no el tiempo desplegado. Sirve para una cosa — señalar que descripción de fotogramas, OCR y transcripción son las tres que justifican una instancia caliente, y por tanto las primeras candidatas a separarse en servicios que escalen a cero."
              : "The breakdown below is its own profiling run, CPU-only over six videos, and three branches individually cross the 60 s line: it is a decomposition of cost, not the deployed timing. It is useful for exactly one thing — showing that captioning, OCR and transcription are the three that justify a warm instance, and therefore the obvious first pieces to peel out into services that can scale to zero."}
          </StoryBeat>
          <StoryStat
            value="198.7s"
            label={es ? "media total de la corrida de profiling" : "total mean of the profiling run"}
          />
        </StoryProse>
      </StoryChapter>

      {/* 04 — Temporal discipline */}
      <StoryChapter index="04" eyebrow={es ? "Disciplina temporal" : "Temporal discipline"}>
        <StoryStage>
          {/* maxWidth is inline, not a max-w-* utility: `.story-stage > *` sets
              max-width:100% at equal specificity and later in the cascade, so
              `max-w-[Npx]` on a direct stage child is dead. */}
          <div className="w-full" style={{ maxWidth: 420 }}>
            {(() => {
              // Every coordinate is derived. Changing a row count, or adding a
              // tick to the sketch, cannot push anything outside the frame.
              const x0 = 12;
              const x1 = 228;
              const span = x1 - x0;
              const totalRows = SPLIT_ROWS.train + SPLIT_ROWS.val + SPLIT_ROWS.test;

              // Lane A - the shuffle.
              const laneAY = 20;
              const laneH = 20;
              const pitch = span / SHUFFLED_SKETCH.length;
              const tickW = pitch * 0.62;
              const firstTest = SHUFFLED_SKETCH.indexOf("test");
              const frontierX = x0 + firstTest * pitch - pitch * 0.19;
              // The label hangs off whichever side of the frontier has room, so
              // it can never run past the right edge wherever the frontier lands.
              const labelRight = frontierX > x0 + span * 0.55;

              // Lane B - the chronological split. The slot between validation
              // and test is real geometry, so the blocks share what is left.
              const laneBY = 114;
              const legendY = 172;
              const axisY = 190;
              const gapW = 7;
              const usable = span - gapW;
              const wTrain = (usable * SPLIT_ROWS.train) / totalRows;
              const wVal = (usable * SPLIT_ROWS.val) / totalRows;
              const wTest = (usable * SPLIT_ROWS.test) / totalRows;
              const xVal = x0 + wTrain;
              const gapX = xVal + wVal;
              const xTest = gapX + gapW;
              const gapMid = gapX + gapW / 2;

              const fills: Record<Split, string> = {
                train: isDark ? "rgba(148,163,184,0.3)" : "rgba(71,85,105,0.22)",
                val: `${accent}55`,
                test: `${rose}55`,
              };
              const strokes: Record<Split, string> = {
                train: isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.5)",
                val: accent,
                test: rose,
              };
              const axis = isDark ? "rgba(148,163,184,0.45)" : "rgba(71,85,105,0.35)";

              // Custom-property style objects, the house cast (see TowerDiagram).
              const at = (i: number) => ({ "--i": i }) as CSSProperties;

              const blocks = [
                { s: "train" as Split, x: x0, w: wTrain, n: "511", i: 10 },
                { s: "val" as Split, x: xVal, w: wVal, n: "109", i: 11 },
                { s: "test" as Split, x: xTest, w: wTest, n: "111", i: 12 },
              ];

              // Named once, for both lanes - the blocks are too narrow to
              // carry a word, in either language.
              const legend: { s: Split; label: string }[] = [
                { s: "train", label: es ? "entrenamiento" : "train" },
                { s: "val", label: es ? "validación" : "validation" },
                { s: "test", label: "test" },
              ];

              return (
                <svg
                  viewBox="0 0 240 210"
                  className="w-full h-auto block"
                  role="img"
                  aria-label={
                    es
                      ? "Dos líneas temporales sobre el mismo eje. Arriba, un reparto aleatorio: filas de entrenamiento quedan a la derecha del primer registro de test, así que el modelo entrena con el futuro sobre el que luego se le pregunta. Es un esquema ilustrativo, no una ejecución. Abajo, el reparto cronológico real del datamart: 511 filas de entrenamiento, 109 de validación y 111 de test en orden, con una separación de más de siete minutos entre el último registro de validación y el primero de test."
                      : "Two timelines on one axis. On top, a random split: training rows land to the right of the first test record, so the model trains on the very future it is later asked about. It is an illustrative sketch, not a run. Below, the datamart's real chronological split: 511 train, 109 validation and 111 test rows in order, with a gap of more than seven minutes between the last validation record and the first test record."
                  }
                >
                  {/* ---- Lane A: the random split, i.e. the failure mode ---- */}
                  <text className="font-mono" x={x0} y={10} fontSize={8.5} fill={muted}>
                    {es ? "reparto aleatorio" : "random split"}
                  </text>

                  {/* Everything right of the first test record is the future. */}
                  <rect
                    className="tk-fade"
                    style={at(9)}
                    x={frontierX}
                    y={laneAY - 5}
                    width={x1 - frontierX}
                    height={laneH + 10}
                    fill={rose}
                    fillOpacity={0.08}
                  />

                  {SHUFFLED_SKETCH.map((s, i) => (
                    <rect
                      key={i}
                      className="tk-tick"
                      style={at(Math.floor(i / 3))}
                      x={x0 + i * pitch}
                      y={laneAY}
                      width={tickW}
                      height={laneH}
                      rx={1.5}
                      fill={fills[s]}
                      stroke={strokes[s]}
                      strokeWidth={0.6}
                    />
                  ))}

                  <line
                    className="tk-fade"
                    style={at(9)}
                    x1={frontierX}
                    y1={laneAY - 7}
                    x2={frontierX}
                    y2={laneAY + laneH + 7}
                    stroke={rose}
                    strokeWidth={1}
                    strokeDasharray="3 2.5"
                  />
                  <text
                    className="tk-fade font-mono"
                    style={at(9)}
                    x={labelRight ? frontierX - 3 : frontierX + 3}
                    y={laneAY + laneH + 20}
                    fontSize={7.5}
                    textAnchor={labelRight ? "end" : "start"}
                    fill={rose}
                  >
                    {es ? "primer registro de test" : "first test record"}
                  </text>

                  <text className="tk-fade" style={at(10)} x={x0} y={laneAY + laneH + 32} fontSize={7.5} fill={faint}>
                    {es
                      ? "hay filas de train a ambos lados de la frontera"
                      : "train rows sit on both sides of the frontier"}
                  </text>
                  <text className="tk-fade" style={at(10)} x={x0} y={laneAY + laneH + 42} fontSize={7.5} fill={faint}>
                    {es
                      ? "esquema ilustrativo, no una ejecución"
                      : "illustrative sketch, not a measured run"}
                  </text>

                  {/* ---- Lane B: the chronological split, the real datamart ---- */}
                  <text className="font-mono" x={x0} y={laneBY - 10} fontSize={8.5} fill={muted}>
                    {es ? "reparto cronológico" : "chronological split"}
                  </text>

                  {blocks.map((b) => (
                    <rect
                      key={b.s}
                      className="tk-seq"
                      style={at(b.i)}
                      x={b.x}
                      y={laneBY}
                      width={b.w}
                      height={laneH}
                      rx={2}
                      fill={fills[b.s]}
                      stroke={strokes[b.s]}
                      strokeWidth={0.7}
                    />
                  ))}
                  {blocks.map((b) => (
                    <text
                      key={b.s}
                      className="tk-fade font-mono"
                      style={at(b.i + 1)}
                      x={b.x + b.w / 2}
                      y={laneBY + laneH / 2 + 3}
                      fontSize={8}
                      textAnchor="middle"
                      fill={tileText}
                    >
                      {b.n}
                    </text>
                  ))}

                  {/* The empty slot, bracketed and labelled underneath. The
                      bracket is an annotation: nothing here says how wide
                      seven minutes is against the corpus, because nothing
                      measured says so. */}
                  <g className="tk-fade" style={at(13)}>
                    <line x1={gapX} y1={laneBY} x2={gapX} y2={laneBY + laneH + 12} stroke={accent} strokeWidth={0.8} strokeDasharray="3 2.5" />
                    <line x1={xTest} y1={laneBY} x2={xTest} y2={laneBY + laneH + 12} stroke={accent} strokeWidth={0.8} strokeDasharray="3 2.5" />
                    <line x1={gapX} y1={laneBY + laneH + 10} x2={xTest} y2={laneBY + laneH + 10} stroke={accent} strokeWidth={0.8} />
                    <line x1={gapMid} y1={laneBY + laneH + 10} x2={gapMid} y2={laneBY + laneH + 16} stroke={accent} strokeWidth={0.8} />
                    <text className="font-mono" x={gapMid} y={laneBY + laneH + 26} fontSize={8} textAnchor="middle" fill={accent}>
                      &gt; 7 min
                    </text>
                  </g>

                  {/* ---- Legend: names the colours once, for both lanes ---- */}
                  {legend.map((l, i) => {
                    const lx = x0 + (i * span) / 3;
                    return (
                      <g key={l.s} className="tk-fade" style={at(13)}>
                        <rect x={lx} y={legendY} width={6} height={6} rx={1.5} fill={fills[l.s]} stroke={strokes[l.s]} strokeWidth={0.6} />
                        <text x={lx + 9} y={legendY + 5.5} fontSize={7.5} fill={faint}>
                          {l.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* ---- Shared time axis ---- */}
                  <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={axis} strokeWidth={0.7} />
                  <text className="font-mono" x={x0} y={axisY + 12} fontSize={7.5} fill={faint}>
                    {es ? "más antiguo" : "oldest"}
                  </text>
                  <text className="font-mono" x={(x0 + x1) / 2} y={axisY + 12} fontSize={7.5} textAnchor="middle" fill={faint}>
                    {es ? "tiempo" : "time"}
                  </text>
                  <text className="font-mono" x={x1} y={axisY + 12} fontSize={7.5} textAnchor="end" fill={faint}>
                    {es ? "más reciente" : "newest"}
                  </text>
                </svg>
              );
            })()}
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "El fallo que hace mentir a las métricas" : "The failure mode that makes metrics lie"}>
            {es
              ? "Un recomendador entrenado con información que todavía no existía se evalúa a sí mismo con notas infladas. Es el error más fácil de cometer y el más difícil de detectar, porque el resultado se ve mejor, no peor."
              : "A recommender trained on information that did not exist yet grades itself with inflated marks. It is the easiest mistake to make and the hardest to catch, because the result looks better, not worse."}
          </StoryBeat>
          <StoryBeat title={es ? "Barajar es la opción cómoda" : "Shuffling is the comfortable option"}>
            {es
              ? "Un reparto aleatorio deja filas de entrenamiento a la derecha del primer registro de test: el modelo ve el futuro sobre el que después se le pregunta. La línea de arriba dibuja esa situación como esquema; no es una ejecución ni lleva ningún recuento."
              : "A random split leaves training rows to the right of the first test record: the model sees the future it is later asked about. The top lane draws that situation as a sketch; it is not a run and it carries no counts."}
          </StoryBeat>
          <StoryBeat title={es ? "Fronteras que se comprueban solas" : "Boundaries that check themselves"}>
            {es
              ? "Por eso el datamart parte cronológicamente y comprueba sus propias fronteras: la marca de tiempo nunca decrece al cruzarlas, ningún identificador de vídeo se repite entre particiones, y el primer registro de test va más de siete minutos después del último de validación. La separación del diagrama es una anotación, no una escala."
              : "So the datamart splits chronologically and checks its own boundaries: the timestamp never decreases across them, no video id repeats between partitions, and the earliest test record sits more than seven minutes after the last validation record. The gap in the diagram is an annotation, not a scale."}
          </StoryBeat>
          <div className="flex gap-8 flex-wrap">
            <StoryStat value="731" label={es ? "filas en el datamart" : "rows in the datamart"} accent />
            <StoryStat value="511" label={es ? "entrenamiento" : "train"} />
            <StoryStat value="109" label={es ? "validación" : "validation"} />
            <StoryStat value="111" label="test" />
          </div>
        </StoryProse>
      </StoryChapter>

      {/* 05 — The metrics, and the contradiction inside them */}
      <StoryChapter index="05" eyebrow={es ? "Métricas que no cuadran" : "Metrics that disagree"}>
        <StoryStage>
          <MetricDivergence isDark={isDark} es={es} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Tres familias, no una" : "Three families, not one"}>
            {es
              ? "Sobre 89 consultas de test contra un pool de 620 candidatos, medí las tres familias en k=5, 10 y 20. NDCG sube en los tres cortes. MRR baja en los tres. Recall baja en los tres. La línea de color está encima de la referencia en un panel y debajo en los otros dos."
              : "Over 89 test queries against a 620-row candidate pool, I measured all three families at k=5, 10 and 20. NDCG rises at all three cut-offs. MRR falls at all three. Recall falls at all three. The coloured line is above the reference in one panel and below it in the other two."}
          </StoryBeat>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <StoryStat value="0.429" label={es ? "NDCG@5, pipeline completo" : "NDCG@5, full pipeline"} accent />
            <StoryStat
              value="0.165"
              label={es ? "Recall@5 (recuperación: 0.305)" : "Recall@5 (retrieval: 0.305)"}
            />
          </div>

          <StoryBeat title={es ? "Y eso no debería poder pasar" : "And that should not be possible"}>
            {es
              ? "Con relevancia binaria esto es aritméticamente casi imposible. Si hay menos elementos relevantes dentro del top-k (Recall baja) y el primero relevante aparece más abajo (MRR baja), entonces DCG@k tiene que bajar; e IDCG@k no cambia, porque depende del conjunto de relevantes y no del orden. NDCG@k no puede subir. Sube."
              : "Under binary relevance this is close to arithmetically impossible. If fewer relevant items sit inside the top-k (Recall falls) and the first relevant item is deeper (MRR falls), then DCG@k must fall; and IDCG@k does not change, because it depends on the relevant set, not on the ranking. NDCG@k cannot rise. It rises."}
          </StoryBeat>

          <StoryBeat title={es ? "Dos explicaciones plausibles" : "Two plausible explanations"}>
            {es
              ? "La primera: NDCG usa ganancias graduadas de engagement mientras MRR y Recall usan etiquetas binarias, así que no miden la misma noción de relevancia y el desacuerdo es real pero no contradictorio. La segunda, más incómoda: que IDCG se calcule sobre el conjunto recuperado y no sobre el conjunto completo de relevantes, lo que infla NDCG justo para un ranker que devuelve menos elementos pero mejor ordenados. Es exactamente el perfil de este reranker."
              : "The first: NDCG uses graded engagement gains while MRR and Recall use binary labels, so they do not measure the same notion of relevance and the disagreement is real but not contradictory. The second, and more uncomfortable: that IDCG is computed over the retrieved set rather than the full relevant set, which inflates NDCG precisely for a ranker that returns fewer but better-ordered items. That is exactly this reranker's profile."}
          </StoryBeat>

          <StoryBeat title={es ? "Por qué no titulo con la subida de NDCG" : "Why I do not headline the NDCG gain"}>
            {es
              ? "Porque no sé cuál de las dos explicaciones es la correcta, y la segunda convertiría la mejora de NDCG en un artefacto de mi propio arnés de evaluación. Hasta auditarlo, la lectura defendible es la caída de MRR y Recall: el reranker cambia cobertura por orden en la cabeza de la lista. Eso encaja con el producto (lo mejor de lo relevante, no descubrimiento), pero es una decisión, no una victoria."
              : "Because I do not know which of the two explanations holds, and the second would make the NDCG gain an artefact of my own evaluation harness. Until that is audited, the defensible reading is the MRR and Recall drop: the reranker trades coverage for ordering at the head of the list. That fits the product (best of what is relevant, not discovery), but it is a decision, not a win."}
          </StoryBeat>

          <StoryBeat title={es ? "El parámetro está conectado de verdad" : "The knob is genuinely wired"}>
            {es
              ? "La mezcla por defecto es coseno 0.6 más engagement-z 0.4, expuesta como configuración. Ponerla en 0.2 / 0.8 da NDCG@5 0.389, por debajo del 0.429 por defecto: el parámetro cambia la métrica, así que no es decorativo. Ese contraste compara dos configuraciones bajo el mismo arnés, así que sigue en pie aunque la pregunta sobre IDCG se resuelva del peor modo."
              : "The default blend is cosine 0.6 plus engagement-z 0.4, exposed as a config knob. Setting it to 0.2 / 0.8 gives NDCG@5 0.389, below the 0.429 default: the knob moves the metric, so it is not cosmetic. That comparison holds the harness fixed and varies only the configuration, so it stands even if the IDCG question resolves the worse way."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 06 — Honest limits */}
      <StoryChapter index="06" eyebrow={es ? "Los límites" : "The limits"}>
        <StoryStage>
          <div
            className="w-full max-w-[340px] rounded-xl px-5 py-5 text-[13px] leading-relaxed"
            style={{ border: `1px solid ${rose}44`, background: `${rose}10`, color: tileText }}
          >
            {es
              ? "La verdad de referencia es un proxy de engagement. Un sistema optimizado contra un proxy hereda el sesgo de popularidad del corpus con el que se entrenó."
              : "Ground truth is an engagement proxy. A system optimised against a proxy inherits the popularity bias of the corpus it was trained on."}
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Lo que estas métricas no demuestran" : "What these numbers don't prove"}>
            {es
              ? "Sin un registro de feedback real, el objetivo más defendible disponible es un proxy: se consideran relevantes los vídeos que comparten hashtag o keyword y caen en el cuantil alto de engagement. Es razonable, y aun así es un proxy."
              : "Without an implicit-feedback log, the most defensible offline target available is a proxy: items count as relevant when they share a hashtag or keyword and land in the top engagement quantile. It is reasonable, and it is still a proxy."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "Registrarlo como limitación importa más que el número que produce. Una métrica sin su asterisco es una métrica que alguien va a citar fuera de contexto."
              : "Recording that as a limitation matters more than the number it produces. A metric without its asterisk is a metric someone will quote out of context."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 07 — Why it isn't online */}
      <StoryChapter index="07" eyebrow={es ? "Por qué no está online" : "Why it isn't online"}>
        <StoryStage>
          {/* maxWidth is inline, not a max-w-* utility: `.story-stage > *` sets
              max-width:100% and wins the cascade tie, so the utility is dead. */}
          <div className="w-full flex flex-col gap-4" style={{ maxWidth: 340 }}>
            <svg
              viewBox="0 0 200 128"
              className="tk-rise w-full h-auto block"
              role="img"
              aria-label={
                es
                  ? "Coste diario en GCP durante abril: casi cero durante tres semanas y luego una meseta plana de 13,23 euros al día del 17 al 23 de abril, la semana en que se mantuvo una instancia caliente, que concentra el 92% de los 100,40 euros del mes. Sostenida un año entero, esa meseta son 4.828 euros."
                  : "Daily GCP cost through April: near zero for three weeks, then a flat plateau of 13.23 euros a day from the 17th to the 23rd, the week one instance was kept warm, which accounts for 92% of the month's 100.40 euros. Held for a full year, that plateau is 4,828 euros."
              }
            >
              {/* Euro axis. Two gridlines and the zero: enough to read a height. */}
              {[0, 5, 10].map((v) => (
                <g key={v}>
                  {v > 0 && (
                    <line
                      x1={PLOT.x0}
                      y1={yAt(v)}
                      x2={PLOT.x1}
                      y2={yAt(v)}
                      stroke={isDark ? "rgba(148,163,184,0.22)" : "rgba(71,85,105,0.18)"}
                      strokeWidth={0.5}
                    />
                  )}
                  <text
                    className="font-mono"
                    x={PLOT.x0 - 4}
                    y={yAt(v) + 2.4}
                    fontSize={7}
                    textAnchor="end"
                    fill={faint}
                  >
                    {`€${v}`}
                  </text>
                </g>
              ))}

              {/* One column per day. Rose for the seven warm days, faint for the rest. */}
              {COST_COLS.map((c) => (
                <rect
                  key={c.i}
                  className="tk-col"
                  style={{ ["--i" as string]: `${c.i}` }}
                  x={c.x}
                  y={c.y}
                  width={BAR_W}
                  height={c.h}
                  rx={0.7}
                  fill={c.warm ? rose : isDark ? "rgba(148,163,184,0.55)" : "rgba(71,85,105,0.45)"}
                />
              ))}

              {/* The projection: that same day, held across the whole frame. */}
              <line
                x1={PLOT.x0}
                y1={PLATEAU_Y}
                x2={PLOT.x1}
                y2={PLATEAU_Y}
                stroke={rose}
                strokeWidth={0.8}
                strokeDasharray="3 2.5"
              />
              <text
                className="font-mono"
                x={PLOT.x0}
                y={PLATEAU_Y - 3.5}
                fontSize={7}
                fill={rose}
              >
                {es ? "€13,23 / día" : "€13.23 / day"}
              </text>
              <text
                className="font-mono"
                x={PLOT.x1}
                y={PLATEAU_Y - 3.5}
                fontSize={7}
                textAnchor="end"
                fill={rose}
              >
                {es ? "× 365 = €4.828" : "× 365 = €4,828"}
              </text>

              {/* Baseline. */}
              <line
                x1={PLOT.x0}
                y1={PLOT.base}
                x2={PLOT.x1}
                y2={PLOT.base}
                stroke={isDark ? "rgba(148,163,184,0.5)" : "rgba(71,85,105,0.45)"}
                strokeWidth={0.7}
              />

              {/* Only the two run extremes get a day tick; the bracket names the rest. */}
              {[
                { i: 0, l: "1" },
                { i: APRIL.days - 1, l: "30" },
              ].map(({ i, l }) => (
                <text
                  key={l}
                  className="font-mono"
                  x={xAt(i) + BAR_W / 2}
                  y={PLOT.base + 8.5}
                  fontSize={7}
                  textAnchor="middle"
                  fill={faint}
                >
                  {l}
                </text>
              ))}

              {/* Bracket under the seven warm days. */}
              <path
                d={`M${WARM_X0} 102 L${WARM_X0} 106 L${WARM_X1} 106 L${WARM_X1} 102`}
                fill="none"
                stroke={rose}
                strokeWidth={0.7}
                strokeOpacity={0.75}
              />
              <text
                className="font-mono"
                x={(WARM_X0 + WARM_X1) / 2}
                y={114}
                fontSize={7}
                textAnchor="middle"
                fill={rose}
              >
                {es ? "17-23 abr" : "17-23 Apr"}
              </text>
              <text
                className="font-mono"
                x={(WARM_X0 + WARM_X1) / 2}
                y={123}
                fontSize={6.5}
                textAnchor="middle"
                fill={faint}
              >
                {es ? "92% del mes" : "92% of the month"}
              </text>
            </svg>

            <div className="flex flex-col gap-2">
              {[
                { k: es ? "facturado en abril" : "billed in April", v: es ? "€100,40" : "€100.40" },
                {
                  k: es ? "instancia caliente" : "instance kept warm",
                  v: es ? "7 días · €13,23/día" : "7 days · €13.23/day",
                },
                {
                  k: es ? "subidas reales esa semana" : "real uploads that week",
                  v: es ? "menos de 12" : "fewer than 12",
                },
              ].map((t) => (
                <div
                  key={t.k}
                  className="tower-band glass-tile rounded-lg px-3 py-2.5 flex items-baseline justify-between gap-3"
                >
                  <span className="font-mono text-[11px]" style={{ color: faint }}>
                    {t.k}
                  </span>
                  <span className="text-[11px] tracking-[0.08em]" style={{ color: tileText }}>
                    {t.v}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10.5px] leading-relaxed font-mono" style={{ color: faint }}>
              {es
                ? "El export solo es fiable por semanas: los 23 días fuera de la meseta reparten a partes iguales lo que queda del mes, no son lecturas diarias."
                : "The export is only trustworthy by week: the 23 off-plateau days split whatever is left of the month evenly — they aren't daily readings."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Cuarenta segundos de arranque en frío" : "A forty-second cold start"}>
            {es
              ? "BLIP, Whisper, EasyOCR y SBERT cargan enteros antes de la primera petición. Para que el demo fuera usable había que fijar min-instances=1 — y una instancia caliente se paga por hora, no por uso."
              : "BLIP, Whisper, EasyOCR and SBERT all load before the first request. Making the demo usable meant pinning min-instances=1 — and a warm instance is billed by the hour, not by use."}
          </StoryBeat>
          <StoryBeat title={es ? "La meseta es la factura" : "The plateau is the bill"}>
            {es
              ? "Siete días calientes concentran el 92% del gasto del mes. La línea discontinua es esa meseta sostenida todo el año: no es una estimación con supuestos, es el mismo día repetido 365 veces."
              : "Seven warm days account for 92% of the month's spend. The dashed line is that plateau held for a year: not an estimate with assumptions, just the same day repeated 365 times."}
          </StoryBeat>
          <StoryStat value="€4,828" label={es ? "coste anualizado del plató" : "annualised run-rate"} />
          <StoryBeat title={es ? "Apagarlo fue la conclusión" : "Turning it off was the conclusion"}>
            {es
              ? "Esa cifra sostenía un sistema que aquella semana atendió menos de una docena de subidas reales. La decisión de apagarlo no es una nota al pie: es la conclusión de ingeniería del proyecto, y la razón por la que aquí hay un vídeo en vez de un enlace."
              : "That figure supported a system serving fewer than a dozen real uploads that week. Turning it off isn't a footnote: it is the project's engineering conclusion, and the reason this page has a video instead of a link."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 08 — Built by seven */}
      <StoryChapter index="08" eyebrow={es ? "Entre siete" : "Built by seven"}>
        <StoryStage>
          <div className="w-full max-w-[320px] grid grid-cols-3 gap-3">
            {[
              { v: "98", l: es ? "commits míos" : "my commits" },
              { v: "282", l: es ? "del equipo" : "team total" },
              { v: "7", l: es ? "personas" : "people" },
              { v: "22", l: es ? "PRs abiertos" : "PRs opened" },
              { v: "9", l: es ? "PRs revisados" : "PRs reviewed" },
              { v: "25", l: es ? "tests de scoring" : "scoring tests" },
            ].map((s) => (
              <div
                key={s.l}
                className="tower-band rounded-lg px-2 py-3 text-center"
                style={{ border: cardBorder, background: cardBg }}
              >
                <div className="font-mono text-base" style={{ color: tileText }}>
                  {s.v}
                </div>
                <div className="text-[10px] leading-tight mt-0.5" style={{ color: faint }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Integrar fue el trabajo" : "Integration was the job"}>
            {es
              ? "Con siete personas y varias líneas de trabajo en paralelo, los conflictos de merge a tres bandas eran semanales. Resolverlos, correr el pipeline completo en local para comprobar que nada se rompía y sólo entonces abrir el PR fue, en la práctica, mi rol por defecto."
              : "With seven people and several streams in flight, three-way merge conflicts happened weekly. Resolving them, running the full pipeline locally to check nothing regressed, and only then opening the PR became my default role."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "También escribí la documentación de arquitectura, el runbook del recomendador y la guía de despliegue, para que cualquiera del equipo pudiera añadir un endpoint o relanzar un entrenamiento sin pasar por mí."
              : "I also wrote the architecture overview, the recommender runbook and the deployment guide, so anyone on the team could add an endpoint or start a training run without going through me."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "Los tests de regresión sobre el código de scoring validan las métricas contra resultados conocidos analíticamente. Es la diferencia entre una métrica en la que confías y un número que sale por pantalla."
              : "The regression tests over the scoring code validate the metrics against analytically known ground truth. That is the difference between a metric you trust and a number that appears on screen."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>
    </div>
  );
}
