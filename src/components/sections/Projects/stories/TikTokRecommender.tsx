"use client";

import { useState } from "react";
import { Hash, Play, RotateCcw } from "lucide-react";
import type { Locale } from "@/domain/i18n";
import recs from "@/data/tiktokRecs.json";

/**
 * The explainable hashtag recommender, running on the project's own real
 * output. Pick a caption and the widget shows what the pipeline actually does:
 * encode the caption with SBERT, pull its nearest neighbours out of the 22k-post
 * corpus, and surface the hashtags those neighbours really used — ranked by how
 * many neighbours share each tag and the average engagement of the posts that
 * carried it. Every tag traces back to real posts shown alongside it, which is
 * the whole point: no black box, no invented tags.
 *
 * The recommendations, neighbour captions and engagement numbers in
 * src/data/tiktokRecs.json come from encoding each query with all-MiniLM-L6-v2
 * and searching a FAISS index over the real corpus — not hand-written.
 */

type Neighbor = { caption: string; sim: number; views: number; likes: number };
type Rec = { tag: string; freq: number; k: number; avgLogViews: number; approxViews: number };
type Sample = { query: string; neighborsShown: Neighbor[]; hashtags: Rec[]; k: number };

const SAMPLES = recs.samples as Record<string, Sample>;

/** Which captions to offer and what to call each vertical in the chip row. */
const VERTICALS: Array<{ id: string; en: string; es: string }> = [
  { id: "fitness", en: "Fitness", es: "Fitness" },
  { id: "mealprep", en: "Meal prep", es: "Meal prep" },
  { id: "finance", en: "Money", es: "Dinero" },
  { id: "skincare", en: "Skincare", es: "Skincare" },
  { id: "travel", en: "Travel", es: "Viajes" },
  { id: "pets", en: "Pets", es: "Mascotas" },
];
const CARDS = VERTICALS.filter((v) => SAMPLES[v.id]);

