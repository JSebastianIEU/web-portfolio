export type ProjectStatus = "live" | "prototype" | "in-progress" | "paused";

export type ProjectType = "personal" | "enterprise" | "hackathon" | "startup";

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
  timeframe?: string;
  stack: string[];
  highlights: string[];
  highlightsES?: string[];
  architecture: string[];
  architectureES?: string[];
  thumbnail?: string;
  links: ProjectLinkSet;
};
