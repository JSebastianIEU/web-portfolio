"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/domain/i18n";
import { PhoneFrame, useInView } from "./ProductFrames";

type Verdict = "ok" | "used" | "invalid";

/* A scripted night at the door. GEN-4821 shows up twice: the second time is
   the forwarded screenshot. All codes are made up. */
const SCRIPT: { code: string; kind: { es: string; en: string }; v: Verdict }[] = [
  { code: "GEN-4821", kind: { es: "General", en: "General" }, v: "ok" },
  { code: "PAL-0193", kind: { es: "Palco", en: "Table" }, v: "ok" },
  { code: "GEN-4821", kind: { es: "General", en: "General" }, v: "used" },
  { code: "GEN-5107", kind: { es: "General", en: "General" }, v: "ok" },
  { code: "GEN-3990", kind: { es: "Código vencido", en: "Expired code" }, v: "invalid" },
  { code: "GEN-5230", kind: { es: "General", en: "General" }, v: "ok" },
];

const STEP_MS = 1900;
const SYNC_MS = 2200;

const LABEL: Record<Verdict, { es: string; en: string }> = {
  ok: { es: "Entra", en: "Admit" },
  used: { es: "Ya entró", en: "Already in" },
  invalid: { es: "No válida", en: "Not valid" },
};

/**
 * Chapter 05: the doorman's phone. Tickets arrive in a queue and get one of
 * three verdicts. "No signal" keeps validating on the device; switching back
 * shows the pending reads syncing. Paused while off screen.
 */
export default function DoorScanner({ lang }: { lang: Locale }) {
  const es = lang === "es";
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef);
  // One state object so a scan can count itself and its offline read atomically.
  const [door, setDoor] = useState({ step: 0, inside: 1, offline: false, pending: 0, syncing: 0 });
  const { step, inside, offline, pending, syncing } = door;

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => {
      setDoor((d) => {
        const next = SCRIPT[(d.step + 1) % SCRIPT.length];
        return {
          ...d,
          step: d.step + 1,
          inside: d.inside + (next.v === "ok" ? 1 : 0),
          pending: d.pending + (d.offline ? 1 : 0),
        };
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [inView]);

  useEffect(() => {
    if (!syncing) return;
    const id = window.setTimeout(() => setDoor((d) => ({ ...d, syncing: 0 })), SYNC_MS);
    return () => window.clearTimeout(id);
  }, [syncing]);

  const current = SCRIPT[step % SCRIPT.length];
  const queue = [1, 2, 3].map((i) => SCRIPT[(step + i) % SCRIPT.length]);

  const toggle = () =>
    setDoor((d) => (d.offline ? { ...d, offline: false, pending: 0, syncing: d.pending } : { ...d, offline: true }));

  const net = offline
    ? es
      ? `Sin señal · ${pending} ${pending === 1 ? "lectura guardada" : "lecturas guardadas"}`
      : `No signal · ${pending} ${pending === 1 ? "read stored" : "reads stored"}`
    : syncing > 0
      ? es
        ? `Sincronizando ${syncing} ${syncing === 1 ? "lectura" : "lecturas"}`
        : `Syncing ${syncing} ${syncing === 1 ? "read" : "reads"}`
      : es
        ? "En línea · al día"
        : "Online · up to date";

  return (
    <div ref={boxRef} className="bp-door">
      <PhoneFrame className="bp-door-phone">
        <div className="bp-door-ui">
          <div className="bp-door-top">
            <span>{es ? "Puerta 1 · Noche de Clave" : "Door 1 · Noche de Clave"}</span>
            <span className="bp-door-net" data-state={offline ? "off" : syncing ? "sync" : "on"}>
              {net}
            </span>
          </div>
          <div key={step} className="bp-verdict" data-v={current.v}>
            <span className="bp-verdict-word">{es ? LABEL[current.v].es : LABEL[current.v].en}</span>
            <span className="bp-verdict-code">
              {current.code} · {es ? current.kind.es : current.kind.en}
            </span>
          </div>
          <div className="bp-door-count">
            <span className="tabular-nums">{inside}</span> {es ? "adentro" : "inside"}
          </div>
          <div className="bp-door-queue" aria-hidden>
            <span className="bp-door-queue-label">{es ? "En fila" : "In line"}</span>
            {queue.map((t, i) => (
              <span key={`${step}-${i}`} className="bp-door-chip">
                {t.code}
              </span>
            ))}
          </div>
        </div>
      </PhoneFrame>

      <button
        type="button"
        role="switch"
        aria-checked={offline}
        onClick={toggle}
        className="bp-switch"
        data-cursor="pointer"
      >
        <span className="bp-switch-track" aria-hidden>
          <span className="bp-switch-thumb" />
        </span>
        {es ? "Sin señal" : "No signal"}
      </button>

      {/* Announce only the network changes; the verdict ticks too often to read aloud. */}
      <p className="sr-only" aria-live="polite">
        {offline
          ? es
            ? "Sin señal: el teléfono sigue validando."
            : "No signal: the phone keeps validating."
          : syncing
            ? es
              ? `Sincronizando ${syncing} lecturas.`
              : `Syncing ${syncing} reads.`
            : ""}
      </p>

      <ul className="bp-legend">
        {(["ok", "used", "invalid"] as Verdict[]).map((v) => (
          <li key={v} data-v={v}>
            {es ? LABEL[v].es : LABEL[v].en}
          </li>
        ))}
      </ul>
    </div>
  );
}
