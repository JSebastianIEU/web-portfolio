"use client";

import type { Locale } from "@/domain/i18n";
import { ArrowRight, ChevronDown, Menu, Sparkles } from "lucide-react";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import styles from "./BoletappHeroReplica.module.css";
import { TICKET_D, WORDMARK_PATHS } from "./boletappWordmark";

/*
 * Replica of the boletapp.co home hero (ported from apps/web/components/landing/hero.tsx,
 * hero-video.tsx, frase-glitch.tsx, intro.tsx, intro-geometry.ts and lib/intro-gate.ts).
 * Differences from the original: it lives in a rounded card instead of the viewport, the brand
 * intro runs once when the card scrolls into view (not on page load), and the buttons and nav
 * are decorative.
 */

// --- Intro geometry (intro-geometry.ts): the zoom enters through the "t" of the wordmark. ---

/** Applies an affine map to every (x,y) pair of a path made of ABSOLUTE commands. */
function bake(d: string, f: (x: number, y: number) => [number, number]): string {
  return d.replace(/(-?\d*\.?\d+)([ ,]+)(-?\d*\.?\d+)/g, (_, x, sep, y) => {
    const [X, Y] = f(+x, +y);
    return `${X.toFixed(2)}${sep}${Y.toFixed(2)}`;
  });
}

const CX = 253.57;
const CY = 44.2;

/** The lockup with the <Logo> transforms baked in, centred on the origin. */
const LOGO_D = [
  ...WORDMARK_PATHS.map((p) => bake(p.d, (x, y) => [-6.6 + 0.1 * (x + p.tx) - CX, 71.7 - 0.1 * y - CY])),
  bake(TICKET_D, (x, y) => [458.1 + 3.7895 * x - CX, 1.5 + 3.7895 * y - CY]),
].join(" ");

// Centred viewBox, 507/0.17 wide: with `meet` the logo is ~17% of the card width.
const VB_W = 507.14 / 0.17;
const VB_H = VB_W * (9 / 16);
const VIEWBOX = `${(-VB_W / 2).toFixed(2)} ${(-VB_H / 2).toFixed(2)} ${VB_W.toFixed(2)} ${VB_H.toFixed(2)}`;
const BOX = { x: -9000, y: -9000, width: 18000, height: 18000 };

type Pt = [number, number];

/** Flattens an absolute M/L/Q/Z path (what the glyphs use) into a polygon. */
function flatten(d: string): Pt[] {
  const pts: Pt[] = [];
  let cur: Pt = [0, 0];
  for (const m of d.matchAll(/([MLQZ])([^MLQZ]*)/g)) {
    const n = (m[2].match(/-?\d*\.?\d+/g) ?? []).map(Number);
    if (m[1] === "M" || m[1] === "L") {
      cur = [n[0], n[1]];
      pts.push(cur);
    } else if (m[1] === "Q") {
      const p0 = cur;
      const c: Pt = [n[0], n[1]];
      const p1: Pt = [n[2], n[3]];
      for (let i = 1; i <= 8; i++) {
        const t = i / 8;
        const u = 1 - t;
        pts.push([
          u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
          u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
        ]);
      }
      cur = p1;
    }
  }
  return pts;
}

function inside(poly: Pt[], [x, y]: Pt): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function distToEdges(poly: Pt[], [x, y]: Pt): number {
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j];
    const [bx, by] = poly[i];
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return best;
}

/** Interior point farthest from any edge (90x90 grid search over the bbox). */
function poleOfInaccessibility(d: string): { x: number; y: number; r: number } {
  const poly = flatten(d);
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let best = { x: 0, y: 0, r: -1 };
  for (let i = 1; i < 90; i++) {
    for (let j = 1; j < 90; j++) {
      const p: Pt = [x0 + ((x1 - x0) * i) / 90, y0 + ((y1 - y0) * j) / 90];
      if (!inside(poly, p)) continue;
      const r = distToEdges(poly, p);
      if (r > best.r) best = { x: p[0], y: p[1], r };
    }
  }
  return best;
}

