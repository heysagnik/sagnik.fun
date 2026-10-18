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
  useScroll,
  useTransform,
} from "framer-motion";
import type { Project } from "@/lib/projects";
import { armDialSound, playDialClick } from "@/lib/dial-sound";

interface Props {
  header: ReactNode;
  projects: Project[];
  onOpen: (project: Project) => void;
}

const DESKTOP = "(min-width: 768px)";
const EDGE = "pl-[max(24px,calc((100vw-1080px)/2+24px))]";

// Desktop: the header stays put while vertical scroll drives the project track sideways.
// Mobile: the header scrolls normally and the track is a native horizontal scroller.
export default function WorkCarousel({ header, projects, onOpen }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [desktop, setDesktop] = useState(true);
  const [shift, setShift] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const [active, setActive] = useState(0);
  const previous = useRef(0);

  const measure = useCallback(() => {
    const t = track.current;
    const v = viewport.current;
    if (!t || !v) return;
    setDesktop(window.matchMedia(DESKTOP).matches);
    setShift(Math.max(0, t.scrollWidth - v.clientWidth));
    setStageHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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

  useMotionValueEvent(x, "change", (latest) => {
    if (desktop) setActive(nearest(-latest));
  });

  const goTo = (i: number) => {
    const node = items.current[i];
    if (!node) return;
    if (!desktop) {
      viewport.current?.scrollTo({
        left: node.offsetLeft - padding(),
        behavior: "smooth",
      });
      return;
    }
    const o = outer.current;
    if (!o || shift === 0) return;
    const progress = Math.min(
      1,
      Math.max(0, (node.offsetLeft - padding()) / shift),
    );
    const top = o.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + progress * shift, behavior: "smooth" });
  };

  return (
    <div
      ref={outer}
      className="relative left-1/2 -mt-16 w-screen -translate-x-1/2 md:-mt-20"
      style={desktop ? { height: shift + stageHeight } : undefined}
    >
      <div className="flex flex-col gap-6 overflow-hidden pt-16 md:sticky md:top-0 md:h-screen md:pt-20 md:pb-24">
        <div className={`pr-6 ${EDGE}`}>{header}</div>

        <div role="tablist" aria-label="Projects" className={`flex items-center gap-1 ${EDGE}`}>
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={p.title}
              onClick={() => goTo(i)}
              className={`flex h-7 w-8 items-center justify-center rounded-md transition-colors duration-150 ease-out ${
                i === active ? "bg-surface" : "hover:bg-surface/60"
              }`}
            >
              <span
                className={`block w-px bg-ink transition-[height,opacity] duration-150 ease-out ${
                  i === active ? "h-4 opacity-100" : "h-3 opacity-30"
                }`}
              />
            </button>
          ))}
        </div>

        <div
          ref={viewport}
          onScroll={(e) => {
            if (!desktop) setActive(nearest(e.currentTarget.scrollLeft));
          }}
          className="snap-x snap-mandatory overflow-x-auto pb-4 md:snap-none md:overflow-hidden md:pb-0"
        >
          <motion.div
            ref={track}
            style={{ x: desktop ? x : 0 }}
            className={`flex w-max gap-8 pr-6 will-change-transform ${EDGE}`}
          >
            {projects.map((project, i) => (
              <article
                key={project.id}
                ref={(node) => {
                  items.current[i] = node;
                }}
                className="w-[min(78vw,440px)] shrink-0 snap-start md:w-[clamp(240px,calc((100vh_-_560px)*1.628),440px)]"
              >
                <button
                  type="button"
                  onClick={() => onOpen(project)}
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
