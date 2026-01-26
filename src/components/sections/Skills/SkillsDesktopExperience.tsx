/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/domain/i18n";
import type { SkillCategory, SkillLink, SkillNode } from "@/domain/skills";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNetworkSimulation } from "./useNetworkSimulation";
import { buildCategoryBackbone, buildMeshEdges, buildSkillEdges, segmentIntersectsRect } from "./skillsGraph";

type SkillsDesktopExperienceProps = {
  theme: string;
  lang: Locale;
  t: (key: string) => string;
  categories: SkillCategory[];
  nodes: SkillNode[];
  links: SkillLink[];
  srList: React.ReactNode;
};

const HERO_PALETTE = ["#a855f7", "#22c55e", "#38bdf8", "#fb923c", "#67e8f9", "#f472b6"];

export default function SkillsDesktopExperience({ theme, lang, t, categories, nodes, links, srList }: SkillsDesktopExperienceProps) {
  const isDark = theme === "dark";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)") && !isMobile;
  const viewportMode = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const allowPointer = viewportMode === "desktop";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [tooltip, setTooltip] = useState<{ id: string; name: string; x: number; y: number } | null>(null);
  const [tooltipCoords, setTooltipCoords] = useState<{ x: number; y: number } | null>(null);
  const [categoryRects, setCategoryRects] = useState<Array<{ id: string; width: number; height: number }>>(
    categories.map((c) => ({ id: c.id, width: 220, height: 60 })),
  );
  const edgesRef = useRef<{ cross: SkillLink[]; intra: SkillLink[] }>({ cross: [], intra: [] });
  const lastEdgeBuild = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const titleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const iconCache = useRef<Record<string, HTMLImageElement>>({});

  const meshEdges = useMemo(() => buildMeshEdges(nodes), [nodes]);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Img = window.Image;
    const cache: Record<string, HTMLImageElement> = {};
    nodes.forEach((node) => {
      const img = new Img();
      img.src = node.iconSrc;
      cache[node.id] = img;
    });
    iconCache.current = cache;
  }, [nodes]);

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

  useEffect(() => {
    const measure = () => {
      const padX = isMobile ? 44 : 60;
      const padY = isMobile ? 28 : 34;
      const rects = categories.map((category) => {
        const el = titleRefs.current[category.id];
        if (el) {
          const r = el.getBoundingClientRect();
          return { id: category.id, width: r.width + padX, height: r.height + padY };
        }
        return { id: category.id, width: 220, height: 60 };
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
    categories.forEach((category) => {
      map[category.id] = { x: category.anchor.x * size.w, y: category.anchor.y * size.h };
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
    onFrame: ({ nodes: state, hoverId: frameHover, time }) => {
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
      const paddedRects = categories.map((category) => {
        const rect = categoryRects.find((r) => r.id === category.id);
        const w = rect?.width ?? 220;
        const h = rect?.height ?? 60;
        const cx = category.anchor.x * size.w;
        const cy = category.anchor.y * size.h;
        return { id: category.id, x: cx - w / 2, y: cy - h / 2, width: w, height: h };
      });

      const positions = state.map((node) => ({
        id: node.node.id,
        x: node.x,
        y: node.y,
        category: node.node.category,
        tier: node.node.tier,
      }));

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
      const posMap = new Map(state.map((node) => [node.node.id, node]));
      const neighborMap: Record<string, Set<string>> = {};
      const addNeighbor = (a: string, b: string) => {
        if (!neighborMap[a]) neighborMap[a] = new Set();
        neighborMap[a].add(b);
      };
      allEdges.forEach((link) => {
        addNeighbor(link.sourceId, link.targetId);
        addNeighbor(link.targetId, link.sourceId);
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

      ctx.lineWidth = 0.6;
      for (const link of meshEdges) {
        const a = posMap.get(link.sourceId);
        const b = posMap.get(link.targetId);
        if (!a || !b) continue;
        const intersects = paddedRects.some((rect) =>
          segmentIntersectsRect(a.x, a.y, b.x, b.y, rect.x, rect.y, rect.width, rect.height),
        );
        if (intersects) continue;
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.065)" : "rgba(15,23,42,0.08)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const edge of categoryBackbone) {
        const a = categories.find((c) => c.id === edge.a);
        const b = categories.find((c) => c.id === edge.b);
        if (!a || !b) continue;
        const ax = a.anchor.x * size.w;
        const ay = a.anchor.y * size.h;
        const bx = b.anchor.x * size.w;
        const by = b.anchor.y * size.h;
        const intersects = paddedRects.some((rect) => segmentIntersectsRect(ax, ay, bx, by, rect.x, rect.y, rect.width, rect.height));
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

      ctx.lineWidth = 0.85;
      for (const link of crossEdges) {
        const a = posMap.get(link.sourceId);
        const b = posMap.get(link.targetId);
        if (!a || !b) continue;
        const intersects = paddedRects.some((rect) =>
          segmentIntersectsRect(a.x, a.y, b.x, b.y, rect.x, rect.y, rect.width, rect.height),
        );
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

      const breathe =
        (viewportMode === "mobile" ? 0.02 : viewportMode === "tablet" ? 0.03 : 0.04) *
        Math.sin(time * 0.0015);
      ctx.lineWidth = 0.65;
      for (const link of intraEdges) {
        const a = posMap.get(link.sourceId);
        const b = posMap.get(link.targetId);
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

      for (const node of state) {
        const isHover = node.node.id === activeHover;
        const rBase = node.r * (node.node.tier === "primary" ? 1.05 : 0.95);
        const r = isHover ? rBase * 1.18 : rBase;
        const dim = connectedSet && !connectedSet.has(node.node.id) ? 0.45 : 1;
        const tone = dim * visibilityScale;
        ctx.save();
        ctx.translate(node.x, node.y);
        const shadowBlur =
          node.node.tier === "primary"
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

        const img = iconCache.current[node.node.id];
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

  const activeCategory = hoverId ? nodes.find((node) => node.id === hoverId)?.category ?? null : null;

  const onPointerMove = (event: React.PointerEvent) => {
    if (!allowPointer) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const onPointerLeave = () => {
    pointerRef.current = null;
  };

  useEffect(() => {
    if (!allowPointer) {
      pointerRef.current = null;
    }
  }, [allowPointer]);

  useEffect(() => {
    if (!hoverId) {
      setTooltip(null);
      return;
    }
    const node = nodes.find((entry) => entry.id === hoverId);
    const simNode = nodesRef.current.find((entry) => entry.node.id === hoverId);
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

  return (
    <>
      <div className="relative w-full">
        <div className="flex items-start justify-between mb-6 md:mb-8 px-1">
          <h2
            className="text-2xl md:text-3xl font-semibold"
            data-parallax="title"
            data-speed="0.26"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            {t("skills.label")}
          </h2>
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
          <canvas ref={canvasRef} className="block w-full h-full" style={{ minHeight: isMobile ? "280px" : "360px" }} />

          <div className="pointer-events-none absolute inset-0">
            {categories.map((category) => {
              const label = (lang === "es" ? category.labelES : category.labelEN).toUpperCase();
              const lines = titleLines[category.id as keyof typeof titleLines] ?? [label];
              return (
                <div
                  key={category.id}
                  ref={(el) => {
                    titleRefs.current[category.id] = el;
                  }}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${category.anchor.x * 100}%`,
                    top: `${category.anchor.y * 100}%`,
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
                            activeCategory === category.id
                              ? categoryColors[category.id as keyof typeof categoryColors]?.title ?? neutralTitle
                              : neutralTitle,
                          textShadow:
                            activeCategory === category.id && isDark
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
    </>
  );
}
