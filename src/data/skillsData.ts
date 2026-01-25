"use client";

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
  tier?: SkillTier;
  nodeType?: "skill" | "category";
};

export type SkillCategory = {
  id: SkillCategoryId;
  labelEN: string;
  labelES: string;
  anchor: { x: number; y: number }; // normalized 0..1
};