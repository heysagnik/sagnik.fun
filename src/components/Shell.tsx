"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Contact from "@/components/Contact";
import Dock from "@/components/Dock";

export default function Shell({ children }: { children: ReactNode }) {
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
