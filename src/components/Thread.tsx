"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ChevronLeft } from "lucide-react";
import { ask } from "@/lib/ask";
import { applyLiquidGlass } from "@/lib/liquid-glass";
import { createMessage, loadThread, saveThread, type ThreadMessage } from "@/lib/thread";

const SPRING = { type: "spring", duration: 0.35, bounce: 0 } as const;
const FRESH_WINDOW_MS = 3000; // messages this recent (or newer) animate in; older history just appears

const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

function Bubble({ message, tail, fresh }: { message: ThreadMessage; tail: boolean; fresh: boolean }) {
  const outgoing = message.role === "user";
  return (
    <motion.div
      initial={fresh ? { opacity: 0, scale: 0.85, y: 8 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={SPRING}
      style={{ transformOrigin: outgoing ? "bottom right" : "bottom left" }}
      className={`bubble ${outgoing ? "bubble-out" : "bubble-in"} ${tail ? "bubble-tail" : ""}`}
    >
      {message.text}
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
      transition={SPRING}
      style={{ transformOrigin: "bottom left" }}
      role="status"
      aria-label="Sagnik is typing"
      className="bubble bubble-in bubble-tail mt-3 flex w-fit items-center gap-1 !py-3.5"
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </motion.div>
  );
}

export default function Thread({ id }: { id: string }) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const openedAt = useRef(Date.now());
  const glassCleanups = useRef<(() => void)[]>([]);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  // The visual viewport shrinks when a phone keyboard opens; sizing to it keeps the composer above the keys.
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);

  useEffect(() => {
    setMessages(loadThread(id));
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    if (loaded) saveThread(id, messages);
  }, [id, loaded, messages]);

  useEffect(() => {
    const visual = window.visualViewport;
    if (!visual) return;
    const update = () => setViewport({ height: visual.height, top: visual.offsetTop });
    update();
    visual.addEventListener("resize", update);
    visual.addEventListener("scroll", update);
    return () => {
      visual.removeEventListener("resize", update);
      visual.removeEventListener("scroll", update);
    };
  }, []);

  // Answer the newest message of mine that has no reply yet: a beat, the typing dots, then the answer.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!loaded || last?.role !== "user") return;
    const answer = ask(last.text);
    const showTyping = setTimeout(() => setTyping(true), 350);
    const send = setTimeout(() => {
      setTyping(false);
      setMessages((current) => [...current, createMessage("assistant", answer)]);
    }, 350 + Math.min(1600, 600 + answer.length * 10));
    return () => {
      clearTimeout(showTyping);
      clearTimeout(send);
    };
  }, [loaded, messages]);

  useEffect(() => {
    const el = list.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, viewport?.height]);

  const releaseGlass = () => {
    glassCleanups.current.forEach((cleanup) => cleanup());
    glassCleanups.current = [];
  };

  useEffect(() => releaseGlass, []);

  // Every [data-glass] control (back button, name capsule, composer) gets the refraction treatment.
  const applyGlass = () => {
    releaseGlass();
    root.current?.querySelectorAll<HTMLElement>("[data-glass]").forEach((el) => {
      const cleanup = applyLiquidGlass(el, -60);
      if (cleanup) glassCleanups.current.push(cleanup);
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, createMessage("user", text)]);
    setDraft("");
    input.current?.focus({ preventScroll: true });
  };

  const goBack = () => (window.history.length > 1 ? router.back() : router.push("/work"));
  const last = messages[messages.length - 1];

  return (
    <div
      ref={root}
      style={{ height: viewport?.height ?? "100dvh", top: viewport?.top ?? 0 }}
      className="thread-enter fixed inset-x-0 z-[60] overflow-hidden bg-white"
    >
      <Script src="/liquid-glass.js" strategy="lazyOnload" onReady={applyGlass} />

      {/* Messages run edge to edge and scroll beneath the floating glass controls. */}
      <div ref={list} className="absolute inset-0 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full w-full max-w-[680px] flex-col px-4 pt-[calc(88px+env(safe-area-inset-top))] pb-[calc(88px+env(safe-area-inset-bottom))]">
          {loaded && messages.length === 0 && (
            <p className="m-auto text-center text-[14px] leading-6 text-muted">
              Say hi. Ask about my work, stack or experience.
            </p>
          )}

          {messages.length > 0 && (
            <p className="pb-3 text-center text-[11px] leading-none text-muted">
              <span className="font-semibold">Today</span> {timeFormat.format(messages[0].at)}
            </p>
          )}

          {messages.map((message, i) => {
            const startsGroup = messages[i - 1]?.role !== message.role;
            const endsGroup = messages[i + 1]?.role !== message.role;
            return (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} ${startsGroup ? "mt-3 first:mt-0" : "mt-0.5"}`}
              >
                <Bubble message={message} tail={endsGroup} fresh={message.at > openedAt.current - FRESH_WINDOW_MS} />
                {message === last && message.role === "user" && (
                  <p className="pt-1 pr-1 text-[11px] leading-none font-medium text-muted">Delivered</p>
                )}
              </div>
            );
          })}

          <AnimatePresence>{typing && <TypingBubble />}</AnimatePresence>
        </div>
      </div>

      <div aria-hidden className="scroll-edge scroll-edge-top" />
      <div aria-hidden className="scroll-edge scroll-edge-bottom" />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 pt-[max(8px,env(safe-area-inset-top))]">
        <button
          type="button"
          data-glass
          onClick={goBack}
          aria-label="Back"
          className="glass pointer-events-auto grid size-11 place-items-center rounded-full text-[#0a84ff] transition-transform duration-150 ease-out active:scale-[0.92]"
        >
          <ChevronLeft className="size-6 -translate-x-px -translate-y-px" strokeWidth={2.25} aria-hidden />
        </button>

        <div data-glass className="glass flex h-11 items-center gap-2 rounded-full py-1 pr-4 pl-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/apple-touch-icon.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
          />
          <p className="text-[15px] leading-none font-medium text-ink">Sagnik</p>
        </div>

        <div aria-hidden className="size-11" />
      </header>

      <form
        onSubmit={submit}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-3 pb-[max(10px,env(safe-area-inset-bottom))]"
      >
        <div
          data-glass
          className="glass pointer-events-auto mx-auto flex h-12 w-full max-w-[680px] items-center rounded-full pr-1.5 pl-5"
        >
          <input
            ref={input}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message"
            aria-label="Message Sagnik"
            autoComplete="off"
            enterKeyHint="send"
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] leading-none text-ink outline-none placeholder:text-black/40"
          />
          <AnimatePresence initial={false}>
            {draft.trim() && (
              <motion.button
                type="submit"
                aria-label="Send"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={SPRING}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0a84ff] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] active:scale-[0.92]"
              >
                <ArrowUp className="size-[18px]" strokeWidth={2.75} aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
