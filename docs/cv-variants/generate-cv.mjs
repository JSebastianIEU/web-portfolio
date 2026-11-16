import puppeteer from "puppeteer";
import fs from "fs";
const F = JSON.parse(fs.readFileSync(new URL("./fonts.json", import.meta.url), "utf8"));

const CFG = { lang: process.env.LANG_CV || "en" };
const T = CFG.lang === "es";

const D = {
  name: "JUAN SEBASTIAN PEÑA DONNEYS",
  city: T ? "Madrid, España" : "Madrid, Spain",
  phone: "(+34) 697 643 097",
  email: "juansebastianpenadonneys@gmail.com",
  site: "juansebastianpena.dev",
  li: "linkedin.com/in/juan-sebastian-pena-donneys",
  gh: "github.com/JSebastianIEU",
};

const summary = T
  ? "Ingeniero de software que construye y despliega agentes de IA de punta a punta, del modelo al cliente. Único ingeniero de un agente LLM en producción que cotiza y cobra a clientes reales, creador de un agente de voz que negocia tarifas de transporte y cofundador técnico que llevó a producción una plataforma de boletería con web, dos apps publicadas y pagos reales. Mantengo a los LLMs dentro de límites escritos en código y lo demuestro con medición: tests, evaluaciones adversariales y latencia en sesiones de voz en vivo."
  : "Software engineer who builds and ships AI agents end-to-end, from the model to the customer. Sole engineer on a production LLM agent that quotes and charges real customers, builder of a voice agent that negotiates freight rates, and technical co-founder who took a ticketing platform to production with a web app, two published mobile apps and real payments. I keep LLMs inside guardrails written in code and prove it with measurement: tests, adversarial evaluations and latency in live voice sessions.";

const experience = [
  {
    role: T ? "Ingeniero de Automatización e Integración (prácticas)" : "Automation & Integration Engineer (Intern)",
    org: "Strategos AI",
    loc: T ? "Madrid · Remoto" : "Madrid · Remote",
    date: "Jun 2026 - Nov 2026",
    bullets: T
      ? [
          "Único ingeniero de Craig, un agente de IA en producción para una imprenta de Dublín que cotiza, cobra y gestiona pedidos de clientes por chat web, con pagos en Stripe.",
          "En producción: ~230 conversaciones con clientes y ~160 cotizaciones por ~56.000 €; 12 pedidos pagados, 9 de ellos (75%) aprobados y procesados sin intervención humana.",
          "El LLM nunca calcula un precio: un agente con llamadas a herramientas (12 herramientas) sobre un motor de precios determinista, con 5 validaciones en el servidor que rechazan cualquier precio que no haya producido una herramienta. Una regla de consistencia de precios redujo los precios incorrectos de 38.743 de 136.392 a 0.",
          "Responsable de todo el stack (FastAPI, PostgreSQL, Cloud Run, Cloud SQL); convierto los requisitos no técnicos del cliente en funcionalidades en producción, reportando al director general.",
        ]
      : [
          "Sole engineer on Craig, a production AI agent for a Dublin print shop that quotes, charges and manages customer orders over web chat, with Stripe payments.",
          "In production: ~230 customer conversations and ~160 quotes worth ~€56k; 12 paid orders, 9 of them (75%) approved and processed with no human intervention.",
          "The LLM never calculates a price: a tool-calling agent (12 tools) over a deterministic pricing engine, with 5 server-side gates that reject any price no tool produced. A pricing-consistency rule cut incorrect prices from 38,743 of 136,392 to 0.",
          "Own the whole stack (FastAPI, PostgreSQL, Cloud Run, Cloud SQL) and turn the client's non-technical requirements into shipped features, reporting to the managing director.",
        ],
  },
  {
    role: T ? "Cofundador técnico y único ingeniero" : "Technical Co-founder and Sole Engineer",
    org: "Boletapp",
    loc: T ? "Colombia · Remoto" : "Colombia · Remote",
    date: "Jun 2026 - Nov 2026",
    bullets: T
      ? [
          "Construí solo una plataforma de boletería para vida nocturna y conciertos: web en Next.js, FastAPI sobre PostgreSQL con aislamiento por organización (RLS), pagos reales, Cloud Run y Vercel.",
          "Piloto con organizadores reales en el Valle del Cauca, incluido un festival de 4 fechas y un primer cliente que pagó; el escáner de puerta funcionó en eventos en vivo con puertas sincronizadas y control de aforo en tiempo real.",
          "Dos apps de tienda desde una sola base de código en Expo/React Native (App Store y Google Play), códigos QR rotativos con HMAC que hacen inútiles los pantallazos y validación sin conexión en la puerta.",
          "Asistente de IA para organizadores que responde con sus propios datos y nunca aplica cambios sin confirmación; más de 1.700 tests. Cerrada en noviembre de 2026.",
        ]
      : [
          "Built alone a ticketing platform for nightlife and concerts: Next.js web, FastAPI on PostgreSQL with per-organization isolation (RLS), real payments, Cloud Run and Vercel.",
          "Piloted with real organizers in Valle del Cauca, including a 4-date festival and a first paying client; the door scanner ran at live events with synced gates and real-time capacity control.",
          "Two store apps from one Expo/React Native codebase (App Store and Google Play), rotating HMAC QR codes that make screenshots useless, and offline validation at the door.",
          "AI assistant for organizers that answers from their own data and never applies changes without confirmation; 1,700+ tests. Wound down in November 2026.",
        ],
  },
  {
    role: T ? "GenAI Mavericks - hackathon (1 semana)" : "GenAI Mavericks - hackathon (1 week)",
    org: "Accenture",
    loc: "Madrid",
    date: "2025",
    bullets: T
      ? [
          "Primera edición, más de 100 estudiantes de 20 universidades: solución RAG que convierte documentos legales en lenguaje claro (iniciativa Justice 2030 España). Recibí una oferta de trabajo después.",
        ]
      : [
          "First edition, 100+ students from 20 universities: a RAG solution turning legal documents into plain language (Justice 2030 Spain initiative). Received a job offer afterwards.",
        ],
  },
];

