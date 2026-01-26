"use client";

import { useMemo } from "react";
import SectionShell from "@/components/layout/SectionShell";
import SkillsDesktopExperience from "@/components/sections/Skills/SkillsDesktopExperience";
import SkillsMobileLayout from "@/components/sections/Skills/SkillsMobileLayout";
import { skillCategories, skillCrossLinks, skillNodes } from "@/data/skillsData";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function SkillsSection() {
  const { theme } = useTheme();
  const { lang, t } = useI18n();
  const revealRef = useScrollReveal<HTMLElement>();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const srList = useMemo(
    () => (
      <div className="sr-only" aria-hidden="false">
        <p>{t("skills.label")}</p>
        <ul>
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
      className="reveal relative min-h-[60vh] flex items-center justify-center py-12 md:py-14 overflow-hidden"
      contentClassName="relative w-full"
    >
      {isMobile ? (
        <SkillsMobileLayout
          lang={lang}
          isDark={theme === "dark"}
          t={t}
          categories={skillCategories}
          nodes={skillNodes}
          srList={srList}
        />
      ) : (
        <SkillsDesktopExperience
          theme={theme}
          lang={lang}
          t={t}
          categories={skillCategories}
          nodes={skillNodes}
          links={skillCrossLinks}
          srList={srList}
        />
      )}
    </SectionShell>
  );
}
