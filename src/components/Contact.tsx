"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CONTACT_LINKS } from "@/lib/nav";

const item = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Contact() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Move focus into the panel when it opens and back to the tag when it closes,
  // so keyboard users never get stranded on a hidden control.
  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus({ preventScroll: true });
    } else if (wasOpen.current && containerRef.current?.contains(document.activeElement)) {
      tagRef.current?.focus({ preventScroll: true });
    }
    wasOpen.current = open;
  }, [open]);

  return (
    <div ref={containerRef} className="fixed top-0 right-0 z-50">
      <button
        ref={tagRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open contact information"
        className={`contact-tag flex items-end justify-start bg-[#f6d000] pb-3 pl-4 text-[14px] leading-6 text-[#1a1a1a] ${
          open ? "contact-tag-hidden" : ""
        }`}
      >
        Contact
      </button>

      <div
        role="dialog"
        aria-label="Contact information"
        className={`contact-panel absolute top-3 right-3 flex w-[min(260px,calc(100vw-24px))] flex-col gap-1 rounded-2xl bg-[#f6d000] p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_4px_rgba(20,20,20,0.06),0_18px_36px_-14px_rgba(20,20,20,0.35)] ${
          open ? "contact-panel-open" : "contact-panel-closed"
        }`}
      >
        <p className="contact-item px-3 pb-1 pt-2 text-[14px] leading-6 text-[#5c5326]" style={item(0)}>
          Reach me at:
        </p>
        {CONTACT_LINKS.map((link, i) => (
          <a
            key={link.label}
            ref={i === 0 ? firstLinkRef : undefined}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={item(i + 1)}
            className="contact-item contact-link flex min-h-10 items-center justify-between gap-3 rounded-lg px-3 text-[14px] leading-6 text-ink"
          >
            {link.label}
            <span aria-hidden className="contact-arrow">
              ↗
            </span>
          </a>
        ))}
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={item(CONTACT_LINKS.length + 1)}
          className="contact-item contact-toggle flex min-h-10 w-full items-center rounded-lg px-3 text-left text-[14px] leading-6 text-[#5c5326]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
