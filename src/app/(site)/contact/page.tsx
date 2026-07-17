"use client";

import SectionShell from "@/components/layout/SectionShell";
import SiteChrome from "@/components/layout/SiteChrome";
import ContactWizard from "@/components/sections/Contact/ContactWizard";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { CustomCursorDot, useCustomCursor } from "@/components/ui/CustomCursor";

export default function ContactPage() {
  const { theme } = useTheme();
  const { dictionary } = useI18n();
  const isDark = theme === "dark";
  const { enableCustomCursor, cursorVariant, enterLink, leaveLink } = useCustomCursor();
  const copy = dictionary.contact;

  return (
    <>
      <SiteChrome
        showSpotlight={enableCustomCursor}
        onEnterLink={enterLink}
        onLeaveLink={leaveLink}
        mainClassName="relative z-[10]"
      >
        <SectionShell className="min-h-[100svh] flex items-center py-20 md:py-24">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span
                className="text-xs font-semibold uppercase tracking-[0.28em]"
                style={{ color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)" }}
              >
                {copy.wizard.eyebrow}
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                {copy.tagline}
              </h1>
            </div>
            <ContactWizard copy={copy} isDark={isDark} enterLink={enterLink} leaveLink={leaveLink} />
          </div>
        </SectionShell>
      </SiteChrome>

      {enableCustomCursor && <CustomCursorDot variant={cursorVariant} isDark={isDark} />}
    </>
  );
}