const projects = [
  {
    link: "github.com/JSebastianIEU/voice-freight-negotiator",
    name: T ? "Alex: agente de voz que negocia fletes, dos artículos en Towards AI" : "Alex: voice AI freight negotiator, two articles in Towards AI",
    meta: "2026 · Python, LiveKit, GPT-4.1 mini, Next.js, GCP · talk-to-alex.web.app",
    bullets: T
      ? [
          "Agente de voz en tiempo real que verifica a quien llama y negocia tarifas de transporte en inglés y español; demo de voz en vivo en el navegador, guiada.",
          "Límites de precio aplicados en código, no en el prompt: en 10 ataques adversariales x 3 rondas, el margen regalado bajó de $197 a $72 de $500 y las filtraciones del límite de 4/30 a 0/30.",
          "1,39 s de respuesta mediana en sesiones de voz en vivo; espera de turno reducida de 3 s a 1,2 s y LLM elegido por tiempo medido hasta el primer token (705 ms frente a 2.153 ms).",
          "183 tests con 91% de cobertura, CI en cada PR y despliegue automático en Cloud Run con Workload Identity Federation.",
        ]
      : [
          "Real-time voice agent that verifies the caller and negotiates freight rates in English and Spanish; a guided live voice demo in the browser.",
          "Price limits enforced in code, not in the prompt: across 10 adversarial attacks x 3 rounds, margin given away fell from $197 to $72 of $500 and limit leaks from 4/30 to 0/30.",
          "1.39 s median response in live voice sessions; turn waiting cut from 3 s to 1.2 s and the LLM chosen by measured time to first token (705 ms vs 2,153 ms).",
          "183 tests at 91% coverage, CI on every PR, automatic deploys to Cloud Run with Workload Identity Federation.",
        ],
  },
  {
    link: "github.com/PredictiveSocialMedia/Tik-Tok-Recommendation-System",
    name: T ? "Plataforma de recomendación de TikTok" : "TikTok Recommendation Platform",
    meta: T ? "Equipo de 7 · Ene-Abr 2026 · Python, FastAPI, React" : "Team of 7 · Jan-Apr 2026 · Python, FastAPI, React",
    bullets: T
      ? [
          "Construí el pipeline de análisis de vídeo (8 ramas en paralelo: Whisper, OCR, captioning, keywords): de más de 5 minutos por vídeo a menos de 60 segundos.",
          "Responsable de la evaluación: métricas NDCG@k, splits temporales con fronteras point-in-time y 25 tests que validan las métricas contra resultados analíticos conocidos.",
        ]
      : [
          "Built the video analysis pipeline (8 parallel branches: Whisper, OCR, captioning, keywords); cut it from over 5 minutes per video to under 60 seconds.",
          "Owned evaluation: NDCG@k ranking metrics, temporal splits respecting point-in-time boundaries, and 25 regression tests validating the metrics against analytically known ground truth.",
        ],
  },
  {
    link: "github.com/JSebastianIEU/tiktok-semantic-engagement",
    name: T ? "Engagement semántico en TikTok - publicado en Towards AI" : "Semantic Engagement on TikTok - published in Towards AI",
    meta: T ? "2026 · Python, transformers, FAISS" : "2026 · Python, transformers, FAISS",
    bullets: T
      ? [
          "¿Los captions con significado parecido rinden parecido? Sobre 22.647 posts, 12 tests de Mann-Whitney U muestran entre 10,5% y 13% menos varianza de engagement que las líneas base aleatorias.",
        ]
      : [
          "Do semantically similar captions perform similarly? Across 22,647 posts, 12 Mann-Whitney U tests show 10.5-13% lower engagement variance than random baselines.",
        ],
  },
  {
    link: "github.com/JSebastianIEU/qr_forge",
    name: "QR Forge",
    meta: T ? "Open source · 2026 · FastAPI, React, Docker, Azure" : "Open source · 2026 · FastAPI, React, Docker, Azure",
    bullets: T
      ? [
          "136 tests con 80% de cobertura tras un gate de CI; imagen Docker de tres etapas sin root; CI/CD a Azure con escaneo Trivy, Bandit y Safety.",
        ]
      : [
          "136 tests at 80% line coverage behind a CI gate; three-stage non-root Docker image; CI/CD to Azure with Trivy, Bandit and Safety scanning.",
        ],
  },
];