/** 1_500_000 → "1.5M", 12_400 → "12.4K". */
function compact(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

type Props = { isDark: boolean; lang: Locale };

export default function TikTokRecommender({ isDark, lang }: Props) {
  const es = lang === "es";
  const [active, setActive] = useState(0);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const sample = SAMPLES[CARDS[active].id];
  const maxFreq = Math.max(...sample.hashtags.map((h) => h.freq), 1);

  const run = () => {
    setState("running");
    setTimeout(() => setState("done"), 1100);
  };
  const pick = (i: number) => {
    setActive(i);
    setState("idle");
  };

  const muted = isDark ? "rgba(148,163,184,0.82)" : "rgba(71,85,105,0.82)";
  const faint = isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)";

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base md:text-lg font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
          {es ? "Recomiéndale hashtags a un caption" : "Recommend hashtags for a caption"}
        </h3>
        <p className="text-[11.5px]" style={{ color: muted }}>
          {es
            ? "Cada tag sale de posts reales que significan lo mismo — no de un modelo de caja negra."
            : "Every tag comes from real posts that mean the same thing — not a black-box model."}
        </p>
      </div>

      {/* Caption picker: one scrolling row on phones, wraps on desktop. */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar flex-nowrap md:flex-wrap -mx-1 px-1">
        {CARDS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pick(i)}
            data-cursor="pointer"
            aria-pressed={i === active}
            className="shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors whitespace-nowrap"
            style={{
              cursor: "none",
              border:
                i === active
                  ? `1px solid ${isDark ? "#f8fafc" : "#0f172a"}`
                  : isDark
                  ? "1px solid rgba(255,255,255,0.16)"
                  : "1px solid rgba(15,23,42,0.14)",
              background: i === active ? (isDark ? "#f8fafc" : "#0f172a") : "transparent",
              color:
                i === active ? (isDark ? "#0f172a" : "#f8fafc") : isDark ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.8)",
            }}
          >
            {es ? c.es : c.en}
          </button>
        ))}
      </div>

      {/* The query caption, styled like a post caption. */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: muted }}>
          {es ? "Caption de entrada" : "Input caption"}
        </span>
        <div
          className={`tk-caption relative overflow-hidden rounded-xl px-4 py-3 text-[13.5px] leading-snug ${
            state === "running" ? "is-encoding" : ""
          }`}
          style={{
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.025)",
            color: isDark ? "rgba(240,244,250,0.95)" : "rgba(15,23,42,0.9)",
          }}
        >
          <span aria-hidden style={{ color: faint }}>
            “
          </span>
          {sample.query}
          <span aria-hidden style={{ color: faint }}>
            ”
          </span>
          <span className="tk-encode-line" aria-hidden />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        {/* Recommended hashtags */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: muted }}>
            {es ? "Hashtags recomendados" : "Recommended hashtags"}
          </span>
          <div className="flex flex-col gap-2 min-h-[150px] md:min-h-[210px]" aria-live="polite">
            {state !== "done" ? (
              <p className="text-[12px] my-auto" style={{ color: faint }}>
                {state === "running"
                  ? es
                    ? "Buscando los vecinos más cercanos en el corpus de 22k posts…"
                    : "Retrieving nearest neighbours across the 22k-post corpus…"
                  : es
                  ? "Pulsa Ejecutar para ver qué tags usan los posts vecinos."
                  : "Hit Run to see which tags the neighbouring posts use."}
              </p>
            ) : (
              sample.hashtags.map((h, i) => (
                <div key={h.tag} className="vpr-row flex items-center gap-2" style={{ ["--d" as string]: `${i * 70}ms` }}>
                  <span
                    className="flex items-center gap-1 text-[12px] w-[132px] shrink-0 font-medium truncate"
                    style={{ color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.85)" }}
                  >
                    <Hash size={11} aria-hidden style={{ color: "#22d3ee" }} className="shrink-0" />
                    <span className="truncate">{h.tag}</span>
                  </span>
                  <span
                    className="flex-1 h-[6px] rounded-full overflow-hidden"
                    style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)" }}
                  >
                    <span
                      className="vpr-bar block h-full rounded-full"
                      style={{
                        width: `${Math.round((h.freq / maxFreq) * 100)}%`,
                        background: i === 0 ? "#22d3ee" : isDark ? "rgba(226,232,240,0.42)" : "rgba(15,23,42,0.32)",
                        ["--d" as string]: `${i * 70 + 90}ms`,
                      }}
                    />
                  </span>
                  <span className="font-mono text-[10px] w-[70px] text-right tabular-nums" style={{ color: muted }}>
                    {h.freq}/{h.k} · {compact(h.approxViews)}
                  </span>
                </div>
              ))
            )}
          </div>
          {state === "done" && (
            <p className="font-mono text-[9.5px]" style={{ color: faint }}>
              {es ? "frecuencia entre vecinos · engagement medio" : "frequency among neighbours · avg engagement"}
            </p>
          )}
        </div>

        {/* The real posts behind the tags */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: muted }}>
            {es ? "Porque estos posts están cerca" : "Because these real posts are nearby"}
          </span>
          <div className="flex flex-col gap-2 min-h-[150px] md:min-h-[210px]" aria-live="polite">
            {state !== "done" ? (
              <p className="text-[12px] my-auto" style={{ color: faint }}>
                {es ? "Los vecinos semánticos aparecen aquí." : "The semantic neighbours show up here."}
              </p>
            ) : (
              sample.neighborsShown.map((n, i) => (
                <div
                  key={i}
                  className="vpr-row rounded-lg px-3 py-2 flex flex-col gap-1"
                  style={{
                    ["--d" as string]: `${i * 70 + 120}ms`,
                    border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.07)",
                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.015)",
                  }}
                >
                  <span className="text-[11.5px] leading-snug" style={{ color: isDark ? "rgba(226,232,240,0.88)" : "rgba(15,23,42,0.82)" }}>
                    {n.caption}
                  </span>
                  <span className="font-mono text-[9.5px] flex gap-2.5" style={{ color: faint }}>
                    <span style={{ color: "#22d3ee" }}>{(n.sim * 100).toFixed(0)}% {es ? "similar" : "match"}</span>
                    <span>♥ {compact(n.likes)}</span>
                    <span>▶ {compact(n.views)}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action row: full-width run on phones so it never collides with the nav. */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={state === "running"}
          data-cursor="pointer"
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-60"
          style={{ background: isDark ? "#f8fafc" : "#0f172a", color: isDark ? "#0f172a" : "#f8fafc", cursor: "none" }}
        >
          {state === "running" ? (es ? "Buscando…" : "Retrieving…") : es ? "Recomendar" : "Recommend"}
          <Play size={15} aria-hidden />
        </button>
        {state === "done" && (
          <button
            type="button"
            onClick={() => setState("idle")}
            data-cursor="pointer"
            aria-label={es ? "Reiniciar" : "Reset"}
            className="glass-tile inline-flex items-center justify-center rounded-full h-10 w-10 shrink-0"
            style={{ cursor: "none" }}
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        )}
      </div>

      <p className="text-[10px] leading-relaxed" style={{ color: faint }}>
        {es
          ? `Salida real: cada caption se codifica con all-MiniLM-L6-v2 (384-d) y se buscan sus ${sample.k} vecinos más cercanos por coseno en un índice FAISS sobre el corpus de 22k posts. Los tags y las cifras de engagement salen de esos posts vecinos.`
          : `Real output: each caption is encoded with all-MiniLM-L6-v2 (384-d) and its ${sample.k} nearest neighbours are retrieved by cosine over a FAISS index of the 22k-post corpus. The tags and engagement figures come from those neighbouring posts.`}
      </p>
    </div>
  );
}
