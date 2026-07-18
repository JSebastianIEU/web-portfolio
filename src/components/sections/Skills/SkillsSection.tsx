"use client";

import { useMemo } from "react";
import SectionHeading from "@/components/layout/SectionHeading";
import SectionShell from "@/components/layout/SectionShell";
import SkillsDesktopExperience from "@/components/sections/Skills/SkillsDesktopExperience";
import { skillCategories, skillCrossLinks, skillNodes } from "@/data/skillsData";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* On phones the network runs portrait as a zigzag: one category per row,
   alternating right / left, each with its bubbles orbiting its title. Bigger
   and airier than a 2x3 grid on a narrow screen. */
const MOBILE_ANCHORS: Record<string, { x: number; y: number }> = {
  software: { x: 0.62, y: 0.08 },
  frontend: { x: 0.36, y: 0.245 },
  data: { x: 0.63, y: 0.41 },
  db: { x: 0.36, y: 0.575 },
  cloud: { x: 0.63, y: 0.74 },
  automation: { x: 0.37, y: 0.9 },
};

export default function SkillsSection() {
  const { theme } = useTheme();
  const { lang, t } = useI18n();
  const revealRef = useScrollReveal<HTMLElement>();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const categories = useMemo(
    () =>
      isMobile
        ? skillCategories.map((c) => ({ ...c, anchor: MOBILE_ANCHORS[c.id] ?? c.anchor }))
        : skillCategories,
    [isMobile],
  );

  const srList = useMemo(
    () => (
      <div className="sr-only" aria-hidden="false">
        {/* No heading here: the visible h2 now serves that role, and repeating
            the label made a screen reader announce "Skills" twice. */}
        <ul aria-label={t("skills.label")}>
          {skillNodes.map((node) => (
            <li key={node.id}>{lang === "es" ? node.nameES : node.nameEN}</li>
          ))}
        </ul>
      </div>
    ),
    [lang, t],
  );

  return (
    <SectionShell
      id="skills"
      ref={revealRef}
      className="reveal relative min-h-[55svh] md:min-h-[60vh] flex flex-col justify-start py-16 md:py-20 overflow-hidden"
      contentClassName="section-exit relative w-full"
    >
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading eyebrow={t("skills.label")} title={t("skills.title")} subcopy={t("skills.subcopy")} />
        <SkillsDesktopExperience
          theme={theme}
          lang={lang}
          categories={categories}
          nodes={skillNodes}
          links={skillCrossLinks}
          srList={srList}
        />
      </div>
    </SectionShell>
  );
}
