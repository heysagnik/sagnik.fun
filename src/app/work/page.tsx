"use client";

import { useState, useEffect, useCallback } from "react";
import { type Project, getAllProjects, getProjectById } from "@/lib/projects";
import BottomSheet from "@/components/BottomSheet";

interface CardProps {
  project: Project;
  delay?: number;
  onClick: () => void;
}

function Card({ project, delay = 0, onClick }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-enter flex w-full flex-col gap-4 text-left cursor-pointer transition-transform duration-150 ease-out active:scale-[0.98]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-[14px] leading-6">
        <p className="text-ink">{project.title}</p>
        <p className="text-muted">{project.meta}</p>
      </div>

      <div
        className={`card-media relative w-full overflow-hidden rounded-xl bg-surface ${
          project.fullBleedImage ? "aspect-[1200/630]" : "aspect-[661/406]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className={`absolute inset-0 h-full w-full ${project.fullBleedImage ? "object-cover" : "object-contain p-6"}`}
        />
      </div>
    </button>
  );
}

export function WorkView({ initialSlug }: { initialSlug?: string }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    return initialSlug ? getProjectById(initialSlug) || null : null;
  });

  useEffect(() => {
    const slug =
      initialSlug ||
      (typeof window !== "undefined"
        ? window.location.pathname.match(/^\/work\/([^/]+)$/)?.[1]
        : undefined);

    if (slug) {
      const project = getProjectById(slug);
      if (project) setSelectedProject(project);
    }
  }, [initialSlug]);

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/work\/([^/]+)$/);
      if (match && match[1]) {
        setSelectedProject(getProjectById(match[1]) || null);
      } else {
        setSelectedProject(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleOpen = useCallback((project: Project) => {
    setSelectedProject(project);
    if (typeof window !== "undefined" && window.location.pathname !== `/work/${project.id}`) {
      window.history.pushState({ projectId: project.id }, "", `/work/${project.id}`);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProject(null);
    if (typeof window !== "undefined" && window.location.pathname !== "/work") {
      window.history.pushState(null, "", "/work");
    }
  }, []);

  return (
    <>
      {getAllProjects().map((project, i) => (
        <Card
          key={project.id}
          project={project}
          delay={Math.min(i * 60, 240)}
          onClick={() => handleOpen(project)}
        />
      ))}

      <BottomSheet project={selectedProject} onClose={handleClose} />
    </>
  );
}

export default function Work() {
  return <WorkView />;
}
