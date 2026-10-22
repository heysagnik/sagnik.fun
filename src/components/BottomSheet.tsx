"use client";

import { Fragment, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, animate, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/projects";

// Resting offset of a drag that keeps decelerating (UIScrollView-style exponential decay).
const DECELERATION = 0.998;
const projectRest = (velocity: number) => ((velocity / 1000) * DECELERATION) / (1 - DECELERATION);

const SPRING = { type: "spring", duration: 0.45, bounce: 0 } as const;
const DISMISS_DISTANCE = 160;
const DIM_RANGE = 360;
const ORIGIN_SCALE = 0.85;
const COLLAPSED_TOP = 0.08; // the sheet rests at 92dvh, so its top edge sits 8dvh down

/** Viewport-space centre of the card that opened the sheet. */
export interface SheetOrigin {
  x: number;
  y: number;
}

type ExitMode = "origin" | "drag";

export interface BottomSheetProps {
  project: Project | null;
  origin?: SheetOrigin | null;
  onClose: () => void;
}

const root = () => document.documentElement;

export default function BottomSheet({ project, origin = null, onClose }: BottomSheetProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const exitMode = useRef<ExitMode>("origin");
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  // 0 = sheet closed, 1 = fully open. Drives the scrim and how far the page recedes,
  // so both follow the finger during a drag instead of only reacting when it ends.
  const progress = useMotionValue(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => progress.on("change", (v) => root().style.setProperty("--push", v.toFixed(4))), [progress]);

  useEffect(() => {
    if (reduceMotion) {
      progress.set(project ? 1 : 0);
      return;
    }
    if (project) {
      root().style.setProperty("--sheet-y", `${window.scrollY + window.innerHeight / 2}px`);
      root().dataset.sheet = "";
    }
    const controls = animate(progress, project ? 1 : 0, SPRING);
    return () => controls.stop();
  }, [project, progress, reduceMotion]);

  const clearPush = () => {
    delete root().dataset.sheet;
    root().style.removeProperty("--push");
    root().style.removeProperty("--sheet-y");
  };

  const dismiss = (mode: ExitMode) => {
    exitMode.current = mode;
    onClose();
  };

  useEffect(() => {
    if (!project) return;

    exitMode.current = "origin";
    setIsExpanded(false);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (galleryRef.current) {
      galleryRef.current.scrollLeft = 0;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dismiss("origin");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, onClose]);

  const scrollGallery = (direction: "left" | "right") => {
    if (!galleryRef.current) return;
    const card = galleryRef.current.querySelector<HTMLElement>(".gallery-slide");
    const scrollAmount = card ? card.offsetWidth + 20 : 500;
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
      const walk = x - startXRef.current;
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

  const details: { label: string; value: ReactNode }[] = [
    { label: "Role", value: project?.role },
    { label: "Stack", value: project?.stack },
    {
      label: "Link",
      value: project?.href && (
        <a href={project.href} target="_blank" rel="noopener noreferrer" className="link-hover break-all">
          {project.href.replace(/^https?:\/\//, "")}
        </a>
      ),
    },
    { label: "Credits", value: project?.credits },
  ].filter((detail) => detail.value);

  if (!mounted) return null;

  // The sheet grows out of the tapped card and returns to it. With no known card
  // (direct link, back button) it falls back to sliding up from the bottom edge.
  const fromCard = !!origin;
  const transformOrigin = origin
    ? `${origin.x}px ${origin.y - window.innerHeight * (isExpanded ? 0 : COLLAPSED_TOP)}px`
    : undefined;

  return createPortal(
    <AnimatePresence custom={exitMode.current} onExitComplete={clearPush}>
      {project && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            style={{ opacity: progress }}
            onClick={() => dismiss("origin")}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <motion.div
            custom={exitMode.current}
            initial={fromCard ? { opacity: 0, scale: ORIGIN_SCALE, height: "92dvh" } : { y: "100%", height: "92dvh" }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              height: isExpanded ? "100dvh" : "92dvh",
              borderTopLeftRadius: isExpanded ? 0 : 20,
              borderTopRightRadius: isExpanded ? 0 : 20,
            }}
            variants={{
              exit: (mode: ExitMode) =>
                mode === "origin" && fromCard ? { opacity: 0, scale: ORIGIN_SCALE } : { y: "100%" },
            }}
            exit="exit"
            transition={SPRING}
            style={{ transformOrigin }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.12}
            onDrag={(_, info) => progress.set(1 - Math.min(1, Math.max(0, info.offset.y / DIM_RANGE)))}
            onDragEnd={(_, info) => {
              // Decide from where the flick will land, not where the finger lifted.
              if (info.offset.y + projectRest(info.velocity.y) > DISMISS_DISTANCE) {
                dismiss("drag");
              } else {
                animate(progress, 1, SPRING);
              }
            }}
            className="relative z-10 flex w-full flex-col overflow-hidden rounded-t-[20px] bg-bg shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex w-full shrink-0 cursor-grab items-center justify-center pt-3 pb-2 active:cursor-grabbing">
              <div className="h-1 w-9 rounded-full bg-black/15" />
            </div>

            <div
              onScroll={(e) => {
                if (e.currentTarget.scrollTop > 8) setIsExpanded(true);
              }}
              className="flex-1 overflow-y-auto overflow-x-hidden pb-28 pt-2"
            >
              <div className="mb-2">
                <div
                  ref={galleryRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  className={`flex w-full flex-row items-center gap-5 py-6 overflow-x-auto [overflow-anchor:none] select-none ${isDraggingGallery ? "" : "snap-x snap-mandatory"} [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 sm:px-[max(1.5rem,calc((100vw-36rem)/2))] ${
                    isDraggingGallery ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
                  {images.map((imgSrc, i) => (
                    <div
                      key={`${imgSrc}-${i}`}
                      className="gallery-slide relative shrink-0 overflow-hidden rounded-lg bg-surface/60 snap-center shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_28px_-16px_rgba(31,30,27,0.3)]"
                    >
                      {/\.(mp4|webm)$/i.test(imgSrc) ? (
                        <video
                          src={imgSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload={i === 0 ? "auto" : "none"}
                          aria-label={`${project.title} slide ${i + 1}`}
                          className="block h-auto w-auto max-h-[70dvh] max-w-[90vw] pointer-events-none"
                        />
                      ) : (
                        <img
                          src={imgSrc}
                          alt={`${project.title} slide ${i + 1}`}
                          draggable={false}
                          loading={i < 2 ? "eager" : "lazy"}
                          decoding="async"
                          className="block h-auto w-auto max-h-[70dvh] max-w-[90vw] pointer-events-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <article className="mx-auto w-full max-w-xl px-6 pt-2">
                <header className="flex items-start justify-between gap-4 pb-5">
                  <div className="min-w-0">
                    <h1 className="font-display text-[34px] leading-[1.05] text-ink">{project.title}</h1>
                    <p className="mt-2 text-[14px] tracking-[0.005em] text-muted tabular-nums">
                      {project.meta}
                      {project.date ? ` · ${project.date}` : ""}
                    </p>
                  </div>
                  {images.length > 1 && (
                    <div className="flex shrink-0 gap-2 pt-1">
                      {([
                        { direction: "left", label: "Previous image", Icon: ChevronLeft },
                        { direction: "right", label: "Next image", Icon: ChevronRight },
                      ] as const).map(({ direction, label, Icon }) => (
                        <button
                          key={direction}
                          type="button"
                          onClick={() => scrollGallery(direction)}
                          aria-label={label}
                          className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-ink transition-[transform,background-color] duration-150 ease-out hover:bg-border active:scale-[0.96]"
                        >
                          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                        </button>
                      ))}
                    </div>
                  )}
                </header>

                {project.summary && (
                  <p className="pb-8 text-[17px] leading-[1.55] tracking-[-0.011em] text-ink">
                    {project.summary}
                  </p>
                )}

                {project.sections && project.sections.length > 0 && (
                  <div className="space-y-7">
                    {project.sections.map((section, sIdx) => (
                      <section key={section.heading || sIdx} className="space-y-2">
                        <h2 className="text-[15px] font-medium tracking-[-0.006em] text-ink">{section.heading}</h2>
                        {section.paragraphs.map((p, idx) => (
                          <p key={idx} className="text-[15px] leading-[1.65] text-ink/70">
                            {p}
                          </p>
                        ))}
                      </section>
                    ))}
                  </div>
                )}

                {details.length > 0 && (
                  <dl className="mt-10 grid grid-cols-[88px_1fr] gap-x-4 gap-y-4 border-t border-border pt-6 text-[14px] leading-6">
                    {details.map(({ label, value }) => (
                      <Fragment key={label}>
                        <dt className="text-muted">{label}</dt>
                        <dd className="min-w-0 text-ink">{value}</dd>
                      </Fragment>
                    ))}
                  </dl>
                )}
              </article>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
