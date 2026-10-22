"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Contact from "@/components/Contact";
import Dock from "@/components/Dock";

export default function Shell({ children }: { children: ReactNode }) {
  // A thread is a full-screen conversation of its own, so the page chrome steps aside.
  const isThread = usePathname()?.startsWith("/thread/");

  if (isThread) return <MotionConfig reducedMotion="user">{children}</MotionConfig>;

  return (
    <MotionConfig reducedMotion="user">
      <main
        id="top"
        className="mx-auto flex w-full max-w-[1080px] min-w-0 flex-col gap-section-gap px-6 pt-16 pb-36 md:pt-20"
      >
        {children}
      </main>

      <Dock />
      <Contact />
    </MotionConfig>
  );
}