const T_GLYPH = WORDMARK_PATHS.find((p) => p.tx === 2146) ?? WORDMARK_PATHS[4];
const POLE = poleOfInaccessibility(T_GLYPH.d);
/** Zoom origin in the centred lockup space, and the radius of the circle inscribed there. */
const INTRO_ORIGIN = { x: -6.6 + 0.1 * (POLE.x + T_GLYPH.tx) - CX, y: 71.7 - 0.1 * POLE.y - CY };
const INTRO_R = 0.1 * POLE.r;
const TO_ORIGIN = `translate(${(-INTRO_ORIGIN.x).toFixed(3)} ${(-INTRO_ORIGIN.y).toFixed(3)})`;

// --- Rotating phrase (frase-glitch.tsx) ---

const PHRASES = ["sin complique.", "en el celular.", "sin recargos.", "de una."] as const;
const EVERY_MS = 2800;
const GLITCH_MS = 600;
const STEP_MS = 50;
const NOISE = "#%&*+=<>/|_?01";

/** Each keyframe holds until the next: the glitch jumps, it does not slide. */
const held = (k: Keyframe[]): Keyframe[] => k.map((f) => ({ ...f, easing: "steps(1, end)" }));

const SHAKE = held([
  { transform: "none", opacity: 1 },
  { transform: "translate3d(-4px, 0, 0) skewX(-8deg)", opacity: 0.85 },
  { transform: "translate3d(3px, 0, 0)", opacity: 1 },
  { transform: "skewX(6deg)", opacity: 0.6 },
  { transform: "translate3d(5px, 0, 0)", opacity: 1 },
  { transform: "translate3d(-2px, 0, 0) skewX(-4deg)", opacity: 0.8 },
  { transform: "none", opacity: 1 },
]);

const FLICKER = held([
  { opacity: 1 },
  { opacity: 0.25 },
  { opacity: 1 },
  { opacity: 0.4 },
  { opacity: 0.95 },
  { opacity: 0.7 },
  { opacity: 1 },
]);

/** Horizontal slices of a colour copy jumping sideways; one in three is the whole phrase shifted. */
function slices(side: 1 | -1): Keyframe[] {
  return held(
    Array.from({ length: 10 }, (_, j) => {
      const edge = j === 0 || j === 9;
      const top = j % 3 === 1 ? 0 : Math.random() * 85;
      const bottom = j % 3 === 1 ? 0 : Math.max(0, 100 - top - (8 + Math.random() * 30));
      return {
        opacity: edge ? 0 : 0.9,
        transform: `translate3d(${side * (3 + Math.random() * 9)}px, 0, 0)`,
        clipPath: `inset(${top.toFixed(1)}% 0 ${bottom.toFixed(1)}% 0)`,
      };
    }),
  );
}

function withNoise(text: string, solved: (i: number) => boolean): string {
  return Array.from(text, (c, i) =>
    c === " " || solved(i) ? c : NOISE[Math.floor(Math.random() * NOISE.length)],
  ).join("");
}

