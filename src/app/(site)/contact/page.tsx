"use client";

import SiteChrome from "@/components/layout/SiteChrome";
import { ContactSection } from "@/components/sections/Contact";
import { useTheme } from "@/components/providers/theme-provider";
import { CustomCursorDot, useCustomCursor } from "@/components/ui/CustomCursor";

export default function ContactPage() {
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
        <ContactSection variant="page" enterLink={enterLink} leaveLink={leaveLink} />
      </SiteChrome>

      {enableCustomCursor && <CustomCursorDot variant={cursorVariant} isDark={isDark} />}
    </>
  );
}
