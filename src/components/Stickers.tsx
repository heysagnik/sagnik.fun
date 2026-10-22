"use client";

import type { CSSProperties } from "react";
import { resetPointer, trackPointer } from "@/lib/tilt";
import { STICKERS, type StickerIcon } from "@/lib/experience";

// Alternating tilt, so the row reads as stickers pressed on by hand.
const TILTS = ["-2.5deg", "1.5deg", "-1deg"];

// Soft 3D glyphs: gradient body, specular highlight, contact shadow, tiny face. 100x100 viewBox.
const SHADOW = <ellipse cx="50" cy="92" rx="26" ry="4.5" fill="#000" opacity="0.14" />;

function Face({ x = 50, y = 56 }: { x?: number; y?: number }) {
  return (
    <>
      <ellipse cx={x - 8} cy={y} rx="2.6" ry="3.2" fill="#2b1d12" />
      <ellipse cx={x + 8} cy={y} rx="2.6" ry="3.2" fill="#2b1d12" />
      <circle cx={x - 14} cy={y + 6} r="3.6" fill="#ff8aa1" opacity="0.55" />
      <circle cx={x + 14} cy={y + 6} r="3.6" fill="#ff8aa1" opacity="0.55" />
      <path d={`M${x - 4} ${y + 5.5}q4 4 8 0`} fill="none" stroke="#2b1d12" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Medal() {
  return (
    <svg viewBox="10 8 80 88" className="size-[4.5rem]" aria-hidden>
      <defs>
        <linearGradient id="medal-disc" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#f4f4f6" />
          <stop offset="1" stopColor="#9a9aa4" />
        </linearGradient>
        <linearGradient id="medal-ribbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a3c" />
          <stop offset="1" stopColor="#e4640f" />
        </linearGradient>
      </defs>
      {SHADOW}
      <path d="m30 52-11 36 17-8 8 12 8-34z" fill="url(#medal-ribbon)" />
      <path d="m70 52 11 36-17-8-8 12-8-34z" fill="#d4580a" />
      <circle cx="50" cy="38" r="29" fill="url(#medal-disc)" />
      <circle cx="50" cy="38" r="22" fill="#d3d3da" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" />
      <text x="50" y="49" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" stroke="#8d8d98" strokeWidth="1" paintOrder="stroke">
        2
      </text>
      <ellipse cx="38" cy="22" rx="9" ry="4.5" transform="rotate(-35 38 22)" fill="#fff" opacity="0.75" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="10 8 80 88" className="size-[4.5rem]" aria-hidden>
      <defs>
        <linearGradient id="star-body" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffe873" />
          <stop offset="1" stopColor="#ffa800" />
        </linearGradient>
      </defs>
      {SHADOW}
      <polygon
        points="50.0,18.0 59.4,38.1 81.4,40.8 65.2,55.9 69.4,77.7 50.0,67.0 30.6,77.7 34.8,55.9 18.6,40.8 40.6,38.1"
        fill="url(#star-body)"
        stroke="url(#star-body)"
        strokeWidth="12"
        strokeLinejoin="round"
      />
      <ellipse cx="40" cy="30" rx="7" ry="3.5" transform="rotate(-40 40 30)" fill="#fff" opacity="0.8" />
      <Face y={54} />
    </svg>
  );
}

function Users() {
  return (
    <svg viewBox="10 8 80 88" className="size-[4.5rem]" aria-hidden>
      <defs>
        <linearGradient id="users-front" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#6ee7a8" />
          <stop offset="1" stopColor="#14a35c" />
        </linearGradient>
        <linearGradient id="users-back" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#b6f3d2" />
          <stop offset="1" stopColor="#6fd3a1" />
        </linearGradient>
      </defs>
      {SHADOW}
      <circle cx="70" cy="34" r="11" fill="url(#users-back)" />
      <path d="M54 72c0-12 7-20 16-20s16 8 16 20z" fill="url(#users-back)" />
      <circle cx="42" cy="36" r="15" fill="url(#users-front)" />
      <path d="M18 84c0-18 10-30 24-30s24 12 24 30z" fill="url(#users-front)" />
      <ellipse cx="36" cy="27" rx="6" ry="3" transform="rotate(-35 36 27)" fill="#fff" opacity="0.7" />
      <Face x={42} y={38} />
    </svg>
  );
}

const ART: Record<StickerIcon, () => React.JSX.Element> = { medal: Medal, users: Users, star: Star };

// Pastel face (dark text clears 7:1 on each) plus the glyph's own colour.
const FACE: Record<StickerIcon, string> = {
  medal: "from-[#ffe6d6] to-[#ffc7a3] text-[#4f220a]",
  users: "from-[#dcf6e6] to-[#b3e9cf] text-[#0d412a]",
  star: "from-[#fff3bd] to-[#ffdf78] text-[#4d3800]",
};

export default function Stickers() {
  return (
    <ul className="grid grid-cols-3 gap-3">
      {STICKERS.map(({ icon, kicker, title }, i) => {
        const Art = ART[icon];
        return (
        <li
          key={title}
          onPointerMove={trackPointer}
          onPointerLeave={resetPointer}
          className="sticker rounded-[26px] bg-white p-1"
          style={{ "--tilt": TILTS[i % TILTS.length] } as CSSProperties}
        >
          <div
            className={`sticker-face flex aspect-[4/5] flex-col items-center rounded-[22px] bg-gradient-to-br p-3 min-[420px]:p-3.5 ${FACE[icon]}`}
          >
            <span className="grid flex-1 place-items-center">
              <Art />
            </span>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.06em] opacity-70">{kicker}</p>
              <p className="text-[14px] font-semibold leading-tight tracking-[-0.01em] min-[420px]:text-[15px]">{title}</p>
            </div>
          </div>
        </li>
        );
      })}
    </ul>
  );
}