const skills = T
  ? [
      ["Lenguajes", "Python, TypeScript, JavaScript, SQL, Java, C"],
      ["IA y voz", "agentes LLM y llamadas a herramientas, guardrails y evaluación, RAG, embeddings, LiveKit, WebRTC, voz a texto y texto a voz (Deepgram, Cartesia), PyTorch, scikit-learn"],
      ["Backend y datos", "FastAPI, Node.js, PostgreSQL, SQLModel, Alembic, pandas, APIs REST y webhooks"],
      ["Frontend y móvil", "React, Next.js, React Native (Expo), Tailwind"],
      ["Cloud y DevOps", "GCP (Cloud Run, Cloud SQL, Firebase), Vercel, Azure, Docker, GitHub Actions, Prometheus, pytest, Vitest"],
    ]
  : [
      ["Languages", "Python, TypeScript, JavaScript, SQL, Java, C"],
      ["AI and voice", "LLM agents and tool calling, guardrails and evaluation, RAG, embeddings, LiveKit, WebRTC, speech to text and text to speech (Deepgram, Cartesia), PyTorch, scikit-learn"],
      ["Backend and data", "FastAPI, Node.js, PostgreSQL, SQLModel, Alembic, pandas, REST APIs and webhooks"],
      ["Frontend and mobile", "React, Next.js, React Native (Expo), Tailwind"],
      ["Cloud and DevOps", "GCP (Cloud Run, Cloud SQL, Firebase), Vercel, Azure, Docker, GitHub Actions, Prometheus, pytest, Vitest"],
    ];

