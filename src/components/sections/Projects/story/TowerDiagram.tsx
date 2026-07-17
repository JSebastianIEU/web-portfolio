"use client";

import type { Locale } from "@/domain/i18n";

type Props = {
  isDark: boolean;
  lang: Locale;
  /** 0-24 highlighted band, or null. Drives the "which floor?" beat. */
  active?: number | null;
};

const FLOORS = 21;
const BASEMENTS = 4;

/**
 * An original schematic of the tower — drawn from published facts (a 1:4:9
 * slab, 21 storeys over 4 basements) rather than tracing anyone's drawings.
 * Each band is a floor in the model's label space, so the same diagram doubles
 * as a legend for the 25-way classification.
 */
export default function TowerDiagram({ isDark, lang, active = null }: Props) {
  const stroke = isDark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.22)";
  const fill = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.045)";
  const accent = "#67e8f9";
  const muted = isDark ? "rgba(148,163,184,0.75)" : "rgba(71,85,105,0.75)";

  const bandH = 13;
  const gap = 2.4;
  const towerW = 92;
  const x = 54;
  const topPad = 26;
  const totalH = (FLOORS + BASEMENTS) * (bandH + gap);

  return (
    <svg
      viewBox={`0 0 240 ${totalH + topPad + 40}`}
      className="h-[52vh] md:h-[66vh] w-auto"
      role="img"
      aria-label={
        lang === "es"
          ? "Esquema de la torre: 21 plantas sobre 4 sótanos, las 25 etiquetas del modelo"
          : "Schematic of the tower: 21 floors over 4 basements, the model's 25 labels"
      }
    >
      {/* ground line */}
      <line
        x1="12"
        x2="228"
        y1={topPad + FLOORS * (bandH + gap) + 2}
        y2={topPad + FLOORS * (bandH + gap) + 2}
        stroke={stroke}
        strokeDasharray="3 3"
      />

      {Array.from({ length: FLOORS + BASEMENTS }).map((_, i) => {
        // i=0 is the top floor; bands below the ground line are basements.
        const isBasement = i >= FLOORS;
        const y = topPad + i * (bandH + gap);
        const on = active === i;
        return (
          <g key={i} className="tower-band" style={{ "--d": `${i * 26}ms` } as React.CSSProperties}>
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
            {(i === 0 || i === FLOORS - 1 || i === FLOORS + BASEMENTS - 1) && (
              <text
                x={x - 8}
                y={y + bandH - 3}
                textAnchor="end"
                fontSize="7"
                fill={muted}
                fontFamily="ui-monospace, monospace"
              >
                {/* 21 floors counted from a ground floor 0 run F00..F20 —
                    labelling the top F21 would imply a 22nd floor and break
                    the 25-label space the whole story is built on. */}
                {i === 0 ? `F${FLOORS - 1}` : i === FLOORS - 1 ? "F00" : `B0${BASEMENTS}`}
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

      <text x="120" y={totalH + topPad + 26} textAnchor="middle" fontSize="8" fill={muted} fontFamily="ui-monospace, monospace">
        {lang === "es" ? "25 etiquetas · 21 plantas + 4 sótanos" : "25 labels · 21 floors + 4 basements"}
      </text>
    </svg>
  );
}
