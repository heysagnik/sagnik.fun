"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";

// Geometry (px). The lanyard hangs from a pivot at the top of the page; the card hangs from the strap clip.
const ROOT_PADDING_TOP = 160; // `pt-40` on the root
const PIVOT_ABOVE_CARD = 230; // distance from the card's top edge up to the pivot
const CLIP_OFFSET = 18; // the slot the clasp passes through, measured from the card's top

// Pendulum: ~0.85s period, damping ratio ~0.28 so a release keeps swinging a few times before it settles.
const PENDULUM = { type: "spring", stiffness: 55, damping: 4.2, mass: 1 } as const;
const MAX_ANGLE = 38; // soft limit in degrees; resistance grows smoothly towards it
const MAX_VELOCITY = 700; // deg/s

// Elastic strap: pulling down stretches it (soft limit), pushing up only slackens it a little.
const STRETCH = { type: "spring", stiffness: 170, damping: 9, mass: 1 } as const;
const MAX_STRETCH = 120;
const MAX_SLACK = 24;
const MAX_STRETCH_VELOCITY = 1800; // px/s
const STRAP_LENGTH = 420; // px of plain strap above the artwork
const CARD_HEIGHT = 360; // rendered height of the card, used to start the fall fully off-screen

// The further you pull, the less the card follows: roughly 1:1 near rest, asymptotic at the limit.
const resist = (raw: number) => MAX_ANGLE * Math.tanh(raw / MAX_ANGLE);
const resistStretch = (raw: number) =>
  raw >= 0 ? MAX_STRETCH * Math.tanh(raw / MAX_STRETCH) : MAX_SLACK * Math.tanh(raw / MAX_SLACK);

const toDegrees = (rad: number) => (rad * 180) / Math.PI;

