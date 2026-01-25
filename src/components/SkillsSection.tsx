"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";
import { skillCategories, skillCrossLinks, skillNodes } from "@/data/skillsData";
import { useNetworkSimulation } from "@/hooks/useNetworkSimulation";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const iconCache = useRef<Record<string, HTMLImageElement>>({});

  const nodes = useMemo(() => skillNodes, []);
  const categories = useMemo(() => skillCategories, []);
  const links = useMemo(() => skillCrossLinks, []);

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

  const { hoverId, nodesRef } = useNetworkSimulation({
    nodes,
    categories,
    links,
    width: size.w,
    height: size.h,
    pointerRef,
    isMobile,
    onFrame: ({ nodes: state }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, size.w, size.h);
      const lineColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
      const glowColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.14)";

      // Lines (sparse)
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const link of links) {
        const a = state.find((n) => n.node.id === link.sourceId);
        const b = state.find((n) => n.node.id === link.targetId);
        if (!a || !b) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      // Nodes
      for (const n of state) {
        const isHover = n.node.id === hoverId;
        const r = isHover ? n.r * 1.18 : n.r;
        ctx.save();
        ctx.translate(n.x, n.y);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.4);
        grad.addColorStop(0, isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.12)";
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // icon
        const img = iconCache.current[n.node.id];
        if (img && img.complete) {
          const sizePx = r * 1.35;
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(img, -sizePx / 2, -sizePx / 2, sizePx, sizePx);
        }
        ctx.restore();
      }
    },
  });

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

  return (
    <section
      id="skills"
      className="relative min-h-[60vh] flex items-center justify-center px-4 md:px-5 py-12 md:py-14 overflow-hidden"
      style={{ cursor: "none" }}
    >
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto">
        <div
          className="flex items-start justify-between mb-6 md:mb-8 px-1"
          style={{ color: isDark ? "#e5e7eb" : "#0f172a" }}
        >
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">{t("skills.label")}</h2>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-[18px] shadow-xl"
          style={{
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.08)",
            background: isDark ? "rgba(14, 18, 33, 0.65)" : "rgba(255,255,255,0.65)",
            boxShadow: isDark ? "0 24px 70px rgba(0,0,0,0.5)" : "0 24px 70px rgba(15,23,42,0.15)",
            backdropFilter: "blur(16px) saturate(140%)",
            WebkitBackdropFilter: "blur(16px) saturate(140%)",
          }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <canvas ref={canvasRef} className="block w-full h-full" style={{ minHeight: "360px" }} />

          {/* Cluster labels */}
          <div className="pointer-events-none absolute inset-0">
            {categories.map((c) => (
              <div
                key={c.id}
                className="absolute text-[10px] md:text-xs uppercase tracking-[0.24em]"
                style={{
                  left: `${c.anchor.x * 100}%`,
                  top: `${c.anchor.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                  color: isDark ? "rgba(226,232,240,0.7)" : "rgba(15,23,42,0.55)",
                }}
              >
                {lang === "es" ? c.labelES : c.labelEN}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute px-2.5 py-1.5 rounded-full text-xs font-medium"
              style={{
                left: tooltip.x,
                top: tooltip.y - 18,
                transform: "translate(-50%, -100%)",
                background: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)",
                border: isDark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.12)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
                color: isDark ? "#e5e7eb" : "#0f172a",
              }}
            >
              {tooltip.name}
            </div>
          )}
        </div>
      </div>

      {srList}
    </section>
  );
}
