"use client";

import SectionShell from "@/components/layout/SectionShell";
import ContactForm from "@/components/sections/Contact/ContactForm";
import { contactActions } from "@/data/contactCopy";
import { siteConfig } from "@/data/siteConfig";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Variant = "section" | "page";

type ContactSectionProps = {
  variant?: Variant;
  enterLink?: () => void;
  leaveLink?: () => void;
};

export default function ContactSection({ variant = "section", enterLink, leaveLink }: ContactSectionProps) {
  const { dictionary } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const revealRef = useScrollReveal<HTMLElement>();
  const copy = dictionary.contact;

  const subtle = { color: isDark ? "rgba(148,163,184,0.85)" : "rgba(71,85,105,0.9)" };

  const actions = contactActions
    .map((action) => {
      const href = siteConfig[action.hrefKey];
      return { ...action, href };
    })
    .filter((action) => Boolean(action.href));

  return (
    <SectionShell
      id={variant === "section" ? "contact" : undefined}
      ref={revealRef}
      className="reveal relative w-full py-12 md:py-16"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2
            className="text-2xl md:text-3xl font-semibold"
            data-parallax="title"
            data-speed="0.28"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            {copy.title}
          </h2>
          <div className="text-lg font-semibold" style={{ color: isDark ? "#e2e8f0" : "#111827" }}>
            {copy.tagline}
          </div>
          <p className="text-sm md:text-base" style={subtle}>
            {copy.subcopy}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {actions.map((action) => {
            const isExternal = action.external ?? action.href?.startsWith("http");
            return (
              <a
                key={action.id}
                href={action.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                data-cursor="pointer"
                style={{
                  border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.18)",
                  color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
                  cursor: "none",
                }}
                onMouseEnter={enterLink}
                onMouseLeave={leaveLink}
              >
                {copy.actions[action.id]}
              </a>
            );
          })}
        </div>

        <ContactForm copy={copy} isDark={isDark} enterLink={enterLink} leaveLink={leaveLink} />
      </div>
    </SectionShell>
  );
}
