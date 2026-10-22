"use client";

import { useState, useEffect, useCallback } from "react";
import { type Project, getAllProjects, getProjectById } from "@/lib/projects";
import BottomSheet, { type SheetOrigin } from "@/components/BottomSheet";
import Hero from "@/components/Hero";
import WorkCarousel from "@/components/WorkCarousel";

export function WorkView({ initialSlug }: { initialSlug?: string }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    return initialSlug ? getProjectById(initialSlug) || null : null;
  });

  const [origin, setOrigin] = useState<SheetOrigin | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/work\/([^/]+)$/);
      if (match && match[1]) {
        setOrigin(null);
        setSelectedProject(getProjectById(match[1]) || null);
      } else {
        setSelectedProject(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleOpen = useCallback((project: Project, from: SheetOrigin) => {
    setOrigin(from);
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
      <WorkCarousel header={<Hero />} projects={getAllProjects()} onOpen={handleOpen} />

      <BottomSheet project={selectedProject} origin={origin} onClose={handleClose} />
    </>
  );
}

export default function Work() {
  return <WorkView />;
}
