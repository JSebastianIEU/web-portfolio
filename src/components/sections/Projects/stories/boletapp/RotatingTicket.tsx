"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/domain/i18n";
import { useInView, usePrefersReducedMotion } from "./ProductFrames";

const PERIOD_S = 10;
const N = 25; // modules per side

/** Deterministic PRNG so a given period always draws the same pattern. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const inEye = (x: number, y: number) =>
  (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);

/**
 * A QR-looking pattern: random modules plus the three position eyes. It is
 * NOT a real QR code and encodes nothing; it only has to look like one and
 * visibly change every period.
 */
function qrPath(seed: number) {
  const rnd = mulberry32(seed * 2654435761);
  let d = "";
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) if (!inEye(x, y) && rnd() > 0.52) d += `M${x} ${y}h1v1h-1z`;
  for (const [ex, ey] of [
    [0, 0],
    [N - 7, 0],
    [0, N - 7],
  ]) {
    // Outer 7x7 ring (evenodd hole) and the 3x3 pupil.
    d += `M${ex} ${ey}h7v7h-7zM${ex + 1} ${ey + 1}v5h5v-5zM${ex + 2} ${ey + 2}h3v3h-3z`;
  }
  return d;
}

export function QrArt({ seed, label }: { seed: number; label: string }) {
  const d = useMemo(() => qrPath(seed), [seed]);
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="bp-qr" role="img" aria-label={label} shapeRendering="crispEdges">
      <path d={d} fillRule="evenodd" fill="#06070C" />
    </svg>
  );
}

function TicketHead({ es }: { es: boolean }) {
  return (
    <div className="bp-ticket-head">
      <span className="bp-ticket-org">Noche Pacífica</span>
      <span className="bp-ticket-title">Noche de Clave</span>
      <span className="bp-ticket-meta">{es ? "Sáb · 10:00 p. m. · General" : "Sat · 10:00 PM · General"}</span>
    </div>
  );
}

/**
 * Chapter 04: the ticket whose code rotates. "Take a screenshot" freezes a
 * copy beside it; once the period rolls over, the copy is stale and says so.
 * Off screen the clock stops; reduced motion keeps the swap but drops the ring.
 */
export default function RotatingTicket({ lang }: { lang: Locale }) {
  const es = lang === "es";
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef);
  const reduced = usePrefersReducedMotion();
  // Seconds the widget has been on screen; the code and countdown derive from it.
  const [sec, setSec] = useState(0);
  const [shot, setShot] = useState<number | null>(null);
  const tick = 1 + Math.floor(sec / PERIOD_S);
  const left = PERIOD_S - (sec % PERIOD_S);

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [inView]);

  const expired = shot !== null && shot !== tick;
  const status =
    shot === null
      ? ""
      : expired
        ? es
          ? "El pantallazo venció: el código de la boleta ya cambió."
          : "The screenshot expired: the ticket's code has already changed."
        : es
          ? "Pantallazo tomado. Espera a que cambie el código."
          : "Screenshot taken. Wait for the code to change.";

  return (
    <div ref={boxRef} className="bp-rotate">
      <div className="bp-ticket">
        <TicketHead es={es} />
        <div className="bp-ticket-body">
          <QrArt seed={tick} label={es ? "QR de la boleta (ilustrativo)" : "Ticket QR (illustrative)"} />
          <div className="bp-ticket-live">
            <svg viewBox="0 0 36 36" className="bp-ring" aria-hidden>
              <circle cx="18" cy="18" r="15" className="bp-ring-track" />
              <circle
                key={tick}
                cx="18"
                cy="18"
                r="15"
                pathLength={100}
                className="bp-ring-fill"
                data-run={reduced ? undefined : inView ? "true" : "paused"}
              />
            </svg>
            <span>
              {es ? "Código vivo · cambia en " : "Live code · changes in "}
              <span className="tabular-nums">{left}s</span>
            </span>
          </div>
          <button type="button" className="bp-shot-btn" onClick={() => setShot(tick)} data-cursor="pointer">
            {shot === null
              ? es
                ? "Hacer pantallazo"
                : "Take a screenshot"
              : es
                ? "Hacer otro pantallazo"
                : "Take another screenshot"}
          </button>
        </div>
      </div>

      {shot !== null && (
        <figure className="bp-ticket bp-ticket-copy" data-expired={expired ? "true" : undefined}>
          <figcaption className="bp-copy-cap">{es ? "Pantallazo" : "Screenshot"}</figcaption>
          <TicketHead es={es} />
          <div className="bp-ticket-body">
            <QrArt seed={shot} label={es ? "QR del pantallazo" : "Screenshot QR"} />
            <span className="bp-copy-state">
              {expired ? (es ? "Código vencido" : "Code expired") : es ? "Aún vigente" : "Still valid"}
            </span>
          </div>
        </figure>
      )}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
