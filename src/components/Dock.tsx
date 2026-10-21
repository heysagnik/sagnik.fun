"use client";

import { useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { DOCK } from "@/lib/nav";

declare global {
  interface Window {
    liquidGlass?: (el: Element, opts?: { scale?: number }) => { supported: boolean; destroy: () => void };
  }
}

const ITEM =
  "relative flex h-10 items-center rounded-full px-4 text-[14px] leading-none transition-transform duration-150 ease-out active:scale-[0.96]";

export default function Dock() {
  const pathname = usePathname() ?? "";
  const pill = useRef<HTMLDivElement>(null);

  // Optional refraction (Chromium only). Skipped when the visitor asks for less transparency;
  // elsewhere the library applies a plain frosted blur and `.glass` keeps its own styling.
  const applyLiquidGlass = () => {
    const el = pill.current;
    if (!el || !window.liquidGlass) return;
    if (window.matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more)").matches) return;
    if (window.liquidGlass(el, { scale: -70 }).supported) el.classList.add("glass-liquid");
  };

  return (
    <nav aria-label="Primary" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
      <Script src="/liquid-glass.js" strategy="afterInteractive" onReady={applyLiquidGlass} />
      <div ref={pill} className="glass flex items-center gap-1 rounded-full p-1">
        {DOCK.map((item) => {
          const m = item.match;
          const active =
            !item.external &&
            !!m &&
            (pathname === m || pathname.startsWith(`${m}/`) || (m === "/work" && pathname === "/"));

          const inner = (
            <>
              {active && (
                <motion.span
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-150 ${active ? "text-bg" : "text-ink"}`}>
                {item.label}
              </span>
            </>
          );

          return item.external ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={ITEM}>
              {inner}
            </a>
          ) : (
            <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={ITEM}>
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
