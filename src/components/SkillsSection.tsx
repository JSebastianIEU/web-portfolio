/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import NextImage from "next/image";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import { skillCategories, skillCrossLinks, skillNodes } from "@/data/skillsData";
import type { SkillLink } from "@/domain/skills";
import type { Locale } from "@/domain/i18n";
import { useNetworkSimulation } from "@/components/sections/Skills/useNetworkSimulation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { buildCategoryBackbone, buildSkillEdges } from "@/components/sections/Skills/skillsGraph";

type DesktopSkillsExperienceProps = {
  theme: string;
  lang: Locale;
  t: (key: string) => string;
  revealRef: React.RefObject<HTMLElement | null>;
  srList: React.ReactNode;
};

type MobileSkillsLayoutProps = {
  theme: string;
  lang: Locale;
  t: (key: string) => string;
  revealRef: React.RefObject<HTMLElement | null>;
  srList: React.ReactNode;
};

const HERO_PALETTE = ["#a855f7", "#22c55e", "#38bdf8", "#fb923c", "#67e8f9", "#f472b6"];

export default function SkillsSection() {
  const { theme } = useTheme();
  const { lang, t } = useI18n();
  const revealRef = useScrollReveal<HTMLElement>();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const srList = useMemo(
    () => (
      <div className="sr-only" aria-hidden="false">
        <p>{t("skills.label")}</p>
        <ul>
          {skillNodes.map((n) => (
            <li key={n.id}>{lang === "es" ? n.nameES : n.nameEN}</li>
          ))}
        </ul>
      </div>
    ),
    [lang, t],
  );

  if (isMobile) {
    return <MobileSkillsLayout lang={lang} t={t} theme={theme} revealRef={revealRef} srList={srList} />;
  }

  return <DesktopSkillsExperience theme={theme} lang={lang} t={t} revealRef={revealRef} srList={srList} />;
}

