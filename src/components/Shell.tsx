"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Contact from "@/components/Contact";
import Dock from "@/components/Dock";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        id="top"
        className="mx-auto flex w-full max-w-[1080px] flex-col gap-section-gap px-6 pt-16 pb-36 md:pt-20"
      >
        <main className="flex min-w-0 flex-1 flex-col gap-section-gap">{children}</main>
      </div>

      <Dock />
      <Contact />
    </MotionConfig>
  );
}
