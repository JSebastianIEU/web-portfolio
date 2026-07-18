"use client";

import type { CSSProperties } from "react";

import type { Locale } from "@/domain/i18n";
import { StoryBeat, StoryChapter, StoryProse, StoryStage, StoryStat } from "../story/StoryScene";

type Props = { isDark: boolean; lang: Locale };

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const CYAN = "#22d3ee";
const ROSE = "#fb7185";
const EMERALD = "#34d399";

/** Custom-property style objects, the house cast (see TikTokRecommenderStory). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Measured with `coverage report` on the repo. `pct` is the module's own line
 * coverage; the run as a whole is 846 statements, 173 missed, 80%.
 *
 * Ordered high to low on purpose: the shape of the list is the argument. The
 * domain — models, schemas, routers, services — sits at or near 100, and the
 * tail is entirely cloud glue. Do not re-sort alphabetically.
 */
const COVERAGE = [
  { m: "models", pct: 100 },
  { m: "schemas", pct: 100 },
  { m: "routers/auth", pct: 100 },
  { m: "routers/user", pct: 100 },
  { m: "services/auth", pct: 100 },
  { m: "services/qr", pct: 99 },
  { m: "config", pct: 97 },
  { m: "db", pct: 97 },
  { m: "services/user", pct: 97 },
  { m: "core/security", pct: 95 },
  { m: "core/logging", pct: 94 },
  { m: "services/qr_items", pct: 88 },
  { m: "routers/qr", pct: 87 },
  { m: "routers/export", pct: 57 },
  { m: "storage", pct: 51 },
  { m: "main", pct: 42 },
  { m: "server", pct: 0 },
];

/** The measured run. 80% is where it sits; 60 is what CI refuses to go below. */
const COV = { statements: 846, missed: 173, total: 80, gate: 60 };

/** The generator's parameter surface, straight out of src/app/schemas.py. */
const PARAMS = [
  { k: "title", en: "max 200 chars", es: "máx. 200 caracteres" },
  { k: "url", en: "validated HttpUrl", es: "HttpUrl validada" },
  { k: "foreground_color", en: "hex", es: "hex" },
  { k: "background_color", en: "hex or transparent", es: "hex o transparente" },
  { k: "size", en: "128–1024, default 512", es: "128–1024, por defecto 512" },
  { k: "padding", en: "0–128, default 16", es: "0–128, por defecto 16" },
  { k: "border_radius", en: "0–120, default 0", es: "0–120, por defecto 0" },
  { k: "overlay_text", en: "max 4 chars", es: "máx. 4 caracteres" },
];

/** The two GitHub Actions workflows, job by job, in the order they run. */
const CI_LINT = [
  "checkout",
  "setup python",
  "cache pip",
  "install deps",
  "ruff",
  "black --check",
  "pytest + coverage",
  "fail-under 60",
];
const CI_SCAN = ["buildx build", "Trivy scan", "upload report", "run container", "smoke test", "tear down"];
const CD_SEC = ["Bandit", "Safety", "Trivy", "→ GitHub Security"];
const CD_SHIP = [
  "build + test",
  "validate secrets",
  "Azure + ACR login",
  "build & push image",
  "delete old ACI",
  "deploy to ACI",
  "alembic migrate",
  "HTTPS proxy →",
];

type Palette = {
  isDark: boolean;
  es: boolean;
  muted: string;
  faint: string;
  ink: string;
  chipFill: string;
};

/**
 * A labelled chip. Rect and label carry the same class and the same --i, so
 * they arrive together; neither is wrapped in a <g>, which would have no
 * principal CSS box for the view() timeline to attach to.
 */
function Node({
  x,
  y,
  w,
  h,
  label,
  i,
  fill,
  stroke,
  ink,
  size = 6.5,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  i: number;
  fill: string;
  stroke: string;
  ink: string;
  size?: number;
  dashed?: boolean;
}) {
  return (
    <>
      <rect
        className="qrf-node"
        style={at(i)}
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.7}
        strokeDasharray={dashed ? "3 2.5" : undefined}
      />
      <text
        className="qrf-node"
        style={at(i)}
        x={x + w / 2}
        y={y + h / 2 + size * 0.35}
        fontSize={size}
        fontFamily={MONO}
        textAnchor="middle"
        fill={ink}
      >
        {label}
      </text>
    </>
  );
}

/* =====================================================================
   02 — Two tables, no cleverness
   ===================================================================== */

/**
 * The entire schema, drawn at the scale it deserves: two boxes and one
 * foreign key. The relation is labelled 1 → N and nothing else, because the
 * verified fact is the table count and the ownership edge — not a column
 * list, which is not stated anywhere and would be invention.
 */
