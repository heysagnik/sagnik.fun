"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Project } from "@/lib/projects";
import type { SheetOrigin } from "@/components/BottomSheet";
import { armDialSound, playDialClick } from "@/lib/dial-sound";

interface Props {
  header: ReactNode;
  projects: Project[];
  onOpen: (project: Project, origin: SheetOrigin) => void;
}

const EDGE = "pl-[max(24px,calc((100vw-1080px)/2+24px))]";

// On every screen size the header stays pinned while vertical scroll drives the project track sideways.
export default function WorkCarousel({ header, projects, onOpen }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [shift, setShift] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const [active, setActive] = useState(0);
  const previous = useRef(0);

  const measure = useCallback(() => {
    const t = track.current;
    const v = viewport.current;
    if (!t || !v) return;
    setShift(Math.max(0, t.scrollWidth - v.clientWidth));
    setStageHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    // Card widths come from CSS (viewport height, fonts, images), so the scroll distance
    // must be re-measured whenever the track or its viewport changes size, not just on resize.
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    if (viewport.current) observer.observe(viewport.current);
    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    // wheel cannot unlock audio itself, but it lets playback start if the visitor already clicked earlier.
    const events = ["pointerdown", "pointerup", "click", "keydown", "touchend", "wheel"] as const;
    const arm = () => armDialSound();
    events.forEach((e) => window.addEventListener(e, arm));
    return () => events.forEach((e) => window.removeEventListener(e, arm));
  }, []);

  useEffect(() => {
    if (previous.current !== active) playDialClick();
    previous.current = active;
  }, [active]);

  const padding = () =>
    parseFloat(getComputedStyle(track.current!).paddingLeft) || 0;

  const nearest = (offset: number) => {
    const pad = track.current ? padding() : 0;
    let best = 0;
    let bestDist = Infinity;
    items.current.forEach((node, i) => {
      if (!node) return;
      const d = Math.abs(node.offsetLeft - pad - offset);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  // The track chases the wheel through a critically damped spring (no overshoot), so
  // notched wheel steps glide like momentum instead of jumping. `x` stays the source of truth.
  const reduceMotion = useReducedMotion();
  const glide = useSpring(x, { stiffness: 260, damping: 32, mass: 1 });

  useMotionValueEvent(x, "change", (latest) => setActive(nearest(-latest)));

  return (
    <div
      ref={outer}
      className="relative left-1/2 -mt-16 w-screen -translate-x-1/2 md:-mt-20"
      style={{ height: shift + stageHeight }}
    >
      <div className="sticky top-0 flex h-dvh flex-col gap-8 overflow-hidden pt-16 pb-10 md:gap-12 md:pt-20 md:pb-16">
        <div className={`pr-6 ${EDGE}`}>{header}</div>

        <div ref={viewport} className="overflow-hidden">
          <motion.div
            ref={track}
            style={{ x: reduceMotion ? x : glide }}
            className={`flex w-max gap-4 pr-6 will-change-transform md:gap-8 ${EDGE}`}
          >
            {projects.map((project, i) => (
              <article
                key={project.id}
                ref={(node) => {
                  items.current[i] = node;
                }}
                className="w-[clamp(240px,min(86vw,calc((100dvh_-_440px)*1.628)),520px)] shrink-0 md:w-[clamp(280px,calc((100vh_-_530px)*1.628),580px)]"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    onOpen(project, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                  }}
                  className="flex w-full cursor-pointer flex-col gap-4 text-left transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  <div
                    className={`card-media relative w-full overflow-hidden rounded-xl bg-surface ${
                      project.fullBleedImage
                        ? "aspect-[1200/630]"
                        : "aspect-[661/406]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className={`absolute inset-0 h-full w-full ${
                        project.fullBleedImage
                          ? "object-cover"
                          : "object-contain p-6"
                      }`}
                    />
                  </div>
                  <div className="text-[14px] leading-6">
                    <p className="text-ink">{project.title}</p>
                    <p className="text-muted">
                      {project.meta}
                      {project.date ? ` · ${project.date}` : ""}
                    </p>
                  </div>
                </button>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
