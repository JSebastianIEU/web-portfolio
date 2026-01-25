import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { projectsData } from "@/data/projectsData";

function getNextProjectSlug(currentSlug: string) {
  const idx = projectsData.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return null;
  const next = projectsData[(idx + 1) % projectsData.length];
  return next.slug;
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  redirect("/#projects");
}
