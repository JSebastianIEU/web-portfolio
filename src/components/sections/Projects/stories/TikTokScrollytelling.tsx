"use client";

import type { Locale } from "@/domain/i18n";
import recs from "@/data/tiktokRecs.json";
import EmbeddingScatter from "../story/EmbeddingScatter";
import { StoryBeat, StoryChapter, StoryProse, StoryStage, StoryStat } from "../story/StoryScene";
import VarianceHeatmap from "../story/VarianceHeatmap";
import TikTokRecommender from "./TikTokRecommender";

type Props = { isDark: boolean; lang: Locale };

/**
 * The TikTok semantic-engagement study told as a vertical story: ten chapters,
 * each a sticky visual with prose scrolling past it — the same system as the IE
 * Tower story. Copy lives inline because it is long-form narrative specific to
 * this project. Every number traces to the author's own run (README table) or
 * to a local rerun of the pipeline in src/data/tiktokRecs.json.
 */
export default function TikTokScrollytelling({ isDark, lang }: Props) {
  const es = lang === "es";
  const accent = "#22d3ee";
  const rose = "#fb7185";
  const muted = isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)";
  const faint = isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)";
  const tileText = isDark ? "#f8fafc" : "#0f172a";

  return (
    <div className="flex flex-col">
      {/* 01 — The problem */}
      <StoryChapter index="01" eyebrow={es ? "El problema" : "The problem"}>
        <StoryStage>
          <div className="flex flex-col items-stretch gap-3 w-full max-w-[300px]">
            <div
              className="rounded-xl px-4 py-3 text-[13px] leading-snug"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.025)",
                color: isDark ? "rgba(240,244,250,0.95)" : "rgba(15,23,42,0.9)",
              }}
            >
              {es ? "“receta fácil de pasta en 15 minutos”" : "“easy 15 minute pasta recipe”"}
            </div>
            <div className="flex items-center justify-center text-[11px] font-mono" style={{ color: faint }}>
              ↓ {es ? "mismo tipo de caption" : "same kind of caption"} ↓
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "2.4K", c: muted },
                { v: "1.8M", c: accent },
                { v: "312", c: muted },
              ].map((b, i) => (
                <div
                  key={i}
                  className="tower-band rounded-lg px-2 py-3 text-center"
                  style={{
                    ["--d" as string]: `${i * 90}ms`,
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.015)",
                  }}
                >
                  <span className="block font-mono text-[15px] font-bold tabular-nums" style={{ color: b.c }}>
                    {b.v}
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.12em]" style={{ color: faint }}>
                    {es ? "views" : "views"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Todo el mundo intenta predecir la viralidad" : "Everyone tries to predict virality"}>
            {es
              ? "Es la pregunta obvia sobre TikTok: ¿cuántas visitas va a tener este vídeo? Y desde el texto es una batalla perdida. El mismo tipo de caption puede hacer 300 visitas o 1,8 millones."
              : "It's the obvious TikTok question: how many views will this video get? And from the text alone it's a losing battle. The same kind of caption can pull 300 views or 1.8 million."}
          </StoryBeat>
          <StoryBeat title={es ? "El texto no manda" : "Text isn't what drives it"}>
            {es
              ? "El número de seguidores, el audio, la miniatura, la hora de publicación y el algoritmo pesan mucho más que las palabras. Cuatro clasificadores sobre estos captions se estancan todos en un 59–60% — apenas por encima de tirar una moneda."
              : "Follower count, audio, thumbnail, posting time and the algorithm all weigh far more than the words. Four classifiers over these captions all stall at 59–60% — barely above a coin flip."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 02 — The reframe */}
      <StoryChapter index="02" eyebrow={es ? "La pregunta, replanteada" : "The question, reframed"}>
        <StoryStage>
          <div className="flex flex-col gap-5 w-full max-w-sm">
            {[
              {
                title: es ? "grupo aleatorio" : "random group",
                dots: [8, 22, 35, 50, 64, 78, 92],
                color: muted,
              },
              {
                title: es ? "vecindario semántico" : "semantic neighborhood",
                dots: [40, 46, 49, 52, 55, 58, 62],
                color: accent,
              },
            ].map((row) => (
              <div key={row.title} className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: muted }}>
                  {row.title}
                </span>
                <div
                  className="relative h-9 rounded-lg"
                  style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.035)" }}
                >
                  {row.dots.map((x, i) => (
                    <span
                      key={i}
                      className="tk-pop absolute w-2.5 h-2.5 rounded-full"
                      style={{
                        top: "50%",
                        left: `${x}%`,
                        marginLeft: "-5px",
                        marginTop: "-5px",
                        background: row.color,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <span className="font-mono text-[10px]" style={{ color: faint }}>
              {es ? "engagement, de bajo a alto → mismo tamaño, menos disperso" : "engagement, low to high → same size, tighter spread"}
            </span>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "No cuánto, sino cuán parecido" : "Not how much, but how consistently"}>
            {es
              ? "Así que cambié la pregunta. En vez de «cuánto engagement tendrá este texto», pregunté: ¿los captions que significan lo mismo rinden de forma más consistente entre sí que un grupo al azar del mismo tamaño?"
              : "So I flipped the question. Instead of “how much engagement will this text get,” I asked: do captions that mean the same thing perform more consistently with each other than a random group of the same size?"}
          </StoryBeat>
          <StoryBeat title={es ? "Una hipótesis que sí se puede probar" : "A hypothesis you can actually test"}>
            {es
              ? "H₀: la proximidad semántica no dice nada — un vecindario no es más consistente que un grupo aleatorio. H₁: los vecindarios semánticos tienen menos varianza dentro del grupo. Predecir la magnitud es difícil; medir la consistencia, no tanto."
              : "H₀: semantic proximity says nothing — a neighborhood is no tighter than a random group. H₁: semantic neighborhoods have lower within-group variance. Predicting magnitude is hard; measuring consistency is not."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 03 — The data */}
      <StoryChapter index="03" eyebrow={es ? "Los datos" : "The data"}>
        <StoryStage>
          <div className="flex flex-col gap-6 w-full max-w-xs">
            <div className="flex gap-7 flex-wrap">
              <StoryStat value={recs.meta.cleanPosts.toLocaleString(es ? "es" : "en")} label={es ? "posts limpios" : "cleaned posts"} accent />
              <StoryStat value={recs.meta.uniqueTags.toLocaleString(es ? "es" : "en")} label={es ? "hashtags únicos" : "unique hashtags"} />
            </div>
            <div className="flex flex-col gap-2">
              {[
                { k: "videos", v: es ? "caption · fecha" : "caption · timestamp" },
                { k: "video_snapshots", v: es ? "likes · comentarios · views · shares" : "likes · comments · views · shares" },
                { k: "hashtags", v: es ? "tabla puente + tags" : "bridge table + tags" },
              ].map((row, i) => (
                <div
                  key={row.k}
                  className="tower-band glass-tile rounded-lg px-3 py-2 flex flex-col gap-0.5"
                  style={{ ["--d" as string]: `${i * 70}ms` }}
                >
                  <span className="font-mono text-[12px] font-semibold" style={{ color: tileText }}>
                    {row.k}
                  </span>
                  <span className="text-[9.5px] uppercase tracking-[0.08em]" style={{ color: muted }}>
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Datos de un scraper propio" : "Data from a scraper of my own"}>
            {es
              ? "El dataset salió de un scraper de TikTok que construí en un proyecto anterior, guardado en Postgres sobre Supabase. Para que el análisis sea reproducible, lo replico a una copia local en SQLite: cuatro tablas normalizadas."
              : "The dataset came from a TikTok scraper I built in an earlier project, stored in Postgres on Supabase. To keep the analysis reproducible, I mirror it to a local SQLite copy: four normalised tables."}
          </StoryBeat>
          <StoryBeat title={es ? "Limpieza y escala logarítmica" : "Cleaning and a log scale"}>
            {es
              ? "De 26.623 posts crudos quedan 22.647 tras soltar los captions con menos de cuatro caracteres reales. El engagement sigue una ley de potencias — unos pocos vídeos se llevan todo — así que se trabaja en log(1 + x), donde las distancias tienen sentido."
              : "26,623 raw posts become 22,647 after dropping captions with fewer than four real characters. Engagement follows a power law — a few videos take everything — so it's all done in log(1 + x), where distances make sense."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 04 — The coverage fix */}
      <StoryChapter index="04" eyebrow={es ? "El arreglo que lo hizo posible" : "The fix that made it possible"}>
        <StoryStage>
          <div className="flex flex-col gap-5 w-full max-w-sm">
            {[
              { label: es ? "solo tabla puente" : "bridge table only", pct: recs.meta.coverageBefore, on: false },
              { label: es ? "+ extracción del caption" : "+ inline caption extraction", pct: recs.meta.coveragePct, on: true },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11.5px]" style={{ color: isDark ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.8)" }}>
                    {row.label}
                  </span>
                  <span
                    className="font-mono text-[15px] font-bold tabular-nums"
                    style={{ color: row.on ? accent : muted }}
                  >
                    {row.pct}%
                  </span>
                </div>
                <div
                  className="h-3 w-full rounded-full overflow-hidden"
                  style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)" }}
                >
                  <div
                    className="tk-grow h-full rounded-full"
                    style={{
                      width: `${row.pct}%`,
                      background: row.on ? accent : isDark ? "rgba(226,232,240,0.4)" : "rgba(15,23,42,0.3)",
                    }}
                  />
                </div>
              </div>
            ))}
            <span className="font-mono text-[10px]" style={{ color: faint }}>
              {es ? "posts con al menos un hashtag" : "posts with at least one hashtag"}
            </span>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Menos de 1 de cada 25" : "Fewer than 1 in 25"}>
            {es
              ? "La tabla puente de hashtags solo cubría el 3,9% de los posts. Un recomendador construido sobre eso sería inútil para el 95% del corpus. No es un detalle de preprocesado: es un requisito de toda la tarea."
              : "The hashtag bridge table only covered 3.9% of posts. A recommender built on that alone would be useless for 95% of the corpus. This isn't a preprocessing detail — it's a prerequisite for the whole task."}
          </StoryBeat>
          <StoryBeat title={es ? "Los hashtags estaban en el caption" : "The hashtags were in the caption"}>
            {es
              ? "Extrayéndolos también del propio texto del caption y fusionando ambas fuentes, la cobertura salta al 100%: una media de 5,58 tags por post y 36.866 etiquetas únicas. De ahí sale todo lo demás."
              : "By also pulling them from the caption text itself and merging both sources, coverage jumps to 100%: an average of 5.58 tags per post across 36,866 unique tags. Everything downstream depends on it."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 05 — The method */}
      <StoryChapter index="05" eyebrow={es ? "El método" : "The method"}>
        <StoryStage>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              { k: "all-MiniLM-L6-v2", v: es ? "embeddings de oraciones (SBERT)" : "sentence embeddings (SBERT)" },
              { k: "384-d · L2-norm", v: es ? "un vector por caption" : "one vector per caption" },
              { k: es ? "sin hashtags" : "hashtags stripped", v: es ? "antes de codificar" : "before encoding" },
              { k: "FAISS · cosine", v: es ? "índice de vecinos" : "nearest-neighbor index" },
              { k: "K = 5 · 10 · 20", v: es ? "tamaños de vecindario" : "neighborhood sizes" },
            ].map((row, i) => (
              <div
                key={row.k}
                className="tower-band glass-tile rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
                style={{ ["--d" as string]: `${i * 60}ms` }}
              >
                <span className="font-mono text-[13px] font-semibold" style={{ color: tileText }}>
                  {row.k}
                </span>
                <span className="text-[10.5px] uppercase tracking-[0.1em]" style={{ color: muted }}>
                  {row.v}
                </span>
              </div>
            ))}
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Codificar el significado, no las palabras" : "Encode the meaning, not the words"}>
            {es
              ? "Cada caption se convierte en un vector de 384 dimensiones con un modelo SBERT. Dos captions que dicen lo mismo con palabras distintas caen cerca; la distancia coseno mide ese parecido."
              : "Each caption becomes a 384-dimensional vector with an SBERT model. Two captions that say the same thing in different words land close together; cosine distance measures that likeness."}
          </StoryBeat>
          <StoryBeat title={es ? "El hashtag es la etiqueta, no la pista" : "The hashtag is the label, not the clue"}>
            {es
              ? "Clave: se quitan los hashtags antes de codificar. Si no, el modelo aprendería que dos posts se parecen por compartir #fyp, no por significar lo mismo. Queremos vecinos por tema, para luego recomendar sus hashtags."
              : "Crucial: hashtags are stripped before encoding. Otherwise the model would learn that two posts are similar because they share #fyp, not because they mean the same thing. We want neighbors by topic, so we can then recommend their hashtags."}
          </StoryBeat>
          <StoryBeat title={es ? "Recuperar, no clasificar" : "Retrieve, don't classify"}>
            {es
              ? "Con los vectores en un índice FAISS, cada post tiene su vecindario: los K captions más parecidos. No se entrena ningún clasificador — toda la estructura vive en la geometría del espacio de embeddings."
              : "With the vectors in a FAISS index, every post has its neighborhood: the K most similar captions. No classifier is trained — all the structure lives in the geometry of the embedding space."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 06 — The test */}
      <StoryChapter index="06" eyebrow={es ? "La prueba" : "The test"}>
        <StoryStage>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <svg viewBox="0 0 200 96" className="tk-rise w-full h-auto" role="img" aria-label={es ? "Distribución de varianzas de 1.000 grupos aleatorios; el vecindario semántico cae a la izquierda" : "Variance distribution of 1,000 random groups; the semantic neighborhood sits to the left"}>
              {/* null distribution bell */}
              <path
                d="M10 84 C55 84 55 20 100 20 C145 20 145 84 190 84"
                fill={isDark ? "rgba(148,163,184,0.12)" : "rgba(71,85,105,0.1)"}
                stroke={isDark ? "rgba(148,163,184,0.55)" : "rgba(71,85,105,0.5)"}
                strokeWidth="1.4"
              />
              {/* semantic marker to the left (lower variance) */}
              <line x1="46" x2="46" y1="14" y2="90" stroke={accent} strokeWidth="1.6" strokeDasharray="3 2.5" />
              <circle cx="46" cy="70" r="3" fill={accent} />
              <text x="46" y="10" textAnchor="middle" fontSize="7.5" fill={accent} fontFamily="ui-monospace, monospace">
                {es ? "semántico" : "semantic"}
              </text>
              <text x="120" y="46" textAnchor="middle" fontSize="7.5" fill={muted} fontFamily="ui-monospace, monospace">
                {es ? "1.000 aleatorios" : "1,000 random"}
              </text>
            </svg>
            <span className="font-mono text-[10px]" style={{ color: faint }}>
              {es ? "varianza dentro del grupo, de menos a más →" : "within-group variance, low to high →"}
            </span>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Contra 1.000 sombras" : "Against 1,000 shadows"}>
            {es
              ? "Para cada vecindario se mide la varianza del engagement dentro del grupo. Luego se generan 1.000 grupos aleatorios del mismo tamaño y se mide la suya. Si la proximidad no importara, el vecindario debería parecerse a cualquier grupo al azar."
              : "For each neighborhood I measure the within-group variance of engagement. Then I generate 1,000 random groups of the same size and measure theirs. If proximity didn't matter, the neighborhood should look like any random draw."}
          </StoryBeat>
          <StoryBeat title={es ? "Una prueba, no una corazonada" : "A test, not a hunch"}>
            {es
              ? "La reducción de varianza es (aleatorio − semántico) / aleatorio. Y un test de Mann-Whitney U de una cola pregunta si las varianzas semánticas son sistemáticamente menores que las aleatorias. Todo con semilla fija y 1.000 simulaciones."
              : "Variance reduction is (random − semantic) / random. And a one-sided Mann-Whitney U test asks whether the semantic variances are systematically smaller than the random ones. All seeded, all with 1,000 simulations."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 07 — The result */}
      <StoryChapter index="07" eyebrow={es ? "El resultado" : "The result"}>
        <StoryStage>
          <VarianceHeatmap rows={recs.variance.rows} ks={recs.variance.ks} isDark={isDark} lang={lang} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Doce pruebas, doce veces sí" : "Twelve tests, twelve yeses"}>
            {es
              ? "Cuatro métricas de engagement por tres tamaños de vecindario: doce pruebas. Las doce dan p ≈ 0 y una reducción de varianza de entre 10,5% y 13%. Los vecindarios semánticos rinden de forma más consistente que el azar, siempre."
              : "Four engagement metrics by three neighborhood sizes: twelve tests. All twelve return p ≈ 0 and a variance reduction between 10.5% and 13%. Semantic neighborhoods perform more consistently than chance, every time."}
          </StoryBeat>
          <StoryBeat title={es ? "La caída con K es la prueba" : "The decay with K is the tell"}>
            {es
              ? "Fíjate cómo baja de izquierda a derecha: a K=5, los vecindarios más apretados, la señal es máxima (~13%); a K=20, al meter posts más lejanos, se diluye (~11%). Eso es justo lo que haría una relación real entre significado y engagement."
              : "Notice how it falls left to right: at K=5, the tightest neighborhoods, the signal peaks (~13%); at K=20, as more distant posts creep in, it dilutes (~11%). That's exactly what a genuine meaning-to-engagement relationship would do."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 08 — The ceiling */}
      <StoryChapter index="08" eyebrow={es ? "El techo" : "The ceiling"}>
        <StoryStage>
          <EmbeddingScatter points={recs.umap} isDark={isDark} lang={lang} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Cuatro modelos, un mismo techo" : "Four models, one ceiling"}>
            {es
              ? "Regresión logística, Naive Bayes y dos KNN — sobre embeddings densos y sobre TF-IDF disperso — se estancan todos en 59–60% de acierto, contra un 50% de base. Da igual cómo codifiques el texto: no hay señal suficiente para predecir el engagement."
              : "Logistic regression, Naive Bayes and two KNNs — over dense embeddings and over sparse TF-IDF — all stall at 59–60% accuracy, against a 50% baseline. However you encode the text, there isn't enough signal to predict engagement."}
          </StoryBeat>
          <StoryBeat title={es ? "El mapa lo explica" : "The map explains it"}>
            {es
              ? "Cada punto es un caption real proyectado desde sus 384 dimensiones. El color es engagement alto (rosa) o bajo (azul), y están completamente mezclados. El espacio captura de qué va el post, no cuánto rinde."
              : "Each dot is a real caption projected from its 384 dimensions. Colour is high engagement (rose) or low (blue), and they're completely intermixed. The space captures what a post is about, not how well it does."}
          </StoryBeat>
          <StoryBeat title={es ? "El fracaso es la prueba" : "The failure is the proof"}>
            {es
              ? "Y ese techo refuerza el hallazgo estructural. Si ningún modelo separa las clases, la reducción de varianza no puede ser un truco de clases separadas: sale de la propia estructura semántica."
              : "And that ceiling strengthens the structural finding. If no model can separate the classes, the variance reduction can't be a trick of separated classes — it emerges from the semantic structure itself."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 09 — Try it */}
      <StoryChapter index="09" eyebrow={es ? "Pruébalo" : "Try it"} id="try-it">
        <div className="md:col-span-2">
          <TikTokRecommender isDark={isDark} lang={lang} />
        </div>
      </StoryChapter>

      {/* 10 — What it means */}
      <StoryChapter index="10" eyebrow={es ? "Lo que significa" : "What it means"}>
        <StoryStage>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              { k: es ? "codifica" : "encode", v: es ? "el caption con SBERT" : "the caption with SBERT" },
              { k: es ? "recupera" : "retrieve", v: es ? "los K vecinos reales" : "the K real neighbors" },
              { k: es ? "agrega" : "aggregate", v: es ? "sus hashtags" : "their hashtags" },
              { k: es ? "ordena" : "rank", v: es ? "por frecuencia y engagement" : "by frequency and engagement" },
              { k: es ? "explica" : "explain", v: es ? "con los posts que los usaron" : "with the posts that used them" },
            ].map((row, i) => (
              <div
                key={row.k}
                className="tower-band flex items-center gap-2.5"
                style={{ ["--d" as string]: `${i * 70}ms` }}
              >
                <span
                  className="font-mono text-[11px] w-[70px] shrink-0 lowercase"
                  style={{ color: i === 4 ? accent : isDark ? "rgba(226,232,240,0.85)" : "rgba(15,23,42,0.8)" }}
                >
                  {row.k}
                </span>
                <span className="text-[11px]" style={{ color: muted }}>
                  {row.v}
                </span>
              </div>
            ))}
            <span className="mt-1 font-mono text-[10px]" style={{ color: rose }}>
              {es ? "cero alucinación · todo rastreable" : "zero hallucination · fully traceable"}
            </span>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Un recomendador que se explica" : "A recommender that explains itself"}>
            {es
              ? "La estructura semántica no predice cuántas visitas tendrás, pero sí sostiene un recomendador de hashtags honesto: cada tag viene de posts reales que significan lo mismo que el tuyo, mostrados al lado. Sin caja negra, sin inventar etiquetas."
              : "The semantic structure doesn't predict how many views you'll get, but it does support an honest hashtag recommender: every tag comes from real posts that mean the same as yours, shown right beside it. No black box, no invented tags."}
          </StoryBeat>
          <StoryBeat title={es ? "Dónde flojea, con honestidad" : "Where it's weak, honestly"}>
            {es
              ? "Es solo texto: el audio, la miniatura y el algoritmo — lo que de verdad mueve el engagement — quedan fuera. all-MiniLM-L6-v2 es sobre todo inglés, así que el slang y otros idiomas se embeben peor. Y el corpus es estático: posts nuevos exigen reindexar."
              : "It's text-only: the audio, the thumbnail and the algorithm — what actually moves engagement — are left out. all-MiniLM-L6-v2 is mostly English, so slang and other languages embed less reliably. And the corpus is static: new posts need a re-index."}
          </StoryBeat>
          <StoryBeat title={es ? "Dónde miraría después" : "Where I'd look next"}>
            {es
              ? "La reducción de varianza es la puerta a lo multimodal: sumar audio y frames al embedding debería estrechar aún más los vecindarios. La estructura ya está — lo que falta es darle más de una foto del post."
              : "The variance reduction is the doorway to multimodal: adding audio and frames to the embedding should tighten the neighborhoods further. The structure is already there — what's missing is giving it more than one view of the post."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>
    </div>
  );
}
