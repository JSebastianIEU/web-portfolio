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
  /** Full-colour mark, used on light. */
  logo?: string;
  /** Pure-white silhouette of the same mark, used on dark. */
  logoWhite?: string;
  /**
   * How the floating sticker sits next to the entry: rendered height in px,
   * how far in from the right edge (%) and its tilt. Hand-picked per logo so
   * the cluster reads scattered but each mark still belongs to its own entry.
   */
  sticker?: {
    height: number;
    right: string;
    top: number;
    tilt: string;
    /** Vertical travel of the scroll drift, px. Varied per mark so the three don't move in lockstep. */
    drift: number;
    /** Rotation swung either side of `tilt` across the scrub. Smaller on wider marks: corner displacement scales with width. */
    tiltDelta: string;
    /** Scale at the start and end of the scrub; it passes through 1 at the midpoint. */
    scaleFrom: number;
    scaleTo: number;
  };
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
    logo: "/logos/strategos.webp",
    logoWhite: "/logos/strategos-white.webp",
    sticker: { height: 104, right: "6%", top: -25, tilt: "-6deg", drift: 44, tiltDelta: "2.5deg", scaleFrom: 0.93, scaleTo: 1.06 },
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
    logo: "/logos/boletapp.svg",
    logoWhite: "/logos/boletapp-dark.svg",
    sticker: { height: 44, right: "15%", top: 5, tilt: "4.5deg", drift: 22, tiltDelta: "1.2deg", scaleFrom: 0.96, scaleTo: 1.03 },
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
    logo: "/logos/accenture.webp",
    logoWhite: "/logos/accenture-white.webp",
    sticker: { height: 94, right: "9%", top: -16, tilt: "-3deg", drift: 34, tiltDelta: "1.8deg", scaleFrom: 0.94, scaleTo: 1.05 },
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
