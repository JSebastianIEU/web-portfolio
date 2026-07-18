/**
 * Track record shown in the Experience timeline.
 *
 * Every entry here is verifiable and matches LinkedIn — the portfolio links to
 * it, so titles must not drift. Accenture is labelled as what it was (a one-week
 * hackathon), not as employment. Ventures that didn't survive are deliberately
 * absent rather than listed as "present".
 */
export type ExperienceKind = "role" | "venture" | "hackathon";

export type ExperienceEntry = {
  id: string;
  role: string;
  roleES?: string;
  org: string;
  /** Human-readable period, e.g. "Feb 2026 — present". */
  period: string;
  periodES?: string;
  location: string;
  locationES?: string;
  kind: ExperienceKind;
  bullets: string[];
  bulletsES?: string[];
  /** Optional internal link to the project page that backs this entry. */
  href?: string;
};

export const experience: ExperienceEntry[] = [
  {
    id: "strategos",
    role: "AI Software Engineer",
    roleES: "AI Software Engineer",
    org: "Strategos AI",
    period: "Feb 2026 — present",
    periodES: "Feb 2026 — actualidad",
    location: "Madrid · Remote",
    locationES: "Madrid · Remoto",
    kind: "role",
    href: "/projects/craig-ai",
    bullets: [
      "Sole engineer on Craig, an AI ordering agent running in production for a Dublin print shop — architecture, implementation, testing and deployment.",
      "LLMs and multi-agent systems integrated into real business workflows, plus automations connecting enterprise tools over APIs.",
      "Working directly with the CEO on what ships and when.",
    ],
    bulletsES: [
      "Único ingeniero de Craig, un agente de IA en producción para una imprenta de Dublín — arquitectura, implementación, testing y despliegue.",
      "LLMs y sistemas multi-agente integrados en flujos de negocio reales, más automatizaciones que conectan herramientas vía API.",
      "Trabajo directo con el CEO sobre qué se lanza y cuándo.",
    ],
  },
  {
    id: "boletapp",
    role: "Technical founder",
    roleES: "Fundador técnico",
    org: "Boletapp",
    period: "2026 — ongoing",
    periodES: "2026 — en curso",
    location: "Colombia",
    locationES: "Colombia",
    kind: "venture",
    href: "/projects/boletapp",
    bullets: [
      "Anti-fraud ticketing platform live for nightlife and events: rotating HMAC QR codes, an offline-first door scanner and a live operations dashboard.",
      "Same crypto engine in TypeScript and Python, with shared test vectors enforcing bit-for-bit parity.",
    ],
    bulletsES: [
      "Plataforma de boletería antifraude en vivo para vida nocturna y eventos: QR rotativo con HMAC, scanner de puerta offline-first y panel de operación en tiempo real.",
      "El mismo motor criptográfico en TypeScript y Python, con test-vectors compartidos que garantizan paridad bit a bit.",
    ],
  },
  {
    id: "accenture",
    role: "GenAI Mavericks — hackathon (1 week)",
    roleES: "GenAI Mavericks — hackathon (1 semana)",
    org: "Accenture",
    period: "2025",
    periodES: "2025",
    location: "Madrid",
    locationES: "Madrid",
    kind: "hackathon",
    bullets: [
      "First edition of the programme: 100+ students from 20 universities and business schools.",
      "Built a RAG-based GenAI solution turning complex legal documents into language any citizen can read — part of the Justice 2030 Spain initiative.",
    ],
    bulletsES: [
      "Primera edición del programa: más de 100 estudiantes de 20 universidades y escuelas de negocio.",
      "Solución GenAI con RAG para convertir documentos legales complejos en lenguaje que cualquier ciudadano entiende — dentro de la iniciativa Justice 2030 España.",
    ],
  },
];
