import Link from "next/link";
import IDCard from "@/components/IDCard";
import Github from "@/components/Github";
import Links from "@/components/Links";
import { ACHIEVEMENTS, EXPERIENCE } from "@/lib/experience";

const SECTION = "fade-up-enter flex flex-col gap-5";

export default function About() {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[300px_1fr] md:gap-16">
      <div className="fade-up-enter md:sticky md:top-10 md:self-start">
        <IDCard />
      </div>

      <div className="flex min-w-0 flex-col gap-section-gap">
        <div className="fade-up-enter flex flex-col gap-5" style={{ animationDelay: "60ms" }}>
          <h1 className="font-display text-[44px] leading-none text-ink">About</h1>
          <div className="flex max-w-[560px] flex-col gap-4 text-[16px] leading-[1.5] text-ink">
            <p>Hey, I&apos;m Sagnik. I build software, mostly the AI and backend side.</p>
            <p>
              I&apos;m in my last year of CS at VIT Bhopal. Most of what I&apos;ve
              learned came from two internships: mytribe in Bengaluru, and
              IndianOil&apos;s refinery in Haldia.
            </p>
            <p>
              At mytribe I built a sales assistant that took provider onboarding
              from 45 minutes to 18. At IndianOil I got cameras reading number
              plates at three gates.
            </p>
            <p>
              On the side I make small tools. One of them,{" "}
              <Link href="/work/diy-analytics" className="link-hover">diy-analytics</Link>,
              is analytics without cookies. It has 200 stars on GitHub.
            </p>
            <p>
              I listen to a lot of 90&apos;s Bollywood, usually too loud, and
              there&apos;s always some unfinished project on my desk.
            </p>
          </div>
        </div>

        <div className="fade-up-enter" style={{ animationDelay: "90ms" }}>
          <Github />
        </div>

        <section className={SECTION} style={{ animationDelay: "120ms" }}>
          <h2 className="font-display text-[34px] leading-none text-ink">Experience</h2>
          <div className="grid grid-cols-1 gap-4">
            {EXPERIENCE.map((item) => {
              const current = item.date.includes("Present");
              return (
                  <article key={item.company} className="flex h-full flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_14px_30px_-20px_rgba(20,20,20,0.4)]">
                    <div className="flex items-center justify-between gap-3 text-[12px] text-muted">
                      <span className="tabular-nums">{item.date}</span>
                      {current && (
                        <span className="flex items-center gap-1.5 text-[#1d5a19]">
                          <span className="size-1.5 animate-pulse rounded-full bg-[#3fa73a]" />
                          now
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] leading-snug text-ink">
                      {item.role}
                      <span className="text-muted"> · </span>
                      <Links company={item.company} url={item.url} screenshot={item.screenshot} />
                    </p>
                    <p className="text-[13px] leading-relaxed text-ink/75">{item.description}</p>
                  </article>
              );
            })}
          </div>
        </section>

        <section className={SECTION}>
          <h2 className="font-display text-[34px] leading-none text-ink">Other things</h2>
          <ul className="flex flex-col gap-3 pt-2 text-[14px] leading-[1.4]">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.title} className="flex flex-col gap-0.5">
                <span className="text-ink">{item.title}</span>
                <span className="text-[13px] leading-relaxed text-ink/75">{item.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="fade-up-enter flex flex-col gap-3 text-[16px] leading-[1.5] text-ink">
                    <p>
            Building something, or just want to talk shop?{" "}
            <a href="mailto:sahoosagnik1@gmail.com" className="link-hover">Say hi.</a>
          </p>
        </div>
      </div>
    </div>
  );
}