function SchemaDiagram({ es, isDark, muted, faint, ink, chipFill }: Palette) {
  const BOX = { w: 84, h: 42, y: 24 };
  const LX = 20;
  const RX = 136;
  const midY = BOX.y + BOX.h / 2;

  const absent = [
    { en: "polymorphic tables", es: "tablas polimórficas" },
    { en: "inheritance", es: "herencia" },
    { en: "premature normalisation", es: "normalización prematura" },
  ];

  return (
    <svg
      viewBox="0 0 240 150"
      className="w-full h-auto block"
      role="img"
      aria-label={
        es
          ? "El esquema completo: dos tablas, users y qr_items, unidas por una sola clave ajena en relación uno a muchos. Debajo, en un recuadro discontinuo y tachado, lo que el modelo no tiene: tablas polimórficas, herencia y normalización prematura."
          : "The whole schema: two tables, users and qr_items, joined by a single foreign key in a one-to-many relation. Below, in a dashed struck-through panel, what the model does not have: polymorphic tables, inheritance and premature normalisation."
      }
    >
      <text className="qrf-node" style={at(0)} x={20} y={12} fontSize={7.5} fontFamily={MONO} fill={muted}>
        {es ? "el esquema, entero" : "the schema, entire"}
      </text>

      {/* users */}
      <rect
        className="qrf-node"
        style={at(1)}
        x={LX}
        y={BOX.y}
        width={BOX.w}
        height={BOX.h}
        rx={4}
        fill={chipFill}
        stroke={CYAN}
        strokeWidth={0.9}
      />
      <text
        className="qrf-node"
        style={at(1)}
        x={LX + BOX.w / 2}
        y={BOX.y + 17}
        fontSize={9}
        fontFamily={MONO}
        textAnchor="middle"
        fill={ink}
      >
        users
      </text>
      <text
        className="qrf-node"
        style={at(1)}
        x={LX + BOX.w / 2}
        y={BOX.y + 30}
        fontSize={6.5}
        textAnchor="middle"
        fill={faint}
      >
        {es ? "quién eres" : "who you are"}
      </text>

      {/* qr_items */}
      <rect
        className="qrf-node"
        style={at(3)}
        x={RX}
        y={BOX.y}
        width={BOX.w}
        height={BOX.h}
        rx={4}
        fill={chipFill}
        stroke={CYAN}
        strokeWidth={0.9}
      />
      <text
        className="qrf-node"
        style={at(3)}
        x={RX + BOX.w / 2}
        y={BOX.y + 17}
        fontSize={9}
        fontFamily={MONO}
        textAnchor="middle"
        fill={ink}
      >
        qr_items
      </text>
      <text
        className="qrf-node"
        style={at(3)}
        x={RX + BOX.w / 2}
        y={BOX.y + 30}
        fontSize={6.5}
        textAnchor="middle"
        fill={faint}
      >
        {es ? "qué has hecho" : "what you made"}
      </text>

      {/* The one foreign key. */}
      <path
        className="qrf-line"
        style={at(2)}
        d={`M${LX + BOX.w} ${midY} H${RX}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={1.1}
        pathLength={1}
        strokeDasharray="1"
      />
      {/* Crow's foot on the many side. */}
      <path
        className="qrf-line"
        style={at(3)}
        d={`M${RX - 7} ${midY} L${RX} ${midY - 4} M${RX - 7} ${midY} L${RX} ${midY + 4}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={1.1}
        pathLength={1}
        strokeDasharray="1"
      />
      <text
        className="qrf-node"
        style={at(2)}
        x={LX + BOX.w + 5}
        y={midY - 4}
        fontSize={7}
        fontFamily={MONO}
        fill={CYAN}
      >
        1
      </text>
      <text
        className="qrf-node"
        style={at(3)}
        x={RX - 5}
        y={midY - 4}
        fontSize={7}
        fontFamily={MONO}
        textAnchor="end"
        fill={CYAN}
      >
        N
      </text>
      <text
        className="qrf-node"
        style={at(3)}
        x={(LX + BOX.w + RX) / 2}
        y={midY + 12}
        fontSize={6.5}
        textAnchor="middle"
        fill={faint}
      >
        {es ? "una clave ajena" : "one foreign key"}
      </text>

      {/* What is deliberately not here. */}
      <rect
        className="qrf-node"
        style={at(5)}
        x={20}
        y={84}
        width={200}
        height={54}
        rx={5}
        fill="none"
        stroke={isDark ? "rgba(148,163,184,0.4)" : "rgba(71,85,105,0.35)"}
        strokeWidth={0.7}
        strokeDasharray="4 3"
      />
      {absent.map((a, i) => {
        const y = 100 + i * 14;
        const label = es ? a.es : a.en;
        return (
          <g key={a.en}>
            <text
              className="qrf-node"
              style={at(6 + i)}
              x={34}
              y={y}
              fontSize={7}
              fontFamily={MONO}
              fill={faint}
            >
              {label}
            </text>
            <line
              className="qrf-line"
              style={at(7 + i)}
              x1={32}
              y1={y - 2.4}
              x2={34 + label.length * 4.05}
              y2={y - 2.4}
              stroke={ROSE}
              strokeWidth={0.9}
              pathLength={1}
              strokeDasharray="1"
            />
          </g>
        );
      })}
      <text className="qrf-node" style={at(5)} x={20} y={78} fontSize={7} fill={muted}>
        {es ? "lo que no está, a propósito" : "what isn't there, on purpose"}
      </text>
    </svg>
  );
}

/* =====================================================================
   03 — One interface, two backends
   ===================================================================== */

/**
 * The storage ABC with its two implementations and the environment variable
 * that picks between them. The whole point of the drawing is the branch: one
 * side needs a cloud account, the other needs a directory, and the caller
 * above the line cannot tell which it got.
 */
function StorageDiagram({ es, muted, faint, ink, chipFill, isDark }: Palette) {
  const methods = ["save_file()", "delete_file()", "get_file_path()"];
  const IF = { x: 34, y: 30, w: 172, h: 52 };
  const SEL = { x: 14, y: 96, w: 212, h: 15 };
  const IMPL = { y: 126, h: 38, w: 106 };

  return (
    <svg
      viewBox="0 0 240 182"
      className="w-full h-auto block"
      role="img"
      aria-label={
        es
          ? "El código de la aplicación habla con una interfaz abstracta, StorageBackend, con tres métodos: save_file, delete_file y get_file_path. Debajo, una condición sobre la variable AZURE_STORAGE_CONNECTION_STRING elige entre dos implementaciones: almacenamiento en disco local si no está definida, y Azure Blob si lo está."
          : "Application code talks to an abstract interface, StorageBackend, with three methods: save_file, delete_file and get_file_path. Below it, a condition on AZURE_STORAGE_CONNECTION_STRING picks between two implementations: local filesystem storage when it is unset, and Azure Blob when it is set."
      }
    >
      <Node
        x={72}
        y={6}
        w={96}
        h={16}
        label={es ? "código de la app" : "application code"}
        i={0}
        fill={chipFill}
        stroke={isDark ? "rgba(148,163,184,0.5)" : "rgba(71,85,105,0.4)"}
        ink={ink}
      />
      <path
        className="qrf-line"
        style={at(1)}
        d={`M120 22 V${IF.y}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={1}
        pathLength={1}
        strokeDasharray="1"
      />

      {/* The interface. */}
      <rect
        className="qrf-node"
        style={at(1)}
        x={IF.x}
        y={IF.y}
        width={IF.w}
        height={IF.h}
        rx={4}
        fill={chipFill}
        stroke={CYAN}
        strokeWidth={1}
      />
      <text
        className="qrf-node"
        style={at(1)}
        x={IF.x + 8}
        y={IF.y + 13}
        fontSize={8}
        fontFamily={MONO}
        fill={CYAN}
      >
        StorageBackend
      </text>
      <text
        className="qrf-node"
        style={at(1)}
        x={IF.x + IF.w - 8}
        y={IF.y + 13}
        fontSize={6.5}
        fontFamily={MONO}
        textAnchor="end"
        fill={faint}
      >
        ABC
      </text>
      {methods.map((m, i) => (
        <text
          key={m}
          className="qrf-node"
          style={at(2 + i)}
          x={IF.x + 12}
          y={IF.y + 26 + i * 10}
          fontSize={6.8}
          fontFamily={MONO}
          fill={ink}
        >
          {m}
        </text>
      ))}

      {/* The switch. */}
      <path
        className="qrf-line"
        style={at(5)}
        d={`M120 ${IF.y + IF.h} V${SEL.y}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={1}
        pathLength={1}
        strokeDasharray="1"
      />
      <Node
        x={SEL.x}
        y={SEL.y}
        w={SEL.w}
        h={SEL.h}
        label="AZURE_STORAGE_CONNECTION_STRING?"
        i={5}
        fill="none"
        stroke={isDark ? "rgba(148,163,184,0.55)" : "rgba(71,85,105,0.45)"}
        ink={muted}
        size={6.6}
        dashed
      />

      {/* The fork. */}
      <path
        className="qrf-line"
        style={at(6)}
        d={`M120 ${SEL.y + SEL.h} V${SEL.y + SEL.h + 8} H67 V${IMPL.y}`}
        fill="none"
        stroke={EMERALD}
        strokeWidth={1}
        pathLength={1}
        strokeDasharray="1"
      />
      <path
        className="qrf-line"
        style={at(7)}
        d={`M120 ${SEL.y + SEL.h} V${SEL.y + SEL.h + 8} H173 V${IMPL.y}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={1}
        pathLength={1}
        strokeDasharray="1"
      />
      <text className="qrf-node" style={at(6)} x={62} y={SEL.y + SEL.h + 6} fontSize={6.2} fontFamily={MONO} textAnchor="end" fill={EMERALD}>
        {es ? "no" : "unset"}
      </text>
      <text className="qrf-node" style={at(7)} x={178} y={SEL.y + SEL.h + 6} fontSize={6.2} fontFamily={MONO} fill={CYAN}>
        {es ? "sí" : "set"}
      </text>

      {/* The two implementations. */}
      <rect
        className="qrf-node"
        style={at(8)}
        x={14}
        y={IMPL.y}
        width={IMPL.w}
        height={IMPL.h}
        rx={4}
        fill={chipFill}
        stroke={EMERALD}
        strokeWidth={0.9}
      />
      <text className="qrf-node" style={at(8)} x={67} y={IMPL.y + 15} fontSize={7} fontFamily={MONO} textAnchor="middle" fill={ink}>
        LocalFilesystem
      </text>
      <text className="qrf-node" style={at(8)} x={67} y={IMPL.y + 28} fontSize={6.2} textAnchor="middle" fill={EMERALD}>
        {es ? "cero credenciales" : "zero credentials"}
      </text>

      <rect
        className="qrf-node"
        style={at(9)}
        x={120}
        y={IMPL.y}
        width={IMPL.w}
        height={IMPL.h}
        rx={4}
        fill={chipFill}
        stroke={CYAN}
        strokeWidth={0.9}
      />
      <text className="qrf-node" style={at(9)} x={173} y={IMPL.y + 15} fontSize={7} fontFamily={MONO} textAnchor="middle" fill={ink}>
        AzureBlob
      </text>
      <text className="qrf-node" style={at(9)} x={173} y={IMPL.y + 28} fontSize={6.2} textAnchor="middle" fill={CYAN}>
        {es ? "sólo en producción" : "production only"}
      </text>

      <text className="qrf-node" style={at(10)} x={14} y={178} fontSize={6.4} fill={faint}>
        {es
          ? "la suite de tests recorre siempre la rama de la izquierda"
          : "the test suite always walks the left branch"}
      </text>
    </svg>
  );
}

/* =====================================================================
   04 — The pipeline
   ===================================================================== */

/**
 * Both workflows in one frame: ci.yaml on top, cd.yaml below, each as two
 * parallel job columns. The spine behind each column is a single normalised
 * path, so the connector draws itself as the chips land on it.
 *
 * Two chips are called out in colour because later chapters pick them up:
 * the coverage gate (chapter 07) and the HTTPS proxy (chapter 05).
 */
function PipelineDiagram({ es, muted, faint, ink, chipFill, isDark }: Palette) {
  const COL_W = 108;
  const LX = 6;
  const RX = 126;
  const CH_H = 12.5;
  const PITCH = 16;

  const hair = isDark ? "rgba(148,163,184,0.3)" : "rgba(71,85,105,0.26)";
  const chipStroke = isDark ? "rgba(148,163,184,0.45)" : "rgba(71,85,105,0.35)";

  const CI_TOP = 30;
  const CD_LABEL = 190;
  const CD_TOP = 200;

  /** One column of chips plus the spine they sit on. */
  const column = (steps: string[], x: number, top: number, accents: Record<number, string>) => {
    const cx = x + COL_W / 2;
    const last = top + (steps.length - 1) * PITCH;
    return (
      <>
        <path
          className="qrf-line"
          style={at(0)}
          d={`M${cx} ${top + CH_H / 2} V${last + CH_H / 2}`}
          fill="none"
          stroke={hair}
          strokeWidth={1}
          pathLength={1}
          strokeDasharray="1"
        />
        {steps.map((s, i) => {
          const tone = accents[i];
          return (
            <Node
              key={s}
              x={x}
              y={top + i * PITCH}
              w={COL_W}
              h={CH_H}
              label={s}
              i={i}
              fill={tone ? `${tone}1f` : chipFill}
              stroke={tone ?? chipStroke}
              ink={tone ?? ink}
              size={6.4}
            />
          );
        })}
      </>
    );
  };

  return (
    <svg
      viewBox="0 0 240 336"
      className="w-full h-auto block"
      role="img"
      aria-label={
        es
          ? "Los dos workflows de GitHub Actions. Arriba ci.yaml, con dos jobs en paralelo: test-and-lint (checkout, setup de python, caché de pip, instalación, ruff, black --check, pytest con cobertura y el corte en 60) y container-scan-smoke (build con buildx, escaneo Trivy, subida del informe, arranque del contenedor, smoke test y apagado). Abajo cd.yaml, también con dos jobs: security-scan (Bandit, Safety, Trivy y subida a GitHub Security) y build-and-push (build y tests, validación de secretos, login en Azure y ACR, build y push de la imagen, borrado de la instancia ACI anterior, despliegue en ACI, migraciones de Alembic y por último el proxy HTTPS)."
          : "The two GitHub Actions workflows. On top ci.yaml, with two parallel jobs: test-and-lint (checkout, setup python, cache pip, install, ruff, black --check, pytest with coverage and the fail-under 60 gate) and container-scan-smoke (buildx build, Trivy scan, upload report, run the container, smoke test and tear down). Below, cd.yaml, also two jobs: security-scan (Bandit, Safety, Trivy and upload to GitHub Security) and build-and-push (build and test, validate secrets, Azure and ACR login, build and push the image, delete the old ACI instance, deploy to ACI, Alembic migrations and finally the HTTPS proxy)."
      }
    >
      {/* ---- ci.yaml ---- */}
      <text className="qrf-node" style={at(0)} x={LX} y={9} fontSize={8} fontFamily={MONO} fill={CYAN}>
        ci.yaml
      </text>
      <text className="qrf-node" style={at(0)} x={234} y={9} fontSize={6.4} textAnchor="end" fill={faint}>
        {es ? "en cada push y PR" : "on push and pull request"}
      </text>
      <text className="qrf-node" style={at(0)} x={LX + COL_W / 2} y={24} fontSize={6.6} fontFamily={MONO} textAnchor="middle" fill={muted}>
        test-and-lint
      </text>
      <text className="qrf-node" style={at(0)} x={RX + COL_W / 2} y={24} fontSize={6.6} fontFamily={MONO} textAnchor="middle" fill={muted}>
        container-scan-smoke
      </text>
      {column(CI_LINT, LX, CI_TOP, { 7: ROSE })}
      {column(CI_SCAN, RX, CI_TOP, {})}

      <line x1={LX} y1={176} x2={234} y2={176} stroke={hair} strokeWidth={0.7} />

      {/* ---- cd.yaml ---- */}
      <text className="qrf-node" style={at(0)} x={LX} y={CD_LABEL - 4} fontSize={8} fontFamily={MONO} fill={EMERALD}>
        cd.yaml
      </text>
      <text className="qrf-node" style={at(0)} x={LX + COL_W / 2} y={CD_TOP - 6} fontSize={6.6} fontFamily={MONO} textAnchor="middle" fill={muted}>
        security-scan
      </text>
      <text className="qrf-node" style={at(0)} x={RX + COL_W / 2} y={CD_TOP - 6} fontSize={6.6} fontFamily={MONO} textAnchor="middle" fill={muted}>
        build-and-push
      </text>
      {column(CD_SEC, LX, CD_TOP, {})}
      {column(CD_SHIP, RX, CD_TOP, { 7: ROSE })}

      <text className="qrf-node" style={at(8)} x={LX} y={330} fontSize={6.2} fill={faint}>
        {es
          ? "rosa: el corte de cobertura y el proxy, que tienen su propio capítulo"
          : "rose: the coverage gate and the proxy — each gets its own chapter"}
      </text>
    </svg>
  );
}

/* =====================================================================
   05 — Two containers
   ===================================================================== */

/**
 * Why the deployment is two containers rather than one. The left leg carries
 * TLS and stops at App Service; the right leg is plain HTTP inside Azure,
 * because Azure Container Instances will not terminate TLS for you.
 */
function ProxyDiagram({ es, faint, ink, chipFill, isDark, muted }: Palette) {
  const BOX_Y = 30;
  const hairline = isDark ? "rgba(148,163,184,0.4)" : "rgba(71,85,105,0.35)";

  return (
    <svg
      viewBox="0 0 240 132"
      className="w-full h-auto block"
      role="img"
      aria-label={
        es
          ? "Una petición del navegador llega por HTTPS a un contenedor proxy desplegado en App Service, que es donde termina el TLS. Desde ahí sigue por HTTP plano, dentro de Azure, hasta el contenedor de la aplicación en Container Instances, que escucha en el puerto 8000. La nota indica que ACI no termina TLS."
          : "A browser request arrives over HTTPS at a proxy container deployed on App Service, which is where TLS terminates. From there it continues over plain HTTP, inside Azure, to the application container on Container Instances, listening on port 8000. The note records that ACI does not terminate TLS."
      }
    >
      {/* browser */}
      <rect
        className="qrf-node"
        style={at(0)}
        x={6}
        y={BOX_Y + 12}
        width={44}
        height={30}
        rx={4}
        fill={chipFill}
        stroke={hairline}
        strokeWidth={0.8}
      />
      <text className="qrf-node" style={at(0)} x={28} y={BOX_Y + 31} fontSize={7} fontFamily={MONO} textAnchor="middle" fill={ink}>
        {es ? "navegador" : "browser"}
      </text>

      {/* leg 1: TLS */}
      <path
        className="qrf-line"
        style={at(1)}
        d={`M50 ${BOX_Y + 27} H84`}
        fill="none"
        stroke={EMERALD}
        strokeWidth={1.2}
        pathLength={1}
        strokeDasharray="1"
      />
      <path
        className="qrf-line"
        style={at(2)}
        d={`M78 ${BOX_Y + 23} L84 ${BOX_Y + 27} L78 ${BOX_Y + 31}`}
        fill="none"
        stroke={EMERALD}
        strokeWidth={1.1}
        pathLength={1}
        strokeDasharray="1"
      />
      <text className="qrf-node" style={at(1)} x={67} y={BOX_Y + 20} fontSize={6.4} fontFamily={MONO} textAnchor="middle" fill={EMERALD}>
        https
      </text>

      {/* proxy on App Service */}
      <rect
        className="qrf-node"
        style={at(2)}
        x={86}
        y={BOX_Y}
        width={62}
        height={54}
        rx={4}
        fill={chipFill}
        stroke={EMERALD}
        strokeWidth={1}
      />
      <text className="qrf-node" style={at(2)} x={117} y={BOX_Y + 15} fontSize={7.4} fontFamily={MONO} textAnchor="middle" fill={ink}>
        {es ? "proxy" : "proxy"}
      </text>
      <text className="qrf-node" style={at(2)} x={117} y={BOX_Y + 27} fontSize={6.2} textAnchor="middle" fill={faint}>
        App Service
      </text>
      <text className="qrf-node" style={at(3)} x={117} y={BOX_Y + 43} fontSize={6.2} textAnchor="middle" fill={EMERALD}>
        {es ? "aquí acaba el TLS" : "TLS stops here"}
      </text>

      {/* leg 2: plain HTTP */}
      <path
        className="qrf-line"
        style={at(4)}
        d={`M148 ${BOX_Y + 27} H180`}
        fill="none"
        stroke={ROSE}
        strokeWidth={1.2}
        pathLength={1}
        strokeDasharray="1"
      />
      <path
        className="qrf-line"
        style={at(5)}
        d={`M174 ${BOX_Y + 23} L180 ${BOX_Y + 27} L174 ${BOX_Y + 31}`}
        fill="none"
        stroke={ROSE}
        strokeWidth={1.1}
        pathLength={1}
        strokeDasharray="1"
      />
      <text className="qrf-node" style={at(4)} x={164} y={BOX_Y + 20} fontSize={6.4} fontFamily={MONO} textAnchor="middle" fill={ROSE}>
        http
      </text>

      {/* app on ACI */}
      <rect
        className="qrf-node"
        style={at(5)}
        x={182}
        y={BOX_Y}
        width={52}
        height={54}
        rx={4}
        fill={chipFill}
        stroke={ROSE}
        strokeWidth={1}
      />
      <text className="qrf-node" style={at(5)} x={208} y={BOX_Y + 15} fontSize={7.4} fontFamily={MONO} textAnchor="middle" fill={ink}>
        {es ? "la app" : "the app"}
      </text>
      <text className="qrf-node" style={at(5)} x={208} y={BOX_Y + 27} fontSize={6.2} textAnchor="middle" fill={faint}>
        ACI
      </text>
      <text className="qrf-node" style={at(6)} x={208} y={BOX_Y + 43} fontSize={6.2} fontFamily={MONO} textAnchor="middle" fill={ROSE}>
        :8000
      </text>

      {/* The reason, drawn as a bracket under the second leg. */}
      <path
        className="qrf-line"
        style={at(7)}
        d={`M148 ${BOX_Y + 62} V${BOX_Y + 68} H234 V${BOX_Y + 62}`}
        fill="none"
        stroke={ROSE}
        strokeWidth={0.7}
        strokeOpacity={0.7}
        pathLength={1}
        strokeDasharray="1"
      />
      <text className="qrf-node" style={at(8)} x={191} y={BOX_Y + 78} fontSize={6.6} textAnchor="middle" fill={ROSE}>
        {es ? "ACI no termina TLS" : "ACI does not terminate TLS"}
      </text>

      <text className="qrf-node" style={at(0)} x={6} y={10} fontSize={7.5} fontFamily={MONO} fill={muted}>
        {es ? "una petición, dos contenedores" : "one request, two containers"}
      </text>
    </svg>
  );
}

/* =====================================================================
   06 — Three stages, one lean image
   ===================================================================== */

/**
 * The Dockerfile as what it actually is: a funnel. Two build stages exist so
 * their toolchains can be thrown away, and only their output crosses into the
 * runtime stage — which is the only one that ships.
 */
function DockerDiagram({ es, faint, ink, chipFill, isDark, muted }: Palette) {
  const hairline = isDark ? "rgba(148,163,184,0.4)" : "rgba(71,85,105,0.35)";
  const S = { x: 6, w: 142, h: 40 };
  const S1 = 20;
  const S2 = 80;
  const S3 = 140;

  const stage = (
    y: number,
    n: string,
    image: string,
    role: string,
    i: number,
    tone: string,
    w = S.w,
  ) => (
    <>
      <rect
        className="qrf-node"
        style={at(i)}
        x={S.x}
        y={y}
        width={w}
        height={S.h}
        rx={4}
        fill={chipFill}
        stroke={tone}
        strokeWidth={0.9}
      />
      <text className="qrf-node" style={at(i)} x={S.x + 8} y={y + 12} fontSize={6.2} fontFamily={MONO} fill={tone}>
        {n}
      </text>
      <text className="qrf-node" style={at(i)} x={S.x + 8} y={y + 24} fontSize={7.6} fontFamily={MONO} fill={ink}>
        {image}
      </text>
      <text className="qrf-node" style={at(i)} x={S.x + 8} y={y + 34} fontSize={6.4} fill={faint}>
        {role}
      </text>
    </>
  );

  /**
   * What the stage leaves behind, off to the right. Two short lines rather
   * than one long one: the callout starts at x=176 in a 240-wide viewBox, so
   * a single label of more than ~17 monospace characters runs off the frame —
   * and the Spanish strings are the longer ones.
   */
  const discard = (y: number, lines: [string, string], i: number) => (
    <>
      <path
        className="qrf-line"
        style={at(i)}
        d={`M${S.x + S.w} ${y + S.h / 2} H172`}
        fill="none"
        stroke={ROSE}
        strokeWidth={0.8}
        strokeOpacity={0.75}
        pathLength={1}
        strokeDasharray="1"
      />
      <text className="qrf-node" style={at(i)} x={176} y={y + S.h / 2 - 7} fontSize={6} fill={ROSE}>
        {es ? "se descarta" : "discarded"}
      </text>
      {lines.map((l, k) => (
        <text
          key={l}
          className="qrf-node"
          style={at(i)}
          x={176}
          y={y + S.h / 2 + 2 + k * 8}
          fontSize={6}
          fontFamily={MONO}
          fill={faint}
        >
          {l}
        </text>
      ))}
    </>
  );

  /** What survives: the only thing that crosses into the next stage. */
  const carry = (from: number, label: string, i: number) => (
    <>
      <path
        className="qrf-line"
        style={at(i)}
        d={`M40 ${from + S.h} V${from + S.h + 20}`}
        fill="none"
        stroke={EMERALD}
        strokeWidth={1.1}
        pathLength={1}
        strokeDasharray="1"
      />
      <path
        className="qrf-line"
        style={at(i)}
        d={`M36 ${from + S.h + 14} L40 ${from + S.h + 20} L44 ${from + S.h + 14}`}
        fill="none"
        stroke={EMERALD}
        strokeWidth={1.1}
        pathLength={1}
        strokeDasharray="1"
      />
      <text className="qrf-node" style={at(i)} x={48} y={from + S.h + 13} fontSize={6.4} fontFamily={MONO} fill={EMERALD}>
        {label}
      </text>
    </>
  );

  const runtimeLines = [
    { en: "pip install --no-index (prebuilt wheels)", es: "pip install --no-index (wheels ya construidas)" },
    { en: "system user `app` — never root", es: "usuario de sistema `app` — nunca root" },
    { en: "EXPOSE 8000", es: "EXPOSE 8000" },
    { en: "HEALTHCHECK curl /health · 30s · 5 retries", es: "HEALTHCHECK curl /health · 30s · 5 reintentos" },
    { en: "uvicorn app.server:app --proxy-headers", es: "uvicorn app.server:app --proxy-headers" },
  ];

  return (
    <svg
      viewBox="0 0 240 268"
      className="w-full h-auto block"
      role="img"
      aria-label={
        es
          ? "Tres etapas apiladas. La primera, node:20-alpine, construye el frontend y descarta node_modules y el toolchain de npm; sólo pasan los assets compilados. La segunda, python:3.11-slim, construye las wheels y descarta compiladores y dependencias de build; sólo pasan las wheels. La tercera, otra python:3.11-slim, es la única imagen que se envía: instala desde las wheels sin índice, crea un usuario de sistema app y corre sin root, expone el 8000, define un HEALTHCHECK contra /health cada 30 segundos con 5 reintentos y arranca uvicorn con proxy-headers."
          : "Three stacked stages. The first, node:20-alpine, builds the frontend and discards node_modules and the npm toolchain; only the compiled assets cross. The second, python:3.11-slim, builds wheels and discards compilers and build dependencies; only the wheels cross. The third, another python:3.11-slim, is the only image that ships: it installs from the wheels with no index, creates a system user app and runs non-root, exposes 8000, defines a HEALTHCHECK against /health every 30 seconds with 5 retries, and starts uvicorn with proxy-headers."
      }
    >
      <text className="qrf-node" style={at(0)} x={S.x} y={10} fontSize={7.5} fontFamily={MONO} fill={muted}>
        {es ? "tres etapas, una imagen" : "three stages, one image"}
      </text>

      {stage(S1, "stage 1", "node:20-alpine", es ? "build del frontend" : "frontend build", 0, hairline)}
      {discard(S1, ["node_modules", es ? "toolchain npm" : "npm toolchain"], 1)}
      {carry(S1, es ? "assets compilados" : "compiled assets", 2)}

      {stage(S2, "stage 2", "python:3.11-slim", es ? "constructor de wheels" : "wheel builder", 3, hairline)}
      {discard(S2, [es ? "compiladores" : "compilers", es ? "deps de build" : "build deps"], 4)}
      {carry(S2, "wheels/", 5)}

      {/* The runtime stage is full width: it is the one that ships. */}
      <rect
        className="qrf-node"
        style={at(6)}
        x={S.x}
        y={S3}
        width={228}
        height={94}
        rx={5}
        fill={chipFill}
        stroke={EMERALD}
        strokeWidth={1.1}
      />
      <text className="qrf-node" style={at(6)} x={S.x + 10} y={S3 + 13} fontSize={6.2} fontFamily={MONO} fill={EMERALD}>
        stage 3
      </text>
      <text className="qrf-node" style={at(6)} x={228} y={S3 + 13} fontSize={6.4} fontFamily={MONO} textAnchor="end" fill={EMERALD}>
        {es ? "lo único que se envía" : "the only thing shipped"}
      </text>
      <text className="qrf-node" style={at(6)} x={S.x + 10} y={S3 + 26} fontSize={8.4} fontFamily={MONO} fill={ink}>
        python:3.11-slim
      </text>
      {runtimeLines.map((l, i) => (
        <text
          key={l.en}
          className="qrf-node"
          style={at(7 + i)}
          x={S.x + 10}
          y={S3 + 40 + i * 11}
          fontSize={6.6}
          fontFamily={MONO}
          fill={faint}
        >
          {es ? l.es : l.en}
        </text>
      ))}
    </svg>
  );
}

/* =====================================================================
   07 — Coverage, per module
   ===================================================================== */

/**
 * One bar per module, sorted high to low, with two reference lines: the CI
 * gate at 60 (the promise) and the run total at 80 (where it currently sits).
 *
 * The colour bands are not decoration. Everything above the gate is domain
 * code; everything below it — export, storage, main, server — is the code
 * that only fully executes against a cloud account, which is precisely the
 * cost of the chapter-03 decision.
 */
function CoverageDiagram({ es, faint, ink, isDark, muted }: Palette) {
  const X0 = 78;
  const X1 = 220;
  const SPAN = X1 - X0;
  const ROW_TOP = 26;
  const PITCH = 12;
  const BAR_H = 7;
  const AXIS_Y = ROW_TOP + COVERAGE.length * PITCH + 2;

  const xAt = (p: number) => X0 + (p / 100) * SPAN;
  const toneOf = (p: number) => (p < COV.gate ? ROSE : p >= 95 ? EMERALD : CYAN);

  const grid = isDark ? "rgba(148,163,184,0.18)" : "rgba(71,85,105,0.16)";

  return (
    <svg
      viewBox={`0 0 240 ${AXIS_Y + 22}`}
      className="w-full h-auto block"
      role="img"
      aria-label={
        es
          ? `Cobertura por módulo, de mayor a menor: models 100, schemas 100, routers/auth 100, routers/user 100, services/auth 100, services/qr 99, config 97, db 97, services/user 97, core/security 95, core/logging 94, services/qr_items 88, routers/qr 87, routers/export 57, storage 51, main 42 y server 0. Dos líneas de referencia: el corte de CI en 60 y el total medido de la ejecución en 80. Los cuatro módulos por debajo del corte son los que sólo se ejecutan del todo contra una cuenta cloud.`
          : `Coverage per module, high to low: models 100, schemas 100, routers/auth 100, routers/user 100, services/auth 100, services/qr 99, config 97, db 97, services/user 97, core/security 95, core/logging 94, services/qr_items 88, routers/qr 87, routers/export 57, storage 51, main 42 and server 0. Two reference lines: the CI gate at 60 and the run's measured total at 80. The four modules below the gate are the ones that only fully execute against a cloud account.`
      }
    >
      <text className="qrf-node" style={at(0)} x={4} y={9} fontSize={7.5} fontFamily={MONO} fill={muted}>
        {es ? "cobertura por módulo" : "coverage, per module"}
      </text>

      {/* The two reference lines. The gate is what is enforced; the total is
          only where the run happens to land today. */}
      <line x1={xAt(COV.gate)} y1={16} x2={xAt(COV.gate)} y2={AXIS_Y} stroke={ROSE} strokeWidth={0.8} strokeDasharray="3 2.5" />
      <line x1={xAt(COV.total)} y1={16} x2={xAt(COV.total)} y2={AXIS_Y} stroke={CYAN} strokeWidth={0.8} strokeDasharray="3 2.5" />
      <text className="qrf-node" style={at(0)} x={xAt(COV.gate) - 2} y={13} fontSize={6.2} fontFamily={MONO} textAnchor="end" fill={ROSE}>
        {es ? "gate 60" : "gate 60"}
      </text>
      <text className="qrf-node" style={at(0)} x={xAt(COV.total) + 2} y={13} fontSize={6.2} fontFamily={MONO} fill={CYAN}>
        {es ? "total 80" : "total 80"}
      </text>

      {/* 0 and 100 rules, so a bar length is readable without a ruler. */}
      {[0, 100].map((p) => (
        <line key={p} x1={xAt(p)} y1={20} x2={xAt(p)} y2={AXIS_Y} stroke={grid} strokeWidth={0.6} />
      ))}

      {COVERAGE.map((row, i) => {
        const y = ROW_TOP + i * PITCH;
        const tone = toneOf(row.pct);
        const w = (row.pct / 100) * SPAN;
        return (
          <g key={row.m}>
            <text
              className="qrf-node"
              style={at(i)}
              x={X0 - 5}
              y={y + BAR_H - 1}
              fontSize={6.2}
              fontFamily={MONO}
              textAnchor="end"
              fill={row.pct < COV.gate ? ROSE : faint}
            >
              {row.m}
            </text>
            {/* A zero-width rect is invisible, so `server` gets a tick instead
                of a bar and still reads as a row rather than a gap. */}
            {w > 0 ? (
              <rect
                className="qrf-bar"
                style={at(i)}
                x={X0}
                y={y}
                width={w}
                height={BAR_H}
                rx={1.4}
                fill={tone}
                fillOpacity={0.85}
              />
            ) : (
              <line className="qrf-node" style={at(i)} x1={X0} y1={y} x2={X0} y2={y + BAR_H} stroke={tone} strokeWidth={1.4} />
            )}
            <text
              className="qrf-node"
              style={at(i)}
              x={X0 + w + 4}
              y={y + BAR_H - 1}
              fontSize={6}
              fontFamily={MONO}
              fill={row.pct < COV.gate ? ROSE : ink}
            >
              {row.pct}
            </text>
          </g>
        );
      })}

      <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} stroke={grid} strokeWidth={0.7} />
      {[0, 50, 100].map((p) => (
        <text
          key={p}
          className="qrf-node"
          style={at(0)}
          x={xAt(p)}
          y={AXIS_Y + 9}
          fontSize={6}
          fontFamily={MONO}
          textAnchor={p === 100 ? "end" : p === 0 ? "start" : "middle"}
          fill={faint}
        >
          {p}
        </text>
      ))}
      <text className="qrf-node" style={at(0)} x={4} y={AXIS_Y + 19} fontSize={6.2} fill={faint}>
        {es
          ? `${COV.statements} sentencias · ${COV.missed} sin cubrir · ${COV.total}% medido`
          : `${COV.statements} statements · ${COV.missed} missed · ${COV.total}% measured`}
      </text>
    </svg>
  );
}

/* =====================================================================
   08 — Scope
   ===================================================================== */

/** What shipped on the left, what was refused on the right, one line between. */
function ScopeDiagram({ es, faint, ink, chipFill, isDark, muted }: Palette) {
  /**
   * Kept short on purpose: the chips are 104 units wide and the labels are
   * centred inside them, so anything past ~26 monospace characters spills out
   * of its own box. The prose beside the diagram carries the full phrasing.
   */
  const shipped = [
    { en: "bcrypt password hashing", es: "contraseñas con bcrypt" },
    { en: "short-lived JWTs", es: "JWT de vida corta" },
    { en: "ownership at query level", es: "propiedad en la query" },
    { en: "deliberately vague errors", es: "errores vagos a propósito" },
  ];
  const refused = [
    { en: "OAuth", es: "OAuth" },
    { en: "refresh tokens", es: "refresh tokens" },
    { en: "role-based access control", es: "control de acceso por roles" },
    { en: "blue-green deployments", es: "despliegues blue-green" },
    { en: "infrastructure as code", es: "infraestructura como código" },
  ];

  const COL_W = 104;
  const CH_H = 14;
  const PITCH = 18;
  const TOP = 26;
  const hairline = isDark ? "rgba(148,163,184,0.4)" : "rgba(71,85,105,0.35)";

  return (
    <svg
      viewBox="0 0 240 132"
      className="w-full h-auto block"
      role="img"
      aria-label={
        es
          ? "Dos columnas separadas por una línea discontinua. A la izquierda, lo que sí está construido: hash de contraseñas con bcrypt, JWT de vida corta, propiedad forzada a nivel de query y errores deliberadamente vagos. A la derecha, en recuadros discontinuos, lo que se dejó fuera a propósito: OAuth, refresh tokens, control de acceso por roles, despliegues blue-green e infraestructura como código."
          : "Two columns separated by a dashed line. On the left, what is built: bcrypt password hashing, short-lived JWTs, ownership enforced at query level and deliberately vague errors. On the right, in dashed boxes, what was left out on purpose: OAuth, refresh tokens, role-based access control, blue-green deployments and infrastructure as code."
      }
    >
      <text className="qrf-node" style={at(0)} x={6} y={10} fontSize={7} fontFamily={MONO} fill={EMERALD}>
        {es ? "construido" : "built"}
      </text>
      <text className="qrf-node" style={at(0)} x={234} y={10} fontSize={7} fontFamily={MONO} textAnchor="end" fill={muted}>
        {es ? "fuera de alcance, a propósito" : "out of scope, on purpose"}
      </text>

      <line x1={120} y1={16} x2={120} y2={124} stroke={hairline} strokeWidth={0.7} strokeDasharray="4 3" />

      {shipped.map((s, i) => (
        <Node
          key={s.en}
          x={6}
          y={TOP + i * PITCH}
          w={COL_W}
          h={CH_H}
          label={es ? s.es : s.en}
          i={i}
          fill={chipFill}
          stroke={EMERALD}
          ink={ink}
          size={6.1}
        />
      ))}
      {refused.map((r, i) => (
        <Node
          key={r.en}
          x={130}
          y={TOP + i * PITCH}
          w={COL_W}
          h={CH_H}
          label={es ? r.es : r.en}
          i={i}
          fill="none"
          stroke={hairline}
          ink={faint}
          size={6.1}
          dashed
        />
      ))}
    </svg>
  );
}

/* =====================================================================
   The story
   ===================================================================== */

/**
 * QR Forge told as a vertical story, same system as the other project pages:
 * a sticky visual per chapter with the prose scrolling past it.
 *
 * Every figure here was measured on the repo itself — `wc -l` over the source
 * trees, a pytest run, a `coverage report`, and the two workflow files. Where
 * the number here is the measured one, and the split by module is the point:
 * the domain is fully covered and the cloud glue is not, by design, as stated in
 * chapter 07. Nothing on this page is taken from the write-up.
 */
export default function QrForgeStory({ isDark, lang }: Props) {
  const es = lang === "es";
  const muted = isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)";
  const faint = isDark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)";
  const ink = isDark ? "#f8fafc" : "#0f172a";
  const chipFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.025)";
  const cardBorder = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)";

  const palette: Palette = { isDark, es, muted, faint, ink, chipFill };

  return (
    <div className="flex flex-col">
      {/* 01 — The easy part is the QR */}
      <StoryChapter index="01" eyebrow={es ? "La parte fácil" : "The easy part"}>
        <StoryStage>
          {/* maxWidth is inline, not a max-w-* utility: `.story-stage > *` sets
              max-width:100% at equal specificity and later in the cascade, so
              a max-w-[Npx] on a direct stage child is silently dead. */}
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: 420 }}>
            <div className="tower-band rounded-xl overflow-hidden" style={{ border: cardBorder, background: cardBg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/qr-forge/home.webp"
                alt={
                  es
                    ? "Página de inicio de QR Forge, con su propuesta y el acceso al generador"
                    : "QR Forge landing page, with its pitch and the way into the generator"
                }
                width={1600}
                height={1000}
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>
            <div className="tower-band rounded-xl overflow-hidden" style={{ border: cardBorder, background: cardBg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/projects/qr-forge/generator.webp"
                alt={
                  es
                    ? "El generador en marcha: controles de color, tamaño, padding y radio junto a la vista previa del código"
                    : "The generator running: colour, size, padding and radius controls beside the live preview of the code"
                }
                width={1600}
                height={1000}
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>
            <p className="text-[10.5px] leading-relaxed font-mono" style={{ color: faint }}>
              {es
                ? "El producto existe y es aburrido a propósito: pones una URL, ajustas cuatro cosas y te llevas el código."
                : "The product exists, and it is deliberately boring: paste a URL, adjust four things, take the code away."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Generar un QR es una llamada a una librería" : "Generating a QR is a library call"}>
            {es
              ? "Esa es toda la parte interesante del dominio, y cabe en un puñado de líneas. Si el proyecto fuera eso, no habría nada que contar aquí."
              : "That is the whole of the interesting domain, and it fits in a handful of lines. If the project were that, there would be nothing to tell here."}
          </StoryBeat>
          <StoryBeat title={es ? "Lo que sí cuesta" : "What actually costs"}>
            {es
              ? "Validar cada parámetro antes de tocar nada. Guardar el archivo en un sitio que no dependa de una nube concreta. Saber que sigue funcionando después de un cambio. Construir una imagen que se pueda desplegar. Y ponerla detrás de HTTPS. Ese es el proyecto."
              : "Validating every parameter before anything is touched. Putting the file somewhere that does not depend on one particular cloud. Knowing it still works after a change. Building an image you can actually deploy. And putting it behind HTTPS. That is the project."}
          </StoryBeat>
          <StoryBeat title={es ? "El reparto de líneas lo dice solo" : "The line count says it out loud"}>
            {es
              ? "1.801 líneas de backend, 2.487 de frontend y 2.109 de tests. Hay más código de test que de aplicación, y no por casualidad: es la forma que toma un proyecto cuyo objetivo declarado era el rigor operativo y no la funcionalidad."
              : "1,801 lines of backend, 2,487 of frontend and 2,109 of tests. There is more test code than application code, and not by accident: that is the shape a project takes when its stated goal was operational rigour rather than features."}
          </StoryBeat>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <StoryStat value="1,801" label={es ? "líneas de backend (22 archivos)" : "backend lines (22 files)"} />
            <StoryStat value="2,109" label={es ? "líneas de test (20 archivos)" : "test lines (20 files)"} accent />
          </div>

          <StoryBeat title={es ? "Todo lo que se puede pedir, y sus límites" : "Everything you can ask for, and its limits"}>
            {es
              ? "La superficie del generador es pequeña y está cerrada por completo en el esquema. Ningún parámetro llega al dominio sin haber pasado por su rango."
              : "The generator's surface is small and it is closed completely in the schema. No parameter reaches the domain without having gone through its range first."}
          </StoryBeat>
          <div className="flex flex-col gap-1.5" style={{ maxWidth: 420 }}>
            {/* .tower-band takes no --i: its range is fixed, and the natural
                vertical offset between rows is enough of a stagger here. */}
            {PARAMS.map((p) => (
              <div
                key={p.k}
                className="tower-band rounded-lg px-3 py-2 flex items-baseline justify-between gap-3"
                style={{ border: cardBorder, background: cardBg }}
              >
                <span className="font-mono text-[11px]" style={{ color: ink }}>
                  {p.k}
                </span>
                <span className="font-mono text-[10.5px] text-right" style={{ color: faint }}>
                  {es ? p.es : p.en}
                </span>
              </div>
            ))}
          </div>
        </StoryProse>
      </StoryChapter>

      {/* 02 — Two tables, no cleverness */}
      <StoryChapter index="02" eyebrow={es ? "Dos tablas" : "Two tables"}>
        <StoryStage>
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: 400 }}>
            <SchemaDiagram {...palette} />
            <p className="text-[10.5px] leading-relaxed font-mono" style={{ color: faint }}>
              {es
                ? "«Este modelo no es ingenioso — y ése es justo el punto.»"
                : "“This model is not clever — and that is exactly the point.”"}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Quién eres y qué has hecho" : "Who you are and what you made"}>
            {es
              ? "El modelo de datos entero son dos tablas: users y qr_items, unidas por una clave ajena. No hay una tercera. Todo lo que hace el producto cabe en esa relación."
              : "The entire data model is two tables: users and qr_items, joined by one foreign key. There is no third. Everything the product does fits inside that relation."}
          </StoryBeat>
          <StoryBeat title={es ? "La tentación era la otra" : "The temptation ran the other way"}>
            {es
              ? "Un esquema de generador «genérico» pide a gritos polimorfismo: tipos de código, tipos de destino, tablas de atributos. Nada de eso existe aquí, y no porque no se pensara, sino porque no había ninguna necesidad que lo justificara todavía."
              : "A “generic” generator schema begs for polymorphism: code types, target types, attribute tables. None of that exists here — not because it was never considered, but because no requirement justified it yet."}
          </StoryBeat>
          <StoryBeat title={es ? "El coste de la sencillez es cero" : "Simplicity costs nothing here"}>
            {es
              ? "Un esquema de dos tablas se lee entero en un minuto, se migra sin ceremonia y no obliga a nadie a aprender una abstracción antes de arreglar un bug. Cuando aparezca el requisito que lo rompa, romperlo será barato precisamente porque no hay nada montado encima."
              : "A two-table schema is read end to end in a minute, migrates without ceremony, and forces nobody to learn an abstraction before fixing a bug. When the requirement that breaks it arrives, breaking it will be cheap precisely because nothing was built on top."}
          </StoryBeat>
          <StoryStat value="2" label={es ? "tablas, en total" : "tables, in total"} accent />
        </StoryProse>
      </StoryChapter>

      {/* 03 — The abstraction that kills the cloud dependency */}
      <StoryChapter index="03" eyebrow={es ? "El almacenamiento" : "Storage"}>
        <StoryStage>
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: 400 }}>
            <StorageDiagram {...palette} />
            <p className="text-[10.5px] leading-relaxed font-mono" style={{ color: faint }}>
              {es
                ? "src/app/storage.py — una ABC y dos implementaciones; la elección la hace una variable de entorno, no un import."
                : "src/app/storage.py — one ABC, two implementations; an environment variable makes the choice, not an import."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Tres métodos, ni uno más" : "Three methods, not one more"}>
            {es
              ? "StorageBackend es una clase abstracta con save_file, delete_file y get_file_path. Es toda la superficie que el resto de la aplicación conoce sobre dónde viven los archivos."
              : "StorageBackend is an abstract base class with save_file, delete_file and get_file_path. That is the entire surface the rest of the application knows about where files live."}
          </StoryBeat>
          <StoryBeat title={es ? "Dos implementaciones, una condición" : "Two implementations, one condition"}>
            {es
              ? "LocalFilesystemStorage y una implementación sobre Azure Blob. Cuál se usa lo decide una sola cosa: si AZURE_STORAGE_CONNECTION_STRING está definida o no."
              : "LocalFilesystemStorage and an Azure Blob implementation. Which one runs is decided by exactly one thing: whether AZURE_STORAGE_CONNECTION_STRING is set."}
          </StoryBeat>
          <StoryBeat title={es ? "La consecuencia es la que importa" : "The consequence is the point"}>
            {es
              ? "La aplicación entera arranca, funciona y pasa sus tests sin una sola credencial de cloud. No hay que pedir acceso a nadie para trabajar en ella, y CI no necesita secretos para correr la suite. Esa decisión es también la razón de que un módulo concreto tenga poca cobertura — se verá en el capítulo 07."
              : "The whole application boots, runs and passes its tests with zero cloud credentials. Nobody has to be granted access to work on it, and CI needs no secrets to run the suite. That same decision is why one particular module has thin coverage — chapter 07 comes back to it."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 04 — The pipeline */}
      <StoryChapter index="04" eyebrow={es ? "El pipeline" : "The pipeline"}>
        <StoryStage>
          <div className="w-full" style={{ maxWidth: 380 }}>
            <PipelineDiagram {...palette} />
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Dos workflows, cuatro jobs" : "Two workflows, four jobs"}>
            {es
              ? "ci.yaml corre en cada cambio y tiene dos jobs. El primero, test-and-lint: checkout, python, caché de pip, instalación, ruff, black --check y pytest con cobertura. El segundo, container-scan-smoke: construye la imagen con buildx, la escanea con Trivy, sube el informe, la arranca, le hace un smoke test y la apaga."
              : "ci.yaml runs on every change and has two jobs. The first, test-and-lint: checkout, python, pip cache, install, ruff, black --check and pytest with coverage. The second, container-scan-smoke: builds the image with buildx, scans it with Trivy, uploads the report, runs it, smoke-tests it and tears it down."}
          </StoryBeat>
          <StoryBeat title={es ? "El corte es la promesa" : "The gate is the promise"}>
            {es
              ? "El paso final del primer job es coverage report --fail-under=60. Ese número es lo único que el pipeline se compromete a mantener; lo que la suite consigue de hecho es otra cosa, y el capítulo 07 es exactamente sobre esa distinción."
              : "The last step of the first job is coverage report --fail-under=60. That number is the only thing the pipeline commits to holding; what the suite actually achieves is a different number, and chapter 07 is exactly about that distinction."}
          </StoryBeat>
          <StoryBeat title={es ? "Y después, desplegar" : "And then, shipping"}>
            {es
              ? "cd.yaml también son dos jobs. security-scan pasa Bandit sobre el código, Safety sobre las dependencias y Trivy sobre la imagen, y sube los resultados a GitHub Security. build-and-push construye el frontend, corre sus tests y los de pytest, valida que los secretos requeridos existan, entra en Azure y en el registro, publica la imagen, borra la instancia ACI anterior, despliega la nueva, corre las migraciones de Alembic desde la propia imagen construida, espera a que ACI esté lista y hace un smoke test."
              : "cd.yaml is two jobs as well. security-scan runs Bandit over the code, Safety over the dependencies and Trivy over the image, then uploads the results to GitHub Security. build-and-push builds the frontend, runs its tests and pytest, validates that the required secrets exist, logs into Azure and the registry, pushes the image, deletes the previous ACI instance, deploys the new one, runs the Alembic migrations from the built image itself, waits for ACI to come up and smoke-tests it."}
          </StoryBeat>
          <StoryBeat title={es ? "Migrar desde la imagen, no desde el runner" : "Migrating from the image, not the runner"}>
            {es
              ? "Las migraciones se ejecutan desde la imagen que se acaba de construir, no desde el entorno de CI. Es la diferencia entre migrar con las dependencias que se van a desplegar y migrar con las que casualmente tenía el runner."
              : "The migrations run from the image that was just built, not from the CI environment. That is the difference between migrating with the dependencies you are about to deploy and migrating with whatever the runner happened to have."}
          </StoryBeat>
          <StoryBeat title={es ? "Y entonces se construye un segundo contenedor" : "And then it builds a second container"}>
            {es
              ? "El último tramo del despliegue no toca la aplicación: construye otra imagen, la publica, la despliega en App Service y la prueba. Por qué existe es el capítulo siguiente."
              : "The last stretch of the deploy does not touch the application at all: it builds another image, pushes it, deploys it to App Service and tests it. Why it exists is the next chapter."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 05 — Why there are two containers */}
      <StoryChapter index="05" eyebrow={es ? "Dos contenedores" : "Two containers"}>
        <StoryStage>
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: 400 }}>
            <ProxyDiagram {...palette} />
            <p className="text-[10.5px] leading-relaxed font-mono" style={{ color: faint }}>
              {es
                ? "Por eso el entrypoint es uvicorn --proxy-headers: la app tiene que creerse los encabezados de quien va delante."
                : "This is why the entrypoint is uvicorn --proxy-headers: the app has to trust the headers of whatever sits in front of it."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "El detalle que no aparece en el diagrama de nadie" : "The detail nobody's architecture diagram has"}>
            {es
              ? "Azure Container Instances no termina TLS. Es una frase corta y una restricción entera: puedes desplegar ahí un contenedor perfectamente sano y seguir sin poder servirlo por HTTPS."
              : "Azure Container Instances does not terminate TLS. It is a short sentence and an entire constraint: you can deploy a perfectly healthy container there and still have no way to serve it over HTTPS."}
          </StoryBeat>
          <StoryBeat title={es ? "La solución fue un segundo contenedor" : "The fix was a second container"}>
            {es
              ? "Un proxy, empaquetado como su propia imagen, publicado en el mismo registro y desplegado en App Service delante de la instancia de ACI. App Service sí termina TLS; el tráfico interno sigue por HTTP plano dentro de Azure."
              : "A proxy, packaged as its own image, pushed to the same registry and deployed on App Service in front of the ACI instance. App Service does terminate TLS; the traffic behind it continues over plain HTTP inside Azure."}
          </StoryBeat>
          <StoryBeat title={es ? "Es la parte más honesta del proyecto" : "It is the most honest part of the project"}>
            {es
              ? "Nadie diseña esto: se descubre al intentar desplegar. Que el pipeline construya, publique, despliegue y pruebe ese segundo contenedor como un paso más significa que la restricción quedó automatizada en vez de anotada en un README que nadie lee."
              : "Nobody designs this; you find it while trying to deploy. That the pipeline builds, pushes, deploys and tests that second container as just another step means the constraint ended up automated instead of written down in a README nobody reads."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 06 — Three stages, one lean image */}
      <StoryChapter index="06" eyebrow={es ? "La imagen" : "The image"}>
        <StoryStage>
          <div className="w-full" style={{ maxWidth: 400 }}>
            <DockerDiagram {...palette} />
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Dos etapas existen para tirarse" : "Two stages exist to be thrown away"}>
            {es
              ? "La primera etapa es node:20-alpine y sólo construye el frontend. La segunda es python:3.11-slim y sólo construye wheels. Ninguna de las dos se despliega: existen para que sus toolchains se queden fuera de la imagen final."
              : "The first stage is node:20-alpine and only builds the frontend. The second is python:3.11-slim and only builds wheels. Neither one ships: they exist so their toolchains stay out of the final image."}
          </StoryBeat>
          <StoryBeat title={es ? "El runtime instala sin red" : "The runtime installs offline"}>
            {es
              ? "La tercera etapa instala desde las wheels ya construidas con --no-index. No resuelve dependencias, no consulta un índice: coge lo que la etapa anterior produjo. La construcción es más reproducible y la imagen final no arrastra un compilador."
              : "The third stage installs from the prebuilt wheels with --no-index. It resolves nothing and queries no index: it takes what the previous stage produced. The build is more reproducible and the shipped image carries no compiler."}
          </StoryBeat>
          <StoryBeat title={es ? "Y no corre como root" : "And it does not run as root"}>
            {es
              ? "Crea un usuario de sistema llamado app y se ejecuta con él. Expone el 8000, define un HEALTHCHECK que llama a /health con curl cada 30 segundos (5 s de timeout, 5 reintentos) y arranca uvicorn con --proxy-headers, que es lo que le permite estar detrás del proxy del capítulo anterior."
              : "It creates a system user called app and runs as it. It exposes 8000, defines a HEALTHCHECK that curls /health every 30 seconds (5 s timeout, 5 retries), and starts uvicorn with --proxy-headers — which is what lets it sit behind the previous chapter's proxy."}
          </StoryBeat>
          <StoryStat value="3" label={es ? "etapas, una sola se envía" : "stages, only one ships"} accent />
        </StoryProse>
      </StoryChapter>

      {/* 07 — The coverage number, with its asterisk */}
      <StoryChapter index="07" eyebrow={es ? "La cobertura" : "The coverage"}>
        <StoryStage>
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: 400 }}>
            <CoverageDiagram {...palette} />
            <p className="text-[10.5px] leading-relaxed font-mono" style={{ color: faint }}>
              {es
                ? "Rosa: por debajo del corte. Cian: por encima. Verde: 95 o más. La forma de la lista es el argumento."
                : "Rose: below the gate. Cyan: above it. Green: 95 or more. The shape of the list is the argument."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "El número, y lo que de verdad se exige" : "The number, and what is actually enforced"}>
            {es
              ? "La ejecución medida da 80%: 846 sentencias, 173 sin cubrir. Lo que CI exige es otra cosa — COVERAGE_GATE está en 60. Son dos afirmaciones distintas y conviene no confundirlas: 60 es la promesa que el pipeline hace cumplir, 80 es donde está hoy."
              : "The measured run comes out at 80%: 846 statements, 173 missed. What CI enforces is a different thing — COVERAGE_GATE is set to 60. Those are two separate claims and they should not be blurred: 60 is the promise the pipeline enforces, 80 is where it happens to sit today."}
          </StoryBeat>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <StoryStat value="80%" label={es ? "cobertura medida" : "measured coverage"} accent />
            <StoryStat value="60" label={es ? "el corte que exige CI" : "the gate CI enforces"} />
          </div>

          <StoryBeat title={es ? "Por qué las capas bajas están bajas" : "Why the low modules are low"}>
            {es
              ? "No es descuido: es la factura de la decisión del capítulo 03. El pegamento de cloud —el arranque de la app, el backend de Azure Blob— es justo lo que no se puede ejercitar sin una cuenta de Azure, y la abstracción existe precisamente para que los tests no la necesiten. Las 12 pruebas que se saltan son las de integración con Azure, tras credenciales."
              : "Not an oversight: it is the bill for the chapter-03 decision. The cloud glue — app startup, the Azure Blob backend — is exactly what cannot be exercised without an Azure account, and the abstraction exists so the tests never need one. The 12 skipped tests are the Azure integration ones, gated behind credentials."}
          </StoryBeat>

          <StoryBeat title={es ? "Una cobertura no es un número" : "Coverage is not one number"}>
            {es
              ? "Es una distribución, y ésta tiene una forma muy concreta. El dominio está clavado: models, schemas, los routers de auth y user y el servicio de auth, todos al 100. services/qr al 99. La lógica que decide qué hace el producto está cubierta hasta el borde."
              : "It is a distribution, and this one has a very specific shape. The domain is nailed: models, schemas, the auth and user routers and the auth service all at 100. services/qr at 99. The logic that decides what the product does is covered to the edge."}
          </StoryBeat>

          <StoryBeat title={es ? "Y la cola es toda del mismo tipo" : "And the tail is all one kind of thing"}>
            {es
              ? "routers/export 57, storage 51, main 42, server 0. Ninguno es lógica de negocio: son el arranque del proceso, la exportación de archivos y la capa de almacenamiento. Es decir, exactamente el código que sólo se ejecuta del todo contra una cuenta de cloud."
              : "routers/export 57, storage 51, main 42, server 0. None of them is business logic: they are process startup, file export and the storage layer. Which is to say, exactly the code that only fully executes against a cloud account."}
          </StoryBeat>

          <StoryBeat title={es ? "Es la factura del capítulo 03" : "This is chapter 03's bill"}>
            {es
              ? "La abstracción de almacenamiento hace que todo corra sin credenciales, y ése es su valor. El precio es que la rama de Azure no se recorre en CI: 12 de los 136 tests son de integración con Azure y se saltan sin credenciales. Los otros 124 pasan en unos 10 segundos. Subir esa cola exigiría credenciales en el pipeline, que es justo lo que la decisión evitaba."
              : "The storage abstraction is what lets everything run without credentials, and that is its value. The price is that the Azure branch is never walked in CI: 12 of the 136 tests are Azure integration tests and they skip without credentials. The other 124 pass in about 10 seconds. Lifting that tail would mean putting credentials in the pipeline — which is precisely what the decision avoided."}
          </StoryBeat>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <StoryStat value="136" label={es ? "funciones de test" : "test functions"} />
            <StoryStat value="124" label={es ? "pasan, en unos 10 s" : "pass, in about 10 s"} />
            <StoryStat value="12" label={es ? "se saltan (integración Azure)" : "skipped (Azure integration)"} />
          </div>

          <StoryBeat title={es ? "Por eso el corte está en 60 y no en 80" : "Which is why the gate sits at 60, not 80"}>
            {es
              ? "Poner el corte en el número que hoy se consigue convierte cualquier refactor honesto en un fallo de CI. Poner el corte por debajo declara un suelo que no se puede cruzar y deja sitio para moverse. La cifra alta es una observación; el corte es un contrato."
              : "Setting the gate at whatever the suite achieves today turns any honest refactor into a CI failure. Setting it below declares a floor that cannot be crossed and leaves room to move. The high figure is an observation; the gate is a contract."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 08 — What it deliberately does not do */}
      <StoryChapter index="08" eyebrow={es ? "Lo que no hace" : "What it doesn't do"}>
        <StoryStage>
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: 400 }}>
            <ScopeDiagram {...palette} />
            <p className="text-[10.5px] leading-relaxed font-mono" style={{ color: faint }}>
              {es
                ? "La columna de la derecha no son deudas ocultas: están escritas, en el repo, por su autor."
                : "The right-hand column is not hidden debt: it is written down, in the repo, by its author."}
            </p>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Lo que sí hace en seguridad" : "What it does do about security"}>
            {es
              ? "Contraseñas con bcrypt, JWT de vida corta, propiedad forzada a nivel de query — no comprobada después de leer — y respuestas de error deliberadamente vagas, para no confirmarle a nadie qué cuenta existe."
              : "bcrypt for passwords, short-lived JWTs, ownership enforced at query level rather than checked after the fact, and deliberately vague error responses, so nobody gets told which account exists."}
          </StoryBeat>
          <StoryBeat title={es ? "Y lo que dejó fuera, escrito" : "And what it left out, in writing"}>
            {es
              ? "OAuth, refresh tokens, control de acceso por roles, despliegues blue-green e infraestructura como código. Ninguna de las cinco es un descuido: están declaradas como aplazadas por el propio autor."
              : "OAuth, refresh tokens, role-based access control, blue-green deployments and infrastructure as code. None of the five is an oversight: they are declared as deferred by the author himself."}
          </StoryBeat>
          <StoryBeat title={es ? "Decir que no también se diseña" : "Saying no is also a design decision"}>
            {es
              ? "Cada una de esas cinco cosas habría sido una tarde de trabajo y una línea más en la lista de tecnologías. Ninguna habría hecho el producto mejor para su único usuario real. Un proyecto que sabe nombrar lo que no hizo es más fácil de creer que uno que dice haberlo hecho todo."
              : "Every one of those five would have been an afternoon of work and one more line on a stack list. Not one would have made the product better for its only real user. A project that can name what it did not do is easier to believe than one that claims it did everything."}
          </StoryBeat>
          <StoryBeat title={es ? "Y ahora mismo está apagado" : "And right now it is switched off"}>
            {es
              ? "El despliegue en Azure ya no responde: la URL no resuelve. Lo que queda es el repositorio — público, completo e inspeccionable, con sus workflows, su Dockerfile y sus 136 tests dentro. El artefacto de este proyecto nunca fue la URL; era eso."
              : "The Azure deployment no longer answers: the URL does not resolve. What remains is the repository — public, complete and inspectable, with its workflows, its Dockerfile and its 136 tests inside it. This project's artifact was never the URL; it was that."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>
    </div>
  );
}