const L = {
  summary: T ? "PERFIL" : "SUMMARY",
  exp: T ? "EXPERIENCIA" : "EXPERIENCE",
  proj: T ? "PROYECTOS SELECCIONADOS" : "SELECTED PROJECTS",
  edu: T ? "FORMACIÓN" : "EDUCATION",
  skills: T ? "COMPETENCIAS TÉCNICAS" : "TECHNICAL SKILLS",
  langs: T ? "IDIOMAS" : "LANGUAGES",
  degree: T ? "Grado en Ciencias de la Computación e Inteligencia Artificial" : "BSc in Computer Science and Artificial Intelligence",
  expected: T ? "Prevista: May 2027" : "Expected: May 2027",
  eduBullets: T
    ? [
        "Beca CUBICO Young Talented Leaders. Machine Learning: 9,5/10.",
        "Seleccionado para el Ripple–IE Blockchain, XRPL and Policy Gateway (desde ene 2027).",
      ]
    : [
        "CUBICO Young Talented Leaders Scholarship. Machine Learning: 9.5/10.",
        "Selected for the Ripple–IE Blockchain, XRPL and Policy Gateway (from Jan 2027).",
      ],
  school: T ? "Bachillerato Bilingüe Colombiano" : "Colombian Bilingual High School Diploma",
  schoolDate: T ? "Jun 2023" : "Jun 2023",
  langLine: T ? "<b>Español</b> (nativo) · <b>Inglés</b> (bilingüe, uso profesional diario)" : "<b>Spanish</b> (native) · <b>English</b> (bilingual, daily professional use)",
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const entry = (e) => `
  <div class="entry">
    <div class="row"><span class="role">${esc(e.role)}</span><span class="loc">${esc(e.loc)}</span></div>
    <div class="row"><span class="org">${esc(e.org)}</span><span class="date">${esc(e.date)}</span></div>
    <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
  </div>`;

const proj = (p) => `
  <div class="entry">
    <div class="row"><span class="role">${esc(p.name)}</span></div>
    <div class="row"><span class="org meta">${esc(p.meta)}</span><span class="plink"><a href="https://${p.link}">${esc(p.link)}</a></span></div>
    <ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
  </div>`;

const html = `<!doctype html><html lang="${CFG.lang}"><head><meta charset="utf-8"><style>
@font-face{font-family:Carlito;font-weight:400;font-style:normal;src:url(data:font/woff2;base64,${F.r}) format("woff2");}
@font-face{font-family:Carlito;font-weight:700;font-style:normal;src:url(data:font/woff2;base64,${F.b}) format("woff2");}
@font-face{font-family:Carlito;font-weight:400;font-style:italic;src:url(data:font/woff2;base64,${F.i}) format("woff2");}
@page { size: A4; margin: 10mm 12mm; }
* { box-sizing: border-box; }
body { font-family: Carlito, Calibri, Arial, sans-serif; font-size: 9.4pt; line-height: 1.14; color: #000; margin: 0; }
h1 { font-size: 16pt; text-align: center; margin: 0 0 1pt; letter-spacing: .4pt; font-weight: 700; }
.contact { text-align: center; font-size: 8.6pt; margin-bottom: 1pt; white-space: nowrap; }
.contact.city { font-size: 9.2pt; margin-bottom: 1.5pt; }
.contact a { color: #0645ad; text-decoration: none; }
h2 { font-size: 10pt; font-weight: 700; letter-spacing: .5pt; margin: 3.8pt 0 1.2pt; padding-bottom: 1.2pt; border-bottom: .8pt solid #000; }
.entry { margin-bottom: 2.4pt; }
.entry:last-child { margin-bottom: 0; }
.row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
.role { font-weight: 700; }
.org { font-weight: 700; }
.meta { font-weight: 400; font-style: italic; color: #333; }
.loc, .date { font-weight: 700; white-space: nowrap; font-size: 9pt; }
.plink { font-size: 8.2pt; white-space: nowrap; }
.plink a { color: #0645ad; text-decoration: none; }
ul { margin: 1.2pt 0 0; padding-left: 12pt; }
li { margin-bottom: 0.4pt; }
p.sum { margin: 1.5pt 0 0; text-align: justify; }
.sk { margin: 1pt 0 0; }
.sk b { font-weight: 700; }
</style></head><body>
<h1>${D.name}</h1>
<div class="contact city">${D.city}</div>
<div class="contact">${D.phone} &nbsp;·&nbsp; <a href="mailto:${D.email}">${D.email}</a> &nbsp;·&nbsp; <a href="https://${D.site}">${D.site}</a> &nbsp;·&nbsp; <a href="https://${D.li}">${D.li}</a> &nbsp;·&nbsp; <a href="https://${D.gh}">${D.gh}</a></div>

<h2>${L.summary}</h2>
<p class="sum">${esc(summary)}</p>

<h2>${L.exp}</h2>
${experience.map(entry).join("")}

<h2>${L.proj}</h2>
${projects.map(proj).join("")}

<h2>${L.edu}</h2>
<div class="entry">
  <div class="row"><span class="role">IE University</span><span class="loc">Madrid, ${T ? "España" : "Spain"}</span></div>
  <div class="row"><span class="org">${L.degree}</span><span class="date">${L.expected}</span></div>
  <ul>${L.eduBullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
</div>

<h2>${L.skills}</h2>
${skills.map(([k, v]) => `<div class="sk"><b>${k}:</b> ${esc(v)}</div>`).join("")}

<h2>${L.langs}</h2>
<div class="sk">${L.langLine}</div>
</body></html>`;

const out = process.env.OUT;
const b = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_BIN, args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setContent(html, { waitUntil: "load" });
const pdf = await p.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
await b.close();
// Cuenta las paginas reales del PDF; medir el DOM en pantalla no coincide con la impresion.
const pages = (Buffer.from(pdf).toString("latin1").match(/\/Type\s*\/Page\b(?!s)/g) || []).length;
console.log(out.split("/").pop(), "·", pages, "pagina(s)");
if (pages !== 1) process.exitCode = 1;
