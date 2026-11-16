/**
 * Track record shown in the Experience timeline.
 *
 * Every entry here is verifiable and matches LinkedIn — the portfolio links to
 * it, so titles must not drift. Accenture is labelled as what it was (a one-week
 * hackathon), not as employment. A venture that closed keeps its real end date
 * instead of reading as "present". Titles and dates mirror the CV, except that
 * the site leaves out the CV's "(Intern)" label on the Strategos title.
 */
export type ExperienceKind = "role" | "venture" | "hackathon";

export type ExperienceEntry = {
  id: string;
  role: string;
  roleES?: string;
  org: string;
  /** Human-readable period, e.g. "Jun 2026 - Nov 2026". */
  period: string;
  periodES?: string;
  location: string;
  locationES?: string;
  kind: ExperienceKind;
  bullets: string[];
  bulletsES?: string[];
  /** Optional internal link to the project page that backs this entry. */
  href?: string;
  /** Optional public repo that lets a reader verify the entry themselves. */
  repoHref?: string;
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
    role: "Automation & Integration Engineer",
    roleES: "Ingeniero de Automatización e Integración",
    org: "Strategos AI",
    period: "Jun 2026 - Nov 2026",
    periodES: "Jun 2026 - Nov 2026",
    location: "Madrid · Remote",
    locationES: "Madrid · Remoto",
    kind: "role",
    href: "/projects/craig-ai",
    logo: "/logos/strategos.webp",
    logoWhite: "/logos/strategos-white.webp",
    sticker: { height: 104, right: "6%", top: -25, tilt: "-6deg", drift: 44, tiltDelta: "2.5deg", scaleFrom: 0.93, scaleTo: 1.06 },
    bullets: [
      "Sole engineer on Craig: an AI ordering agent live for a Dublin print shop that quotes, charges and manages orders end-to-end.",
      "LLMs in real business workflows: I turn the client's non-technical requirements into shipped features, reporting to the managing director.",
    ],
    bulletsES: [
      "Único ingeniero de Craig: un agente de IA en producción para una imprenta de Dublín que cotiza, cobra y gestiona pedidos de punta a punta.",
      "LLMs en flujos de negocio reales: convierto los requisitos no técnicos del cliente en funcionalidades en producción, reportando al director general.",
    ],
  },
  {
    id: "boletapp",
    role: "Technical co-founder and sole engineer",
    roleES: "Cofundador técnico y único ingeniero",
    org: "Boletapp",
    period: "Jun 2026 - Nov 2026",
    periodES: "Jun 2026 - Nov 2026",
    location: "Colombia",
    locationES: "Colombia",
    kind: "venture",
    href: "/projects/boletapp",
    logo: "/logos/boletapp.svg",
    logoWhite: "/logos/boletapp-dark.svg",
    sticker: { height: 44, right: "15%", top: 5, tilt: "4.5deg", drift: 22, tiltDelta: "1.2deg", scaleFrom: 0.96, scaleTo: 1.03 },
    bullets: [
      "Anti-fraud ticketing platform with rotating HMAC QR and an offline-first door scanner. In production Jul to Nov 2026, wound down in November 2026.",
      "One crypto engine in TypeScript and Python, kept bit-for-bit identical by shared tests.",
    ],
    bulletsES: [
      "Plataforma de boletería antifraude con QR rotativo con HMAC y scanner offline-first. En producción de julio a noviembre de 2026, cerrada en noviembre de 2026.",
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
    repoHref: "https://github.com/rh45-one/GenAI-Mavericks-2025",
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
