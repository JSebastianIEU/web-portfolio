"use client";

import { useRef } from "react";
import type { Locale } from "@/domain/i18n";
import { useInView } from "./ProductFrames";

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  titleEn?: string;
  sub: { es: string; en: string }[];
  logos?: string[];
  main?: boolean;
};

const MID = 180; // centre of the main column
const L = (text: string) => ({ es: text, en: text });

const CLIENTS: Box[] = [
  { x: 10, y: 8, w: 104, h: 46, title: "Web", sub: [L("Next.js · React")], logos: ["nextdotjs", "react"] },
  { x: 128, y: 8, w: 104, h: 46, title: "App fan", sub: [L("Expo · iOS / Android")], logos: ["expo"] },
  { x: 246, y: 8, w: 104, h: 46, title: "App Pro", sub: [L("Expo · iOS / Android")], logos: ["expo"] },
];

const MAIN: Box[] = [
  { x: 110, y: 96, w: 140, h: 58, title: "Vercel", sub: [L("Next.js · BFF")], logos: ["vercel", "nextdotjs"], main: true },
  {
    x: 110,
    y: 206,
    w: 140,
    h: 58,
    title: "Cloud Run",
    sub: [{ es: "API FastAPI modular", en: "Modular FastAPI API" }],
    logos: ["googlecloud", "fastapi", "python"],
    main: true,
  },
  {
    x: 110,
    y: 330,
    w: 140,
    h: 68,
    title: "Cloud SQL",
    sub: [L("PostgreSQL"), { es: "RLS por organización", en: "RLS per organization" }],
    logos: ["postgresql"],
    main: true,
  },
];

const LEFT: Box[] = [
  { x: 0, y: 99, w: 92, h: 52, title: "CI/CD", sub: [L("GitHub Actions")], logos: ["githubactions"] },
  { x: 0, y: 198, w: 92, h: 46, title: "Cloud Storage", sub: [{ es: "archivos", en: "files" }], logos: ["googlecloud"] },
  { x: 0, y: 258, w: 92, h: 46, title: "Cloud KMS", sub: [{ es: "llaves", en: "keys" }], logos: ["googlecloud"] },
];

const RIGHT: Box[] = [
  { x: 268, y: 172, w: 92, h: 44, title: "Pagos", titleEn: "Payments", sub: [{ es: "pasarela local", en: "local gateway" }] },
  { x: 268, y: 224, w: 92, h: 44, title: "Correo", titleEn: "Email", sub: [L("Resend")], logos: ["resend"] },
  { x: 268, y: 276, w: 92, h: 44, title: "SMS", sub: [L("Twilio")], logos: ["twilio"] },
  { x: 268, y: 328, w: 92, h: 44, title: "LLM", sub: [{ es: "Boletabot", en: "Boletabot" }] },
];

const cy = (b: Box) => b.y + b.h / 2;
const [vercel, run, sql] = MAIN;
const runY = cy(run);

/* Every edge points downstream, so the packets read as requests flowing in. */
const EDGES: string[] = [
  ...CLIENTS.map((c) => {
    const x = c.x + c.w / 2;
    return `M${x} ${c.y + c.h} C${x} 76 ${MID} 76 ${MID} ${vercel.y}`;
  }),
  `M${MID} ${vercel.y + vercel.h} L${MID} ${run.y}`,
  `M${MID} ${run.y + run.h} L${MID} ${sql.y}`,
  `M${LEFT[0].x + LEFT[0].w} ${cy(LEFT[0])} L${vercel.x} ${cy(vercel)}`,
  ...LEFT.slice(1).map((b) => `M${run.x} ${runY} C${run.x - 9} ${runY} ${b.x + b.w + 9} ${cy(b)} ${b.x + b.w} ${cy(b)}`),
  ...RIGHT.map((b) => {
    const rx = run.x + run.w;
    return `M${rx} ${runY} C${rx + 9} ${runY} ${b.x - 9} ${cy(b)} ${b.x} ${cy(b)}`;
  }),
];

function Node({ b, es }: { b: Box; es: boolean }) {
  const logo = b.main ? 15 : 11;
  const pad = b.main ? 10 : 7;
  const titleY = b.main ? b.y + pad + logo + 13 : b.y + 17;
  const textX = b.main ? b.x + pad : b.x + pad + (b.logos ? logo + 5 : 0);
  return (
    <g className={b.main ? "bp-node bp-node-main" : "bp-node"}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={b.main ? 12 : 9} />
      {(b.main ? b.logos ?? [] : (b.logos ?? []).slice(0, 1)).map((slug, i) => (
        <image
          key={slug}
          href={`/images/projects/boletapp/stack/${slug}.svg`}
          x={b.x + pad + i * (logo + 6)}
          y={b.main ? b.y + pad : b.y + 7}
          width={logo}
          height={logo}
          className="bp-logo"
          // A missing logo just disappears; the text label carries the meaning.
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ))}
      <text x={textX} y={titleY} className="bp-node-title">
        {!es && b.titleEn ? b.titleEn : b.title}
      </text>
      {b.sub.map((s, i) => (
        <text key={i} x={b.main ? textX : b.x + pad} y={titleY + (b.main ? 13 : 15) + i * 11} className="bp-node-sub">
          {es ? s.es : s.en}
        </text>
      ))}
    </g>
  );
}

/**
 * Chapter 09: the production topology. Clients reach Vercel, Vercel's BFF is
 * the only thing that talks to Cloud Run, and Cloud Run owns the database and
 * every third-party service. Packets travel the edges (stroke-dashoffset, pure
 * CSS) and freeze off screen; reduced motion drops them entirely.
 */
export default function InfraDiagram({ lang }: { lang: Locale }) {
  const es = lang === "es";
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const label = es
    ? "Diagrama de infraestructura: web, app fan y app Pro llegan a Vercel (Next.js y BFF), que habla con Cloud Run (API FastAPI modular), que usa Cloud SQL (PostgreSQL con RLS por organización). Alrededor: GitHub Actions, Cloud Storage, Cloud KMS, pasarela de pagos, correo, SMS y un LLM."
    : "Infrastructure diagram: web, fan app and Pro app reach Vercel (Next.js and BFF), which talks to Cloud Run (modular FastAPI API), which uses Cloud SQL (PostgreSQL with per-organization RLS). Around it: GitHub Actions, Cloud Storage, Cloud KMS, payment gateway, email, SMS and an LLM.";

  return (
    <div ref={ref} className="bp-infra" data-paused={inView ? undefined : "true"}>
      <svg viewBox="0 0 360 404" role="img" aria-label={label}>
        <g className="bp-edges">
          {EDGES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g className="bp-packets" aria-hidden>
          {EDGES.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={100}
              className="bp-packet"
              style={{ animationDelay: `${(i * 0.37) % 2.4}s` }}
            />
          ))}
        </g>
        {[...CLIENTS, ...MAIN, ...LEFT, ...RIGHT].map((b) => (
          <Node key={b.title + b.x} b={b} es={es} />
        ))}
      </svg>
    </div>
  );
}