function MobileSkillsLayout({ lang, t, theme, revealRef, srList }: MobileSkillsLayoutProps) {
  const isDark = theme === "dark";
  const groupedSkills = useMemo(() => {
    const tierOrder: Record<"primary" | "secondary", number> = { primary: 0, secondary: 1 };
    return skillCategories.map((category, idx) => {
      const skills = skillNodes
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
  }, [lang]);

  return (
    <section
      id="skills"
      ref={revealRef}
      className="reveal relative px-4 py-12 overflow-hidden"
      style={{ cursor: "none" }}
    >
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6 px-1">
          <h2 className="text-2xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
            {t("skills.label")}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {groupedSkills.map((group) => (
            <div
              key={group.category.id}
              className="rounded-2xl p-4 shadow-sm"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, rgba(12,16,32,0.92), rgba(9,12,24,0.86))"
                  : "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,249,253,0.92))",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}`,
                boxShadow: isDark ? "0 14px 38px rgba(0,0,0,0.35)" : "0 16px 34px rgba(15,23,42,0.08)",
              }}
            >
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
    </section>
  );
}

function DesktopSkillsExperience({ theme, lang, t, revealRef, srList }: DesktopSkillsExperienceProps) {
  const isDark = theme === "dark";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)") && !isMobile;
  const viewportMode = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const allowPointer = viewportMode === "desktop" || viewportMode === "tablet";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tooltip, setTooltip] = useState<{ id: string; name: string; x: number; y: number } | null>(null);
  const [tooltipCoords, setTooltipCoords] = useState<{ x: number; y: number } | null>(null);
  const [categoryRects, setCategoryRects] = useState<Array<{ id: string; width: number; height: number }>>(
    skillCategories.map((c) => ({ id: c.id, width: 220, height: 60 })),
  );
  const edgesRef = useRef<{ cross: SkillLink[]; intra: SkillLink[] }>({ cross: [], intra: [] });
  const lastEdgeBuild = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const titleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const iconCache = useRef<Record<string, HTMLImageElement>>({});

  const nodes = useMemo(() => skillNodes, []);
  const categories = useMemo(() => skillCategories, []);
  const links = useMemo(() => skillCrossLinks, []);
  const meshEdges = useMemo(() => {
    const sorted = [...skillNodes].sort((a, b) => (a.id < b.id ? -1 : 1));
    const edges: SkillLink[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      const b = sorted[(i + 1) % sorted.length];
      edges.push({ sourceId: a.id, targetId: b.id });
    }
    return edges;
  }, []);
  const titleLines = useMemo(() => {
    if (lang === "es") {
      return {
        software: ["INGENIERÍA", "DE SOFTWARE"],
        frontend: ["FRONTEND", "Y PRODUCTO", "UI"],
        data: ["DATOS", "E IA"],
        db: ["BASES", "DE DATOS"],
        cloud: ["CLOUD Y", "DEVOPS"],
        automation: ["AUTOMATIZACIÓN", "Y SCRIPTING"],
      };
    }
    return {
      software: ["SOFTWARE", "ENGINEERING"],
      frontend: ["FRONTEND", "& PRODUCT", "UI"],
      data: ["DATA", "& ML"],
      db: ["DATABASES"],
      cloud: ["CLOUD &", "DEVOPS"],
      automation: ["AUTOMATION", "& SCRIPTING"],
    };
  }, [lang]);
  const categoryColors = useMemo(() => {
    const map: Record<string, { title: string }> = {};
    const ids = ["software", "frontend", "data", "db", "cloud", "automation"];
    ids.forEach((id, idx) => {
      const base = HERO_PALETTE[idx % HERO_PALETTE.length];
      map[id] = {
        title: isDark ? "rgba(255,255,255,0.92)" : base,
      };
    });
    return map;
  }, [isDark]);
  const neutralTitle = isDark ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.88)";
  // Preload icons
  useEffect(() => {
    if (typeof window === "undefined") return;
    const Img = window.Image;
    const cache: Record<string, HTMLImageElement> = {};
    skillNodes.forEach((n) => {
      const img = new Img();
      img.src = n.iconSrc;
      cache[n.id] = img;
    });
    iconCache.current = cache;
  }, []);

  // Resize observer for canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resize = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: Math.max(300, rect.width * 0.6) });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    lastEdgeBuild.current = 0;
  }, [size.w, size.h, viewportMode]);

  // measure category label sizes for no-go rectangles using real DOM sizes
  useEffect(() => {
    const measure = () => {
      const padX = isMobile ? 44 : 60;
      const padY = isMobile ? 28 : 34;
      const rects = categories.map((c) => {
        const el = titleRefs.current[c.id];
        if (el) {
          const r = el.getBoundingClientRect();
          return { id: c.id, width: r.width + padX, height: r.height + padY };
        }
        return { id: c.id, width: 220, height: 60 };
      });
      setCategoryRects(rects);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [categories, isMobile, lang, size.w, size.h]);

  const categoryBackbone = useMemo(() => {
    const totalPairs = (categories.length * (categories.length - 1)) / 2;
    return buildCategoryBackbone(categories, nodes, links, totalPairs, true);
  }, [categories, links, nodes]);

  const titleAnchorMap = useMemo(() => {
    if (!size.w || !size.h) return {};
    const map: Record<string, { x: number; y: number }> = {};
    categories.forEach((c) => {
      map[c.id] = { x: c.anchor.x * size.w, y: c.anchor.y * size.h };
    });
    return map;
  }, [categories, size.h, size.w]);

  const { hoverId, nodesRef } = useNetworkSimulation({
    nodes,
    categories,
    categoryRects,
    links,
    width: size.w,
    height: size.h,
    pointerRef,
    viewport: viewportMode,
    titleAnchors: titleAnchorMap,
    onFrame: ({ nodes: state, hoverId: frameHover, time }: { nodes: any[]; hoverId: string | null; time: number }) => {
      const canvas = canvasRef.current;
      if (!canvas || !size.w || !size.h) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, size.w, size.h);
      const paddedRects = categories.map((c) => {
        const rect = categoryRects.find((r) => r.id === c.id);
        const w = rect?.width ?? 220;
        const h = rect?.height ?? 60;
        const cx = c.anchor.x * size.w;
        const cy = c.anchor.y * size.h;
        return { id: c.id, x: cx - w / 2, y: cy - h / 2, width: w, height: h };
      });

      const positions = state.map((n: any) => ({
        id: n.node.id,
        x: n.x,
        y: n.y,
        category: n.node.category,
        tier: n.node.tier,
      }));

      // rebuild edges occasionally (not every frame) to reduce churn
      if (!lastEdgeBuild.current || time - lastEdgeBuild.current > 1200) {
        const edgeSettings =
          viewportMode === "mobile"
            ? { maxCross: 50, kPrimary: 1, kSecondary: 1 }
            : viewportMode === "tablet"
            ? { maxCross: 110, kPrimary: 2, kSecondary: 2 }
            : { maxCross: 160, kPrimary: 4, kSecondary: 3 };
        edgesRef.current = buildSkillEdges(positions, links, {
          maxCross: edgeSettings.maxCross,
          kPrimary: edgeSettings.kPrimary,
          kSecondary: edgeSettings.kSecondary,
          paddedRects,
          categories,
        });
        lastEdgeBuild.current = time;
      }

      const { cross: crossEdges, intra: intraEdges } = edgesRef.current;
      const allEdges = [...crossEdges, ...intraEdges];
      const posMap = new Map(state.map((n: any) => [n.node.id, n]));
      const neighborMap: Record<string, Set<string>> = {};
      const addNeighbor = (a: string, b: string) => {
        if (!neighborMap[a]) neighborMap[a] = new Set();
        neighborMap[a].add(b);
      };
      allEdges.forEach((l) => {
        addNeighbor(l.sourceId, l.targetId);
        addNeighbor(l.targetId, l.sourceId);
      });

      const activeHover = frameHover ?? hoverId;
      const connectedSet =
        activeHover && neighborMap[activeHover]
          ? new Set<string>([activeHover, ...Array.from(neighborMap[activeHover])])
          : activeHover
          ? new Set<string>([activeHover])
          : null;

      const longThreshold = size.w * 0.45;
      const visibilityScale = viewportMode === "mobile" ? 0.55 : viewportMode === "tablet" ? 0.8 : 1;

      // Global mesh (very faint, behind everything, deterministic)
      ctx.lineWidth = 0.6;
      for (const link of meshEdges) {
        const a = posMap.get(link.sourceId) as any;
        const b = posMap.get(link.targetId) as any;
        if (!a || !b) continue;
        const intersects = paddedRects.some((r) => segmentIntersectsRect(a.x, a.y, b.x, b.y, r.x, r.y, r.width, r.height));
        if (intersects) continue;
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.065)" : "rgba(15,23,42,0.08)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Backbone between hubs
      for (const edge of categoryBackbone) {
        const a = categories.find((c) => c.id === edge.a);
        const b = categories.find((c) => c.id === edge.b);
        if (!a || !b) continue;
        const ax = a.anchor.x * size.w;
        const ay = a.anchor.y * size.h;
        const bx = b.anchor.x * size.w;
        const by = b.anchor.y * size.h;
        const intersects = paddedRects.some((r) => segmentIntersectsRect(ax, ay, bx, by, r.x, r.y, r.width, r.height));
        const len = Math.hypot(ax - bx, ay - by);
        const alphaBase = 0.16 + (edge.norm ?? 0.5) * 0.1;
        let alpha = alphaBase * (intersects ? 0.12 : 1);
        if (len > longThreshold) alpha *= 0.65;
        alpha *= visibilityScale;
        const widthL = 0.9 + (edge.norm ?? 0.5) * 0.8;
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(15,23,42,${alpha + 0.05})`;
        ctx.lineWidth = widthL;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Cross edges (medium)
      ctx.lineWidth = 0.85;
      for (const link of crossEdges) {
        const a = posMap.get(link.sourceId) as any;
        const b = posMap.get(link.targetId) as any;
        if (!a || !b) continue;
        const intersects = paddedRects.some((r) => segmentIntersectsRect(a.x, a.y, b.x, b.y, r.x, r.y, r.width, r.height));
        const isHovered = activeHover && (a.node.id === activeHover || b.node.id === activeHover);
        const deEmphasize = connectedSet && !(connectedSet.has(a.node.id) || connectedSet.has(b.node.id));
        const len = Math.hypot(a.x - b.x, a.y - b.y);
        const tierFactor =
          (a.node.tier === "primary" ? 1.0 : 0.75) * (b.node.tier === "primary" ? 1.0 : 0.75);
        let alphaBase = isHovered ? 0.18 : deEmphasize ? 0.05 : 0.1;
        alphaBase *= isHovered ? 1.8 : deEmphasize ? 0.55 : 1;
        let alpha = alphaBase * tierFactor * (intersects ? 0.12 : 1);
        if (len > longThreshold) alpha *= 0.65;
        const boost = isDark ? 1.35 : 1.1;
        alpha = Math.min(0.38, alpha * boost * visibilityScale);
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(15,23,42,${alpha + 0.03})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Intra edges (weak mesh)
      const breathe =
        (viewportMode === "mobile" ? 0.02 : viewportMode === "tablet" ? 0.03 : 0.04) *
        Math.sin(time * 0.0015);
      ctx.lineWidth = 0.65;
      for (const link of intraEdges) {
        const a = posMap.get(link.sourceId) as any;
        const b = posMap.get(link.targetId) as any;
        if (!a || !b) continue;
        const isHovered = activeHover && (a.node.id === activeHover || b.node.id === activeHover);
        const deEmphasize = connectedSet && !(connectedSet.has(a.node.id) || connectedSet.has(b.node.id));
        const len = Math.hypot(a.x - b.x, a.y - b.y);
        const tierFactor =
          (a.node.tier === "primary" ? 1.0 : 0.7) * (b.node.tier === "primary" ? 1.0 : 0.7);
        let alphaBase = isHovered ? 0.08 : deEmphasize ? 0.025 : 0.04;
        alphaBase *= isHovered ? 1.8 : deEmphasize ? 0.55 : 1;
        let alpha = Math.max(0, Math.min(0.12, alphaBase * tierFactor + breathe));
        if (len > longThreshold) alpha *= 0.65;
        const boost = isDark ? 1.25 : 1.1;
        alpha = Math.min(0.16, alpha * boost * visibilityScale);
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(15,23,42,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Nodes
      for (const n of state) {
        const isHover = n.node.id === activeHover;
        const rBase = n.r * (n.node.tier === "primary" ? 1.05 : 0.95);
        const r = isHover ? rBase * 1.18 : rBase;
        const dim = connectedSet && !connectedSet.has(n.node.id) ? 0.45 : 1;
        const tone = dim * visibilityScale;
        ctx.save();
        ctx.translate(n.x, n.y);
        const shadowBlur =
          n.node.tier === "primary"
            ? viewportMode === "mobile"
              ? 10
              : viewportMode === "tablet"
              ? 14
              : 18
            : viewportMode === "mobile"
            ? 6
            : viewportMode === "tablet"
            ? 9
            : 12;
        ctx.shadowColor = isDark ? `rgba(255,255,255,${0.14 * tone})` : `rgba(15,23,42,${0.16 * tone})`;
        ctx.shadowBlur = shadowBlur;
        ctx.fillStyle = isDark ? `rgba(255,255,255,${0.07 * tone})` : `rgba(15,23,42,${0.07 * tone})`;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${0.22 * tone})` : `rgba(15,23,42,${0.2 * tone})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // icon clipped
        const img = iconCache.current[n.node.id];
        if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
          const target = r * 1.1;
          const iw = img.naturalWidth || target;
          const ih = img.naturalHeight || target;
          const aspect = iw / ih || 1;
          let drawW = target;
          let drawH = target;
          if (aspect > 1) {
            drawH = target / aspect;
          } else {
            drawW = target * aspect;
          }
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, r - 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        }
        ctx.restore();
      }

    },
  });
  const activeCategory = hoverId ? (nodes.find((n) => n.id === hoverId)?.category ?? null) : null;

  // Pointer handlers
  const onPointerMove = (e: React.PointerEvent) => {
    if (!allowPointer) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onPointerLeave = () => {
    pointerRef.current = null;
  };

  useEffect(() => {
    if (!allowPointer) {
      pointerRef.current = null;
    }
  }, [allowPointer]);

  // Tooltip follow
  useEffect(() => {
    if (!hoverId) {
      setTooltip(null);
      return;
    }
    const node = nodes.find((n) => n.id === hoverId);
    const simNode = nodesRef.current.find((n: any) => n.node.id === hoverId);
    if (!node || !simNode) {
      setTooltip(null);
      return;
    }
    setTooltip({
      id: hoverId,
      name: lang === "es" ? node.nameES : node.nameEN,
      x: simNode.x,
      y: simNode.y,
    });
  }, [hoverId, lang, nodes, nodesRef]);

  useEffect(() => {
    if (!tooltip || typeof window === "undefined") {
      setTooltipCoords(null);
      return;
    }
    const padding = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = tooltip.x;
    let y = tooltip.y - 18;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      x = rect.left + tooltip.x;
      y = rect.top + tooltip.y - 18;
      if (y < padding) {
        y = rect.top + tooltip.y + 18;
      }
    } else if (y < padding) {
      y = tooltip.y + 18;
    }
    x = Math.min(vw - padding, Math.max(padding, x));
    y = Math.min(vh - padding, Math.max(padding, y));
    setTooltipCoords({ x, y });
  }, [tooltip, size.h, size.w]);

  const tooltipNode =
    tooltip && tooltipCoords && typeof window !== "undefined"
      ? createPortal(
          <div
            className="pointer-events-none fixed px-2.5 py-1.5 rounded-full text-xs font-medium"
            style={{
              left: tooltipCoords.x,
              top: tooltipCoords.y,
              transform: "translate(-50%, -100%)",
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)",
              border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.12)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
              color: isDark ? "#e5e7eb" : "#0f172a",
              zIndex: 30000,
            }}
          >
            {tooltip.name}
          </div>,
          document.body,
        )
      : null;

  // helper: segment-rect intersection
  function segmentIntersectsRect(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number) {
    const inside = (x: number, y: number) => x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
    if (inside(x1, y1) || inside(x2, y2)) return true;
    const lines = [
      [rx, ry, rx + rw, ry],
      [rx + rw, ry, rx + rw, ry + rh],
      [rx + rw, ry + rh, rx, ry + rh],
      [rx, ry + rh, rx, ry],
    ];
    const cross = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number) => {
      const det = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
      if (det === 0) return false;
      const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / det;
      const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / det;
      return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    };
    for (const [ax, ay, bx, by] of lines) {
      if (cross(x1, y1, x2, y2, ax, ay, bx, by)) return true;
    }
    return false;
  }

  return (
    <section
      id="skills"
      ref={revealRef}
      className="reveal relative min-h-[60vh] flex items-center justify-center px-4 md:px-5 py-12 md:py-14 overflow-hidden"
      style={{ cursor: "none" }}
    >
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-6 md:mb-8 px-1">
          <h2
            className="text-2xl md:text-3xl font-semibold"
            data-parallax="title"
            data-speed="0.26"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            {t("skills.label")}
          </h2>
          <div aria-hidden className="hidden" />
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-[18px]"
          style={{
            border: "none",
            background: "transparent",
            boxShadow: "none",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <canvas
            ref={canvasRef}
            className="block w-full h-full"
            style={{ minHeight: isMobile ? "280px" : "360px" }}
          />

          {/* Category titles overlay */}
          <div className="pointer-events-none absolute inset-0">
            {categories.map((c) => {
              const label = (lang === "es" ? c.labelES : c.labelEN).toUpperCase();
              const lines = titleLines[c.id as keyof typeof titleLines] ?? [label];
              return (
                <div
                  key={c.id}
                  ref={(el) => {
                    titleRefs.current[c.id] = el;
                  }}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${c.anchor.x * 100}%`,
                    top: `${c.anchor.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex flex-col items-center leading-[1.05]">
                    {lines.map((line, idx) => (
                      <span
                        key={idx}
                        className="block text-[12px] md:text-[17px] font-semibold uppercase"
                        style={{
                          letterSpacing: "0.1em",
                          color:
                            activeCategory === c.id
                              ? categoryColors[c.id as keyof typeof categoryColors]?.title ?? neutralTitle
                              : neutralTitle,
                          textShadow:
                            activeCategory === c.id && isDark
                              ? "0 0 15px rgba(255,255,255,0.95), 0 0 30px rgba(255,255,255,0.75), 0 0 45px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3), 0 6px 20px rgba(0,0,0,0.25)"
                              : isDark
                              ? "0 6px 20px rgba(0,0,0,0.25)"
                              : "0 6px 18px rgba(0,0,0,0.08)",
                          fontSize: "clamp(14px,2vw,22px)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {srList}
      {tooltipNode}
    </section>
  );
}
