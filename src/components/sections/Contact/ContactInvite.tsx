"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionShell from "@/components/layout/SectionShell";
import { contactActions } from "@/data/contactCopy";
import { siteConfig } from "@/data/siteConfig";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Props = {
  enterLink?: () => void;
  leaveLink?: () => void;
};

/**
 * Homepage closing section — replaces the old inline contact form. Its only job
 * is to invite the visitor into the dedicated /contact wizard. Keeps id="contact"
 * so the header scroll-spy and footer anchor still resolve.
 */
export default function ContactInvite({ enterLink, leaveLink }: Props) {
  const { dictionary } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const revealRef = useScrollReveal<HTMLElement>();
  const copy = dictionary.contact;

  const actions = contactActions
    .map((action) => ({ ...action, href: siteConfig[action.hrefKey] }))
    .filter((action) => Boolean(action.href));

  const hover = { onMouseEnter: enterLink, onMouseLeave: leaveLink };

  return (
    <SectionShell id="contact" ref={revealRef} className="reveal relative w-full py-16 md:py-24">
      <div className="glass-panel rounded-3xl p-8 md:p-14 flex flex-col items-center text-center gap-5">
        <span
          className="text-xs font-semibold uppercase tracking-[0.28em]"
          style={{ color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)" }}
        >
          {copy.wizard.eyebrow}
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold max-w-2xl" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
          {copy.tagline}
        </h2>
        <p className="text-sm md:text-base max-w-md" style={{ color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)" }}>
          {copy.subcopy}
        </p>

        <Link
          href="/contact"
          data-cursor="pointer"
          className="mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold transition-transform hover:scale-[1.04]"
          style={{
            background: isDark ? "#f8fafc" : "#0f172a",
            color: isDark ? "#0f172a" : "#f8fafc",
            cursor: "none",
          }}
          {...hover}
        >
          {copy.wizard.cta}
          <ArrowRight size={16} aria-hidden />
        </Link>

        {actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {actions.map((action) => {
              const isExternal = action.external ?? action.href?.startsWith("http");
              return (
                <a
                  key={action.id}
                  href={action.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  data-cursor="pointer"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.18)",
                    color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)",
                    cursor: "none",
                  }}
                  {...hover}
                >
                  {copy.actions[action.id]}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
