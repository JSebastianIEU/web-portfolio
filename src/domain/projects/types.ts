export type ProjectStatus = "live" | "live-demo" | "prototype" | "in-progress" | "paused" | "published";

export type ProjectType = "personal" | "enterprise" | "hackathon" | "startup" | "team";

/**
 * professional: real-world/client or venture work, usually testable live but with private code.
 * open-source: public builds with GitHub repos and/or Medium articles.
 */
export type ProjectCategory = "professional" | "open-source";

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
  category: ProjectCategory;
  /** Company/context line, e.g. "Strategos AI" or "Fundador — Colombia". */
  org?: string;
  orgES?: string;
  /** Client/venture work whose source can't be shared. */
  codePrivate?: boolean;
  /** Brand wordmark/logo (SVG path under /public) shown on featured cards. */
  logo?: string;
  /** Light-on-dark variant of `logo`, used when the dark theme is active. */
  logoDark?: string;
  /** Screenshot of the page `links.live` points at, shown on featured cards. */
  preview?: string;
  type: ProjectType;
  status: ProjectStatus;
  role?: string;
  roleES?: string;
  /** Client/venture work the visitor built and shipped solo, end-to-end. */
  ownedEndToEnd?: boolean;
  timeframe?: string;
  stack: string[];
  highlights: string[];
  highlightsES?: string[];
  architecture: string[];
  architectureES?: string[];
  thumbnail?: string;
  /** Real screenshots for the detail page's media section. When absent, the
   *  section is hidden (no empty placeholders). */
  media?: { src: string; altEN: string; altES: string }[];
  /** Published write-ups about the project, listed on the detail page. */
  articles?: { title: string; titleES?: string; outlet: string; url: string }[];
  links: ProjectLinkSet;
};
