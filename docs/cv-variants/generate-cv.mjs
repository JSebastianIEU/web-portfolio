import puppeteer from "puppeteer";
import fs from "fs";
const F = JSON.parse(fs.readFileSync(new URL("./fonts.json", import.meta.url), "utf8"));

/* Two variables the CV pivots on. `intern` swaps the Strategos title only. */
const CFG = { intern: process.env.INTERN === "1", lang: process.env.LANG_CV || "en" };
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

const strategosTitle = CFG.intern
  ? (T ? "AI Software Engineer Intern" : "AI Software Engineer Intern")
  : "AI Software Engineer";

const summary = T
  ? "Ingeniero de software que construye y opera productos de IA de punta a punta. Único ingeniero de un agente LLM en producción que cotiza y cobra a clientes reales, y fundador técnico de una plataforma de boletería antifraude. Trabajo con evaluación medible: métricas, splits temporales y tests, no solo demos."
  : "Software engineer who builds and operates AI products end-to-end. Sole engineer on a production LLM agent that quotes and charges real customers, and technical founder of an anti-fraud ticketing platform. I work with measurable evaluation \u2014 metrics, temporal splits and tests, not just demos.";

const experience = [
  {
    role: strategosTitle,
    org: "Strategos AI",
    loc: T ? "Madrid · Remoto" : "Madrid · Remote",
    date: T ? "Feb 2026 – Actualidad" : "Feb 2026 – Present",
    bullets: T
      ? [
          "Único ingeniero de Craig, un agente de IA en producción para una imprenta de Dublín que cotiza, cobra y gestiona pedidos de punta a punta.",
          "Diseño y opero flujos multi-agente con LLMs sobre procesos de negocio reales. Reporte directo al CEO; los fundadores no son técnicos.",
          "Responsable de todo el stack: diseño del agente, API, modelo de datos, despliegue y operación. En producción de forma continua desde febrero de 2026.",
        ]
      : [
          "Sole engineer on Craig, a production AI agent for a Dublin print shop that quotes, charges and manages customer orders end-to-end.",
          "Design and operate LLM multi-agent workflows against real business processes. Direct report to the CEO; the founders are non-technical.",
          "Own the whole stack: agent design, API, data model, deployment and operation. Continuously in production since February 2026.",
        ],
  },
  {
    role: T ? "Fundador técnico" : "Technical Founder",
    org: "Boletapp",
    loc: "Colombia",
    date: T ? "2026 – En curso" : "2026 – Present",
    bullets: T
      ? [
          "Plataforma de boletería antifraude (construida, en pruebas, sin lanzar): QR derivados por HMAC que rotan constantemente y scanner de puerta offline-first que valida sin conexión.",
          "Un mismo motor criptográfico implementado dos veces, en TypeScript y Python, mantenido idéntico bit a bit mediante test-vectors compartidos.",
          "El problema que ataca: una boleta reenviada por WhatsApp deja de servir, porque el código cambia solo y solo abre la puerta una vez.",
        ]
      : [
          "Anti-fraud ticketing platform (built, in testing, pre-launch): constantly rotating HMAC-derived QR codes and an offline-first door scanner that validates without connectivity.",
          "One cryptographic engine implemented twice, in TypeScript and Python, held bit-for-bit identical by shared test vectors.",
          "The problem it attacks: a ticket forwarded over WhatsApp stops working, because the code rotates on its own and opens the door exactly once.",
        ],
  },
  {
    role: T ? "GenAI Mavericks — hackathon (1 semana)" : "GenAI Mavericks — hackathon (1 week)",
    org: "Accenture",
    loc: "Madrid",
    date: "2025",
    bullets: T
      ? [
          "Primera edición, más de 100 estudiantes de 20 universidades: solución RAG que convierte documentos legales en lenguaje claro (iniciativa Justice 2030 España).",
        ]
      : [
          "First edition, 100+ students from 20 universities: a RAG solution turning legal documents into plain language (Justice 2030 Spain initiative).",
        ],
  },
];

