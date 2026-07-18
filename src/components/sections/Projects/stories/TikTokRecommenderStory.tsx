"use client";

import type { Locale } from "@/domain/i18n";
import SkipToDemo from "../story/SkipToDemo";
import { StoryBeat, StoryChapter, StoryProse, StoryStage, StoryStat } from "../story/StoryScene";

type Props = { isDark: boolean; lang: Locale };

/** Held-out evaluation, 89 test queries against the 620-row candidate pool. */
const NDCG = [
  { k: "5", retrieval: 0.303, full: 0.429 },
  { k: "10", retrieval: 0.368, full: 0.478 },
  { k: "20", retrieval: 0.431, full: 0.555 },
];

/** Mean wall-clock per branch, six representative videos, CPU-only. */
const BRANCHES = [
  { name: "BLIP captioning", s: 78.6 },
  { name: "EasyOCR", s: 64.8 },
  { name: "Whisper", s: 57.2 },
  { name: "KeyBERT + rest", s: 9.8 },
];

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
  const emerald = "#34d399";
  const muted = isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)";
  const faint = isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)";
  const tileText = isDark ? "#f8fafc" : "#0f172a";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.025)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)";

  const maxBranch = Math.max(...BRANCHES.map((b) => b.s));

  return (
    <div className="flex flex-col">
      <SkipToDemo target="demo" label={es ? "Ver el demo" : "Skip to the demo"} isDark={isDark} />

      {/* 01 — The problem */}
      <StoryChapter index="01" eyebrow={es ? "El problema" : "The problem"}>
        <StoryStage>
          <div className="flex flex-col items-stretch gap-3 w-full max-w-[320px]">
            <div
              className="rounded-xl px-4 py-6 text-center text-[13px] leading-snug"
              style={{ border: cardBorder, background: cardBg, color: tileText }}
            >
              {es ? "subes el vídeo" : "you hit publish"}
            </div>
            <div className="text-center text-[11px] font-mono" style={{ color: faint }}>
              ↓
            </div>
            <div
              className="rounded-xl px-4 py-6 text-center text-[13px] leading-snug"
              style={{ border: `1px solid ${rose}55`, background: `${rose}14`, color: tileText }}
            >
              {es ? "y esperas" : "and you wait"}
            </div>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Publicar es apostar a ciegas" : "Publishing is a blind bet"}>
            {es
              ? "Un creador decide caption, hashtags y los primeros dos segundos sin ninguna señal de si funcionarán. El feedback llega cuando ya no se puede cambiar nada."
              : "A creator picks the caption, the hashtags and the first two seconds with no signal about whether any of it works. The feedback arrives once nothing can be changed."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "La pregunta del proyecto era si se puede decir algo útil antes de publicar, comparando un vídeo nuevo con los que ya existen y midiendo en qué se parecen de verdad."
              : "The question this project asked was whether anything useful can be said before publishing — by comparing a new video against ones that already exist, and measuring what they actually share."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 02 — Understanding the video */}
      <StoryChapter index="02" eyebrow={es ? "Entender el vídeo" : "Understanding the video"}>
        <StoryStage>
          <div className="flex flex-col gap-2 w-full max-w-[340px]">
            {[
              es ? "transcripción (Whisper)" : "transcript (Whisper)",
              es ? "texto en pantalla (OCR)" : "on-screen text (OCR)",
              es ? "descripción de fotogramas (BLIP)" : "frame captions (BLIP)",
              es ? "palabras clave (KeyBERT)" : "keywords (KeyBERT)",
              es ? "cortes de escena" : "scene cuts",
              es ? "color y movimiento" : "colour and motion",
            ].map((label, i) => (
              <div
                key={label}
                className="tower-band rounded-lg px-3 py-2 text-[12px] flex items-center gap-2"
                style={{ border: cardBorder, background: cardBg, color: tileText, animationDelay: `${i * 60}ms` }}
              >
                <span className="font-mono text-[10px]" style={{ color: accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {label}
              </div>
            ))}
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Ocho ramas en paralelo" : "Eight branches in parallel"}>
            {es
              ? "Un vídeo no es una cosa: es audio, texto en pantalla, imagen y ritmo. El analizador abre ocho ramas en un thread pool — transcripción cuantizada a int8, OCR en inglés y español, descripción de fotogramas, extracción de keywords, separación de audio opcional, detección de cortes, rasgos de color y movimiento, y una línea de tiempo de fotogramas representativos."
              : "A video isn't one thing: it's audio, on-screen text, imagery and pacing. The analyzer opens eight branches in a thread pool — int8-quantised transcription, OCR in English and Spanish, frame captioning, keyword extraction, optional audio separation, scene-cut detection, colour and motion features, and a timeline of representative frames."}
          </StoryBeat>
          <StoryStat value="1,236" label={es ? "líneas en el analizador" : "lines in the analyzer"} />
        </StoryProse>
      </StoryChapter>

      {/* 03 — Making it fast */}
      <StoryChapter index="03" eyebrow={es ? "Hacerlo rápido" : "Making it fast"}>
        <StoryStage>
          <div className="flex flex-col gap-3 w-full max-w-[340px]">
            {BRANCHES.map((b) => (
              <div key={b.name} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between text-[11px]" style={{ color: muted }}>
                  <span>{b.name}</span>
                  <span className="font-mono" style={{ color: tileText }}>
                    {b.s}s
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)" }}>
                  <div
                    className="tk-grow h-full rounded-full"
                    style={{ width: `${(b.s / maxBranch) * 100}%`, background: accent }}
                  />
                </div>
              </div>
            ))}
            <p className="text-[11px] leading-snug mt-1" style={{ color: faint }}>
              {es
                ? "Media por rama sobre seis vídeos, sólo CPU."
                : "Mean per branch over six videos, CPU-only."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "De cinco minutos a menos de uno" : "From five minutes to under one"}>
            {es
              ? "La primera versión tardaba más de cinco minutos por vídeo. Bajarlo a menos de sesenta segundos costó varias rondas de profiling honesto, no de intuición."
              : "The first version took over five minutes per video. Getting it under sixty seconds took several rounds of honest profiling rather than intuition."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "La mayor victoria fue quitar la detección de caras por fotograma, que resultó ser el cuello de botella real. Después: línea de tiempo de 20 a 10 fotogramas, OCR de 5 a 3, y Whisper de small a base."
              : "The biggest win was dropping per-frame face detection, which turned out to be the actual bottleneck. After that: the timeline from 20 frames to 10, OCR from 5 frames to 3, and Whisper from small to base."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "El desglose por rama es la señal que importa: descripción de fotogramas, OCR y transcripción son las tres que justifican mantener una instancia caliente, y por tanto las primeras candidatas a separarse en servicios que escalen a cero."
              : "The per-branch decomposition is the signal that matters: captioning, OCR and transcription are the three that justify a warm instance, and therefore the obvious first pieces to peel out into services that can scale to zero."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 04 — Temporal discipline */}
      <StoryChapter index="04" eyebrow={es ? "Disciplina temporal" : "Temporal discipline"}>
        <StoryStage>
          <div className="w-full max-w-[360px] flex flex-col gap-3">
            <div className="flex h-9 rounded-lg overflow-hidden" style={{ border: cardBorder }}>
              <div className="flex items-center justify-center text-[11px] font-mono" style={{ width: "70%", background: `${accent}22`, color: tileText }}>
                511 train
              </div>
              <div className="flex items-center justify-center text-[11px] font-mono" style={{ width: "15%", background: `${emerald}22`, color: tileText }}>
                109
              </div>
              <div className="flex items-center justify-center text-[11px] font-mono" style={{ width: "15%", background: `${rose}22`, color: tileText }}>
                111
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: faint }}>
              <span>{es ? "más antiguo" : "oldest"}</span>
              <span>→ {es ? "tiempo" : "time"} →</span>
              <span>{es ? "más reciente" : "newest"}</span>
            </div>
            <p className="text-[11px] leading-snug" style={{ color: muted }}>
              {es
                ? "Ningún vídeo aparece en dos particiones. El primer registro de test va más de siete minutos después del último de validación."
                : "No video appears in two splits. The earliest test record sits more than seven minutes after the last validation record."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "El fallo que hace mentir a las métricas" : "The failure mode that makes metrics lie"}>
            {es
              ? "Un recomendador entrenado con información que todavía no existía se evalúa a sí mismo con notas infladas. Es el error más fácil de cometer y el más difícil de detectar, porque el resultado se ve mejor, no peor."
              : "A recommender trained on information that did not exist yet grades itself with inflated marks. It is the easiest mistake to make and the hardest to catch, because the result looks better, not worse."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "Por eso el datamart parte cronológicamente y valida sus propias fronteras: la marca de tiempo no decrece nunca al cruzar la frontera, y ningún identificador de vídeo se repite entre particiones."
              : "So the datamart splits chronologically and validates its own boundaries: the timestamp never decreases across the split, and no video id repeats between partitions."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 05 — Does the reranker earn its place */}
      <StoryChapter index="05" eyebrow={es ? "¿Sirve el reranker?" : "Does the reranker earn it?"}>
        <StoryStage>
          <div className="w-full max-w-[380px] flex flex-col gap-4">
            {NDCG.map((row) => (
              <div key={row.k} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between text-[11px]" style={{ color: muted }}>
                  <span className="font-mono">NDCG@{row.k}</span>
                  <span className="font-mono" style={{ color: emerald }}>
                    +{Math.round(((row.full - row.retrieval) / row.retrieval) * 100)}%
                  </span>
                </div>
                <div className="relative h-7 rounded-md" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)" }}>
                  <div
                    className="tk-grow absolute inset-y-0 left-0 rounded-md"
                    style={{ width: `${row.retrieval * 100}%`, background: isDark ? "rgba(148,163,184,0.35)" : "rgba(71,85,105,0.3)" }}
                  />
                  <div
                    className="tk-grow absolute inset-y-0 left-0 rounded-md"
                    style={{ width: `${row.full * 100}%`, background: `${accent}66`, border: `1px solid ${accent}` }}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center gap-3 text-[10px] font-mono" style={{ color: tileText }}>
                    <span style={{ color: faint }}>{row.retrieval.toFixed(3)}</span>
                    <span>{row.full.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[11px] leading-snug" style={{ color: faint }}>
              {es ? "Sólo recuperación vs. pipeline completo." : "Retrieval only vs. full pipeline."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Mezclar significado con señal de engagement" : "Blending meaning with engagement signal"}>
            {es
              ? "El reranker combina similitud de significado con la señal de engagement normalizada. Sobre 89 consultas de test contra un pool de 620 candidatos, el orden de los resultados mejora de forma clara."
              : "The reranker blends semantic similarity with a z-scored engagement signal. Over 89 test queries against a 620-row candidate pool, the ordering improves clearly."}
          </StoryBeat>
          <StoryBeat title={es ? "Y lo que empeora" : "And what it costs"}>
            {es
              ? "Recall baja en los primeros puestos antes de converger en k=20: el reranker cambia cobertura por calidad de orden en la cabeza de la lista. Para una superficie de descubrimiento sería la dirección equivocada; para “lo mejor de lo relevante”, que es lo que este producto ofrece, es la correcta."
              : "Recall drops at small k before converging at k=20: the reranker trades coverage for ranking quality at the head of the list. For a discovery surface that would be the wrong direction; for the “best of what's relevant” framing this product was built around, it is the right one."}
          </StoryBeat>
          <StoryBeat>
            {es
              ? "El peso de la mezcla es un parámetro configurable, no una constante escondida: moverlo cambia las métricas como debe, lo que confirma que está realmente conectado y no es decorativo."
              : "The blend weight is a configurable knob, not a hidden constant: moving it moves the metrics as expected, which confirms it is actually wired through rather than cosmetic."}
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
          <div className="w-full max-w-[340px] flex flex-col gap-4">
            <div className="flex items-end gap-1 h-28">
              {[0, 0, 0, 0, 0, 0, 0, 0, 0.35, 0.1, 0, 0.85, 1, 1, 1, 1, 1, 0.05].map((h, i) => (
                <div
                  key={i}
                  className="tk-grow flex-1 rounded-t"
                  style={{
                    height: `${Math.max(h * 100, 2)}%`,
                    background: h > 0.5 ? rose : `${accent}88`,
                    animationDelay: `${i * 25}ms`,
                  }}
                />
              ))}
            </div>
            <div className="text-[11px] font-mono" style={{ color: faint }}>
              {es ? "coste diario, abril" : "cost per day, April"}
            </div>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Cuarenta segundos de arranque en frío" : "A forty-second cold start"}>
            {es
              ? "Los cuatro modelos cargan antes de la primera petición. Para que el demo fuera usable había que mantener una instancia caliente — y una instancia caliente se paga por hora, no por uso."
              : "All four models load before the first request. Making the demo usable meant keeping one instance warm — and a warm instance is billed by the hour, not by use."}
          </StoryBeat>
          <StoryStat value="€4,828" label={es ? "coste anualizado del plató" : "annualised run-rate"} accent />
          <StoryBeat>
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
            ].map((s, i) => (
              <div
                key={s.l}
                className="tower-band rounded-lg px-2 py-3 text-center"
                style={{ border: cardBorder, background: cardBg, animationDelay: `${i * 50}ms` }}
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

      {/* 09 — Demo */}
      <StoryChapter index="09" eyebrow={es ? "El demo" : "The demo"} id="demo">
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
              ? "Grabación del sistema en funcionamiento: se sube un vídeo, se analiza, y devuelve comparables con su desglose de puntuación, hashtags sugeridos y recomendaciones concretas de edición. El servicio ya no está desplegado, por el coste del capítulo anterior."
              : "A recording of the system running: upload a video, it gets analysed, and it returns comparables with their score breakdown, suggested hashtags and concrete editing recommendations. The service is no longer deployed, for the cost reason in the previous chapter."}
          </p>
        </div>
      </StoryChapter>
    </div>
  );
}
