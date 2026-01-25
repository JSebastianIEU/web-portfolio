"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/theme-provider";
import { siteConfig } from "@/config/siteConfig";

const links = [
  { key: "github", href: siteConfig.github, label: "GitHub", icon: "/logos/github.svg" },
  { key: "linkedin", href: siteConfig.linkedin, label: "LinkedIn", icon: "/logos/linkedin.svg" },
  { key: "medium", href: siteConfig.medium, label: "Medium", icon: "/logos/medium.svg" },
];

interface SocialRailProps {
  onEnter?: () => void;
  onLeave?: () => void;
}

export default function SocialRail({ onEnter, onLeave }: SocialRailProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const baseColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)";
  const hoverColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)";

  return (
    <div
      className="hidden md:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-[18000]"
      style={{ pointerEvents: "none", cursor: "none" }}
    >
      <div
        aria-hidden
        className="w-px rounded-full"
        style={{ height: 22, background: baseColor, opacity: 0.65 }}
      />

      {links
        .filter((l) => !!l.href)
        .map((link) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={link.label}
            className="group w-10 h-10 flex items-center justify-center rounded-full transition-transform duration-150"
            style={{ pointerEvents: "auto", cursor: "none" }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full transition duration-200"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
                border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.12)",
                transform: "scale(1)",
              }}
            >
              <Image
                src={link.icon}
                alt={link.label}
                width={20}
                height={20}
                className="transition duration-200"
                style={{
                  filter: `grayscale(1) invert(${isDark ? 1 : 0})`,
                  opacity: 0.72,
                }}
              />
            </div>
            <style jsx>{`
              a.group:hover div,
              a.group:focus-visible div {
                transform: scale(1.04);
                border-color: ${hoverColor};
                background: ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"};
              }
              a.group:hover img,
              a.group:focus-visible img {
                opacity: 0.95;
              }
            `}</style>
          </a>
        ))}

      <div
        aria-hidden
        className="w-px rounded-full"
        style={{ height: 22, background: baseColor, opacity: 0.65 }}
      />
    </div>
  );
}