const projects = [
  {
    link: "github.com/PredictiveSocialMedia/Tik-Tok-Recommendation-System",
    name: T ? "Plataforma de recomendación de TikTok" : "TikTok Recommendation Platform",
    meta: T ? "Equipo de 7 · Ene–Abr 2026 · Python, FastAPI, React" : "Team of 7 · Jan–Apr 2026 · Python, FastAPI, React",
    bullets: T
      ? [
          "98 de 282 commits, 22 pull requests abiertos y 9 PRs de compañeros revisados por mí.",
          "Responsable de la evaluación: métricas de ranking NDCG@k, splits temporales que respetan fronteras point-in-time y 25 tests de regresión que validan las métricas contra resultados analíticos conocidos.",
          "Construí el pipeline de análisis de vídeo (8 ramas en paralelo: Whisper, OCR, captioning, keywords); bajó de más de 5 minutos por vídeo a menos de 60 segundos.",
        ]
      : [
          "98 of 282 commits, 22 pull requests opened and 9 of my teammates' PRs reviewed.",
          "Owned evaluation: NDCG@k ranking metrics, temporal splits respecting point-in-time boundaries, and 25 regression tests validating the metrics against analytically known ground truth.",
          "Built the video analysis pipeline (8 parallel branches: Whisper, OCR, captioning, keywords); cut it from over 5 minutes per video to under 60 seconds.",
        ],
  },
  {
    link: "github.com/JSebastianIEU/tiktok-semantic-engagement",
    name: T ? "Engagement semántico en TikTok — publicado en Towards AI" : "Semantic Engagement on TikTok — published in Towards AI",
    meta: T ? "2026 · Python, transformers, FAISS" : "2026 · Python, transformers, FAISS",
    bullets: T
      ? [
          "¿Los captions con significado parecido rinden parecido? Sobre 22.647 posts, 12 tests de Mann-Whitney U muestran entre 10,5% y 13% menos varianza de engagement que las líneas base aleatorias.",
        ]
      : [
          "Do semantically similar captions perform similarly? Across 22,647 posts, 12 Mann-Whitney U tests show 10.5–13% lower engagement variance than random baselines.",
        ],
  },
  {
    link: "github.com/JSebastianIEU/ie-tower-visual-place-recognition",
    name: T ? "Reconocimiento visual de lugares — IE Tower" : "Visual Place Recognition — IE Tower",
    meta: T ? "2026 · Python, DINOv2, FAISS, PyTorch" : "2026 · Python, DINOv2, FAISS, PyTorch",
    bullets: T
      ? ["Dada la foto de cualquier punto interior del edificio, predice en qué planta está, usando embeddings de imagen y recuperación por vecinos cercanos sobre un índice FAISS."]
      : ["Given a photo of any indoor spot in the building, predicts which floor it is on, using image embeddings and nearest-neighbour retrieval over a FAISS index."],
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
      ["IA y ML", "LLMs y sistemas multi-agente, RAG, transformers y embeddings, FAISS, PyTorch, scikit-learn, visión por computador"],
      ["Backend y datos", "FastAPI, PostgreSQL, SQLModel, Alembic, pandas"],
      ["Infraestructura y frontend", "Docker, GitHub Actions, Azure, GCP, Prometheus, React, Next.js, Tailwind"],
    ]
  : [
      ["Languages", "Python, TypeScript, JavaScript, SQL, Java, C"],
      ["AI & ML", "LLMs and multi-agent systems, RAG, transformers and embeddings, FAISS, PyTorch, scikit-learn, computer vision"],
      ["Backend & data", "FastAPI, PostgreSQL, SQLModel, Alembic, pandas"],
      ["Infrastructure & frontend", "Docker, GitHub Actions, Azure, GCP, Prometheus, React, Next.js, Tailwind"],
    ];

const L = {
  summary: T ? "PERFIL" : "SUMMARY",
  exp: T ? "EXPERIENCIA" : "EXPERIENCE",
  proj: T ? "PROYECTOS SELECCIONADOS" : "SELECTED PROJECTS",
  edu: T ? "FORMACIÓN" : "EDUCATION",
  skills: T ? "COMPETENCIAS TÉCNICAS" : "TECHNICAL SKILLS",
  langs: T ? "IDIOMAS" : "LANGUAGES",
  degree: T ? "Grado en Ciencias de la Computación e Inteligencia Artificial" : "BSc in Computer Science and Artificial Intelligence",
  expected: T ? "Prevista: Jul 2027" : "Expected: Jul 2027",
  scholarship: T
    ? "Beca CUBICO Young Talented Leaders (excelencia académica y liderazgo). Machine Learning: 9,5/10."
    : "CUBICO Young Talented Leaders Scholarship (academic and leadership excellence). Machine Learning: 9.5/10.",
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
@page { size: A4; margin: 11mm 12mm; }
* { box-sizing: border-box; }
body { font-family: Carlito, Calibri, Arial, sans-serif; font-size: 10.2pt; line-height: 1.38; color: #000; margin: 0; }
h1 { font-size: 18pt; text-align: center; margin: 0 0 2pt; letter-spacing: .4pt; font-weight: 700; }
.contact { text-align: center; font-size: 8.8pt; margin-bottom: 1pt; white-space: nowrap; }
.contact a { color: #0645ad; text-decoration: none; }
h2 { font-size: 10.4pt; font-weight: 700; letter-spacing: .5pt; margin: 8pt 0 2pt; padding-bottom: 1.5pt; border-bottom: .8pt solid #000; }
.entry { margin-bottom: 5.5pt; }
.entry:last-child { margin-bottom: 0; }
.row { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
.role { font-weight: 700; }
.org { font-weight: 700; }
.meta { font-weight: 400; font-style: italic; color: #333; }
.loc, .date { font-weight: 700; white-space: nowrap; font-size: 9.8pt; }
.plink { font-size: 8.6pt; white-space: nowrap; }
.plink a { color: #0645ad; text-decoration: none; }
ul { margin: 1.5pt 0 0; padding-left: 12pt; }
li { margin-bottom: 1.4pt; }
p.sum { margin: 2pt 0 0; text-align: justify; }
.sk { margin: 1.5pt 0 0; }
.sk b { font-weight: 700; }
</style></head><body>
<h1>${D.name}</h1>
<div class="contact">${D.city} &nbsp;·&nbsp; ${D.phone} &nbsp;·&nbsp; <a href="mailto:${D.email}">${D.email}</a> &nbsp;·&nbsp; <a href="https://${D.site}">${D.site}</a> &nbsp;·&nbsp; <a href="https://${D.li}">${D.li}</a> &nbsp;·&nbsp; <a href="https://${D.gh}">${D.gh}</a></div>

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
  <ul><li>${esc(L.scholarship)}</li></ul>
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
await p.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
const pages = await p.evaluate(() => Math.ceil(document.body.scrollHeight / (297 * 3.7795 - 2 * 11 * 3.7795)));
await b.close();
console.log(out.split("/").pop(), "· alto aprox:", pages, "pagina(s)");
