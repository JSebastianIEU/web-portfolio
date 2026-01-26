export type ProjectStatus = "live" | "prototype" | "in-progress" | "paused";
export type ProjectType = "personal" | "enterprise" | "hackathon" | "startup";

export type ProjectLinkSet = {
  github?: string;
  caseStudy?: string;
  video?: string;
  live?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  titleES?: string;
  subtitle: string;
  subtitleES?: string;
  description: string;
  descriptionES?: string;
  type: ProjectType;
  status: ProjectStatus;
  role?: string;
  timeframe?: string;
  stack: string[];
  highlights: string[];
  highlightsES?: string[];
  architecture: string[];
  architectureES?: string[];
  thumbnail?: string;
  links: ProjectLinkSet;
};

export const projectsData: Project[] = [
  {
    id: "qr-forge",
    slug: "qr-forge",
    title: "QR-Forge",
    titleES: "QR-Forge",
    subtitle: "Custom QR generator with SVG/PNG export and design controls.",
    subtitleES: "Generador de códigos QR con exportación SVG/PNG y controles de diseño.",
    description:
      "A design-forward QR builder that lets you control colors, backgrounds, error correction, and export formats without leaving the browser.",
    descriptionES:
      "Un generador de QR orientado al diseño que permite controlar colores, fondos, corrección de errores y exportar en varios formatos sin salir del navegador.",
    type: "personal",
    status: "prototype",
    role: "Full-stack",
    stack: ["Next.js", "TypeScript", "Tailwind", "Canvas/SVG"],
    highlights: [
      "Live preview with foreground/background color controls",
      "Export to SVG/PNG with preset sizing",
      "Shareable presets for brand consistency",
    ],
    highlightsES: [
      "Vista previa en vivo con control de colores de fondo y primer plano",
      "Exportación a SVG/PNG con tamaños predefinidos",
      "Presets compartibles para mantener consistencia de marca",
    ],
    architecture: [
      "Next.js app with client-side rendering for instant preview",
      "QR generation via lightweight SVG/Canvas pipeline",
      "Preset serialization for quick reuse",
    ],
    architectureES: [
      "Aplicación Next.js con renderizado en cliente para vista instantánea",
      "Generación de QR mediante una pipeline ligera de SVG/Canvas",
      "Serialización de presets para reutilización rápida",
    ],
    thumbnail: "/images/placeholders/qr-forge.jpg",
    links: {
      github: "",
      caseStudy: "",
      video: "",
      live: "",
    },
  },
  {
    id: "lost-and-found",
    slug: "lost-and-found",
    title: "Lost & Found Platform",
    titleES: "Plataforma de objetos perdidos",
    subtitle: "Institutional lost & found system with realtime chat and role-based access.",
    subtitleES: "Sistema institucional de objetos perdidos con chat en tiempo real y roles de acceso.",
    description:
      "A multi-role platform to register, match, and resolve lost items, with realtime updates and moderated conversations between users and staff.",
    descriptionES:
      "Plataforma multi-rol para registrar, asociar y resolver objetos perdidos, con actualizaciones en tiempo real y conversaciones moderadas entre usuarios y personal.",
    type: "enterprise",
    status: "paused",
    role: "Lead engineer",
    stack: ["Next.js", "Node.js", "PostgreSQL", "WebSockets", "Redis"],
    highlights: [
      "Role-based flows for admins, moderators, and users",
      "Realtime chat and status updates on tickets",
      "Auto-matching between reports and found items",
    ],
    highlightsES: [
      "Flujos basados en roles para administradores, moderadores y usuarios",
      "Chat en tiempo real y actualizaciones de estado en los tickets",
      "Auto-asociación entre reportes y objetos encontrados",
    ],
    architecture: [
      "Next.js front-end with server components for data fetching",
      "Node.js API with WebSocket channel for live updates",
      "PostgreSQL for ticketing; Redis for pub/sub notifications",
    ],
    architectureES: [
      "Frontend Next.js con server components para obtención de datos",
      "API en Node.js con canal WebSocket para actualizaciones en vivo",
      "PostgreSQL para tickets; Redis para pub/sub de notificaciones",
    ],
    thumbnail: "/images/placeholders/lost-found.jpg",
    links: {
      github: "",
      caseStudy: "",
      video: "",
      live: "",
    },
  },
  {
    id: "legal-doc-translator",
    slug: "legal-doc-translator",
    title: "Legal Document Translator",
    titleES: "Traductor de documentos legales",
    subtitle: "Translator for legal documents with structured output.",
    subtitleES: "Traductor de documentos legales con salida estructurada.",
    description:
      "Hackathon prototype for translating legal documents while preserving terminology, structure, and redaction requirements.",
    descriptionES:
      "Prototipo de hackathon para traducir documentos legales preservando terminología, estructura y requisitos de redacción.",
    type: "hackathon",
    status: "prototype",
    role: "Full-stack / ML",
    stack: ["Python", "FastAPI", "Next.js", "OpenAI API"],
    highlights: [
      "Terminology consistency with glossary anchoring",
      "Structured outputs aligned to source sections",
      "Privacy-first handling of documents",
    ],
    highlightsES: [
      "Consistencia terminológica con glosarios",
      "Salidas estructuradas alineadas a las secciones originales",
      "Manejo de documentos con enfoque de privacidad",
    ],
    architecture: [
      "FastAPI backend orchestrating translation pipelines",
      "Section-aware prompts to keep structure intact",
      "Next.js front-end for uploads, review, and exports",
    ],
    architectureES: [
      "Backend FastAPI orquestando pipelines de traducción",
      "Prompts conscientes de secciones para conservar la estructura",
      "Frontend Next.js para cargas, revisión y exportaciones",
    ],
    thumbnail: "/images/placeholders/legal-translator.jpg",
    links: {
      github: "",
      caseStudy: "",
      video: "",
      live: "",
    },
  },
  {
    id: "predictive-content-intel",
    slug: "predictive-content-intel",
    title: "Predictive Content Intelligence",
    titleES: "Inteligencia predictiva para contenido",
    subtitle: "Predictive intelligence for social media content performance.",
    subtitleES: "Inteligencia predictiva para el rendimiento de contenido en redes.",
    description:
      "Startup initiative to forecast content performance, guide scheduling, and surface actionable insights across channels.",
    descriptionES:
      "Iniciativa startup para predecir el rendimiento de contenido, guiar la programación y mostrar insights accionables en múltiples canales.",
    type: "startup",
    status: "in-progress",
    role: "Product & Engineering",
    stack: ["Next.js", "TypeScript", "Supabase", "Python", "Airflow"],
    highlights: [
      "Ingestion pipelines for multi-channel metrics",
      "Model scoring for performance forecasting",
      "Dashboards for scheduling and creative guidance",
    ],
    highlightsES: [
      "Pipelines de ingesta para métricas multicanal",
      "Modelos de scoring para predicción de rendimiento",
      "Dashboards para calendarización y guía creativa",
    ],
    architecture: [
      "Next.js front-end with typed contracts",
      "Supabase for auth and storage; Postgres analytics",
      "Airflow/Python pipelines for feature generation and scoring",
    ],
    architectureES: [
      "Frontend Next.js con contratos tipados",
      "Supabase para auth y storage; Postgres para analítica",
      "Pipelines Airflow/Python para features y scoring",
    ],
    thumbnail: "/images/placeholders/predictive-intel.jpg",
    links: {
      github: "",
      caseStudy: "",
      video: "",
      live: "",
    },
  },
];
