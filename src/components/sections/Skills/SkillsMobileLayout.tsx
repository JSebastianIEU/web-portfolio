"use client";

import { useMemo } from "react";
import NextImage from "next/image";
import type { Locale } from "@/domain/i18n";
import type { SkillCategory, SkillNode } from "@/domain/skills";

const HERO_PALETTE = ["#a855f7", "#22c55e", "#38bdf8", "#fb923c", "#67e8f9", "#f472b6"];

type SkillsMobileLayoutProps = {
  lang: Locale;
  isDark: boolean;
  t: (key: string) => string;
  categories: SkillCategory[];
  nodes: SkillNode[];
  srList: React.ReactNode;
};

export default function SkillsMobileLayout({ lang, isDark, t, categories, nodes, srList }: SkillsMobileLayoutProps) {
  const groupedSkills = useMemo(() => {
    const tierOrder: Record<"primary" | "secondary", number> = { primary: 0, secondary: 1 };
    return categories.map((category, idx) => {
      const skills = nodes
        .filter((skill) => skill.category === category.id)
        .sort((a, b) => {
          const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
          if (tierDiff !== 0) return tierDiff;
          const nameA = lang === "es" ? a.nameES : a.nameEN;
          const nameB = lang === "es" ? b.nameES : b.nameEN;
          return nameA.localeCompare(nameB, lang === "es" ? "es" : "en", { sensitivity: "base" });
        });
      return { category, skills, accent: HERO_PALETTE[idx % HERO_PALETTE.length] };
    });
  }, [categories, lang, nodes]);

  return (
    <>
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6 px-1">
          <h2 className="text-2xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {t("skills.label")}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {groupedSkills.map((group) => (
            <div key={group.category.id} className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: group.accent, boxShadow: `0 0 0 6px ${group.accent}1f` }}
                />
                <p
                  className="text-sm font-semibold uppercase tracking-[0.08em]"
                  style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
                >
                  {lang === "es" ? group.category.labelES : group.category.labelEN}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {group.skills.map((skill) => {
                  const label = lang === "es" ? skill.nameES : skill.nameEN;
                  const isPrimary = skill.tier === "primary";
                  return (
                    <div key={skill.id} className="flex flex-col items-center gap-2 text-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl border"
                        style={{
                          borderColor: isPrimary
                            ? group.accent
                            : isDark
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(15,23,42,0.08)",
                          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.02)",
                          boxShadow: isPrimary
                            ? `0 10px 20px -10px ${group.accent}80`
                            : isDark
                            ? "0 6px 16px rgba(0,0,0,0.35)"
                            : "0 8px 14px rgba(15,23,42,0.06)",
                        }}
                      >
                        <NextImage
                          src={skill.iconSrc}
                          alt={label}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <span
                        className="text-[11px] font-medium leading-tight"
                        style={{
                          color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.85)",
                          opacity: isPrimary ? 1 : 0.82,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {srList}
    </>
  );
}
