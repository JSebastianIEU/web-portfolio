"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { SkillCategory, SkillLink, SkillNode } from "@/data/skillsData";

type Vec = { x: number; y: number; vx: number; vy: number; node: SkillNode; r: number; mass: number; seed: number };

type CategoryRect = {
  id: string;
  width: number;
  height: number;
};

type SimulationParams = {
  nodes: SkillNode[];
  categories: SkillCategory[];
  categoryRects: CategoryRect[];
  links: SkillLink[];
  width: number;
  height: number;
  pointerRef: React.MutableRefObject<{ x: number; y: number } | null>;
  isMobile: boolean;
  titleAnchors?: Record<string, { x: number; y: number }>;
  onFrame?: (state: { nodes: Vec[]; hoverId: string | null; time: number }) => void;
};

const padX = 70;
const padY = 40;
const primaryBand = { min: 110, max: 170 };
const secondaryBand = { min: 210, max: 310 };
const radialBandStrength = 0.08;
const angleForceStrength = 0.01;
const jitterDeg = 8;
const otherAnchorRepelRadius = 220;
const otherAnchorRepelStrength = 0.00022;
const titleRepelStrength = 0.12;

// deterministic hash for seed
function hashString(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) / 4294967296;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useNetworkSimulation({
  nodes,
  categories,
  categoryRects,
  links,
  width,
  height,
  pointerRef,
  isMobile,
  titleAnchors,
  onFrame,
}: SimulationParams) {
  const nodesRef = useRef<Vec[]>([]);
  const hoverIdRef = useRef<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const neighborsRef = useRef<Record<string, Set<string>>>({});

  useEffect(() => {
    if (!width || !height) return;
    const neighbors: Record<string, Set<string>> = {};
    const add = (a: string, b: string) => {
      if (!neighbors[a]) neighbors[a] = new Set();
      neighbors[a].add(b);
    };
    links.forEach((l) => {
      add(l.sourceId, l.targetId);
      add(l.targetId, l.sourceId);
    });
    neighborsRef.current = neighbors;

    const totals: Record<string, number> = {};
    const sortedIdsByCat: Record<string, string[]> = {};
    nodes.forEach((n) => {
      totals[n.category] = (totals[n.category] || 0) + 1;
    });
    // deterministically sort ids per category for angular slots
    categories.forEach((c) => {
      sortedIdsByCat[c.id] = nodes
        .filter((n) => n.category === c.id)
        .map((n) => n.id)
        .sort((a, b) => (hashString(a) < hashString(b) ? -1 : 1));
    });
    const perCatIndex: Record<string, number> = {};

    const nextNodes: Vec[] = nodes.map((n) => {
      const cat = categories.find((c) => c.id === n.category) ?? categories[0];
      const seed = hashString(n.id);
      const rand = mulberry32(Math.floor(seed * 1e9));
      const totalInCat = totals[n.category] || 1;
      const idxInCat = perCatIndex[n.category] || 0;
      perCatIndex[n.category] = idxInCat + 1;

      const sortedIds = sortedIdsByCat[n.category] || [];
      const slotIndex = sortedIds.indexOf(n.id) >= 0 ? sortedIds.indexOf(n.id) : idxInCat;
      const catPhase = hashString(n.category) * Math.PI * 2;
      const spreadAngle = (slotIndex / totalInCat) * Math.PI * 2;
      const jitter = (rand() - 0.5) * (Math.PI / 18); // ~±10°
      const angle = catPhase + spreadAngle + jitter;

      const radiusBase = n.tier === "primary" ? 115 : 200;
      const radiusJitter = n.tier === "primary" ? 20 : 40;
      const r0 = radiusBase + (rand() - 0.5) * radiusJitter;
      const baseR = n.tier === "primary" ? 20 : 14;
      return {
        x: cat.anchor.x * width + Math.cos(angle) * r0,
        y: cat.anchor.y * height + Math.sin(angle) * r0,
        vx: 0,
        vy: 0,
        node: n,
        r: isMobile ? baseR * 0.9 : baseR,
        mass: n.tier === "primary" ? 1.6 : 1,
        seed,
      };
    });
    nodesRef.current = nextNodes;
  }, [categories, height, isMobile, links, nodes, width]);

  useEffect(() => {
    if (!width || !height) return;
    let frame: number;

    const rectMap: Record<string, { w: number; h: number }> = {};
    categoryRects.forEach((r) => {
      rectMap[r.id] = { w: r.width, h: r.height };
    });

    const anchors: Record<string, { x: number; y: number }> = {};
    categories.forEach((c) => {
      anchors[c.id] = { x: c.anchor.x * width, y: c.anchor.y * height };
    });
    const titleCenters: Record<string, { x: number; y: number }> = {};
    if (titleAnchors) {
      Object.entries(titleAnchors).forEach(([id, val]) => {
        titleCenters[id] = val;
      });
    } else {
      categories.forEach((c) => {
        titleCenters[c.id] = { x: c.anchor.x * width, y: c.anchor.y * height };
      });
    }

    const boundsPad = 24;
    const stiffness = isMobile ? 0.04 : 0.046;
    const linkK = 0; // edges are visual-only
    const damping = isMobile ? 0.975 : 0.97;
    const repulseRadius = isMobile ? 60 : 80;
    const repulseForce = 0.0002; // cursor influence minimal
    const ringPrimary = 115;
    const ringSecondary = 200;
    const maxVel = isMobile ? 0.3 : 0.4;
    const angleForce = angleForceStrength;
    const jitterRad = (jitterDeg * Math.PI) / 180;

    const gridSize = 80;
    const freezeMotion = false;

    const step = () => {
      const arr = nodesRef.current;
      const grid: Record<string, Vec[]> = {};
      const cellKey = (x: number, y: number) => `${Math.floor(x / gridSize)}:${Math.floor(y / gridSize)}`;
      for (const n of arr) {
        const key = cellKey(n.x, n.y);
        if (!grid[key]) grid[key] = [];
        grid[key].push(n);
      }

      const time = performance.now() * 0.001;
      const hoveredId = hoverIdRef.current;
      const neighborSet = hoveredId ? neighborsRef.current[hoveredId] : undefined;

      for (const n of arr) {
        const isHovered = hoveredId === n.node.id;
        const isNeighbor = neighborSet?.has(n.node.id);
        const anchor = anchors[n.node.category] ?? { x: width * 0.5, y: height * 0.5 };

        if (freezeMotion) {
          n.vx = 0;
          n.vy = 0;
          n.x = Math.min(width - boundsPad, Math.max(boundsPad, n.x));
          n.y = Math.min(height - boundsPad, Math.max(boundsPad, n.y));
          continue;
        }

        // anchor pull
        let ax = 0;
        let ay = 0;
        if (!isHovered) {
          const anchorFactor = n.node.tier === "primary" ? 2.2 : 1.8;
          ax = (anchor.x - n.x) * stiffness * anchorFactor;
          ay = (anchor.y - n.y) * stiffness * anchorFactor;
        }

        // ring band force
        const dxAnchor = n.x - anchor.x;
        const dyAnchor = n.y - anchor.y;
        const distAnchor = Math.hypot(dxAnchor, dyAnchor) || 1;
        const band = n.node.tier === "primary" ? primaryBand : secondaryBand;
        if (!isHovered) {
          let radialForce = 0;
          if (distAnchor < band.min) {
            radialForce = (distAnchor - band.min) * radialBandStrength;
          } else if (distAnchor > band.max) {
            radialForce = (distAnchor - band.max) * radialBandStrength;
          } else {
            const mid = (band.min + band.max) * 0.5;
            radialForce = (distAnchor - mid) * (radialBandStrength * 0.35);
          }
          ax += (-dxAnchor / distAnchor) * radialForce;
          ay += (-dyAnchor / distAnchor) * radialForce;
        }

        // angular slot correction (even spacing per category+tier)
        if (!isHovered) {
          const sameTier = nodes.filter((nn) => nn.category === n.node.category && nn.tier === n.node.tier);
          const sortedIds = sameTier.map((nn) => nn.id).sort((a, b) => (hashString(a) < hashString(b) ? -1 : 1));
          const slotIndex = Math.max(0, sortedIds.indexOf(n.node.id));
          const totalSlots = Math.max(1, sortedIds.length);
          const baseAngle = hashString(n.node.category) * Math.PI * 2;
          const targetAngle = baseAngle + (slotIndex / totalSlots) * Math.PI * 2;
          const radiusTarget = n.node.tier === "primary" ? (primaryBand.min + primaryBand.max) * 0.5 : (secondaryBand.min + secondaryBand.max) * 0.5;
          const jitterA = (hashString(n.node.id) - 0.5) * 2 * jitterRad;
          const desiredX = anchor.x + Math.cos(targetAngle + jitterA) * radiusTarget;
          const desiredY = anchor.y + Math.sin(targetAngle + jitterA) * radiusTarget;
          const slotDx = desiredX - n.x;
          const slotDy = desiredY - n.y;
          ax += slotDx * angleForce;
          ay += slotDy * angleForce;
        }

        // title exclusion (use title center, not cluster anchor) with strong padding
        const rect = rectMap[n.node.category];
        const titleCenter = titleCenters[n.node.category];
        if (rect && titleCenter) {
          const halfW = rect.w * 0.5 + 70;
          const halfH = rect.h * 0.5 + 40;
          if (Math.abs(n.x - titleCenter.x) < halfW && Math.abs(n.y - titleCenter.y) < halfH) {
            const pushX = (halfW - Math.abs(n.x - titleCenter.x)) * 0.12;
            const pushY = (halfH - Math.abs(n.y - titleCenter.y)) * 0.12;
            ax += n.x > titleCenter.x ? pushX : -pushX;
            ay += n.y > titleCenter.y ? pushY : -pushY;
          }
        }

        // inter-cluster repulsion (push away from other category anchors)
        for (const [catId, otherAnchor] of Object.entries(anchors)) {
          if (catId === n.node.category) continue;
          const dx = n.x - otherAnchor.x;
          const dy = n.y - otherAnchor.y;
          const dist2 = dx * dx + dy * dy;
          const limit = otherAnchorRepelRadius ** 2;
          if (dist2 < limit && dist2 > 0.001) {
            const dist = Math.sqrt(dist2);
            const repel = (limit - dist2) * otherAnchorRepelStrength;
            ax += (dx / dist) * repel;
            ay += (dy / dist) * repel;
          }
        }

        // collision with grid neighbors
        const keyX = Math.floor(n.x / gridSize);
        const keyY = Math.floor(n.y / gridSize);
        for (let gx = keyX - 1; gx <= keyX + 1; gx++) {
          for (let gy = keyY - 1; gy <= keyY + 1; gy++) {
            const key = `${gx}:${gy}`;
            const bucket = grid[key];
            if (!bucket) continue;
            for (const o of bucket) {
              if (o === n) continue;
              const dx = n.x - o.x;
              const dy = n.y - o.y;
              const dist2 = dx * dx + dy * dy;
              const minDist = (n.r + o.r + 20) ** 2;
              if (dist2 < minDist && dist2 > 0.01) {
                const dist = Math.sqrt(dist2);
                const push = (minDist - dist2) * 0.003;
                ax += (dx / dist) * push;
                ay += (dy / dist) * push;
              }
            }
          }
        }

        // pointer repulsion
        const pointer = pointerRef.current;
        if (pointer && !isHovered) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < repulseRadius * repulseRadius) {
            const dist = Math.sqrt(dist2) || 1;
            const force = (repulseRadius - dist) * repulseForce;
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
          }
        }

        // micro motion (deterministic)
        const micro = isMobile ? 0.003 : 0.0045;
        if (!isHovered && !isNeighbor) {
          ax += Math.sin(time * 0.6 + n.seed * 10) * micro;
          ay += Math.cos(time * 0.5 + n.seed * 12) * micro;
        }

        const damp = isNeighbor ? damping * 0.82 : damping;

        n.vx = isHovered ? 0 : (n.vx + ax / n.mass) * damp;
        n.vy = isHovered ? 0 : (n.vy + ay / n.mass) * damp;

        // clamp velocity
        const speed = Math.hypot(n.vx, n.vy);
        if (speed > maxVel) {
          n.vx = (n.vx / speed) * maxVel;
          n.vy = (n.vy / speed) * maxVel;
        }

        n.x += n.vx;
        n.y += n.vy;

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
          const hitRadius = (n.r + 4) ** 2;
          if (dist2 < best && dist2 < hitRadius) {
            best = dist2;
            nextHover = n.node.id;
          }
        }
      }
      if (nextHover !== hoverIdRef.current) {
        hoverIdRef.current = nextHover;
        setHoverId(nextHover);
      }

      onFrame?.({ nodes: nodesRef.current, hoverId: hoverIdRef.current, time: performance.now() });
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [categories, categoryRects, height, isMobile, links, onFrame, pointerRef, titleAnchors, width]);

  return { nodesRef, hoverId };
}
