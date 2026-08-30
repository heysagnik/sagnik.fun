"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_LINKS } from "@/lib/nav";

export default function Contact() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="fixed top-0 right-0 z-50">
      <button
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
        className={`contact-panel absolute top-3 right-3 flex w-[240px] flex-col gap-3 rounded-2xl bg-[#f6d000] px-5 py-4 shadow-lg ${
          open ? "contact-panel-open" : "contact-panel-closed"
        }`}
      >
        <p className="text-[14px] leading-6 text-[#5c5326]">Reach me at:</p>
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link inline-flex w-fit items-center gap-1 text-[14px] leading-6 text-ink"
          >
            {link.label}
            <span aria-hidden>↗</span>
          </a>
        ))}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="contact-toggle w-fit text-[14px] leading-6 text-[#5c5326]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
