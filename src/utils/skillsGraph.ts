"use client";

import type { SkillCategory, SkillLink, SkillNode } from "@/data/skillsData";

export function buildCategoryBackbone(
  categories: SkillCategory[],
  nodes: SkillNode[],
  crossLinks: SkillLink[],
  topN: number,
  ensureAll = false,
) {
  const counts: Record<string, number> = {};
  crossLinks.forEach((l) => {
    const a = nodes.find((n) => n.id === l.sourceId);
    const b = nodes.find((n) => n.id === l.targetId);
    if (!a || !b || a.category === b.category) return;
    const key = [a.category, b.category].sort().join("__");
    const weight = (l as any).weight ?? 1;
    counts[key] = (counts[key] || 0) + weight;
  });
  const fallbackWeight = 0.2;
  const pairKeys = ensureAll
    ? categories.flatMap((cat, i) => categories.slice(i + 1).map((c2) => [cat.id, c2.id].sort().join("__")))
    : Object.keys(counts);
  const pairs = pairKeys
    .map((key) => ({ key, weight: counts[key] ?? (ensureAll ? fallbackWeight : 0) }))
    .filter((p) => p.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, topN)
    .map((entry) => {
      const [a, b] = entry.key.split("__");
      return { a, b, weight: entry.weight };
    });
  if (!pairs.length) return [];
  const minW = Math.min(...pairs.map((p) => p.weight));
  const maxW = Math.max(...pairs.map((p) => p.weight));
  return pairs.map((p) => ({
    a: p.a,
    b: p.b,
    norm: maxW === minW ? 1 : (p.weight - minW) / (maxW - minW),
  }));
}

export function buildSkillEdges(
  positions: Array<{ id: string; x: number; y: number; category: string; tier?: string }>,
  crossLinks: SkillLink[],
  opts: {
    maxCross: number;
    kPrimary: number;
    kSecondary: number;
    paddedRects: Array<{ id: string; x: number; y: number; width: number; height: number }>;
    categories: SkillCategory[];
  },
) {
  const { maxCross, kPrimary, kSecondary, paddedRects } = opts;

  const intersectsAny = (x1: number, y1: number, x2: number, y2: number) => {
    return paddedRects.some((r) => segmentIntersectsRect(x1, y1, x2, y2, r.x, r.y, r.width, r.height));
  };

  const cross: SkillLink[] = [];
  for (const l of crossLinks) {
    if (cross.length >= maxCross) break;
    const a = positions.find((p) => p.id === l.sourceId);
    const b = positions.find((p) => p.id === l.targetId);
    if (!a || !b) continue;
    cross.push(l);
  }

  const intra: SkillLink[] = [];
  const byCat: Record<string, typeof positions> = {};
  positions.forEach((p) => {
    if (!byCat[p.category]) byCat[p.category] = [];
    byCat[p.category].push(p);
  });

  Object.values(byCat).forEach((arr) => {
    arr.forEach((p, idx) => {
      const k = p.tier === "primary" ? kPrimary : kSecondary;
      const nearest = arr
        .map((o, j) => ({ o, d2: (p.x - o.x) ** 2 + (p.y - o.y) ** 2, j }))
        .filter((entry) => entry.j !== idx)
        .sort((a, b) => a.d2 - b.d2)
        .slice(0, k);
      nearest.forEach((entry) => {
        const key = [p.id, entry.o.id].sort().join("__");
        if (!intra.find((l) => [l.sourceId, l.targetId].sort().join("__") === key)) {
          intra.push({ sourceId: p.id, targetId: entry.o.id });
        }
      });
    });
  });

  const filteredIntra = intra.filter((l) => {
    const a = positions.find((p) => p.id === l.sourceId);
    const b = positions.find((p) => p.id === l.targetId);
    if (!a || !b) return false;
    return !intersectsAny(a.x, a.y, b.x, b.y);
  });

  return { cross, intra: filteredIntra };
}

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
