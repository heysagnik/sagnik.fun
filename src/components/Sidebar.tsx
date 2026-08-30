"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV } from "@/lib/nav";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-sidebar-gap md:sticky md:top-page-y md:w-sidebar md:shrink-0 md:self-start">
      <div className="flex flex-col gap-sidebar-block">
        <div className="fade-up-enter">
          <h1 className="text-[14px] leading-6 text-ink">Sagnik Sahoo</h1>
          <p className="text-[14px] leading-6 text-muted">Software Developer</p>
        </div>

        <div
          className="fade-up-enter flex flex-col gap-4 text-[14px] leading-6 text-ink"
          style={{ animationDelay: "60ms" }}
        >
          <p>I build agentic systems and real-time infrastructure.</p>
          <p>Open source enthusiast. 90&apos;s Bollywood, loud.</p>
          <p>
            Based in India — feel free to{" "}
            <a
              href="mailto:sahoosagnik1@gmail.com"
              className="link-hover"
            >
              say hi
            </a>
            .
          </p>
        </div>

        <p
          className="fade-up-enter text-[14px] leading-6 text-ink"
          style={{ animationDelay: "120ms" }}
        >
          Find me on{" "}
          <a
            href="https://x.com/heysagnik"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover"
          >
            X
          </a>
          ,{" "}
          <a
            href="https://github.com/heysagnik"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover"
          >
            GitHub
          </a>{" "}
          or{" "}
          <a
            href="https://www.linkedin.com/in/heysagnik/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover"
          >
            LinkedIn
          </a>
        </p>

        <nav
          className="fade-up-enter flex flex-row items-center gap-3 text-[14px] leading-6 md:flex-col md:items-start md:gap-1"
          style={{ animationDelay: "180ms" }}
        >
          {NAV.map((item) => {
            const isActive =
              pathname === item.match || (item.match === "/work" && (pathname === "/" || pathname?.startsWith("/work")));

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="relative px-2.5 py-0.5 rounded-[2px] text-ink transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="figma-select-box"
                    className="absolute inset-0 pointer-events-none border border-[#0d99ff] bg-[#0d99ff]/[0.06]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  >
                    <span className="absolute -top-[3px] -left-[3px] size-[5px] border border-[#0d99ff] bg-white" />
                    <span className="absolute -top-[3px] -right-[3px] size-[5px] border border-[#0d99ff] bg-white" />
                    <span className="absolute -bottom-[3px] -left-[3px] size-[5px] border border-[#0d99ff] bg-white" />
                    <span className="absolute -bottom-[3px] -right-[3px] size-[5px] border border-[#0d99ff] bg-white" />
                  </motion.div>
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
