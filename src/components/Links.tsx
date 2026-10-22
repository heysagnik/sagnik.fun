"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const PREVIEW = { width: 280, height: 175, margin: 16 };

interface LinksProps {
  company: string;
  url: string;
  screenshot: string;
}

export default function Links({ company, url, screenshot }: LinksProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  function showPreview(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const maxX = window.innerWidth - PREVIEW.width - PREVIEW.margin;
    setPosition({ x: Math.min(Math.max(rect.left, PREVIEW.margin), maxX), y: rect.bottom + 8 });
  }

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-hover"
        onMouseEnter={showPreview}
        onMouseLeave={() => setPosition(null)}
      >
        {company}
      </a>

      {position &&
        createPortal(
          <div
            className="link-preview pointer-events-none fixed z-50 rounded-xl border border-white/80 bg-white/60 p-[3px] shadow-[0_16px_36px_-8px_rgba(0,0,0,0.22),0_4px_12px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.06] backdrop-blur-md"
            style={{ left: position.x, top: position.y, width: PREVIEW.width, height: PREVIEW.height }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshot}
              alt={`Screenshot of ${company}`}
              className="size-full rounded-[9px] bg-stone-100 object-cover object-top outline outline-1 -outline-offset-1 outline-black/10"
            />
          </div>,
          document.body
        )}
    </>
  );
}
