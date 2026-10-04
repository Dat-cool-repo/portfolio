import { ArrowDown } from "lucide-react";
import ComicPortrait from "./ComicPortrait";

// CSS-only entrance so the hero renders before (or without) JS.
const enter = (delay: number) => ({
  style: { "--delay": `${delay}s` } as React.CSSProperties,
});

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-28 pb-20 sm:px-10"
    >
      {/* Cover art: speed lines + two halftone blooms, all CSS. */}
      <div aria-hidden className="speed-lines pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="halftone pointer-events-none absolute -right-24 top-1/4 h-[34rem] w-[34rem] rounded-full opacity-60"
        style={{ "--dot-color": "#000", "--dot": "11px", maskImage: "radial-gradient(circle, #000 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, #000 20%, transparent 70%)" } as React.CSSProperties}
      />
      <div
        aria-hidden
        className="halftone pointer-events-none absolute -left-20 -top-10 h-80 w-80 rounded-full opacity-40"
        style={{ "--dot-color": "var(--accent-3)", "--dot": "9px", maskImage: "radial-gradient(circle, #000 15%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, #000 15%, transparent 70%)" } as React.CSSProperties}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p {...enter(0)} className="pop-in caption -rotate-1">
            UF Computer Engineering &apos;27 · Open to ML &amp; AI roles
          </p>

          <h1
            {...enter(0.1)}
            className="pop-in font-display misprint mt-6 text-6xl uppercase leading-[0.95] tracking-wide sm:text-8xl lg:text-7xl xl:text-[7.5rem]"
          >
            I build systems
            <br />
            <span className="text-accent-3">&amp; chase ideas</span>
            <br />
            worth testing.
          </h1>

          <div
            style={{ "--delay": "0.25s", "--shadow": "var(--accent-1)" } as React.CSSProperties}
            className="pop-in panel mt-10 max-w-xl p-5 sm:p-6"
          >
            <p className="text-base leading-relaxed text-paper-ink sm:text-lg">
              I&apos;m <strong>Dat Le</strong>, an ML engineer in training at the University of
              Florida. I&apos;ve shipped models over 50M-row production pipelines, published
              computer-vision research, and I&apos;m now tracing fine-tuned behavior back to
              individual training tokens on Gemma-3 12B.
            </p>
          </div>

          <div {...enter(0.35)} className="pop-in mt-10 flex flex-wrap items-center gap-5">
            <a href="#experience" data-cursor-hover className="ink-btn bg-accent-3 text-paper-ink">
              See my work
            </a>
            <a href="#research" data-cursor-hover className="ink-btn bg-accent-1 text-paper-ink">
              Research
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <ComicPortrait />
        </div>
      </div>

      <a
        href="#projects"
        data-cursor-hover
        aria-label="Scroll to projects"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 border-[3px] border-black bg-paper-ink px-3 py-1.5 text-foreground shadow-[3px_3px_0_0_#000] transition-colors hover:text-accent-3"
      >
        <span className="font-display text-sm tracking-[0.3em]">Scroll</span>
        <ArrowDown size={18} className="motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
