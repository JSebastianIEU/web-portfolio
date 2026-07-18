"use client";

import type { Locale } from "@/domain/i18n";

type Props = { isDark: boolean; lang: Locale };

/**
 * The analyzer's eight branches.
 *
 * The three timings are the measured per-branch means from the profiling run
 * (CPU-only, six representative videos). They are the numbers that MOTIVATED
 * the optimisation in chapter 03 -- they are not the shipped wall clock, and
 * nothing here should imply that they are. Every other branch profiled under
 * 10 s, which is stated once in the caption rather than invented per row.
 */
const FAN: { en: string; es: string; t?: { en: string; es: string }; heavy: boolean }[] = [
  { en: "Whisper (int8)", es: "Whisper (int8)", t: { en: "57.2 s", es: "57,2 s" }, heavy: true },
  { en: "EasyOCR EN+ES", es: "EasyOCR EN+ES", t: { en: "64.8 s", es: "64,8 s" }, heavy: true },
  { en: "BLIP captions", es: "captions BLIP", t: { en: "78.6 s", es: "78,6 s" }, heavy: true },
  { en: "KeyBERT", es: "KeyBERT", heavy: false },
  { en: "Demucs (opt.)", es: "Demucs (opc.)", heavy: false },
  { en: "scene cuts", es: "cortes", heavy: false },
  { en: "colour + motion", es: "color + mov.", heavy: false },
  { en: "frame timeline", es: "fotogramas", heavy: false },
];

/**
 * One video fanning out into eight parallel analysis branches and converging
 * back into a single representation.
 *
 * The reveal is driven by THREE group-level animations rather than one per
 * branch, on purpose: eight siblings each carrying their own timeline would
 * unroll top to bottom and read as a sequence, which is the opposite of what
 * a thread pool does.
 *
 * All three groups hang off the CHAPTER's named timeline (--chapter), not
 * view(). Two reasons. A view() on an element inside the sticky stage stalls
 * the moment the stage pins -- the same trap documented on .dataset-mosaic.
 * And three sibling groups have three different bounding boxes, so the same
 * percentage on view() would fire at three different scroll positions,
 * reintroducing exactly the positional stagger this diagram exists to avoid.
 * One box, one timeline, eight wires arriving together.
 */
