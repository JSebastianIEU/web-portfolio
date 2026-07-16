import { notFound } from "next/navigation";
import { findProjectBySlug, getProjects } from "@/domain/projects";
import ProjectDetailScreen from "@/components/sections/Projects/ProjectDetailScreen";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) {
    return notFound();
  }
  return <ProjectDetailScreen project={project} />;
}
