"use client";

import type { Locale } from "@/domain/i18n";
import { StoryBeat, StoryChapter, StoryProse, StoryStage, StoryStat } from "../story/StoryScene";
import TowerDiagram from "../story/TowerDiagram";
import IeTowerSimulator from "./IeTowerSimulator";

type Props = { isDark: boolean; lang: Locale };

/**
 * The IE Tower VPR project told as a vertical story rather than a wall of
 * bullets: seven chapters, each with a sticky visual and prose that scrolls
 * past it. Copy lives inline (not in the i18n dictionary) because it is
 * long-form narrative specific to this one project.
 */
export default function IeTowerScrollytelling({ isDark, lang }: Props) {
  const es = lang === "es";

  return (
    <div className="flex flex-col">
      {/* 01 — The question */}
      <StoryChapter index="01" eyebrow={es ? "El problema" : "The problem"}>
        <StoryStage>
          <div className="flex flex-col items-center gap-4 text-center">
            <span
              className="text-[clamp(3rem,9vw,7rem)] leading-none font-bold"
              style={{ color: isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.1)" }}
            >
              ?
            </span>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)" }}
            >
              {es ? "1 foto → 25 respuestas posibles" : "1 photo → 25 possible answers"}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Una foto de un pasillo cualquiera" : "A photo of some corridor"}>
            {es
              ? "Sin ventanas, sin carteles, sin GPS que valga: dentro de un rascacielos todas las plantas se parecen. Un pasillo de la 8 y uno de la 14 comparten el mismo suelo, la misma luz y los mismos muebles."
              : "No windows, no signs, no GPS worth trusting: inside a skyscraper every floor looks alike. A corridor on 8 and one on 14 share the same flooring, the same light, the same furniture."}
          </StoryBeat>
          <StoryBeat title={es ? "La pregunta" : "The question"}>
            {es
              ? "¿Puede un modelo mirar esa foto y decir en qué planta fue tomada, sin más señal que los píxeles? Eso es reconocimiento visual de lugares (VPR), y la torre de IE es un caso especialmente cruel."
              : "Can a model look at that photo and say which floor it was taken on, with nothing but pixels to go on? That is visual place recognition, and IE's tower is an unusually cruel case."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 02 — The building */}
      <StoryChapter index="02" eyebrow={es ? "El edificio" : "The building"}>
        <StoryStage>
          <TowerDiagram isDark={isDark} lang={lang} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Un monolito de 1 : 4 : 9" : "A 1 : 4 : 9 monolith"}>
            {es
              ? "La torre donde estudio es una losa de proporciones exactas — una de ancho, cuatro de fondo, nueve de alto — que sus arquitectos diseñaron mirando al monolito de 2001: Una odisea del espacio."
              : "The tower I study in is a slab of exact proportions — one wide, four deep, nine tall — that its architects designed looking at the monolith from 2001: A Space Odyssey."}
          </StoryBeat>
          <StoryBeat title={es ? "25 etiquetas" : "25 labels"}>
            {es
              ? "Las 21 plantas que ocupa la escuela (de la 3 a la 23) más cuatro sótanos: 25 clases. Cada banda del esquema es una etiqueta real del dataset. Adivinar al azar acierta un 4% de las veces — esa es la línea base a batir."
              : "The 21 floors the school occupies (3 through 23) plus four basements: 25 classes. Every band in the schematic is a real dataset label. Random guessing lands 4% of the time — that's the baseline to beat."}
          </StoryBeat>
          <StoryBeat title={es ? "Por qué es difícil" : "Why it's hard"}>
            {es
              ? "Las plantas repetidas son casi clones entre sí. El modelo no busca «qué es esto» sino «cuál de veinticinco copias casi idénticas es esta»."
              : "The repeated floors are near-clones of each other. The model isn't asking what this is — it's asking which of twenty-five near-identical copies this is."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 03 — The dataset */}
      <StoryChapter index="03" eyebrow={es ? "Los datos" : "The data"}>
        <StoryStage>
          <div className="grid grid-cols-8 gap-1 w-full max-w-sm" aria-hidden>
            {Array.from({ length: 64 }).map((_, i) => (
              <span
                key={i}
                className="tower-band aspect-square rounded-[2px]"
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.07)",
                  border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(15,23,42,0.05)",
                  ["--d" as string]: `${i * 9}ms`,
                }}
              />
            ))}
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Caminar el edificio entero" : "Walking the whole building"}>
            {es
              ? "No había dataset, así que lo grabamos: recorridos en vídeo por cada planta y cada sótano, con el móvil en la mano. ffmpeg los corta a 1 fotograma por segundo y cada frame hereda la etiqueta de su planta."
              : "There was no dataset, so we recorded one: video walkthroughs of every floor and basement, phone in hand. ffmpeg slices them at 1 frame per second and each frame inherits its floor's label."}
          </StoryBeat>
          <div className="flex gap-8 flex-wrap">
            <StoryStat value="2,877" label={es ? "frames etiquetados" : "labelled frames"} />
            <StoryStat value="504" label={es ? "queries de validación" : "held-out queries"} />
          </div>
          <StoryBeat title={es ? "Reproducible o no cuenta" : "Reproducible or it doesn't count"}>
            {es
              ? "Seis etapas, cada una un script idempotente: sincronizar → extraer frames → anotar jerarquía → repartir splits → embeddings e índice → evaluar. Correr el pipeline dos veces no duplica nada; auto-omite lo ya hecho."
              : "Six stages, each an idempotent script: sync → extract frames → annotate hierarchy → assign splits → embeddings and index → evaluate. Running it twice duplicates nothing; it auto-skips what's already done."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 04 — The model */}
      <StoryChapter index="04" eyebrow={es ? "El modelo" : "The model"}>
        <StoryStage>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              { k: "DINOv2 ViT-S/14", v: es ? "backbone congelado" : "frozen backbone" },
              { k: "518 × 518", v: es ? "resolución de entrada" : "input resolution" },
              { k: "L2-norm", v: es ? "embeddings normalizados" : "normalised embeddings" },
              { k: "FAISS Flat-IP", v: es ? "índice exacto" : "exact index" },
              { k: "CPU", v: es ? "sin GPU en inferencia" : "no GPU at inference" },
            ].map((row, i) => (
              <div
                key={row.k}
                className="tower-band glass-tile rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
                style={{ ["--d" as string]: `${i * 60}ms` }}
              >
                <span className="font-mono text-[13px] font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                  {row.k}
                </span>
                <span className="text-[10.5px] uppercase tracking-[0.1em]" style={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)" }}>
                  {row.v}
                </span>
              </div>
            ))}
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "No entrenar nada" : "Train nothing"}>
            {es
              ? "El backbone va congelado, tal cual sale de DINOv2. No hay fine-tuning ni cabeza de clasificación: el modelo nunca «aprende» las plantas. Solo convierte imágenes en vectores."
              : "The backbone stays frozen, straight out of DINOv2. No fine-tuning, no classification head: the model never learns the floors. It just turns images into vectors."}
          </StoryBeat>
          <StoryBeat title={es ? "Recuperar, no clasificar" : "Retrieve, don't classify"}>
            {es
              ? "La planta sale de la vecindad: se busca la foto en un índice FAISS de los 2.877 frames y los vecinos más cercanos votan. Añadir una planta nueva es reindexar, no reentrenar."
              : "The floor comes out of the neighbourhood: the photo is searched against a FAISS index of the 2,877 frames and the nearest neighbours vote. Adding a new floor is a re-index, not a retrain."}
          </StoryBeat>
          <StoryBeat title={es ? "Todo intercambiable" : "Everything swappable"}>
            {es
              ? "Backbone, métrica, frecuencia de frames y estrategia de splits son parámetros. Cambiar DINOv2 por ResNet50 es una bandera, no una reescritura."
              : "Backbone, metric, frame rate and split strategy are parameters. Swapping DINOv2 for ResNet50 is a flag, not a rewrite."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 05 — Results */}
      <StoryChapter index="05" eyebrow={es ? "Resultados" : "Results"}>
        <StoryStage>
          <div className="flex flex-col gap-7">
            <StoryStat value="52.8%" label="Top-1" accent />
            <StoryStat value="72.0%" label="Top-5" />
            <StoryStat value="57.7%" label="mAP" />
            <p className="text-[11px] max-w-[22ch] leading-relaxed" style={{ color: isDark ? "rgba(148,163,184,0.75)" : "rgba(71,85,105,0.75)" }}>
              {es ? "Azar: 4%. Mejor configuración, en CPU." : "Chance: 4%. Best configuration, on CPU."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "13 veces mejor que el azar" : "13× better than chance"}>
            {es
              ? "Acierta la planta exacta algo más de la mitad de las veces, y la deja entre sus cinco candidatas en siete de cada diez. Sin entrenar un solo peso."
              : "It nails the exact floor a little over half the time, and puts it in its top five in seven out of ten. Without training a single weight."}
          </StoryBeat>
          <StoryBeat title={es ? "El hueco entre Top-1 y Top-5 es la historia" : "The Top-1 to Top-5 gap is the story"}>
            {es
              ? "Diecinueve puntos de diferencia significan que el modelo casi siempre está cerca: sabe el barrio, duda de la casa. Confunde plantas vecinas, no partes distintas del edificio."
              : "Nineteen points of spread mean the model is almost always close: it knows the neighbourhood, it doubts the house. It confuses adjacent floors, not distant parts of the building."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 06 — Try it */}
      <StoryChapter index="06" eyebrow={es ? "Pruébalo" : "Try it"}>
        <div className="md:col-span-2">
          <IeTowerSimulator isDark={isDark} lang={lang} />
        </div>
      </StoryChapter>

      {/* 06b — The ablation */}
      <StoryChapter index="07" eyebrow={es ? "La ablación" : "The ablation"}>
        <StoryStage>
          <div className="flex flex-col gap-2 w-full max-w-sm">
            {[
              { k: "ResNet50", t1: 46.8, sec: "338", on: false },
              { k: "DINOv2 S/14", t1: 49.2, sec: "372", on: false },
              { k: "DINOv2 B/14", t1: 49.4, sec: "1051", on: false },
              { k: "DINOv2 S/14 · hi-res", t1: 52.8, sec: "—", on: true },
            ].map((row, i) => (
              <div
                key={row.k}
                className="tower-band flex items-center gap-3"
                style={{ ["--d" as string]: `${i * 80}ms` }}
              >
                <span
                  className="text-[11px] w-[124px] shrink-0 font-medium"
                  style={{ color: row.on ? "#22d3ee" : isDark ? "rgba(226,232,240,0.8)" : "rgba(15,23,42,0.78)" }}
                >
                  {row.k}
                </span>
                <span
                  className="flex-1 h-[7px] rounded-full overflow-hidden"
                  style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)" }}
                >
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(row.t1 / 60) * 100}%`,
                      background: row.on ? "#22d3ee" : isDark ? "rgba(226,232,240,0.4)" : "rgba(15,23,42,0.3)",
                    }}
                  />
                </span>
                <span
                  className="font-mono text-[10.5px] w-[38px] text-right tabular-nums"
                  style={{ color: row.on ? "#22d3ee" : isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.85)" }}
                >
                  {row.t1}%
                </span>
                <span
                  className="font-mono text-[9.5px] w-[42px] text-right tabular-nums"
                  style={{ color: isDark ? "rgba(148,163,184,0.5)" : "rgba(71,85,105,0.5)" }}
                >
                  {row.sec}s
                </span>
              </div>
            ))}
            <p
              className="text-[10px] mt-1"
              style={{ color: isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)" }}
            >
              {es ? "Top-1 y tiempo de pipeline, medidos." : "Measured Top-1 and pipeline time."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Cuatro backbones, medidos" : "Four backbones, measured"}>
            {es
              ? "ResNet50 fue la línea base. Cambiar a DINOv2 sumó dos puntos y medio. Pero el hallazgo interesante está en las dos últimas filas."
              : "ResNet50 was the baseline. Switching to DINOv2 added two and a half points. But the interesting finding is in the last two rows."}
          </StoryBeat>
          <StoryBeat title={es ? "El modelo grande no valió la pena" : "The big model wasn't worth it"}>
            {es
              ? "DINOv2 Base — cuatro veces más parámetros — ganó 0,2 puntos sobre Small y costó casi tres veces más tiempo de pipeline (1.051s contra 372s). Un empate estadístico a triple precio."
              : "DINOv2 Base — four times the parameters — gained 0.2 points over Small and cost nearly three times the pipeline time (1,051s vs 372s). A statistical tie at triple the price."}
          </StoryBeat>
          <StoryBeat title={es ? "Más píxeles ganaron a más parámetros" : "More pixels beat more parameters"}>
            {es
              ? "Lo que sí movió la aguja fue subir la resolución del Small a 518×518: 52,8% de Top-1, el mejor de los cuatro. En un edificio donde la pista está en detalles pequeños, ver mejor importa más que pensar más."
              : "What actually moved the needle was pushing the Small model to 518×518: 52.8% Top-1, the best of the four. In a building where the clue is in small details, seeing better matters more than thinking harder."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 08 — What's broken */}
      <StoryChapter index="08" eyebrow={es ? "Lo que falla" : "What's broken"}>
        <StoryStage>
          <TowerDiagram isDark={isDark} lang={lang} active="floor10" />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Confusión vertical" : "Vertical confusion"}>
            {es
              ? "El error dominante: acertar el sitio y fallar la altura. Plantas de aulas consecutivas son visualmente indistinguibles incluso para una persona; el modelo hereda esa ambigüedad."
              : "The dominant error: right place, wrong height. Consecutive classroom floors are visually indistinguishable even to a person; the model inherits that ambiguity."}
          </StoryBeat>
          <StoryBeat title={es ? "Una sola pasada por planta" : "One pass per floor"}>
            {es
              ? "Cada planta se grabó una vez, un día, con una luz. El modelo no ha visto la misma esquina de tarde, ni con sillas movidas, ni con gente. Eso limita el techo mucho más que la arquitectura del modelo."
              : "Each floor was recorded once, on one day, in one light. The model has never seen the same corner in the evening, with chairs moved, with people in it. That caps the ceiling far more than the model architecture does."}
          </StoryBeat>
          <StoryBeat title={es ? "Lo siguiente" : "What's next"}>
            {es
              ? "Más pasadas por planta en distintos momentos, y un desempate jerárquico que decida primero la zona y luego la altura. El pipeline ya está partido para poder cambiar solo esa etapa."
              : "More passes per floor at different times, and a hierarchical tie-break that settles the zone first and the height second. The pipeline is already split so only that stage has to change."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>
    </div>
  );
}
