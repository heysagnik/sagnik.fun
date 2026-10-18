import Logo from "@/components/Logo";
import { EXPERIENCE } from "@/lib/experience";

const stagger = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero() {
  const mytribe = EXPERIENCE.find((item) => item.company === "mytribe.in");

  return (
    <header className="flex max-w-[560px] flex-col gap-5">
      <div className="fade-up-enter w-fit" style={stagger(0)}>
        <Logo className="size-16" />
      </div>

      <h1
        className="fade-up-enter font-display text-[44px] leading-none text-ink"
        style={stagger(80)}
      >
        Sagnik Sahoo
      </h1>

      <div className="fade-up-enter flex flex-col gap-1.5 text-[16px] leading-[1.5]" style={stagger(160)}>
        <p className="text-ink">I build AI agents and the backend systems behind them.</p>
        {mytribe && (
          <p className="text-ink/70">
            Previously at{" "}
            <a
              href={mytribe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 align-bottom text-ink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/experience/mytribe-logo.png"
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-[5px] outline outline-1 -outline-offset-1 outline-black/10"
              />
              <span className="link-hover">mytribe</span>
            </a>
          </p>
        )}
      </div>

      <div className="fade-up-enter" style={stagger(240)}>
        <a
          href="#contact"
          className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[14px] leading-none text-bg transition-[transform,background-color] duration-150 ease-out hover:bg-ink/85 active:scale-[0.96]"
        >
          Contact me
        </a>
      </div>
    </header>
  );
}