/** Neon phrase that glitches into the next one every EVERY_MS while `running`. Writes text to the DOM directly. */
function GlitchPhrase({ running }: { running: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const neon = useRef<HTMLSpanElement>(null);
  const magenta = useRef<HTMLSpanElement>(null);
  const cyan = useRef<HTMLSpanElement>(null);
  const index = useRef(0);

  useEffect(() => {
    const r = root.current;
    const n = neon.current;
    const m = magenta.current;
    const c = cyan.current;
    if (!running || !r || !n || !m || !c) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step: ReturnType<typeof setInterval> | undefined;
    let live: Animation[] = [];
    const write = (t: string) => {
      n.textContent = t;
      m.textContent = t;
      c.textContent = t;
    };
    const animate = (el: HTMLElement, k: Keyframe[], ms: number) => {
      const a = el.animate?.(k, { duration: ms });
      if (a) live.push(a);
    };

    const cycle = setInterval(() => {
      if (document.hidden) return;
      const old = PHRASES[index.current];
      index.current = (index.current + 1) % PHRASES.length;
      const next = PHRASES[index.current];
      live = [];
      r.dataset.glitch = "";
      animate(m, slices(-1), GLITCH_MS);
      animate(c, slices(1), GLITCH_MS);
      animate(n, SHAKE, GLITCH_MS);
      const steps = GLITCH_MS / STEP_MS;
      const half = steps / 2;
      let t = 0;
      clearInterval(step);
      step = setInterval(() => {
        t++;
        if (t < half) {
          write(withNoise(old, () => Math.random() > t / half));
        } else if (t < steps) {
          const ready = ((t - half) / half) * next.length;
          write(withNoise(next, (j) => j < ready));
        } else {
          clearInterval(step);
          write(next);
          delete r.dataset.glitch;
          animate(n, FLICKER, 450);
        }
      }, STEP_MS);
    }, EVERY_MS);

    return () => {
      clearInterval(cycle);
      clearInterval(step);
      for (const a of live) a.cancel();
      // Stopped mid-glitch: leave the current phrase clean, not noise.
      write(PHRASES[index.current]);
      delete r.dataset.glitch;
    };
  }, [running]);

  return (
    <span ref={root} className={styles.glitch}>
      <span ref={neon} className={styles.neon}>
        {PHRASES[0]}
      </span>
      <span ref={magenta} aria-hidden className={`${styles.glitchLayer} ${styles.magenta}`}>
        {PHRASES[0]}
      </span>
      <span ref={cyan} aria-hidden className={`${styles.glitchLayer} ${styles.cyan}`}>
        {PHRASES[0]}
      </span>
    </span>
  );
}

/** The official lockup, all white (as on the hero header). */
function WhiteLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 507.14 88.40" aria-hidden className={className}>
      <g fill="currentColor" transform="translate(-6.600 71.700) scale(0.1 -0.1)">
        {WORDMARK_PATHS.map((p) => (
          <path key={p.tx} transform={`translate(${p.tx} 0)`} d={p.d} />
        ))}
      </g>
      <path fill="currentColor" transform="translate(458.100 1.5) scale(3.7895)" d={TICKET_D} />
    </svg>
  );
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type IntroState = "idle" | "run" | "done";

