"use client";

import type { Locale } from "@/domain/i18n";
import evalData from "@/data/ieTowerEval.json";
import DatasetGallery from "../story/DatasetGallery";
import CreditedMedia, { type Credit } from "../story/ImageCredit";
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
/* The building's drawings are the architects' work, not mine — published by
   Arquitectura Viva. Credited on every use; see the note in the README. */
const DRAWING_CREDIT: Credit = {
  author: "Fenwick Iribarren Architects",
  source: "Arquitectura Viva",
  href: "https://arquitecturaviva.com/works/torre-caleido-en-madrid",
  rights: "© All rights reserved",
};

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

      {/* 02b — The architects' drawings */}
      <StoryChapter index="03" eyebrow={es ? "Los planos" : "The drawings"}>
        <StoryStage>
          <div className="flex gap-3 items-start">
            <CreditedMedia credit={DRAWING_CREDIT} isDark={isDark} label={es ? "Dibujo de" : "Drawing by"} className="flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/ie-tower/plan-section.webp"
                alt={
                  es
                    ? "Sección longitudinal de la torre mostrando las plantas apiladas sobre el podio y el parking"
                    : "Long section of the tower showing the floors stacked over the podium and parking"
                }
                width={560}
                height={1733}
                loading="lazy"
                className="w-full h-auto block"
                style={{ background: "#fff" }}
              />
            </CreditedMedia>
            <CreditedMedia credit={DRAWING_CREDIT} isDark={isDark} label={es ? "Dibujo de" : "Drawing by"} className="flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/ie-tower/plan-floors.webp"
                alt={
                  es
                    ? "Plantas tipo de la torre a distintas cotas, casi idénticas entre sí"
                    : "Typical floor plans at different levels, near-identical to each other"
                }
                width={560}
                height={1515}
                loading="lazy"
                className="w-full h-auto block"
                style={{ background: "#fff" }}
              />
            </CreditedMedia>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "La prueba está en los planos" : "The proof is in the plans"}>
            {es
              ? "Mira las plantas tipo apiladas: mismo núcleo, mismos ascensores, mismo pasillo perimetral, una y otra vez. Lo que para un arquitecto es eficiencia — un módulo que se repite veintiuna veces — para un modelo de visión es una trampa."
              : "Look at the typical floors stacked up: same core, same lifts, same perimeter corridor, over and over. What is efficiency to an architect — one module repeated twenty-one times — is a trap for a vision model."}
          </StoryBeat>
          <StoryBeat title={es ? "Dónde sí hay pistas" : "Where the clues actually are"}>
            {es
              ? "La sección lo explica: lo único que rompe la repetición está abajo (auditorio, biblioteca, acceso) y arriba (terrazas, talleres). Justo las plantas que el modelo acierta. En medio, veintiuna copias del mismo plano."
              : "The section explains it: the only things breaking the repetition sit at the bottom (auditorium, library, main access) and at the top (terraces, workshops). Exactly the floors the model gets right. In between, twenty-one copies of the same plan."}
          </StoryBeat>
          <StoryBeat title={es ? "Crédito" : "Credit"}>
            {es
              ? "Estos dibujos son de Fenwick Iribarren Architects, los arquitectos de la torre, publicados por Arquitectura Viva. Pasa el cursor por encima para ver la fuente. Yo solo puse el modelo."
              : "These drawings are by Fenwick Iribarren Architects, the tower's architects, published by Arquitectura Viva. Hover to see the source. I only brought the model."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 03 — The dataset */}
      <StoryChapter index="04" eyebrow={es ? "Los datos" : "The data"}>
        <StoryStage>
          <DatasetGallery labels={evalData.gallery} isDark={isDark} lang={lang} />
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
      <StoryChapter index="05" eyebrow={es ? "El modelo" : "The model"}>
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
      <StoryChapter index="06" eyebrow={es ? "Resultados" : "Results"}>
        <StoryStage>
          <div className="flex flex-col gap-7">
            <StoryStat value="52.8%" label="Top-1" accent />
            <StoryStat value="72.0%" label="Top-5" />
            <StoryStat value="57.7%" label="mAP" />
            <p className="text-[11px] max-w-[22ch] leading-relaxed" style={{ color: isDark ? "rgba(148,163,184,0.75)" : "rgba(71,85,105,0.75)" }}>
              {es ? "Azar: 4%. Reproducido sobre 504 queries." : "Chance: 4%. Reproduced over 504 queries."}
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
      <StoryChapter index="07" eyebrow={es ? "Pruébalo" : "Try it"} id="try-it">
        <div className="md:col-span-2">
          <IeTowerSimulator isDark={isDark} lang={lang} />
        </div>
      </StoryChapter>

      {/* 06b — The ablation */}
      <StoryChapter index="08" eyebrow={es ? "La ablación" : "The ablation"}>
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
      <StoryChapter index="09" eyebrow={es ? "Lo que falla" : "What's broken"}>
        <StoryStage>
          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            {[
              { k: es ? "Sótano 3" : "Basement 3", v: 86.7, on: true },
              { k: es ? "Sótano 2" : "Basement 2", v: 81.0, on: true },
              { k: es ? "Sótano 4" : "Basement 4", v: 78.6, on: true },
              { k: es ? "Planta 10" : "Floor 10", v: 48.4, on: false },
              { k: es ? "Planta 15" : "Floor 15", v: 26.3, on: false },
              { k: es ? "Planta 18" : "Floor 18", v: 22.2, on: false },
            ].map((row, i) => (
              <div key={row.k} className="tower-band flex items-center gap-2.5" style={{ ["--d" as string]: `${i * 70}ms` }}>
                <span
                  className="text-[11px] w-[74px] shrink-0"
                  style={{ color: isDark ? "rgba(226,232,240,0.82)" : "rgba(15,23,42,0.78)" }}
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
                      width: `${row.v}%`,
                      background: row.on ? "#22d3ee" : isDark ? "rgba(251,146,60,0.7)" : "rgba(234,88,12,0.6)",
                    }}
                  />
                </span>
                <span
                  className="font-mono text-[10px] w-[36px] text-right tabular-nums"
                  style={{ color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)" }}
                >
                  {row.v}%
                </span>
              </div>
            ))}
            <p className="text-[10px] mt-1" style={{ color: isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)" }}>
              {es ? "Top-1 por clase, medido sobre 504 queries." : "Per-class Top-1, measured over 504 queries."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Los sótanos son lo fácil" : "The basements are the easy part"}>
            {es
              ? "Contra la intuición, lo que el modelo clava son los sótanos: 87%, 81%, 79%. Tienen auditorio, parking, salas con forma propia. Cada uno es visualmente único, así que su vecindario en el espacio de embeddings no se parece a nada más."
              : "Against intuition, what the model nails are the basements: 87%, 81%, 79%. They have the auditorium, the parking, rooms with a shape of their own. Each is visually unique, so its neighbourhood in embedding space looks like nothing else."}
          </StoryBeat>
          <StoryBeat title={es ? "Las plantas de aulas son el infierno" : "The classroom floors are the hell"}>
            {es
              ? "La planta 18 acierta un 22%; la 15, un 26%. Son las plantas repetidas — mismo pasillo, mismo suelo, mismos muebles, distinta altura. El modelo no falla por malo: falla porque la información no está en la imagen."
              : "Floor 18 lands 22%; floor 15, 26%. These are the repeated floors — same corridor, same flooring, same furniture, different height. The model isn't failing because it's bad: it's failing because the information isn't in the image."}
          </StoryBeat>
          <StoryBeat title={es ? "Dónde miraría después" : "Where I'd look next"}>
            {es
              ? "Los números dicen dónde invertir: no en un backbone mayor (ya vimos que no paga), sino en darle a las plantas repetidas algo que las distinga — más pasadas en distintos momentos, o un desempate jerárquico que resuelva primero la zona y luego la altura. El pipeline ya está partido para cambiar solo esa etapa."
              : "The numbers say where to invest: not in a bigger backbone (we saw that doesn't pay), but in giving the repeated floors something that tells them apart — more passes at different times, or a hierarchical tie-break that settles the zone first and the height second. The pipeline is already split so only that stage has to change."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

    </div>
  );
}
