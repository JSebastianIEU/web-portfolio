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
  subtitle: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  role?: string;
  timeframe?: string;
  stack: string[];
  highlights: string[];
  architecture: string[];
  thumbnail?: string;
  links: ProjectLinkSet;
};

export const projectsData: Project[] = [
  {
    id: "qr-forge",
    slug: "qr-forge",
    title: "QR-Forge",
    subtitle: "Custom QR generator with SVG/PNG export and design controls.",
    description:
      "A design-forward QR builder that lets you control colors, backgrounds, error correction, and export formats without leaving the browser.",
    type: "personal",
    status: "prototype",
    role: "Full-stack",
    stack: ["Next.js", "TypeScript", "Tailwind", "Canvas/SVG"],
    highlights: [
      "Live preview with foreground/background color controls",
      "Export to SVG/PNG with preset sizing",
      "Shareable presets for brand consistency",
    ],
    architecture: [
      "Next.js app with client-side rendering for instant preview",
      "QR generation via lightweight SVG/Canvas pipeline",
      "Preset serialization for quick reuse",
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
    subtitle: "Institutional lost & found system with realtime chat and role-based access.",
    description:
      "A multi-role platform to register, match, and resolve lost items, with realtime updates and moderated conversations between users and staff.",
    type: "enterprise",
    status: "paused",
    role: "Lead engineer",
    stack: ["Next.js", "Node.js", "PostgreSQL", "WebSockets", "Redis"],
    highlights: [
      "Role-based flows for admins, moderators, and users",
      "Realtime chat and status updates on tickets",
      "Auto-matching between reports and found items",
    ],
    architecture: [
      "Next.js front-end with server components for data fetching",
      "Node.js API with WebSocket channel for live updates",
      "PostgreSQL for ticketing; Redis for pub/sub notifications",
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
    subtitle: "Translator for legal documents with structured output.",
    description:
      "Hackathon prototype for translating legal documents while preserving terminology, structure, and redaction requirements.",
    type: "hackathon",
    status: "prototype",
    role: "Full-stack / ML",
    stack: ["Python", "FastAPI", "Next.js", "OpenAI API"],
    highlights: [
      "Terminology consistency with glossary anchoring",
      "Structured outputs aligned to source sections",
      "Privacy-first handling of documents",
    ],
    architecture: [
      "FastAPI backend orchestrating translation pipelines",
      "Section-aware prompts to keep structure intact",
      "Next.js front-end for uploads, review, and exports",
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
    subtitle: "Predictive intelligence for social media content performance.",
    description:
      "Startup initiative to forecast content performance, guide scheduling, and surface actionable insights across channels.",
    type: "startup",
    status: "in-progress",
    role: "Product & Engineering",
    stack: ["Next.js", "TypeScript", "Supabase", "Python", "Airflow"],
    highlights: [
      "Ingestion pipelines for multi-channel metrics",
      "Model scoring for performance forecasting",
      "Dashboards for scheduling and creative guidance",
    ],
    architecture: [
      "Next.js front-end with typed contracts",
      "Supabase for auth and storage; Postgres analytics",
      "Airflow/Python pipelines for feature generation and scoring",
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
