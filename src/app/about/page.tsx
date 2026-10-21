import Link from "next/link";
import IDCard from "@/components/IDCard";
import Github from "@/components/Github";
import Links from "@/components/Links";
import { ACHIEVEMENTS, EXPERIENCE } from "@/lib/experience";

const STATS = [
  { value: "11.5K", caption: "daily active users on my apps" },
  { value: "300", caption: "GitHub stars on ScreenREC" },
  { value: "2nd", caption: "place at Product Hunt" },
];

const stagger = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function About() {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-[300px_1fr] md:gap-16">
      <div className="relative z-20 md:sticky md:top-10 md:self-start">
        <IDCard />
      </div>

      <div className="flex min-w-0 flex-col gap-section-gap">
        <section className="fade-up-enter flex flex-col gap-6" style={stagger(60)}>
          <h1 className="font-display text-[clamp(44px,5vw,52px)] leading-[1.02] text-ink">About</h1>

          <div className="flex max-w-[560px] flex-col gap-4 text-[16px] leading-[1.6] tracking-[0.005em] text-ink/70">
            <p className="text-[20px] leading-[1.45] tracking-[-0.014em] text-ink">
              Hey, I&apos;m Sagnik. I build AI agents and the backend plumbing they run on.
            </p>
            <p>
              Final year CS at VIT Bhopal, which mostly means I learned the real stuff by shipping.
              Two internships did most of the teaching: mytribe in Bengaluru and IndianOil&apos;s
              refinery in Haldia.
            </p>
            <p>
              At mytribe I built a sales assistant that took provider onboarding from 45 minutes to
              18. At IndianOil I taught cameras to read number plates at three gates. Different
              worlds, same itch: find the slow thing and make it fast.
            </p>
            <p>
              Nights and weekends go to small tools I&apos;d actually use.{" "}
              <Link href="/work/screenrec" className="link-hover">
                ScreenREC
              </Link>{" "}
              is a free screen recorder that runs in your browser, and it has 300 stars on GitHub.
            </p>
            <p>
              Off the clock it&apos;s 90&apos;s Bollywood, way too loud, hackathons, and a desk with
              at least one unfinished project on it at all times.
            </p>
          </div>

          <dl className="grid max-w-[560px] grid-cols-3 gap-4 border-t border-border pt-6">
            {STATS.map((stat) => (
              <div key={stat.caption} className="flex flex-col gap-1.5">
                <dt className="font-display text-[32px] leading-none text-ink tabular-nums">{stat.value}</dt>
                <dd className="text-[13px] leading-[1.4] text-muted">{stat.caption}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="fade-up-enter" style={stagger(90)}>
          <Github />
        </div>

        <section className="fade-up-enter flex flex-col gap-6" style={stagger(120)}>
          <h2 className="font-display text-[32px] leading-[1.05] text-ink">Where I&apos;ve shipped</h2>

          <ol className="flex flex-col">
            {EXPERIENCE.map((item) => (
                <li
                  key={item.company}
                  className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-border py-5 first:pt-5 md:grid-cols-[128px_1fr]"
                >
                  <time className="text-[13px] leading-6 text-muted tabular-nums">{item.date}</time>

                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="text-[18px] font-medium leading-[1.3] tracking-[-0.012em] text-ink">{item.role}</h3>
                    <p className="text-[15px] leading-6 text-ink/70">
                      <Links company={item.company} url={item.url} screenshot={item.screenshot} />
                    </p>
                  </div>
                </li>
            ))}
          </ol>
        </section>

        <section className="fade-up-enter flex flex-col gap-5" style={stagger(150)}>
          <h2 className="font-display text-[32px] leading-[1.05] text-ink">Other stuff</h2>
          <ul className="surface-card divide-y divide-border/70 overflow-hidden">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.title} className="flex flex-col gap-1 px-5 py-4">
                <p className="text-[15px] font-medium tracking-[-0.006em] text-ink">{item.title}</p>
                <p className="text-[14px] leading-[1.55] text-ink/70">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="fade-up-enter flex flex-col items-start gap-5" style={stagger(180)}>
          <p className="max-w-[420px] font-display text-[clamp(28px,3.4vw,34px)] leading-[1.1] text-ink">
            Building something? Or just want to talk shop? My inbox is open.
          </p>
          <a
            href="mailto:sahoosagnik1@gmail.com"
            className="hero-cta relative inline-flex h-10 items-center rounded-full bg-ink px-5 text-[14px] font-medium leading-none tracking-[0.005em] text-bg active:scale-[0.96]"
          >
            Say hi
          </a>
        </section>
      </div>
    </div>
  );
}
