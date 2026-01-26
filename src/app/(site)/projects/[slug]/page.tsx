import { notFound } from "next/navigation";
import { findProjectBySlug, getProjects } from "@/domain/projects";
import ProjectDetailScreen from "./project-detail-screen";

type ProjectPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = findProjectBySlug(params.slug);
  if (!project) {
    return notFound();
  }
  return <ProjectDetailScreen project={project} />;
}