export default function BranchFanDiagram({ isDark, lang }: Props) {
  const es = lang === "es";
  const accent = "#22d3ee";
  const stroke = isDark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.22)";
  const fill = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.045)";
  const label = isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.92)";
  const muted = isDark ? "rgba(148,163,184,0.75)" : "rgba(71,85,105,0.75)";

  // Layout derived from the row rhythm, so adding a branch cannot break the
  // frame (same rule as TowerDiagram).
  const rowH = 28;
  const gapY = 6;
  const topPad = 14;
  const originX = 40;
  const gateX = 66;
  const cardX = 76;
  const cardW = 128;
  const cardR = cardX + cardW; // 204
  const mergeX = 236;
  const cy = (i: number) => topPad + rowH / 2 + i * (rowH + gapY); // 28, 62, 96 ...
  const midY = (cy(0) + cy(FAN.length - 1)) / 2; // 147
  const lastY = cy(FAN.length - 1) + rowH / 2; // 280
  const vw = 272;

  // Kept in JSX, not CSS, so the pivots can never drift from the geometry.
  const box = { transformBox: "view-box" as const };
  const timesEs = "78,6 s / 64,8 s / 57,2 s";
  const timesEn = "78.6 s / 64.8 s / 57.2 s";

  return (
    <svg
      viewBox={`0 0 ${vw} ${lastY + 36}`}
      className="w-full max-w-[360px] h-auto block"
      role="img"
      aria-label={
        es
          ? `Un vídeo se abre en ocho ramas de análisis que corren a la vez en un thread pool. Tres dominan el perfilado: BLIP, EasyOCR y Whisper, con medias de ${timesEs}. Las otras cinco terminan por debajo de 10 s cada una. Las ocho vuelven a converger en una única representación de rasgos.`
          : `One video fans out into eight analysis branches running at the same time in a thread pool. Three dominate the profile: BLIP, EasyOCR and Whisper, at means of ${timesEn}. The other five each finish under 10 s. All eight converge back into a single feature representation.`
      }
    >
      {/* --- the fan: eight wires, unfurled as one group --- */}
      <g className="tkfan-wires" fill="none" style={{ ...box, transformOrigin: `${originX}px ${midY}px` }}>
        {FAN.map((b, i) => (
          <path
            key={b.en}
            d={`M${originX} ${midY} C52 ${midY} 58 ${cy(i)} ${cardX} ${cy(i)}`}
            stroke={b.heavy ? accent : stroke}
            strokeOpacity={b.heavy ? 0.7 : 1}
            strokeWidth={b.heavy ? 1.1 : 0.8}
          />
        ))}
      </g>

      {/* The pool boundary. Kept OUT of .tkfan-wires: that group animates
          scaleX, which would squash this vertical line's stroke to a hairline
          for the whole reveal. */}
      <line
        className="tkfan-gate"
        x1={gateX}
        x2={gateX}
        y1={topPad - 4}
        y2={lastY + 4}
        stroke={stroke}
        strokeDasharray="2 3"
        strokeWidth="0.8"
      />

      {/* --- source --- */}
      <g>
        <rect x="8" y={midY - 16} width="32" height="32" rx="3" fill={fill} stroke={stroke} strokeWidth="0.8" />
        <text x="24" y={midY + 3} textAnchor="middle" fontSize="8" fill={muted} fontFamily="ui-monospace, monospace">
          {es ? "vídeo" : "video"}
        </text>
      </g>

      {/* --- the eight branch cards: all eight land together --- */}
      <g className="tkfan-nodes" style={{ ...box, transformOrigin: `${cardX + cardW / 2}px ${midY}px` }}>
        {FAN.map((b, i) => (
          <g key={b.en}>
            <rect
              x={cardX}
              y={cy(i) - rowH / 2}
              width={cardW}
              height={rowH}
              rx="2.5"
              fill={b.heavy ? `${accent}14` : fill}
              stroke={b.heavy ? accent : stroke}
              strokeOpacity={b.heavy ? 0.55 : 1}
              strokeWidth="0.8"
            />
            <text
              x={cardX + 7}
              y={cy(i) + 3}
              fontSize="9"
              fill={label}
              fontFamily="ui-monospace, monospace"
            >
              {es ? b.es : b.en}
            </text>
            {b.t && (
              <text
                x={cardR - 7}
                y={cy(i) + 3}
                textAnchor="end"
                fontSize="8"
                fill={accent}
                fontFamily="ui-monospace, monospace"
              >
                {es ? b.t.es : b.t.en}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* --- convergence into one representation --- */}
      <g className="tkfan-merge" style={box}>
        {FAN.map((b, i) => (
          <path
            key={b.en}
            d={`M${cardR} ${cy(i)} C220 ${cy(i)} 220 ${midY} ${mergeX} ${midY}`}
            fill="none"
            stroke={b.heavy ? accent : stroke}
            strokeOpacity={b.heavy ? 0.55 : 0.85}
            strokeWidth="0.8"
          />
        ))}
        <rect x="237" y={midY - 23} width="24" height="46" rx="2.5" fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="0.9" />
        {FAN.map((b, i) => (
          <rect
            key={b.en}
            x="240"
            y={midY - 19.5 + i * 5}
            width="18"
            height="4"
            rx="1"
            fill={b.heavy ? accent : muted}
            fillOpacity={b.heavy ? 0.85 : 0.5}
          />
        ))}
        <text x="249" y={midY + 34} textAnchor="middle" fontSize="7" fill={muted} fontFamily="ui-monospace, monospace">
          {es ? "rasgos" : "features"}
        </text>
      </g>

      <text x={vw / 2} y={lastY + 18} textAnchor="middle" fontSize="8" fill={muted} fontFamily="ui-monospace, monospace">
        {es ? "8 ramas a la vez, un thread pool" : "8 branches at once, one thread pool"}
      </text>
      <text x={vw / 2} y={lastY + 30} textAnchor="middle" fontSize="8" fill={muted} fontFamily="ui-monospace, monospace">
        {es ? "las otras cinco, por debajo de 10 s" : "the other five finish under 10 s each"}
      </text>
    </svg>
  );
}
