import IDCard from "@/components/IDCard";
import Github from "@/components/Github";
import Links from "@/components/Links";
import { EXPERIENCE } from "@/lib/experience";

export default function About() {
  return (
    <>
      <div className="fade-up-enter flex flex-col gap-6">
        <IDCard />
      </div>

      <div
        className="fade-up-enter flex flex-col gap-4 text-[14px] leading-[1.4] text-ink"
        style={{ animationDelay: "60ms" }}
      >
        <p>
          I build things. Mostly agentic systems and real-time
          infrastructure — the kind where the constraint is actually
          real-time, not hypothetical.
        </p>
        <p>
          CS undergrad at VIT Bhopal, class of 2027. Most of what I
          actually know came from internships, not lectures.
        </p>
        <p>Stack: JavaScript, TypeScript, Python, GraphQL.</p>
        <p>
          Outside of work: 90&apos;s Bollywood, loud. And whatever weird
          project I haven&apos;t finished yet.
        </p>
      </div>

      <div className="fade-up-enter" style={{ animationDelay: "90ms" }}>
        <Github />
      </div>

      <div
        className="fade-up-enter flex flex-col gap-6 border-t border-border pt-6 text-[14px] leading-[1.4]"
        style={{ animationDelay: "120ms" }}
      >
        <p className="text-ink">Experience</p>

        <div className="relative flex flex-col gap-7">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[3px] w-px bg-border"
          />

          {EXPERIENCE.map((item) => {
            const current = item.date.includes("Present");
            return (
              <div key={item.company} className="relative pl-6">
                <span
                  aria-hidden
                  className={`absolute top-[5px] left-0 size-[7px] rounded-full ring-4 ring-bg ${
                    current ? "bg-ink" : "bg-neutral-300"
                  }`}
                />

                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                    <p className="text-ink">
                      <span className="font-normal">{item.role}</span>
                      <span className="text-muted"> · </span>
                      <Links
                        company={item.company}
                        url={item.url}
                        screenshot={item.screenshot}
                      />
                    </p>
                    <p className="shrink-0 text-[13px] text-muted tabular-nums">{item.date}</p>
                  </div>
                  <p className="text-[13px] leading-relaxed text-ink/75">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="fade-up-enter flex flex-col gap-4 text-[14px] leading-[1.4] text-ink"
        style={{ animationDelay: "180ms" }}
      >
        <p>
          I care more about a thing feeling right than looking impressive in
          a screenshot.
        </p>
        <p>
          Building something agentic, or just want to talk shop? My inbox
          is open.
        </p>
      </div>
    </>
  );
}
