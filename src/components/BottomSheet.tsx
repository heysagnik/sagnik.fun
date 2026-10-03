"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Project } from "@/lib/projects";

export interface BottomSheetProps {
  project: Project | null;
  onClose: () => void;
}

export default function BottomSheet({ project, onClose }: BottomSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    if (!project) return;

    setIsExpanded(false);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (galleryRef.current) {
      galleryRef.current.scrollLeft = 0;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  const scrollGallery = (direction: "left" | "right") => {
    if (!galleryRef.current) return;
    const card = galleryRef.current.querySelector<HTMLElement>(".gallery-slide");
    const scrollAmount = card ? card.offsetWidth + 16 : 500;
    galleryRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!galleryRef.current) return;
    setIsDraggingGallery(true);
    startXRef.current = e.pageX - galleryRef.current.offsetLeft;
    scrollLeftRef.current = galleryRef.current.scrollLeft;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingGallery || !galleryRef.current) return;
      e.preventDefault();
      const x = e.pageX - galleryRef.current.offsetLeft;
      const walk = (x - startXRef.current) * 1.5;
      galleryRef.current.scrollLeft = scrollLeftRef.current - walk;
    },
    [isDraggingGallery]
  );

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDraggingGallery(false);
  }, []);

  const images = project?.gallery?.length
    ? project.gallery
    : project?.image
      ? [project.image]
      : [];

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ y: "100%", height: "92dvh" }}
            animate={{
              y: 0,
              height: isExpanded ? "100dvh" : "92dvh",
              borderTopLeftRadius: isExpanded ? 0 : 20,
              borderTopRightRadius: isExpanded ? 0 : 20,
            }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 320,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className="relative z-10 flex w-full flex-col overflow-hidden rounded-t-[20px] bg-bg shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex w-full shrink-0 cursor-grab items-center justify-center pt-3 pb-2 active:cursor-grabbing">
              <div className="h-1 w-8 rounded-full bg-stone-300" />
            </div>

            <div
              ref={contentRef}
              onScroll={(e) => {
                if (e.currentTarget.scrollTop > 8) setIsExpanded(true);
              }}
              className="flex-1 overflow-y-auto overflow-x-hidden pb-28 pt-2"
            >
              <div className="w-full relative mb-4">
                <div
                  ref={galleryRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  className={`flex h-[260px] sm:h-[330px] md:h-[390px] w-full flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 sm:px-[max(1.5rem,calc((100vw-36rem)/2))] ${
                    isDraggingGallery ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
                  {images.map((imgSrc, i) => (
                    <div
                      key={`${imgSrc}-${i}`}
                      className="gallery-slide relative h-full w-auto shrink-0 overflow-hidden rounded-xl bg-surface/60 border border-stone-200/50 snap-center shadow-xs flex items-center justify-center"
                    >
                      {/\.(mp4|webm)$/i.test(imgSrc) ? (
                        <video
                          src={imgSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          aria-label={`${project.title} slide ${i + 1}`}
                          className="h-full w-auto max-w-[90vw] object-contain pointer-events-none"
                        />
                      ) : (
                        <img
                          src={imgSrc}
                          alt={`${project.title} slide ${i + 1}`}
                          draggable={false}
                          className="h-full w-auto max-w-[90vw] object-contain pointer-events-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <article className="mx-auto w-full max-w-xl px-6">
                <div className="flex gap-1 pb-4">
                  <button
                    type="button"
                    onClick={() => scrollGallery("left")}
                    aria-label="Previous image"
                    className="inline-flex px-1.5 py-1 items-center justify-center rounded-md border border-stone-200 bg-white/80 text-xs text-stone-800 hover:text-stone-900 backdrop-blur-sm hover:bg-white hover:border-stone-300 transition-colors active:scale-95"
                  >
                    <svg height="12" width="12" viewBox="0 0 12 12" fill="none">
                      <polyline
                        points="7.75 1.75 3.5 6 7.75 10.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollGallery("right")}
                    aria-label="Next image"
                    className="inline-flex px-1.5 py-1 items-center justify-center rounded-md border border-stone-200 bg-white/80 text-xs text-stone-800 hover:text-stone-900 backdrop-blur-sm hover:bg-white hover:border-stone-300 transition-colors active:scale-95"
                  >
                    <svg height="12" width="12" viewBox="0 0 12 12" fill="none">
                      <polyline
                        points="4.25 10.25 8.5 6 4.25 1.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <header className="flex flex-row gap-4 justify-between items-baseline pb-3">
                  <div className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-1">
                    <h1 className="text-base font-medium text-ink">
                      {project.title}
                    </h1>
                    <span className="text-sm text-stone-500">
                      <span className="hidden sm:inline">— </span>
                      {project.meta}
                    </span>
                  </div>
                  {project.date && (
                    <time className="block text-xs text-stone-400 tabular-nums shrink-0">
                      {project.date}
                    </time>
                  )}
                </header>

                {project.summary && (
                  <p className="text-sm leading-relaxed text-stone-600 pb-6">
                    {project.summary}
                  </p>
                )}

                <div className="space-y-6 text-sm leading-relaxed text-stone-600">
                  {project.sections && project.sections.length > 0 && (
                    <div className="space-y-5">
                      {project.sections.map((section, sIdx) => (
                        <div key={section.heading || sIdx} className="space-y-2">
                          <p className="font-medium text-ink">{section.heading}</p>
                          {section.paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {project.role && (
                    <div>
                      <p className="font-medium text-ink">Role</p>
                      <p className="text-stone-600">{project.role}</p>
                    </div>
                  )}

                  {project.stack && (
                    <div>
                      <p className="font-medium text-ink">Stack</p>
                      <p className="text-stone-600">{project.stack}</p>
                    </div>
                  )}

                  {project.href && (
                    <div>
                      <p className="font-medium text-ink">Link</p>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink underline underline-offset-2 decoration-stone-300 hover:decoration-ink"
                      >
                        {project.href.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}

                  {project.credits && (
                    <div>
                      <p className="font-medium text-ink">Credits</p>
                      <p className="text-stone-600">{project.credits}</p>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
