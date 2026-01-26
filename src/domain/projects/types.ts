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
