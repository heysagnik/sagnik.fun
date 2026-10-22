import Link from "next/link";
import IDCard from "@/components/IDCard";
import Github from "@/components/Github";
import Links from "@/components/Links";
import Awards from "@/components/Awards";
import Stickers from "@/components/Stickers";
import { EXPERIENCE } from "@/lib/experience";

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
              is a free screen recorder that runs in your browser, and the one most people know. Across my repos I&apos;m past 300 GitHub stars.
            </p>
            <p>
              Off the clock it&apos;s 90&apos;s Bollywood, way too loud, hackathons, and a desk with
              at least one unfinished project on it at all times.
            </p>
          </div>

          <div className="max-w-[560px] border-t border-border pt-6">
            <Stickers />
          </div>
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
                className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-border py-5 md:grid-cols-[128px_1fr]"
              >
                <time className="text-[13px] leading-6 text-muted tabular-nums">{item.date}</time>

                <div className="flex min-w-0 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logo}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-[10px] outline outline-1 -outline-offset-1 outline-black/10"
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="text-[18px] font-medium leading-[1.3] tracking-[-0.012em] text-ink">{item.role}</h3>
                    <p className="text-[15px] leading-6 text-ink/70">
                      <Links company={item.company} url={item.url} screenshot={item.screenshot} />
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="fade-up-enter flex flex-col gap-5" style={stagger(150)}>
          <h2 className="font-display text-[32px] leading-[1.05] text-ink">Awards</h2>
          <Awards />
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
