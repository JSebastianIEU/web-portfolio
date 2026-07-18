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
      "Sole engineer on Craig, an AI ordering agent live for a Dublin print shop.",
      "LLMs and multi-agent systems in real business workflows. Direct report to the CEO.",
    ],
    bulletsES: [
      "Único ingeniero de Craig, un agente de IA en producción para una imprenta de Dublín.",
      "LLMs y sistemas multi-agente en flujos de negocio reales. Reporte directo al CEO.",
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
      "Live anti-fraud ticketing platform: rotating HMAC QR and an offline-first door scanner.",
      "One crypto engine in TypeScript and Python, kept bit-for-bit identical by shared tests.",
    ],
    bulletsES: [
      "Plataforma de boletería antifraude en vivo: QR rotativo con HMAC y scanner offline-first.",
      "Un solo motor criptográfico en TypeScript y Python, idéntico bit a bit vía tests compartidos.",
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
      "First edition: 100+ students from 20 universities.",
      "RAG solution turning legal documents into plain language (Justice 2030 Spain).",
    ],
    bulletsES: [
      "Primera edición: más de 100 estudiantes de 20 universidades.",
      "Solución RAG que convierte documentos legales en lenguaje claro (Justice 2030 España).",
    ],
  },
];
