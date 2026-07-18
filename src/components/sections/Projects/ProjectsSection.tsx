"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SectionHeading from "@/components/layout/SectionHeading";
import SectionShell from "@/components/layout/SectionShell";
import FeaturedProjectCard from "@/components/sections/Projects/FeaturedProjectCard";
import ProjectCarousel from "@/components/sections/Projects/ProjectCarousel";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { buildProjectCarousel, findProjectById, getProjectsByCategory } from "@/domain/projects";
import { openProject } from "@/components/sections/Projects/openProject";

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

  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // A card opens the project's own story page (with a morph), not a modal.
  // The scroll position is remembered so Back lands exactly where you left.
  const open = (id: string) => {
    const project = findProjectById(id);
    if (project) openProject(router, project.slug);
  };

  return (
    <SectionShell
      id="projects"
      ref={revealRef}
      className="reveal relative w-full py-20 md:py-28"
      contentClassName="section-exit"
    >
      <div className="flex flex-col gap-12 md:gap-16">
        <SectionHeading eyebrow={copy.label} title={copy.title} subcopy={copy.subcopy} />

        <div className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            {/* Labelled divider: the group name sits on the rule instead of
                above it, so the boundary reads without costing vertical space. */}
            <div className="flex items-center gap-3">
              <h3
                className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em]"
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {copy.groups.professional.title}
              </h3>
              <div
                aria-hidden
                className="h-px flex-1"
                style={{ background: isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.12)" }}
              />
            </div>
            <p className="text-xs md:text-sm max-w-[56ch]" style={{ color: isDark ? "rgba(226,232,240,0.65)" : "rgba(15,23,42,0.6)" }}>
              {copy.groups.professional.subcopy}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:gap-6">
            {professionalProjects.map((project) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                onOpen={() => open(project.id)}
                isDark={isDark}
                displayType={typeMap[project.type]}
                displayStatus={statusMap[project.status]}
                copy={copy}
                lang={lang}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            {/* Labelled divider: the group name sits on the rule instead of
                above it, so the boundary reads without costing vertical space. */}
            <div className="flex items-center gap-3">
              <h3
                className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em]"
                style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {copy.groups.openSource.title}
              </h3>
              <div
                aria-hidden
                className="h-px flex-1"
                style={{ background: isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.12)" }}
              />
            </div>
            <p className="text-xs md:text-sm max-w-[56ch]" style={{ color: isDark ? "rgba(226,232,240,0.65)" : "rgba(15,23,42,0.6)" }}>
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
              onOpen={(id) => open(id)}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              totalProjects={openSourceProjects.length}
            />
          </div>
        </div>
      </div>

    </SectionShell>
  );
}
