import Image from "next/image";

// Drop a photo in /public (e.g. /public/portrait.jpg) and set its path here.
// A clear, front-facing headshot works best — the comic treatment is applied in CSS.
const PORTRAIT_SRC: string | null = "/portrait-headshot.jpg";

export default function ComicPortrait() {
  return (
    <div
      data-impact="var(--accent-2)"
      data-impact-word="HEY!"
      className="impact pop-in relative mx-auto w-full max-w-[300px]"
      style={{ "--delay": "0.3s", "--burst": "var(--accent-2)" } as React.CSSProperties}
    >
      <div aria-hidden className="impact-burst" />

      {/* Speech bubble */}
      <div className="absolute -left-16 -top-8 z-20 -rotate-3">
        <p className="bubble bubble-tail-right whitespace-nowrap px-5 py-3 font-display text-2xl uppercase leading-none tracking-wide">
          Hey! I&apos;m Dat.
        </p>
      </div>

      {/* Portrait panel */}
      <figure
        className="panel impact-card relative rotate-2 overflow-hidden p-2"
        style={{ "--shadow": "var(--accent-2)" } as React.CSSProperties}
      >
        <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-black bg-paper-ink">
          {PORTRAIT_SRC ? (
            <Image
              src={PORTRAIT_SRC}
              alt="Portrait of Dat"
              fill
              priority
              sizes="300px"
              className="portrait-photo object-cover"
            />
          ) : (
            <PlaceholderSilhouette />
          )}
          {/* Light halftone screen; the photo itself stays in full color. */}
          <div
            aria-hidden
            className="halftone pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ "--dot-color": "rgb(0 0 0 / 0.12)", "--dot": "5px" } as React.CSSProperties}
          />
          {!PORTRAIT_SRC && (
            <span className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap border-2 border-black bg-accent-3 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-paper-ink">
              Your photo here
            </span>
          )}
        </div>
        <figcaption className="mt-2 px-1 text-right font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper-ink">
          Our hero · Earth-2026
        </figcaption>
      </figure>

      {/* Issue box pinned to the panel corner */}
      <div
        aria-hidden
        className="absolute -right-6 -top-10 z-10 rotate-6 border-[3px] border-black bg-paper px-3 py-2 text-center text-paper-ink shadow-[5px_5px_0_0_var(--accent-1)]"
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Vol. 01</p>
        <p className="font-display text-4xl leading-none">#26</p>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">New grad</p>
      </div>

      {/* Starburst sticker */}
      <div
        aria-hidden
        className="burst animate-wobble absolute -bottom-20 -left-16 z-20 flex h-32 w-32 items-center justify-center bg-accent-3"
      >
        <span className="font-display -rotate-6 text-center text-2xl leading-none text-paper-ink">
          Open to
          <br />
          work!
        </span>
      </div>
    </div>
  );
}

function PlaceholderSilhouette() {
  return (
    <div className="absolute inset-0 flex items-end justify-center bg-accent-2/30">
      <svg viewBox="0 0 200 250" className="h-[92%] w-auto" aria-hidden>
        <circle cx="100" cy="88" r="46" fill="#140c1f" />
        <path d="M18 250c0-58 37-96 82-96s82 38 82 96Z" fill="#140c1f" />
      </svg>
    </div>
  );
}
