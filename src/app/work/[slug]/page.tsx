import { notFound } from "next/navigation";
import { getAllProjects, getProjectById } from "@/lib/projects";
import { WorkView } from "@/app/work/page";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.id }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectById(slug);
  if (!project) notFound();

  return <WorkView initialSlug={slug} />;
}
