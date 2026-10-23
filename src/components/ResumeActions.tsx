"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Share } from "./icons";

// Both icons stay mounted and cross-fade, so the swap can animate in and out.
const iconBase =
  "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-opacity";
const iconOn = "opacity-100 scale-100 blur-0";
const iconOff = "opacity-0 scale-[0.25] blur-[4px]";

const pill =
  "relative inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-[14px] sm:h-11 sm:px-5 font-medium leading-none tracking-[0.005em] transition-[transform,background-color] duration-150 ease-out active:scale-[0.96]";

// Floating controls are a translucent material over the page: blur + saturation for depth, a bright top
// edge where light catches it. Frosted-to-solid fallbacks follow the user's transparency and contrast settings.
const material =
  "bg-white/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_0_0_1px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7),0_8px_24px_-10px_rgba(31,30,27,0.35)] [@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none contrast-more:bg-white contrast-more:shadow-[0_0_0_1.5px_rgba(0,0,0,0.6)]";

export default function ResumeActions({ file }: { file: string }) {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  // Fetched ahead of the tap: browsers only allow sharing inside the click's short activation window,
  // so awaiting a download there can make the share sheet refuse to open.
  const pdf = useRef<File | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(file)
      .then((res) => res.blob())
      .then((blob) => {
        if (!cancelled) pdf.current = new File([blob], file.split("/").pop() ?? "resume.pdf", { type: "application/pdf" });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [file]);

  async function share() {
    const url = window.location.href;
    try {
      const files = pdf.current ? [pdf.current] : null;
      if (files && navigator.canShare?.({ files })) {
        await navigator.share({ title: "Sagnik Sahoo, Resume", files });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "Sagnik Sahoo, Resume", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Share sheet dismissed or clipboard blocked; nothing to recover.
    }
  }

  return (
    <motion.div
      // Materializes rather than fading: blur and scale settle together, critically damped (no bounce, nothing was flicked).
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0, duration: 0.4, delay: 0.15 }}
      className="fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex justify-center gap-2 px-4"
    >
      <button type="button" onClick={share} className={`${pill} min-w-[7.5rem] text-ink ${material}`}>
        <span className="relative size-4" aria-hidden>
          <Share strokeWidth={1.75} className={`${iconBase} ${copied ? iconOff : iconOn}`} />
          <Check strokeWidth={1.75} className={`${iconBase} ${copied ? iconOn : iconOff}`} />
        </span>
        <span aria-live="polite">{copied ? "Copied" : "Share"}</span>
      </button>
    </motion.div>
  );
}