export default function IDCard() {
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const stretchControls = useRef<AnimationPlaybackControls | null>(null);

  // Whole lanyard assembly: angle about the top pivot, plus the drop-in on first load.
  const angle = useMotionValue(0);
  const drop = useMotionValue(0);
  // Hidden until the entrance starts, so nothing flashes at the wrong spot before hydration.
  const visible = useMotionValue(0);
  // Extra strap length in px along the strap axis (positive = stretched down).
  const stretch = useMotionValue(0);
    const strapScale = useTransform(stretch, (v) => 1 + v / STRAP_LENGTH);

  // Pressing the card gives instant feedback on pointer-down, before any movement.
  const press = useSpring(1, { stiffness: 500, damping: 40 });

  // Light stays fixed while the card turns: the cast shadow slides the opposite way and a sheen sweeps across.
  const shadow = useTransform(
    angle,
    (v) =>
      `0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(20,20,20,0.06), ${(-v * 0.7).toFixed(1)}px 20px 40px -18px rgba(20,20,20,0.35)`,
  );
  const sheen = useTransform(angle, [-MAX_ANGLE, MAX_ANGLE], ["90%", "10%"]);


  // The card is a second, lagging pendulum on the clip: it trails the strap and wobbles a little.
  const lagTarget = useTransform(angle, (v) => -v * 0.3);
  const lag = useSpring(lagTarget, { stiffness: 90, damping: 6, mass: 1 });

  const grab = useRef<{ pointerAngle: number; pointerDistance: number; angle: number; stretch: number } | null>(null);
  const samples = useRef<{ t: number; angle: number; stretch: number }[]>([]);

  // Entrance: the lanyard falls in from above the screen, snaps taut on landing and swings from the jolt.
  useEffect(() => {
    if (reduceMotion) {
      visible.set(1);
      return;
    }

    // Start high enough that the whole card (not just the strap) begins above the top edge of the screen.
    const rootTop = root.current?.getBoundingClientRect().top ?? 0;
    drop.set(-(rootTop + ROOT_PADDING_TOP + CARD_HEIGHT + 24));
    visible.set(1);

    // Falls with almost no bounce; the elastic strap supplies the rebound instead.
    const fall = animate(drop, 0, { type: "spring", stiffness: 140, damping: 22, mass: 1 });
    let landed = false;
    const unsubscribe = drop.on("change", (v) => {
      if (landed || v < -14) return;
      landed = true;
      controls.current = animate(angle, 0, { ...PENDULUM, velocity: 130 });
      stretchControls.current = animate(stretch, 0, { ...STRETCH, velocity: 520 });
    });

    return () => {
      fall.stop();
      unsubscribe();
      controls.current?.stop();
      stretchControls.current?.stop();
    };
  }, [angle, drop, stretch, visible, reduceMotion]);

  // The pointer in polar form around the pivot: angle from straight down, and distance.
  const polar = (clientX: number, clientY: number) => {
    const rect = root.current!.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + ROOT_PADDING_TOP - PIVOT_ABOVE_CARD);
    return { angle: toDegrees(Math.atan2(-dx, dy)), distance: Math.hypot(dx, dy) };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Catch it mid-swing: stop the animation and carry on from where it is right now.
    controls.current?.stop();
    stretchControls.current?.stop();
    press.set(0.98);
    e.currentTarget.setPointerCapture(e.pointerId);
    // Remember where it was grabbed (angle and distance) so the card never jumps under the finger.
    const p = polar(e.clientX, e.clientY);
    grab.current = { pointerAngle: p.angle, pointerDistance: p.distance, angle: angle.get(), stretch: stretch.get() };
    samples.current = [{ t: performance.now(), angle: angle.get(), stretch: stretch.get() }];
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!grab.current) return;
    const p = polar(e.clientX, e.clientY);
    angle.set(resist(grab.current.angle + (p.angle - grab.current.pointerAngle)));
    stretch.set(resistStretch(grab.current.stretch + (p.distance - grab.current.pointerDistance)));
    const now = performance.now();
    samples.current.push({ t: now, angle: angle.get(), stretch: stretch.get() });
    samples.current = samples.current.filter((s) => now - s.t < 90);
  };

  const release = () => {
    if (!grab.current) return;
    grab.current = null;
    press.set(1);


    const [first] = samples.current;
    const last = samples.current[samples.current.length - 1];
    let velocity = 0;
    let stretchVelocity = 0;
    if (first && last && last.t > first.t) {
      const dt = (last.t - first.t) / 1000;
      velocity = (last.angle - first.angle) / dt;
      stretchVelocity = (last.stretch - first.stretch) / dt;
    }
    velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
    stretchVelocity = Math.max(-MAX_STRETCH_VELOCITY, Math.min(MAX_STRETCH_VELOCITY, stretchVelocity));

    // Hand the finger's velocity to the springs so there is no seam between dragging and swinging.
    if (reduceMotion) {
      controls.current = animate(angle, 0, { duration: 0.2, ease: "easeOut" });
      stretchControls.current = animate(stretch, 0, { duration: 0.2, ease: "easeOut" });
      return;
    }
    controls.current = animate(angle, 0, { ...PENDULUM, velocity });
    stretchControls.current = animate(stretch, 0, { ...STRETCH, velocity: stretchVelocity });
  };

  return (
    <div ref={root} className="relative flex flex-col items-center pt-40">
      <motion.div
        className="relative"
        style={{ y: drop, rotate: angle, opacity: visible, transformOrigin: `50% -${PIVOT_ABOVE_CARD}px` }}
      >
        {/* Plain strap section above the artwork so it runs off the top of the screen.
            Width = the strap's 56px of the 103px artwork, scaled to the artwork's rendered height. */}
        <motion.div
          aria-hidden
          style={{ scaleY: strapScale, transformOrigin: "top" }}
          className="absolute bottom-[calc(100%+183px)] left-1/2 z-[15] ml-[-0.2px] h-[420px] w-[20.2px] -translate-x-1/2 bg-[#2e2d2d] drop-shadow-[0_4px_5px_rgba(0,0,0,0.2)] md:bottom-[calc(100%+227px)] md:w-[24.44px]"
        />

        <motion.div style={{ y: stretch }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about/lanyard-strap.png"
            alt=""
            draggable={false}
            className="pointer-events-none absolute left-1/2 z-[15] top-[-184px] h-[210px] w-[28px] -translate-x-1/2 select-none object-cover drop-shadow-[0_4px_5px_rgba(0,0,0,0.2)] md:top-[-228px] md:h-[254px]"
          />

          <motion.div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={release}
            onPointerCancel={release}
            style={{ rotate: lag, scale: press, boxShadow: shadow, transformOrigin: `50% ${CLIP_OFFSET}px`, touchAction: "pan-y" }}
            className="relative z-10 w-[260px] cursor-grab select-none overflow-hidden rounded-[26px] bg-white active:cursor-grabbing"
          >
            {/* Punched slot: recessed top edge, bright lip on the bottom edge */}
            <div className="absolute left-1/2 top-[10px] z-20 h-4 w-12 -translate-x-1/2 rounded-full bg-[#f1efec] shadow-[inset_0_1px_2px_rgba(20,20,20,0.22),0_1px_0_rgba(255,255,255,0.9)]" />

            {/* Edge light: bright top rim and a faint bottom rim give the card thickness */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30 rounded-[26px] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(20,20,20,0.06)]"
            />

            <div className="relative h-[140px] w-full overflow-hidden bg-gradient-to-br from-[#5a82d0] via-[#4a72c0] to-[#2f55a0]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 180 140" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <radialGradient id="badge-radial" cx="75%" cy="20%" r="90%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="180" height="140" fill="url(#badge-radial)" />

                <circle cx="132" cy="18" r="34" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" />
                <circle cx="96" cy="46" r="22" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.4" />
                <circle cx="150" cy="60" r="26" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.4" />
                <circle cx="60" cy="20" r="16" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.4" />
                <circle cx="118" cy="92" r="30" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.4" />
                <circle cx="160" cy="108" r="18" fill="none" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.4" />
                <circle cx="78" cy="78" r="12" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.4" />

                <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
                  <path d="M138 30 L138 44 M131 37 L145 37 M133.5 32.5 L142.5 41.5 M142.5 32.5 L133.5 41.5" />
                </g>
              </svg>
            {/* Glossy sheen that sweeps across the header as the card swings */}
            <motion.div
              aria-hidden
              style={{ backgroundPositionX: sheen }}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.28)_48%,transparent_58%)] bg-[length:260%_100%] bg-no-repeat"
            />

            </div>

            <div className="relative z-20 -mt-11 flex justify-center">
              <div className="relative size-24 overflow-hidden rounded-full bg-white ring-4 ring-white shadow-[0_0_0_5px_rgba(20,20,20,0.04),0_1px_2px_rgba(20,20,20,0.12),0_8px_18px_-8px_rgba(20,20,20,0.4)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about/profile.png"
                  alt="Sagnik"
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                />
              </div>
            </div>

            <div className="relative flex flex-col gap-1.5 px-6 pb-8 pt-6">
              <p className="text-[26px] font-semibold leading-none tracking-[-0.03em] text-[#141414]">Sagnik Sahoo</p>
              <p className="text-[13px] font-normal leading-none tracking-[0.01em] text-[#141414]/55">Software Developer</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
