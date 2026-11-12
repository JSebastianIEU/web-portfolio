"use client";

import type { Locale } from "@/domain/i18n";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./BoletappCylinder.module.css";

/*
 * Replica of the "Lo que se viene" 3D gallery on boletapp.co (ported from
 * apps/web/components/landing/eventos-cilindro.tsx and cilindro.ts). One 3D context: the headline
 * is a plane at z=0 and the cards turn with their real depth, so the front cards pass over the
 * headline and the back ones behind it; the compositor sorts them, no JS per frame.
 * Simplified: no cursor steering, drag or keyboard (the cards are decorative, not links).
 */

const POSITIONS = 12;
const STEP = 360 / POSITIONS;

/** Fixed scatter table from cilindro.ts: angle nudge, height, size, radius factor and tilt. */
const SCATTER = [
  { turn: 0, y: -0.38, scale: 1.08, radius: 1, tilt: -2 },
  { turn: 3, y: 0.34, scale: 0.86, radius: 1.06, tilt: 2.5 },
  { turn: -2, y: -0.12, scale: 0.96, radius: 0.94, tilt: -1 },
  { turn: 4, y: 0.44, scale: 1.1, radius: 0.98, tilt: 1.5 },
  { turn: -3, y: -0.46, scale: 0.82, radius: 1.08, tilt: 3 },
  { turn: 2, y: 0.16, scale: 1, radius: 0.95, tilt: -2.5 },
  { turn: -4, y: -0.32, scale: 0.9, radius: 1.04, tilt: 1 },
  { turn: 3, y: 0.4, scale: 1.06, radius: 0.97, tilt: -1.5 },
  { turn: -2, y: -0.44, scale: 0.94, radius: 1.02, tilt: 2 },
  { turn: 4, y: 0.06, scale: 0.84, radius: 1.07, tilt: -3 },
  { turn: -1, y: -0.36, scale: 1.12, radius: 0.96, tilt: 1 },
  { turn: 3, y: 0.36, scale: 0.9, radius: 1.03, tilt: -2 },
] as const;

function cardTransform(i: number): string {
  const d = SCATTER[i];
  return `rotateY(${i * STEP + d.turn}deg) translateZ(calc(var(--r) * ${d.radius})) translateY(calc(var(--h) * ${d.y})) rotate(${d.tilt}deg) scale(${d.scale})`;
}

/** Cruise: 2 deg/s to the left, as on the site. One full turn, in ms. */
const TURN_MS = 360 / (2 / 1000);
/** Ring tilt (seen a bit from above) and the 2D turn of the whole stage. */
const TILT = -7;
const ROLL = 5;

type Poster = { file: string; title: string; es: string; en: string; place: string; color: string };

// Fictional events only.
const POSTERS: Poster[] = [
  { file: "reggaeton-neon", title: "Perreo Neón Vol. 4", es: "Sáb 13 dic", en: "Sat Dec 13", place: "Sala Norte · Cali", color: "#2a0f4a" },
  { file: "salsa-club", title: "Noche de Clave", es: "Vie 12 dic", en: "Fri Dec 12", place: "Salón Pacífico · Cali", color: "#4a1a0f" },
  { file: "techno-cobalto", title: "Techno Cobalto", es: "Sáb 20 dic", en: "Sat Dec 20", place: "Bodega 9 · Cali", color: "#0e45b0" },
  { file: "festival-montanas", title: "Festival Montañas", es: "Sáb 10 ene", en: "Sat Jan 10", place: "Valle del Cauca", color: "#123a2a" },
  { file: "crossover-rooftop", title: "Crossover Rooftop", es: "Jue 18 dic", en: "Thu Dec 18", place: "Terraza Sur · Cali", color: "#3a2a12" },
  { file: "concierto-estadio", title: "Concierto Estadio", es: "Dom 28 dic", en: "Sun Dec 28", place: "Estadio · Cali", color: "#1457d9" },
];

/**
 * Fills the 12 positions (llenarCilindro): even laps in order, odd laps reversed and shifted
 * one place, so no poster sits next to itself, not even at the seam.
 */
const reversed = [...POSTERS.slice(0, -1).reverse(), POSTERS[POSTERS.length - 1]];
const PANELS = Array.from({ length: POSITIONS }, (_, i) =>
  (Math.floor(i / POSTERS.length) % 2 ? reversed : POSTERS)[i % POSTERS.length],
);

export default function BoletappCylinder({ lang }: { lang: Locale }) {
  const es = lang === "es";
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const words = (es ? "Lo que se viene." : "What's coming.").split(" ");

  useEffect(() => {
    const el = stage.current;
    const r = ring.current;
    if (!el || !r) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The spin is ONE Web Animation on the ring: at cruise it runs on the compositor.
    const spin =
      !reduce && typeof r.animate === "function"
        ? r.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(-360deg)" }], {
            duration: TURN_MS,
            iterations: Number.POSITIVE_INFINITY,
          })
        : null;
    spin?.pause();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !document.hidden) spin?.play();
        else spin?.pause();
        // Reveal once a fifth is on screen; reset only after leaving entirely (replays on return).
        if (e.intersectionRatio >= 0.2) setShown(true);
        else if (!e.isIntersecting) setShown(false);
      },
      { threshold: [0, 0.2] },
    );
    io.observe(el);
    const onVis = () => {
      if (document.hidden) spin?.pause();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      spin?.cancel();
    };
  }, []);

  return (
    <div
      ref={stage}
      className={styles.card}
      data-shown={shown || undefined}
      role="img"
      aria-label={
        es
          ? "Réplica de la galería 3D «Lo que se viene» de boletapp.co: afiches de eventos ficticios girando alrededor del titular."
          : "Replica of the boletapp.co “Lo que se viene” 3D gallery: fictional event posters turning around the headline."
      }
    >
      <div aria-hidden className={styles.glow} />
      <div aria-hidden className={styles.reveal}>
        <div className={styles.scene}>
          {/* Headline at z=0, its centre on the top edge of the front cards. */}
          <div className={styles.headline}>
            <div className={styles.parallax}>
              <p className={styles.title}>
                {words.map((w, i) => (
                  <span key={w} className={styles.word} style={{ "--i": i } as CSSProperties}>
                    {w}
                    {i < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </p>
            </div>
          </div>
          {/* Three 3D layers: the fixed tilt, the scroll coupling (CSS) and the spin (WAAPI). */}
          <div
            className={styles.layer}
            style={{ transform: `rotate(${ROLL}deg) translateZ(calc(var(--r) * -0.35)) rotateX(${TILT}deg)` }}
          >
            <div className={styles.scroll}>
              <div ref={ring} className={styles.layer}>
                {PANELS.map((p, i) => (
                  <div
                    key={`${p.file}-${i}`}
                    className={styles.panel}
                    style={{ transform: cardTransform(i), background: p.color }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/projects/boletapp/flyers/${p.file}.webp`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className={styles.poster}
                    />
                    <div className={styles.shade} />
                    <div className={styles.caption}>
                      <p className={styles.name}>{p.title}</p>
                      <p className={styles.meta}>
                        {es ? p.es : p.en} · {p.place}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
