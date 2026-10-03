"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface LinksProps {
  company: string;
  url: string;
  screenshot: string;
}

export default function Links({ company, url, screenshot }: LinksProps) {
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const getHostname = (linkUrl: string) => {
    try {
      return new URL(linkUrl).hostname.replace(/^www\./, "");
    } catch {
      return linkUrl;
    }
  };

  return (
    <span className="relative inline-block">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-hover"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const previewWidth = 280;
          const x =
            typeof window !== "undefined"
              ? Math.min(
                  Math.max(rect.left, 16),
                  window.innerWidth - previewWidth - 16
                )
              : rect.left;
          setHover({ x, y: rect.bottom + 8 });
        }}
        onMouseLeave={() => setHover(null)}
      >
        {company}
      </a>

      {hover &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="link-preview pointer-events-none fixed z-50 rounded-xl p-[3px] bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.22),0_4px_12px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.06]"
            style={{ left: hover.x, top: hover.y, width: 280, height: 175 }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[9px] bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshot}
                alt={`Screenshot of ${getHostname(url)}`}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[9px] ring-1 ring-inset ring-black/10" />
            </div>
          </div>,
          document.body
        )}
    </span>
  );
}
