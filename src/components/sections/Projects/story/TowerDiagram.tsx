"use client";

import type { Locale } from "@/domain/i18n";

type Props = {
  isDark: boolean;
  lang: Locale;
  /** A dataset label (e.g. "floor10") to highlight, or null. */
  active?: string | null;
};

/**
 * The model's label space, drawn to scale.
 *
 * These are the real classes from the project's dataset.csv — floor3..floor23
 * (21 storeys; the lower floors are not part of the school) and basement0,
 * 2, 3 and 4 (there is no basement1 in the recordings). 25 in total, which is
 * exactly the 4%-chance baseline the story leans on.
 *
 * It is an original schematic derived from published facts about the building
 * (a slab of 1:4:9 proportions), not a trace of anyone's drawings.
 */
const FLOOR_LABELS = Array.from({ length: 21 }, (_, i) => `floor${23 - i}`); // top → bottom
const BASEMENT_LABELS = ["basement0", "basement2", "basement3", "basement4"];
const ALL = [...FLOOR_LABELS, ...BASEMENT_LABELS];

export default function TowerDiagram({ isDark, lang, active = null }: Props) {
  const stroke = isDark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.22)";
  const fill = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.045)";
  const accent = "#22d3ee";
  const muted = isDark ? "rgba(148,163,184,0.75)" : "rgba(71,85,105,0.75)";

  const bandH = 13;
  const gap = 2.4;
  const towerW = 92;
  const x = 58;
  const topPad = 26;
  const groundY = topPad + FLOOR_LABELS.length * (bandH + gap);
  const totalH = ALL.length * (bandH + gap);

  const short = (label: string) =>
    label.startsWith("basement") ? `B${label.replace("basement", "")}` : `F${label.replace("floor", "")}`;

  return (
    <svg
      viewBox={`0 0 240 ${totalH + topPad + 40}`}
      className="h-[52vh] md:h-[66vh] w-auto"
      role="img"
      aria-label={
        lang === "es"
          ? "Esquema de la torre con las 25 etiquetas del modelo: plantas 3 a 23 y sótanos 0, 2, 3 y 4"
          : "Schematic of the tower with the model's 25 labels: floors 3 to 23 and basements 0, 2, 3 and 4"
      }
    >
      {/* ground line */}
      <line x1="12" x2="228" y1={groundY} y2={groundY} stroke={stroke} strokeDasharray="3 3" />

      {ALL.map((label, i) => {
        const isBasement = label.startsWith("basement");
        const y = topPad + i * (bandH + gap);
        const on = active === label;
        // Label the extremes of each run so the axis reads without clutter.
        const showLabel = i === 0 || label === "floor3" || label === "basement0" || i === ALL.length - 1;
        return (
          <g key={label} className="tower-band" style={{ "--d": `${i * 26}ms` } as React.CSSProperties}>
            <rect
              x={x}
              y={y}
              width={towerW}
              height={bandH}
              rx="1.5"
              fill={on ? accent : fill}
              fillOpacity={on ? 0.85 : isBasement ? 0.5 : 1}
              stroke={on ? accent : stroke}
              strokeWidth={on ? 1.2 : 0.7}
            />
            {showLabel && (
              <text
                x={x - 8}
                y={y + bandH - 3}
                textAnchor="end"
                fontSize="7"
                fill={on ? accent : muted}
                fontFamily="ui-monospace, monospace"
              >
                {short(label)}
              </text>
            )}
          </g>
        );
      })}

      {/* 1 : 4 : 9 proportion marker — the architects' stated geometry */}
      <g fontFamily="ui-monospace, monospace" fontSize="7.5" fill={muted}>
        <line x1={x + towerW + 12} x2={x + towerW + 12} y1={topPad} y2={topPad + totalH} stroke={stroke} />
        <text x={x + towerW + 18} y={topPad + totalH / 2} fill={muted}>
          1 : 4 : 9
        </text>
      </g>

      <text
        x="120"
        y={totalH + topPad + 26}
        textAnchor="middle"
        fontSize="8"
        fill={muted}
        fontFamily="ui-monospace, monospace"
      >
        {lang === "es" ? "25 clases · F3–F23 + 4 sótanos" : "25 classes · F3–F23 + 4 basements"}
      </text>
    </svg>
  );
}
