import type { ComponentType } from "react";
import type { Locale } from "@/domain/i18n";
import IeTowerSimulator from "./IeTowerSimulator";
import IeTowerScrollytelling from "./IeTowerScrollytelling";
import QrForgeStory from "./QrForgeStory";
import TikTokRecommender from "./TikTokRecommender";
import TikTokRecommenderStory from "./TikTokRecommenderStory";
import TikTokScrollytelling from "./TikTokScrollytelling";

export type ProjectStoryProps = {
  isDark: boolean;
  lang: Locale;
};

/**
 * Compact widget shown inside the quick-view modal — a teaser of the story.
 */
export const projectStories: Record<string, ComponentType<ProjectStoryProps>> = {
  "ie-tower-vpr": IeTowerSimulator,
  "tiktok-semantic-engagement": TikTokRecommender,
};

/**
 * Full vertical scrollytelling rendered on the project's own page. A project
 * with an entry here replaces the generic bullet layout entirely.
 */
export const projectScrollytelling: Record<string, ComponentType<ProjectStoryProps>> = {
  "ie-tower-vpr": IeTowerScrollytelling,
  "tiktok-semantic-engagement": TikTokScrollytelling,
  "tiktok-recommender": TikTokRecommenderStory,
  "qr-forge": QrForgeStory,
};

/**
 * Which stories have a demo far enough down to be worth jumping to, where its
 * anchor lives, and what to call it.
 *
 * A story whose demo already sits at the top is deliberately absent: a skip
 * button that scrolls nowhere, or that promises a "simulator" the page does
 * not have, is worse than no button. The label used to be one global string,
 * which is how the TikTok stories ended up offering a simulator.
 */
export const storyDemoAnchor: Record<string, { id: string; en: string; es: string }> = {
  "ie-tower-vpr": { id: "try-it", en: "Skip to the simulator", es: "Ir al simulador" },
  "tiktok-semantic-engagement": { id: "try-it", en: "Try the recommender", es: "Probar el recomendador" },
};
