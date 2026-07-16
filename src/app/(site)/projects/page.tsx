"use client";

import SiteChrome from "@/components/layout/SiteChrome";
import { ProjectsSection } from "@/components/sections/Projects";
import { useTheme } from "@/components/providers/theme-provider";
import { CustomCursorDot, useCustomCursor } from "@/components/ui/CustomCursor";

export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { enableCustomCursor, cursorVariant, enterLink, leaveLink } = useCustomCursor();

  return (
    <>
      <SiteChrome
        showSpotlight={enableCustomCursor}
        onEnterLink={enterLink}
        onLeaveLink={leaveLink}
        mainClassName="relative z-[10]"
      >
        <ProjectsSection />
      </SiteChrome>

      {enableCustomCursor && <CustomCursorDot variant={cursorVariant} isDark={isDark} />}
    </>
  );
}
