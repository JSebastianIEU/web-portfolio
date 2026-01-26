import type {
  CategoryBackboneEdge,
  PositionedSkillNode,
  SkillCategory,
  SkillEdge,
  SkillLink,
  SkillNode,
} from "./types";

export function buildCategoryBackbone(
  categories: SkillCategory[],
  nodes: SkillNode[],
  crossLinks: SkillLink[],
  topN: number,
  ensureAll = false,
): CategoryBackboneEdge[] {
  const counts: Record<string, number> = {};
  crossLinks.forEach((link) => {
    const a = nodes.find((node) => node.id === link.sourceId);
    const b = nodes.find((node) => node.id === link.targetId);
    if (!a || !b || a.category === b.category) return;
    const key = [a.category, b.category].sort().join("__");
    const weight = (link as { weight?: number }).weight ?? 1;
    counts[key] = (counts[key] || 0) + weight;
  });

  const fallbackWeight = 0.2;
  const pairKeys = ensureAll
    ? categories.flatMap((cat, idx) =>
        categories.slice(idx + 1).map((other) => [cat.id, other.id].sort().join("__")),
      )
    : Object.keys(counts);

  const pairs = pairKeys
    .map((key) => ({ key, weight: counts[key] ?? (ensureAll ? fallbackWeight : 0) }))
    .filter((pair) => pair.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, topN)
    .map((entry) => {
      const [a, b] = entry.key.split("__");
      return { a, b, weight: entry.weight };
    });

  if (!pairs.length) return [];

  const minWeight = Math.min(...pairs.map((pair) => pair.weight));
  const maxWeight = Math.max(...pairs.map((pair) => pair.weight));

  return pairs.map((pair) => ({
    a: pair.a as SkillCategory["id"],
    b: pair.b as SkillCategory["id"],
    norm: maxWeight === minWeight ? 1 : (pair.weight - minWeight) / (maxWeight - minWeight),
  }));
}

export function buildSkillEdges(
  positions: PositionedSkillNode[],
  crossLinks: SkillLink[],
  opts: {
    maxCross: number;
    kPrimary: number;
    kSecondary: number;
    paddedRects: Array<{ id: string; x: number; y: number; width: number; height: number }>;
    categories: SkillCategory[];
  },
): { cross: SkillEdge[]; intra: SkillEdge[] } {
  const { maxCross, kPrimary, kSecondary, paddedRects } = opts;

  const intersectsAny = (x1: number, y1: number, x2: number, y2: number) =>
    paddedRects.some((rect) => segmentIntersectsRect(x1, y1, x2, y2, rect.x, rect.y, rect.width, rect.height));

  const cross: SkillEdge[] = [];
  for (const link of crossLinks) {
    if (cross.length >= maxCross) break;
    const a = positions.find((node) => node.id === link.sourceId);
    const b = positions.find((node) => node.id === link.targetId);
    if (!a || !b) continue;
    cross.push(link);
  }

  const intra: SkillEdge[] = [];
  const byCategory: Record<string, PositionedSkillNode[]> = {};
  positions.forEach((node) => {
    if (!byCategory[node.category]) byCategory[node.category] = [];
    byCategory[node.category].push(node);
  });

  Object.values(byCategory).forEach((group) => {
    group.forEach((node, idx) => {
      const k = node.tier === "primary" ? kPrimary : kSecondary;
      const nearest = group
        .map((candidate, jdx) => ({ candidate, distance: (node.x - candidate.x) ** 2 + (node.y - candidate.y) ** 2, jdx }))
        .filter((entry) => entry.jdx !== idx)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, k);

      nearest.forEach((entry) => {
        const key = [node.id, entry.candidate.id].sort().join("__");
        if (!intra.find((link) => [link.sourceId, link.targetId].sort().join("__") === key)) {
          intra.push({ sourceId: node.id, targetId: entry.candidate.id });
        }
      });
    });
  });

  const filteredIntra = intra.filter((link) => {
    const a = positions.find((node) => node.id === link.sourceId);
    const b = positions.find((node) => node.id === link.targetId);
    if (!a || !b) return false;
    return !intersectsAny(a.x, a.y, b.x, b.y);
  });

  return { cross, intra: filteredIntra };
}

export function buildMeshEdges(nodes: SkillNode[]): SkillEdge[] {
  const sorted = [...nodes].sort((a, b) => (a.id < b.id ? -1 : 1));
  return sorted.map((node, index) => {
    const next = sorted[(index + 1) % sorted.length];
    return { sourceId: node.id, targetId: next.id };
  });
}

export function segmentIntersectsRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
) {
  const inside = (x: number, y: number) => x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  if (inside(x1, y1) || inside(x2, y2)) return true;

  const lines: Array<[number, number, number, number]> = [
    [rx, ry, rx + rw, ry],
    [rx + rw, ry, rx + rw, ry + rh],
    [rx + rw, ry + rh, rx, ry + rh],
    [rx, ry + rh, rx, ry],
  ];

  const cross = (
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    dx: number,
    dy: number,
  ) => {
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
