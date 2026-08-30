"use client";

import { useEffect, useState, type ReactNode } from "react";
import Contact from "@/components/Contact";
import Sidebar from "@/components/Sidebar";
import Clock from "@/components/Clock";
import { QUOTES } from "@/lib/quotes";

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <>
      <div
        id="top"
        className="mx-auto flex w-full max-w-[1000px] flex-col gap-12 px-6 pt-6 pb-page-y md:flex-row md:gap-content-gap md:pt-page-y"
      >
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col gap-section-gap">
          {children}

          <footer className="flex flex-col gap-1 border-t border-border pt-3 text-[14px] leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
            <Clock />
            <p>{quote.text}</p>
          </footer>
        </main>
      </div>

      <Contact />
    </>
  );
}
