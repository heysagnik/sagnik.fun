"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DOCK } from "@/lib/nav";
import { ask } from "@/lib/ask";

declare global {
  interface Window {
    liquidGlass?: (el: Element, opts?: { scale?: number }) => { supported: boolean; destroy: () => void };
  }
}

const ITEM =
  "relative flex h-10 items-center rounded-full px-4 text-[14px] leading-none transition-transform duration-150 ease-out active:scale-[0.96]";

const SPRING = { type: "spring", duration: 0.4, bounce: 0 } as const;
const BLUR_FADE = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
  transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
} as const;

export default function Dock() {
  const pathname = usePathname() ?? "";
  const pill = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const askButton = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [reply, setReply] = useState<{ q: string; a: string } | null>(null);

  // Optional refraction (Chromium only). Skipped when the visitor asks for less transparency;
  // elsewhere the library applies a plain frosted blur and `.glass` keeps its own styling.
  const applyLiquidGlass = () => {
    const el = pill.current;
    if (!el || !window.liquidGlass) return;
    if (window.matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more)").matches) return;
    if (window.liquidGlass(el, { scale: -70 }).supported) el.classList.add("glass-liquid");
  };

  const close = () => {
    setOpen(false);
    setValue("");
    setReply(null);
  };

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) askButton.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    input.current?.focus({ preventScroll: true });

    const onPointerDown = (e: PointerEvent) => {
      if (!pill.current?.parentElement?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Mobile keyboards cover the bottom of the screen without resizing the layout, so lift the dock by
  // however much of the visual viewport the keyboard takes while the chat input is open.
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!open || !viewport) return;
    const update = () => setKeyboardHeight(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop));
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      setKeyboardHeight(0);
    };
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    setReply({ q, a: ask(q) });
    setValue("");
  };

  return (
    <nav
      aria-label="Primary"
      style={keyboardHeight ? { bottom: keyboardHeight + 8 } : undefined}
      className="fixed bottom-5 left-1/2 z-40 flex w-[min(560px,calc(100vw-32px))] -translate-x-1/2 flex-col items-center gap-2"
    >
      <Script src="/liquid-glass.js" strategy="lazyOnload" onReady={applyLiquidGlass} />

      <AnimatePresence>
        {open && reply && (
          <motion.div
            key={reply.q}
            role="status"
            initial={{ opacity: 0, y: 8, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }}
            transition={SPRING}
            style={{ transformOrigin: "bottom center" }}
            className="glass w-full rounded-3xl px-5 py-4 text-[14px] leading-[1.55] text-ink"
          >
            <p className="text-muted">{reply.q}</p>
            <p className="mt-1">{reply.a}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={pill}
        layout
        transition={SPRING}
        style={{ borderRadius: 9999 }}
        className={`glass flex items-center p-1 ${open ? "w-full" : "w-auto"}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.form
              key="chat"
              onSubmit={submit}
              {...BLUR_FADE}
              className="flex w-full items-center gap-2 pl-4"
            >
              <input
                ref={input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask me anything"
                aria-label="Ask Sagnik a question"
                autoComplete="off"
                enterKeyHint="send"
                className="h-10 min-w-0 flex-1 bg-transparent text-[16px] leading-none text-ink outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!value.trim()}
                className="relative grid size-10 shrink-0 place-items-center rounded-full bg-ink text-bg transition-[transform,opacity] duration-150 ease-out active:scale-[0.96] disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="links"
              {...BLUR_FADE}
              className="flex items-center gap-1"
            >
              {DOCK.map((item) => {
                const active = pathname === item.match || pathname.startsWith(`${item.match}/`);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={ITEM}
                  >
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
                  </Link>
                );
              })}
              <button
                ref={askButton}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                className={`${ITEM} text-ink hover:bg-black/5`}
              >
                Ask me
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
