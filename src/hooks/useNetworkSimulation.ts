"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { SkillCategory, SkillLink, SkillNode } from "@/data/skillsData";

type Vec = { x: number; y: number; vx: number; vy: number; node: SkillNode; r: number };

type SimulationParams = {
  nodes: SkillNode[];
  categories: SkillCategory[];
  links: SkillLink[];
  width: number;
  height: number;
  pointerRef: React.MutableRefObject<{ x: number; y: number } | null>;
  isMobile: boolean;
  onFrame?: (state: { nodes: Vec[]; hoverId: string | null }) => void;
};

export function useNetworkSimulation({
  nodes,
  categories,
  links,
  width,
  height,
  pointerRef,
  isMobile,
  onFrame,
}: SimulationParams) {
  const nodesRef = useRef<Vec[]>([]);
  const hoverIdRef = useRef<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    if (!width || !height) return;

    // Initialize nodes near their category anchors
    const nextNodes: Vec[] = nodes.map((n, i) => {
      const cat = categories.find((c) => c.id === n.category) ?? categories[0];
      const jitter = () => (Math.random() - 0.5) * 40;
      return {
        x: cat.anchor.x * width + jitter(),
        y: cat.anchor.y * height + jitter(),
        vx: 0,
        vy: 0,
        node: n,
        r: isMobile ? 14 : 16,
      };
    });
    nodesRef.current = nextNodes;
  }, [categories, height, isMobile, nodes, width]);

  useEffect(() => {
    if (!width || !height) return;
    let frame: number;

    const linkMap = [...links];
    // add gentle intra-category chain links
    const byCat: Record<string, Vec[]> = {};
    nodesRef.current.forEach((n) => {
      if (!byCat[n.node.category]) byCat[n.node.category] = [];
      byCat[n.node.category].push(n);
    });
    Object.values(byCat).forEach((arr) => {
      for (let i = 0; i < arr.length - 1; i++) {
        linkMap.push({ sourceId: arr[i].node.id, targetId: arr[i + 1].node.id });
      }
    });

    const linkPairs = linkMap
      .map((l) => {
        const a = nodesRef.current.find((n) => n.node.id === l.sourceId);
        const b = nodesRef.current.find((n) => n.node.id === l.targetId);
        if (a && b) return { a, b };
        return null;
      })
      .filter(Boolean) as { a: Vec; b: Vec }[];

    const anchors: Record<string, { x: number; y: number }> = {};
    categories.forEach((c) => {
      anchors[c.id] = { x: c.anchor.x * width, y: c.anchor.y * height };
    });

    const boundsPad = 36;
    const stiffness = isMobile ? 0.02 : 0.03;
    const linkK = isMobile ? 0.015 : 0.02;
    const damping = isMobile ? 0.9 : 0.88;
    const repulseRadius = isMobile ? 48 : 64;

    const step = () => {
      const arr = nodesRef.current;

      for (const n of arr) {
        const anchor = anchors[n.node.category] ?? { x: width * 0.5, y: height * 0.5 };
        let ax = (anchor.x - n.x) * stiffness;
        let ay = (anchor.y - n.y) * stiffness;

        // link springs
        for (const { a, b } of linkPairs) {
          if (a !== n && b !== n) continue;
          const other = a === n ? b : a;
          const dx = other.x - n.x;
          const dy = other.y - n.y;
          const dist = Math.hypot(dx, dy) || 1;
          const ideal = 90;
          const k = linkK;
          const f = (dist - ideal) * k;
          ax += (dx / dist) * f;
          ay += (dy / dist) * f;
        }

        // gentle repulsion from others
        for (const o of arr) {
          if (o === n) continue;
          const dx = n.x - o.x;
          const dy = n.y - o.y;
          const dist2 = dx * dx + dy * dy;
          const minDist = (n.r + o.r + 6) ** 2;
          if (dist2 < minDist && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const push = (minDist - dist2) * 0.0008;
            ax += (dx / dist) * push;
            ay += (dy / dist) * push;
          }
        }

        // pointer repulsion
        const pointer = pointerRef.current;
        if (pointer) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < repulseRadius * repulseRadius) {
            const dist = Math.sqrt(dist2) || 1;
            const force = (repulseRadius - dist) * 0.003;
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
          }
        }

        n.vx = (n.vx + ax) * damping;
        n.vy = (n.vy + ay) * damping;
        n.x += n.vx;
        n.y += n.vy;

        // bounds
        n.x = Math.min(width - boundsPad, Math.max(boundsPad, n.x));
        n.y = Math.min(height - boundsPad, Math.max(boundsPad, n.y));
      }

      // hover detection
      let nextHover: string | null = null;
      const pointer = pointerRef.current;
      if (pointer) {
        let best = Infinity;
        for (const n of nodesRef.current) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < best && dist2 < (isMobile ? 900 : 1200)) {
            best = dist2;
            nextHover = n.node.id;
          }
        }
      }
      if (nextHover !== hoverIdRef.current) {
        hoverIdRef.current = nextHover;
        setHoverId(nextHover);
      }

      onFrame?.({ nodes: nodesRef.current, hoverId: hoverIdRef.current });
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [categories, height, isMobile, links, onFrame, pointerRef, width]);

  return { nodesRef, hoverId };
}
