"use client";

import { useMemo, useState } from "react";
import SectionShell from "@/components/layout/SectionShell";
import ProjectCarousel from "@/components/sections/Projects/ProjectCarousel";
import ProjectModal from "@/components/sections/Projects/ProjectModal";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { buildProjectCarousel, findProjectById, getProjects } from "@/domain/projects";

export default function ProjectsSection() {
  const { theme } = useTheme();
  const { lang, dictionary } = useI18n();
  const revealRef = useScrollReveal<HTMLElement>();
  const isDark = theme === "dark";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTabletRaw = useMediaQuery("(max-width: 1024px)");
  const isTablet = !isMobile && isTabletRaw;

  const projects = getProjects();
  const loopProjects = useMemo(() => buildProjectCarousel(projects, 3), [projects]);
  const repeatCount = projects.length
    ? Math.max(1, Math.round(loopProjects.length / projects.length))
    : 1;

  const copy = dictionary.projects;
  const typeMap = dictionary.types;
  const statusMap = dictionary.statuses;

  const [openId, setOpenId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = useMemo(() => (openId ? findProjectById(openId) ?? null : null), [openId]);

  return (
    <SectionShell
      id="projects"
      ref={revealRef}
      className="reveal relative w-full py-12 md:py-16"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2
            className="text-2xl md:text-3xl font-semibold"
            data-parallax="title"
            data-speed="0.26"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            {copy.title}
          </h2>
          <p className="text-sm md:text-base" style={{ color: isDark ? "rgba(226,232,240,0.75)" : "rgba(15,23,42,0.7)" }}>
            {copy.subcopy}
          </p>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <ProjectCarousel
            projects={loopProjects}
            copy={copy}
            isDark={isDark}
            lang={lang}
            typeMap={typeMap}
            statusMap={statusMap}
            isMobile={isMobile}
            isTablet={isTablet}
            repeatCount={repeatCount}
            onOpen={(id) => setOpenId(id)}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            totalProjects={projects.length}
          />
        </div>
      </div>

      {selected && (
        <ProjectModal
          project={selected}
          displayType={typeMap[selected.type]}
          displayStatus={statusMap[selected.status]}
          copy={copy}
          onClose={() => setOpenId(null)}
          isDark={isDark}
          isCompact={isMobile || isTablet}
          lang={lang}
        />
      )}
    </SectionShell>
  );
}
