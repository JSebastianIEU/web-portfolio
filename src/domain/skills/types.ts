export type SkillCategoryId =
  | "software"
  | "frontend"
  | "data"
  | "db"
  | "cloud"
  | "automation";

export type SkillTier = "primary" | "secondary";

export type SkillNode = {
  id: string;
  nameEN: string;
  nameES: string;
  category: SkillCategoryId;
  iconSrc: string;
  tier: SkillTier;
  nodeType?: "skill" | "category";
};

export type SkillCategory = {
  id: SkillCategoryId;
  labelEN: string;
  labelES: string;
  anchor: { x: number; y: number };
};

export type SkillLink = { sourceId: string; targetId: string };

export type PositionedSkillNode = {
  id: string;
  x: number;
  y: number;
  category: SkillCategoryId;
  tier?: SkillTier;
};

export type SkillEdge = SkillLink;

export type CategoryBackboneEdge = { a: SkillCategoryId; b: SkillCategoryId; norm: number };
