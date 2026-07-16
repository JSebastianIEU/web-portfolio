"use client";

import SiteChrome from "@/components/layout/SiteChrome";
import { ProjectDetail } from "@/components/sections/Projects";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { CustomCursorDot, useCustomCursor } from "@/components/ui/CustomCursor";
import type { Project } from "@/domain/projects";

type ProjectDetailScreenProps = {
  project: Project;
};

export default function ProjectDetailScreen({ project }: ProjectDetailScreenProps) {
  const { lang, dictionary } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { enableCustomCursor, cursorVariant, enterLink, leaveLink } = useCustomCursor();

  const copy = dictionary.projects;
  const typeLabel = dictionary.types[project.type];
  const statusLabel = dictionary.statuses[project.status];

  return (
    <>
      <SiteChrome
        showSpotlight={enableCustomCursor}
        onEnterLink={enterLink}
        onLeaveLink={leaveLink}
        mainClassName="relative z-[10]"
      >
        <ProjectDetail
          project={project}
          lang={lang}
          copy={copy}
          typeLabel={typeLabel}
          statusLabel={statusLabel}
          isDark={isDark}
        />
      </SiteChrome>

      {enableCustomCursor && <CustomCursorDot variant={cursorVariant} isDark={isDark} />}
    </>
  );
}
