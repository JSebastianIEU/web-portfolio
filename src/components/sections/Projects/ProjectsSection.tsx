"use client";

import { useMemo, useState } from "react";
import SectionShell from "@/components/layout/SectionShell";
import FeaturedProjectCard from "@/components/sections/Projects/FeaturedProjectCard";
import ProjectCarousel from "@/components/sections/Projects/ProjectCarousel";
import ProjectModal from "@/components/sections/Projects/ProjectModal";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { buildProjectCarousel, findProjectById, getProjectsByCategory } from "@/domain/projects";

export default function ProjectsSection() {
  const { theme } = useTheme();
  const { lang, dictionary } = useI18n();
  const revealRef = useScrollReveal<HTMLElement>();
  const isDark = theme === "dark";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTabletRaw = useMediaQuery("(max-width: 1024px)");
  const isTablet = !isMobile && isTabletRaw;

  const professionalProjects = getProjectsByCategory("professional");
  const openSourceProjects = getProjectsByCategory("open-source");
  const loopProjects = useMemo(() => buildProjectCarousel(openSourceProjects, 3), [openSourceProjects]);
  const repeatCount = openSourceProjects.length
    ? Math.max(1, Math.round(loopProjects.length / openSourceProjects.length))
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

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg md:text-xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
              {copy.groups.professional.title}
            </h3>
            <p className="text-xs md:text-sm" style={{ color: isDark ? "rgba(226,232,240,0.65)" : "rgba(15,23,42,0.6)" }}>
              {copy.groups.professional.subcopy}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalProjects.map((project) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                onOpen={() => setOpenId(project.id)}
                isDark={isDark}
                displayType={typeMap[project.type]}
                displayStatus={statusMap[project.status]}
                copy={copy}
                lang={lang}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg md:text-xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
              {copy.groups.openSource.title}
            </h3>
            <p className="text-xs md:text-sm" style={{ color: isDark ? "rgba(226,232,240,0.65)" : "rgba(15,23,42,0.6)" }}>
              {copy.groups.openSource.subcopy}
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
              totalProjects={openSourceProjects.length}
            />
          </div>
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
