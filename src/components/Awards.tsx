"use client";

import type { CSSProperties } from "react";
import { resetPointer, trackPointer } from "@/lib/tilt";
import { AWARDS, type Award } from "@/lib/experience";

const TILTS = ["-3deg", "2deg", "-1.5deg", "3deg", "-2.5deg", "1.5deg"];

// The placing is a label stuck across the bottom edge, coloured by tier.
const LABEL: Record<Award["tier"], string> = {
  gold: "from-[#ffe9a0] to-[#f0b429] text-[#5e3b00]",
  silver: "from-[#f6f6f9] to-[#c4c6d0] text-[#3e414d]",
  bronze: "from-[#f8d9b9] to-[#dd9556] text-[#5f3208]",
};

export default function Awards() {
  return (
    <ul className="grid grid-cols-3 gap-x-3 gap-y-7 pb-3 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-6">
      {AWARDS.map(({ name, logo, position, tier, background, padding = "16%" }, i) => (
        <li
          key={name}
          title={`${position}, ${name}`}
          onPointerMove={trackPointer}
          onPointerLeave={resetPointer}
          className="sticker relative aspect-square w-full rounded-[22px] bg-white p-1 sm:size-20"
          style={{ "--tilt": TILTS[i % TILTS.length] } as CSSProperties}
        >
          <div
            className="sticker-face grid size-full place-items-center rounded-[18px]"
            style={{ background, padding }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={name} draggable={false} className="max-h-full max-w-full object-contain" />
          </div>
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full bg-gradient-to-b px-2.5 py-1 text-[11px] font-semibold leading-none shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_0_0_2px_#fff,0_2px_4px_rgb(0_0_0/0.2)] ${LABEL[tier]}`}
          >
            {position}
          </span>
        </li>
      ))}
    </ul>
  );
}
