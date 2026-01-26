"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import { skillCategories, skillCrossLinks, skillNodes, type SkillLink } from "@/data/skillsData";
import { useNetworkSimulation } from "@/hooks/useNetworkSimulation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { buildCategoryBackbone, buildSkillEdges } from "@/utils/skillsGraph";

type TooltipState = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export default function SkillsSection() {
  const { theme } = useTheme();
  const { lang, t } = useI18n();
  const isDark = theme === "dark";
  const revealRef = useScrollReveal<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
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
  const heroPalette = ["#a855f7", "#22c55e", "#38bdf8", "#fb923c", "#67e8f9", "#f472b6"];
  const categoryColors = useMemo(() => {
    const map: Record<string, { title: string }> = {};
    const ids = ["software", "frontend", "data", "db", "cloud", "automation"];
    ids.forEach((id, idx) => {
      const base = heroPalette[idx % heroPalette.length];
      map[id] = {
        title: isDark ? "rgba(255,255,255,0.92)" : base,
      };
    });
    return map;
  }, [isDark]);
  const neutralTitle = isDark ? "rgba(226,232,240,0.9)" : "rgba(15,23,42,0.88)";
  // Preload icons
  useEffect(() => {
    const cache: Record<string, HTMLImageElement> = {};
    skillNodes.forEach((n) => {
      const img = new Image();
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
        setSize({ w: rect.width, h: Math.max(320, rect.width * 0.6) });
        setIsMobile(window.innerWidth < 768);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    lastEdgeBuild.current = 0;
  }, [size.w, size.h, isMobile]);

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
    isMobile,
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
      const paddedRects = categories.map((c) => {
        const rect = categoryRects.find((r) => r.id === c.id);
        const w = rect?.width ?? 220;
        const h = rect?.height ?? 60;
        const cx = c.anchor.x * size.w;
        const cy = c.anchor.y * size.h;
        return { id: c.id, x: cx - w / 2, y: cy - h / 2, width: w, height: h };
      });

      const positions = state.map((n) => ({
        id: n.node.id,
        x: n.x,
        y: n.y,
        category: n.node.category,
        tier: n.node.tier,
      }));

      // rebuild edges occasionally (not every frame) to reduce churn
      if (!lastEdgeBuild.current || time - lastEdgeBuild.current > 1200) {
        edgesRef.current = buildSkillEdges(positions, links, {
          maxCross: isMobile ? 80 : 160,
          kPrimary: isMobile ? 2 : 4,
          kSecondary: isMobile ? 1 : 3,
          paddedRects,
          categories,
        });
        lastEdgeBuild.current = time;
      }

      const { cross: crossEdges, intra: intraEdges } = edgesRef.current;
      const allEdges = [...crossEdges, ...intraEdges];
      const posMap = new Map(state.map((n) => [n.node.id, n]));
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

      // Global mesh (very faint, behind everything, deterministic)
      ctx.lineWidth = 0.6;
      for (const link of meshEdges) {
        const a = posMap.get(link.sourceId);
        const b = posMap.get(link.targetId);
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
        const a = posMap.get(link.sourceId);
        const b = posMap.get(link.targetId);
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
        alpha = Math.min(0.38, alpha * boost);
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(15,23,42,${alpha + 0.03})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Intra edges (weak mesh)
      const breathe = 0.04 * Math.sin(time * 0.0015);
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
        alpha = Math.min(0.16, alpha * boost);
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
        ctx.save();
        ctx.translate(n.x, n.y);
        const shadowBlur = n.node.tier === "primary" ? (isMobile ? 12 : 18) : isMobile ? 8 : 12;
        ctx.shadowColor = isDark ? `rgba(255,255,255,${0.14 * dim})` : `rgba(15,23,42,${0.16 * dim})`;
        ctx.shadowBlur = shadowBlur;
        ctx.fillStyle = isDark ? `rgba(255,255,255,${0.07 * dim})` : `rgba(15,23,42,${0.07 * dim})`;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${0.22 * dim})` : `rgba(15,23,42,${0.2 * dim})`;
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
  const activeCategory = useMemo(() => {
    const node = hoverId ? nodes.find((n) => n.id === hoverId) : null;
    return node?.category ?? null;
  }, [hoverId, nodes]);

  // Tooltip follow
  useEffect(() => {
    if (!hoverId) {
      setTooltip(null);
      return;
    }
    const node = nodes.find((n) => n.id === hoverId);
    const simNode = nodesRef.current.find((n) => n.node.id === hoverId);
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

  // Pointer handlers
  const onPointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const onPointerLeave = () => {
    pointerRef.current = null;
  };

  const tooltipNode =
    tooltip && typeof window !== "undefined"
      ? createPortal(
          (() => {
            const padding = 12;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            let x = tooltip.x;
            let y = tooltip.y - 18;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              x = rect.left + tooltip.x;
              y = rect.top + tooltip.y - 18;
            }
            if (y < padding) {
              y = (rect ? rect.top + tooltip.y : tooltip.y) + 18;
            }
            x = Math.min(vw - padding, Math.max(padding, x));
            y = Math.min(vh - padding, Math.max(padding, y));

            return (
              <div
                className="pointer-events-none fixed px-2.5 py-1.5 rounded-full text-xs font-medium"
                style={{
                  left: x,
                  top: y,
                  transform: "translate(-50%, -100%)",
                  background: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)",
                  border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.12)",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
                  color: isDark ? "#e5e7eb" : "#0f172a",
                  zIndex: 30000,
                }}
              >
                {tooltip.name}
              </div>
            );
          })(),
          document.body,
        )
      : null;

  const srList = (
    <div className="sr-only" aria-hidden="false">
      <p>{t("skills.label")}</p>
      <ul>
        {nodes.map((n) => (
          <li key={n.id}>{lang === "es" ? n.nameES : n.nameEN}</li>
        ))}
      </ul>
    </div>
  );

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
          <canvas ref={canvasRef} className="block w-full h-full" style={{ minHeight: "360px" }} />

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
