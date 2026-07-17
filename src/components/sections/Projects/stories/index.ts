import type { ComponentType } from "react";
import type { Locale } from "@/domain/i18n";
import IeTowerSimulator from "./IeTowerSimulator";
import IeTowerScrollytelling from "./IeTowerScrollytelling";

export type ProjectStoryProps = {
  isDark: boolean;
  lang: Locale;
};

/**
 * Compact widget shown inside the quick-view modal — a teaser of the story.
 */
export const projectStories: Record<string, ComponentType<ProjectStoryProps>> = {
  "ie-tower-vpr": IeTowerSimulator,
};

/**
 * Full vertical scrollytelling rendered on the project's own page. A project
 * with an entry here replaces the generic bullet layout entirely.
 */
export const projectScrollytelling: Record<string, ComponentType<ProjectStoryProps>> = {
  "ie-tower-vpr": IeTowerScrollytelling,
};
