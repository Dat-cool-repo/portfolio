import { boilFrames, scribble, wobblyLine } from "@/lib/sketch";

/*
 * Hobie-style "living zine" layers for a .punk-box: like a punk show flyer
 * torn off a telephone pole. On hover the box gets pasted onto torn
 * newsprint, red/blue halftone plates slip out of register behind it, a
 * ransom-note headline slams in above it, cut-out clippings and safety pins
 * get slapped on, and a red marker scribble boils around it. Like Hobie,
 * every layer runs at its own frame rate (see the .zine-* / .ransom rules in
 * globals.css). The page around it goes to photocopy (SectionThemes.tsx).
 */

const CLIP_STYLES = [
  "bg-[#e8112d] text-white font-display",
  "bg-white text-black font-mono",
  "bg-[#ffe14d] text-[#1d3fbb] [font-family:Georgia,serif] italic",
  "bg-black text-[#ffe14d] font-display",
];

// Straddle the box's edges (top-right corner, bottom border) so they never
// sit over the box's content.
const SPOTS = ["-right-4 -top-5 rotate-6", "-left-4 -bottom-6 -rotate-6", "right-10 -bottom-7 rotate-3"];

// Each ransom letter cut from a different "magazine".
const LETTER_STYLES = [
  "bg-[#e8112d] text-white font-display",
  "bg-white text-black [font-family:Georgia,serif] font-bold",
  "bg-black text-[#ffe14d] font-mono font-bold",
  "bg-[#ffe14d] text-[#e8112d] font-display",
  "bg-[#1d3fbb] text-white [font-family:Georgia,serif] italic font-bold",
  "bg-[#f6f1e4] text-[#1d3fbb] font-display",
];

const SCRIBBLE = boilFrames(4, 1977, (layout, jitter) => {
  const box = (i: number, amp: number) =>
    [
      wobblyLine([i, i], [100 - i, i], jitter, amp, 0.04),
      wobblyLine([100 - i, i], [100 - i, 100 - i], jitter, amp, 0.04),
      wobblyLine([100 - i, 100 - i], [i, 100 - i], jitter, amp, 0.04),
      wobblyLine([i, 100 - i], [i, i], jitter, amp, 0.04),
    ].join("");
  return {
    red: box(2, 1.2) + box(4, 1.6),
    black: box(1, 0.8) + scribble([96, 6], 10, 14, layout, jitter, 5) + scribble([4, 94], 10, 14, layout, jitter, 5),
  };
});

function Pin({ className }: { className: string }) {
  return (
    <svg aria-hidden className={`zine-pin ${className}`} viewBox="0 0 54 22">
      <path d="M6 11 H44 A8 8 0 1 0 44 3 H12" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" />
      <path d="M6 11 H44 A8 8 0 1 0 44 3 H12" fill="none" stroke="#d9d9d9" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="2" y="1" width="12" height="20" rx="2" fill="#ffe14d" stroke="#000" strokeWidth="2.5" />
    </svg>
  );
}

export default function ZineCut({ words, headline }: { words: string[]; headline: string }) {
  return (
    <>
      <span aria-hidden className="zine-plate zine-plate-red" />
      <span aria-hidden className="zine-plate zine-plate-blue" />
      <span aria-hidden className="zine-back" />

      <svg aria-hidden className="zine-scribble boil" viewBox="0 0 100 100" preserveAspectRatio="none">
        {SCRIBBLE.map((fr, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
            <path d={fr.red} stroke="#e8112d" strokeWidth="4" />
            <path d={fr.black} stroke="#000" strokeWidth="2.5" />
          </g>
        ))}
      </svg>

      <span aria-hidden className="ransom">
        {[...headline].map((ch, i) =>
          ch === " " ? (
            <span key={i} className="w-3" />
          ) : (
            <span
              key={i}
              className={`ransom-letter ${LETTER_STYLES[(i * 5 + headline.length) % LETTER_STYLES.length]}`}
              style={
                {
                  "--r": `${((i * 37) % 17) - 8}deg`,
                  "--y": `${((i * 13) % 9) - 4}px`,
                  "--d": `${i * 0.042}s`,
                  "--j": `${0.333 + (i % 3) * 0.167}s`,
                } as React.CSSProperties
              }
            >
              {ch}
            </span>
          ),
        )}
      </span>

      {words.slice(0, SPOTS.length).map((w, i) => (
        <span
          key={w}
          aria-hidden
          className={`zine-clip ${SPOTS[i]} ${CLIP_STYLES[i % CLIP_STYLES.length]}`}
          style={{ "--clip-d": `${i * 0.042}s` } as React.CSSProperties}
        >
          {w}
        </span>
      ))}

      <Pin className="-left-3 top-10 -rotate-[30deg]" />
      <Pin className="-right-3 bottom-12 rotate-[150deg]" />
    </>
  );
}
