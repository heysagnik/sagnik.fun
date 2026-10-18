"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { DOCK } from "@/lib/nav";

const ITEM =
  "relative flex h-9 items-center rounded-full px-4 text-[14px] leading-none transition-transform duration-150 ease-out active:scale-[0.96]";

export default function Dock() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Primary" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-[0_10px_30px_-12px_rgba(20,20,20,0.35)]">
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
