"use client";

import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { SkillCategory, SkillLink, SkillNode } from "@/domain/skills";

type Vec = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  node: SkillNode;
  r: number;
  mass: number;
  seed: number;
  /** Precomputed angular slot (category phase + per-tier spacing + jitter). */
  slotAngle: number;
  /** Precomputed target ring radius (band mid for the node's tier). */
  slotRadius: number;
};

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
  pointerRef: MutableRefObject<{ x: number; y: number } | null>;
  viewport: "mobile" | "tablet" | "desktop";
  titleAnchors?: Record<string, { x: number; y: number }>;
  onFrame?: (state: { nodes: Vec[]; hoverId: string | null; time: number }) => void;
};

const padX = 70;
const padY = 40;
// Wider, softer rings: more spread within each cluster while staying grouped.
const primaryBand = { min: 105, max: 195 };
const secondaryBand = { min: 225, max: 360 };
// Portrait phones get compact absolute rings: the desktop bands (even scaled)
// would overrun the 2x3 cluster grid on a ~390px-wide stage.
const primaryBandMobile = { min: 56, max: 98 };
const secondaryBandMobile = { min: 112, max: 172 };
const radialBandStrength = 0.05;
const angleForceStrength = 0.008;
const jitterDeg = 14;
const otherAnchorRepelRadius = 230;
const otherAnchorRepelStrength = 0.0002;
const titleRepelStrength = 0.12;
const maxAccelDesktop = 0.15;
const maxAccelMobile = 0.12;
const cursorRadiusDesktop = 200;
const cursorRadiusTablet = 170;
const cursorRadiusMobile = 150;
const cursorStrengthDesktop = 0.12;
const cursorStrengthTablet = 0.1;
const cursorStrengthMobile = 0.08;
const microMotionAmp = { desktop: 0.02, tablet: 0.014, mobile: 0.008 };

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
  viewport,
  titleAnchors,
  onFrame,
}: SimulationParams) {
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";
  const nodesRef = useRef<Vec[]>([]);
  const hoverIdRef = useRef<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const neighborsRef = useRef<Record<string, Set<string>>>({});
  const cursorSmooth = useRef<{ x: number; y: number } | null>(null);
  const sleepCounter = useRef<Record<string, number>>({});
  const lastTimeRef = useRef<number>(0);

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

    // Precompute deterministic angular slots per category+tier so the
    // per-frame loop never sorts or filters (this was the main jank source).
    const pBand = isMobile ? primaryBandMobile : primaryBand;
    const sBand = isMobile ? secondaryBandMobile : secondaryBand;
    const jitterRad = (jitterDeg * Math.PI) / 180;
    const sortedIdsByCatTier: Record<string, string[]> = {};
    nodes.forEach((n) => {
      const key = `${n.category}:${n.tier}`;
      if (!sortedIdsByCatTier[key]) {
        sortedIdsByCatTier[key] = nodes
          .filter((nn) => nn.category === n.category && nn.tier === n.tier)
          .map((nn) => nn.id)
          .sort((a, b) => (hashString(a) < hashString(b) ? -1 : 1));
      }
    });

    const nextNodes: Vec[] = nodes.map((n) => {
      const cat = categories.find((c) => c.id === n.category) ?? categories[0];
      const seed = hashString(n.id);
      const rand = mulberry32(Math.floor(seed * 1e9));

      const sortedIds = sortedIdsByCatTier[`${n.category}:${n.tier}`] || [];
      const slotIndex = Math.max(0, sortedIds.indexOf(n.id));
      const totalSlots = Math.max(1, sortedIds.length);
      const catPhase = hashString(n.category) * Math.PI * 2;
      const jitterA = (seed - 0.5) * 2 * jitterRad;
      const slotAngle = catPhase + (slotIndex / totalSlots) * Math.PI * 2 + jitterA;

      const band = n.tier === "primary" ? pBand : sBand;
      // Mobile bands are already absolute; tablet compresses the desktop ones.
      const ringScale = isMobile ? 1 : isTablet ? 0.92 : 1;
      const nodeScale = isMobile ? 0.78 : isTablet ? 0.92 : 1;
      // Scatter targets across the band (not just its midline) for a more
      // organic, spread-out cluster.
      const slotRadius = (band.min + (band.max - band.min) * (0.25 + rand() * 0.6)) * ringScale;

      const baseR = n.tier === "primary" ? 20 : 14;
      return {
        x: cat.anchor.x * width + Math.cos(slotAngle) * slotRadius,
        y: cat.anchor.y * height + Math.sin(slotAngle) * slotRadius,
        vx: 0,
        vy: 0,
        node: n,
        r: baseR * nodeScale,
        mass: n.tier === "primary" ? 1.6 : 1,
        seed,
        slotAngle,
        slotRadius,
      };
    });
    nodesRef.current = nextNodes;
  }, [categories, height, isMobile, isTablet, links, nodes, width]);

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
    const stiffness = isMobile ? 0.032 : isTablet ? 0.037 : 0.039;
    const damping = isMobile ? 0.982 : isTablet ? 0.976 : 0.97;
    const maxVelCap = isMobile ? 0.28 : isTablet ? 0.34 : 0.42;
    const angleForce = angleForceStrength;
    const bandScale = isMobile ? 1 : isTablet ? 0.92 : 1;
    const stepPBand = isMobile ? primaryBandMobile : primaryBand;
    const stepSBand = isMobile ? secondaryBandMobile : secondaryBand;
    // The 2x3 mobile grid packs anchors closer, so cross-cluster repulsion
    // and title padding shrink with it.
    const repelRadius = isMobile ? 120 : otherAnchorRepelRadius;
    const titlePadX = isMobile ? 40 : padX;
    const titlePadY = isMobile ? 24 : padY;

    const gridSize = isMobile ? 120 : isTablet ? 100 : 80;
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

      const now = performance.now();
      const dt = Math.min(Math.max((now - lastTimeRef.current) / 1000, 0), 1 / 30);
      lastTimeRef.current = now;
      const fixedDt = 1 / 60;

      const time = now * 0.001;
      const hoveredId = hoverIdRef.current;
      const neighborSet = hoveredId ? neighborsRef.current[hoveredId] : undefined;

      // smooth cursor
      const rawCursor = pointerRef.current;
      if (rawCursor) {
        const prev = cursorSmooth.current || rawCursor;
        cursorSmooth.current = {
          x: prev.x + (rawCursor.x - prev.x) * 0.16,
          y: prev.y + (rawCursor.y - prev.y) * 0.16,
        };
      } else {
        cursorSmooth.current = null;
      }

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
          const anchorFactor = n.node.tier === "primary" ? 1.7 : 1.25;
          ax = (anchor.x - n.x) * stiffness * anchorFactor;
          ay = (anchor.y - n.y) * stiffness * anchorFactor;
        }

        // ring band force (soft: lets nodes drift within a wide band)
        const dxAnchor = n.x - anchor.x;
        const dyAnchor = n.y - anchor.y;
        const distAnchor = Math.hypot(dxAnchor, dyAnchor) || 1;
        const band = n.node.tier === "primary" ? stepPBand : stepSBand;
        const bandMin = band.min * bandScale;
        const bandMax = band.max * bandScale;
        if (!isHovered) {
          let radialForce = 0;
          if (distAnchor < bandMin) {
            radialForce = (distAnchor - bandMin) * radialBandStrength;
          } else if (distAnchor > bandMax) {
            radialForce = (distAnchor - bandMax) * radialBandStrength;
          } else {
            radialForce = (distAnchor - n.slotRadius) * (radialBandStrength * 0.2);
          }
          ax += (-dxAnchor / distAnchor) * radialForce;
          ay += (-dyAnchor / distAnchor) * radialForce;
        }

        // angular slot correction (precomputed; even spacing per category+tier)
        if (!isHovered) {
          const desiredX = anchor.x + Math.cos(n.slotAngle) * n.slotRadius;
          const desiredY = anchor.y + Math.sin(n.slotAngle) * n.slotRadius;
          ax += (desiredX - n.x) * angleForce;
          ay += (desiredY - n.y) * angleForce;
        }

        // title exclusion (use title center, not cluster anchor) with strong padding
        const rect = rectMap[n.node.category];
        const titleCenter = titleCenters[n.node.category];
        if (rect && titleCenter) {
          const halfW = rect.w * 0.5 + titlePadX;
          const halfH = rect.h * 0.5 + titlePadY;
          if (Math.abs(n.x - titleCenter.x) < halfW && Math.abs(n.y - titleCenter.y) < halfH) {
            const pushX = (halfW - Math.abs(n.x - titleCenter.x)) * titleRepelStrength;
            const pushY = (halfH - Math.abs(n.y - titleCenter.y)) * titleRepelStrength;
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
          const limit = repelRadius ** 2;
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
              const minDist = (n.r + o.r + 34) ** 2;
              if (dist2 < minDist && dist2 > 0.01) {
                const dist = Math.sqrt(dist2);
                const push = (minDist - dist2) * 0.0048;
                ax += (dx / dist) * push;
                ay += (dy / dist) * push;
              }
            }
          }
        }

        // pointer repulsion (smoothed)
        const pointer = cursorSmooth.current;
        if (pointer && !isHovered) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const radius = isMobile ? cursorRadiusMobile * 0.6 : isTablet ? cursorRadiusTablet : cursorRadiusDesktop;
          if (dist < radius) {
            const strength = isMobile ? cursorStrengthMobile * 0.4 : isTablet ? cursorStrengthTablet : cursorStrengthDesktop;
            const falloff = 1 - dist / radius;
            const baseForce = strength * falloff * falloff;
            // reduce influence if near band edges
            const distToAnchor = Math.hypot(n.x - anchor.x, n.y - anchor.y);
            const atEdge = distToAnchor < bandMin + 8 || distToAnchor > bandMax - 8;
            const scale = atEdge ? 0.35 : 1;
            const force = baseForce * scale;
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
          }
        }

        // micro motion (very subtle)
        const micro = isMobile ? microMotionAmp.mobile : isTablet ? microMotionAmp.tablet : microMotionAmp.desktop;
        if (!isHovered && !isNeighbor) {
          const nearTitle =
            rectMap[n.node.category] &&
            titleCenters[n.node.category] &&
            Math.abs(n.x - titleCenters[n.node.category].x) < (rectMap[n.node.category].w * 0.5 + titlePadX + 10) &&
            Math.abs(n.y - titleCenters[n.node.category].y) < (rectMap[n.node.category].h * 0.5 + titlePadY + 10);
          if (!nearTitle) {
            ax += Math.sin(time * 0.28 + n.seed * 8) * micro;
            ay += Math.cos(time * 0.21 + n.seed * 9) * micro;
          }
        }

        // clamp accel
        const maxAccel = isMobile ? maxAccelMobile : isTablet ? (maxAccelDesktop * 0.85) : maxAccelDesktop;
        const accelMag = Math.hypot(ax, ay);
        if (accelMag > maxAccel) {
          ax = (ax / accelMag) * maxAccel;
          ay = (ay / accelMag) * maxAccel;
        }

        const baseDamp = damping;
        const damp = Math.pow(baseDamp, dt * 60) * (isNeighbor ? 0.9 : 1);

        n.vx = isHovered ? 0 : (n.vx + (ax / n.mass) * fixedDt) * damp;
        n.vy = isHovered ? 0 : (n.vy + (ay / n.mass) * fixedDt) * damp;

        // clamp velocity
        const speed = Math.hypot(n.vx, n.vy);
        if (speed > maxVelCap) {
          n.vx = (n.vx / speed) * maxVelCap;
          n.vy = (n.vy / speed) * maxVelCap;
        }

        // keep gentle motion; disable sleep zeroing to avoid stuck nodes
        sleepCounter.current[n.node.id] = 0;

        // dt-scaled so speed is identical on 60Hz and 120Hz displays
        const frameScale = dt / fixedDt;
        n.x += n.vx * frameScale;
        n.y += n.vy * frameScale;

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
          const hitRadius = (n.r + 8) ** 2;
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
  }, [categories, categoryRects, height, isMobile, isTablet, links, nodes, onFrame, pointerRef, titleAnchors, width]);

  return { nodesRef, hoverId };
}
