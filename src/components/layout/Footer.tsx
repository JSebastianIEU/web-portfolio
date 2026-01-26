"use client";

import { siteConfig } from "@/data/siteConfig";
import { useI18n } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";

const footerLinks = [
  { label: "Email", href: (config: typeof siteConfig) => `mailto:${config.email}` },
  { label: "GitHub", href: (config: typeof siteConfig) => config.github },
  { label: "LinkedIn", href: (config: typeof siteConfig) => config.linkedin },
  { label: "Medium", href: (config: typeof siteConfig) => config.medium },
];

export default function Footer() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  const lineColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const primary = isDark ? "rgba(248,250,252,0.9)" : "rgba(15,23,42,0.9)";
  const secondary = isDark ? "rgba(226,232,240,0.65)" : "rgba(15,23,42,0.6)";
  const linkColor = isDark ? "rgba(226,232,240,0.7)" : "rgba(15,23,42,0.65)";
  const linkHover = isDark ? "rgba(248,250,252,0.95)" : "rgba(15,23,42,0.9)";

  return (
    <footer className="relative w-full px-4 md:px-6 lg:px-8 pb-6 pt-6 md:pt-7" style={{ cursor: "none" }}>
      <div className="absolute top-0 inset-x-4 md:inset-x-6 lg:inset-x-8 h-px" style={{ background: lineColor }} />
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-sm font-semibold" style={{ color: primary }}>
            Juan Sebastian Peña — {t("footer.tagline")}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {footerLinks.map((link) => {
              const href = link.href(siteConfig);
              const isExternal = href.startsWith("http");
              return (
                <a
                  key={link.label}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer noopener" : undefined}
                  className="text-sm transition-colors"
                  style={{ color: linkColor }}
                >
                  <span className="hover:underline" style={{ transition: "color 160ms ease", color: linkColor }}>
                    {link.label}
                  </span>
                  <style jsx>{`
                    a:hover span,
                    a:focus-visible span {
                      color: ${linkHover};
                    }
                  `}</style>
                </a>
              );
            })}
          </div>
        </div>
        <div className="text-xs" style={{ color: secondary }}>
          {t("footer.copyright").replace("{year}", year.toString())}
        </div>
      </div>
    </footer>
  );
}