export default function BoletappHeroReplica({ isDark, lang }: { isDark: boolean; lang: Locale }) {
  const es = lang === "es";
  const maskId = `bp-intro-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const card = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const overlay = useRef<SVGSVGElement>(null);
  const logo = useRef<SVGGElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const [intro, setIntro] = useState<IntroState>("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anims: Animation[] = [];
    let started = false;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;

    const startIntro = () => {
      started = true;
      const svg = overlay.current;
      const g = logo.current;
      if (reduce || !svg || !g || typeof g.animate !== "function") {
        setIntro("done");
        return;
      }
      setIntro("run");
      // intro-gate.ts introRun, measured against the card instead of the window.
      const { width: w, height: h } = el.getBoundingClientRect();
      const mobile = window.innerWidth < 1024;
      const k = mobile ? 2.7 : 1;
      const pxPerUnit = Math.min(w / VB_W, h / VB_H); // `meet`
      const F = Math.max(k, (1.1 * (Math.hypot(w, h) / 2)) / (INTRO_R * pxPerUnit));
      const HOLD = mobile ? 120 : 220;
      const ZOOM = mobile ? 850 : 1150;
      const curve: KeyframeAnimationOptions = {
        delay: HOLD,
        duration: ZOOM,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)",
        fill: "both",
      };
      if (!mobile) {
        // Desktop: scale the vector inside the mask, crisp on every frame.
        anims.push(g.animate([{ transform: "scale(1)" }, { transform: `scale(${F})` }], curve));
      } else {
        // Phone: the start x2.7 goes inside (vector, painted once); the GPU scales the rest.
        anims.push(g.animate([{ transform: `scale(${k})` }, { transform: `scale(${k})` }], { duration: 1, fill: "forwards" }));
        const zoom = svg.animate([{ transform: "scale(1)" }, { transform: `scale(${F / k})` }], curve);
        anims.push(zoom);
        zoom.pause();
        requestAnimationFrame(() => requestAnimationFrame(() => zoom.play()));
      }
      const hd = header.current;
      if (hd?.animate) {
        anims.push(
          hd.animate(
            [
              { opacity: 0, transform: "translateY(-24px)" },
              { opacity: 1, transform: "none" },
            ],
            { delay: HOLD + ZOOM - 370, duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
          ),
        );
      }
      doneTimer = setTimeout(() => setIntro("done"), HOLD + ZOOM + 30);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        const v = video.current;
        setVisible(e.isIntersecting);
        if (v && !reduce) {
          if (e.isIntersecting) {
            v.muted = true;
            v.play().catch(() => {
              /* autoplay blocked: the poster stays */
            });
          } else {
            v.pause();
          }
        }
        if (!started && e.intersectionRatio >= 0.45) startIntro();
      },
      { threshold: [0, 0.45] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(doneTimer);
      for (const a of anims) a.cancel();
    };
  }, []);

  const shadow = isDark ? "0 40px 90px -30px rgba(0,0,0,0.75)" : "0 36px 80px -32px rgba(6,7,12,0.5)";

  return (
    <div
      ref={card}
      className={styles.card}
      data-intro={intro}
      data-visible={visible || undefined}
      style={{ boxShadow: shadow }}
      role="img"
      aria-label={
        es
          ? "Réplica animada del hero de boletapp.co: video de rumba, el titular «Tu boleta, sin complique.» y los botones Ver la app y Ver eventos."
          : "Animated replica of the boletapp.co hero: a party video, the headline “Tu boleta, sin complique.” and the Ver la app and Ver eventos buttons."
      }
    >
      <div aria-hidden className={styles.backdrop}>
        <video
          ref={video}
          className={styles.video}
          poster="/videos/boletapp/rumba-poster.jpg"
          preload="metadata"
          muted
          loop
          playsInline
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src="/videos/boletapp/rumba-720.webm" type="video/webm" />
          <source src="/videos/boletapp/rumba-720.mp4" type="video/mp4" />
        </video>
        <div className={styles.veil} />
      </div>

      <div aria-hidden className={styles.inner}>
        <div ref={header} className={styles.header}>
          <WhiteLogo className={styles.headerLogo} />
          <nav className={styles.nav}>
            <span>Eventos</span>
            <span>Preguntas</span>
            <span>Negocios</span>
          </nav>
          <span className={styles.login}>Ingresar</span>
          <Menu className={styles.menu} />
        </div>

        <div className={styles.content}>
          <p className={`${styles.rise} ${styles.eyebrow}`}>
            <Sparkles className={styles.eyebrowIcon} />
            Colombia · desde Cali
          </p>
          <p className={styles.title}>
            <span className={styles.word} style={delay(50)}>
              Tu
            </span>{" "}
            <span className={styles.word} style={delay(105)}>
              boleta,
            </span>
            <span className={`${styles.word} ${styles.wordLine}`} style={delay(160)}>
              <GlitchPhrase running={visible && intro !== "idle"} />
            </span>
          </p>
          <p className={`${styles.rise} ${styles.lede}`} style={delay(300)}>
            La compras, te llega al correo y queda en tu celular. En la puerta muestras el QR y entras.
          </p>
          <div className={`${styles.rise} ${styles.ctas}`} style={delay(420)}>
            <span role="presentation" className={styles.btnGold}>
              Ver la app
            </span>
            <span role="presentation" className={styles.btnOutline}>
              <span className={styles.roll}>
                <span>Ver eventos</span>
                <span>Ver eventos</span>
              </span>
              <ArrowRight className={styles.btnIcon} />
            </span>
          </div>
        </div>

        <span className={`${styles.rise} ${styles.chevron}`} style={delay(900)}>
          <ChevronDown className={styles.pulse} />
        </span>
      </div>

      {intro !== "done" ? (
        <svg ref={overlay} className={styles.intro} viewBox={VIEWBOX} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <mask id={maskId}>
            <rect {...BOX} fill="#fff" />
            <g ref={logo}>
              <g transform={TO_ORIGIN}>
                <path d={LOGO_D} fill="#000" />
              </g>
            </g>
          </mask>
          <rect {...BOX} fill="#06070c" mask={`url(#${maskId})`} />
        </svg>
      ) : null}

      <span className={styles.badge}>{es ? "Réplica del hero de boletapp.co" : "Replica of the boletapp.co hero"}</span>
    </div>
  );
}
