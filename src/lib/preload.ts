import type { Project } from "@/lib/projects";

const requested = new Set<string>();

/** Start fetching images ahead of time so they are in the cache by the time they are shown. */
export function preloadImages(sources: string[]) {
  for (const src of sources) {
    if (requested.has(src) || /\.(mp4|webm)$/i.test(src)) continue;
    requested.add(src);
    new Image().src = src;
  }
}

/** The images a visitor sees first when a project sheet opens. */
export function preloadProject(project: Project, count = 3) {
  preloadImages((project.gallery?.length ? project.gallery : [project.image]).slice(0, count));
}
