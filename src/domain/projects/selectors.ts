import { projectsData } from "@/data/projectsData";
import type { Project, ProjectCategory } from "./types";

export function getProjects(): Project[] {
  return projectsData;
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projectsData.filter((project) => project.category === category);
}

export function findProjectById(id: string): Project | undefined {
  return projectsData.find((project) => project.id === id);
}

export function findProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((project) => project.slug === slug);
}

export function buildProjectCarousel(items: Project[], repeat = 3): Project[] {
  if (repeat <= 1) return items;
  const normalized = Math.max(2, repeat);
  return Array.from({ length: normalized }, () => items).flat();
}
