import { boilFrames, scribble, sketchCircle, smooth, spiral, wander, wobblyLine } from "@/lib/sketch";

/*
 * Splash art for a project strip in the Spot's style: one of his spots blown
 * up into a portal — a solid, ragged black ink hole punched in sketch paper,
 * with sketchy ink rims, blue construction lines and an accent ring that
 * bleeds into the paper. On hover a storm of squiggles swirls around (never
 * over) the hole. Lines boil.
 */

const CX = 200;
const CY = 150;
const R = 105;

const FRAMES = boilFrames(4, 5150, (_layout, jitter) => {
  const hole = smooth(
    Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const rr = R * (0.9 + jitter() * 0.18);
      return [CX + Math.cos(a) * rr, CY + Math.sin(a) * rr * 0.92] as [number, number];
    }),
    true,
  );
  const satellites = [
    [62, 58, 16],
    [338, 236, 22],
    [352, 64, 9],
    [70, 250, 11],
  ].map(([x, y, r]) =>
    smooth(
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const rr = r * (0.82 + jitter() * 0.36);
        return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as [number, number];
      }),
      true,
    ),
  );
  return {
    hole,
    satellites: satellites.join(""),
    rims: [
      sketchCircle([CX, CY], R * 1.06, jitter, 1.25),
      sketchCircle([CX, CY], R * 1.16, jitter, 0.85),
    ].join(""),
    accent: sketchCircle([CX, CY], R * 1.3, jitter, 1.1),
    construction:
      sketchCircle([CX, CY], R * 1.48, jitter, 1.02) +
      wobblyLine([CX - 190, CY], [CX + 190, CY], jitter, 1.5, 0) +
      wobblyLine([CX, CY - 150], [CX, CY + 150], jitter, 1.5, 0) +
      wobblyLine([CX - 170, CY + 140], [CX + 170, CY - 140], jitter, 1.5, 0),
    // Hover: the hole erupts — colored spirals, a scribble storm around the
    // rim, and squiggles lashing out of it.
    // Storm swirls in the ring around the hole, never over it.
    storm: [0, 1, 2, 3].map((c) =>
      [0, 1.6, 3.2, 4.8].map((s) => spiral([CX, CY], R * (1.75 + c * 0.06), R * 1.02, 1.3, jitter, s + c * 0.7)).join(""),
    ),
    rimStorm: scribble([CX, CY], R * 2.7, R * 2.5, _layout, jitter, 16),
    lash: Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 + jitter() * 0.4;
      const r0 = R * 0.9;
      const r1 = R * (1.5 + jitter() * 0.9);
      return wander([CX + Math.cos(a) * r0, CY + Math.sin(a) * r0], [CX + Math.cos(a) * r1, CY + Math.sin(a) * r1], jitter, 10, 5);
    }).join(""),
  };
});

const STORM_COLORS = ["#0b0b0b", "#ff2e88", "#0b0b0b", "#ff2e88"];

const VIEW = { viewBox: "0 0 400 300", preserveAspectRatio: "xMidYMid slice" } as const;

/*
 * Rendered as stacked layers so motion never repaints the filtered parts:
 * the storm spins as its own composited element, and each hole frame is a
 * pre-rendered layer (the ink-rough filter runs once, not on every boil).
 * With "xMidYMid slice" the element center is (CX, CY), so rotating the
 * storm element about its center spins it about the hole.
 */
export default function SpotPortal({ accent }: { accent: string }) {
  return (
    <>
      <svg aria-hidden className="absolute inset-0 h-full w-full" {...VIEW}>
        <g className="boil">
          {FRAMES.map((fr, i) => (
            <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
              <path d={fr.construction} fill="none" stroke="#5fa8ff" strokeWidth="1.3" opacity="0.8" />
              <path d={fr.accent} className="ink-bleed" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
              <path d={fr.rims} fill="none" stroke="#0b0b0b" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          ))}
        </g>
        {/* Hover-only eruption around the rim. */}
        <g className="portal-storm boil boil-slow">
          {FRAMES.map((fr, i) => (
            <g key={i} style={{ "--boil-i": i } as React.CSSProperties} fill="none" strokeLinecap="round">
              <path d={fr.rimStorm} stroke="#0b0b0b" strokeWidth="2" />
              <path d={fr.lash} stroke="#0b0b0b" strokeWidth="5" />
              <path d={fr.lash} className="ink-bleed" stroke={accent} strokeWidth="2.6" />
            </g>
          ))}
        </g>
      </svg>

      {/* Hover-only spinning storm. Multiplied onto the paper as one layer. */}
      <svg
        aria-hidden
        className="portal-storm spot-spin boil boil-slow absolute inset-0 h-full w-full overflow-visible"
        {...VIEW}
        style={{ "--spin-dur": "7s", "--spin-dir": -1, mixBlendMode: "multiply", willChange: "rotate" } as React.CSSProperties}
      >
        {FRAMES.map((fr, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties} fill="none" strokeLinecap="round">
            {fr.storm.map((d, c) => (
              <path key={c} d={d} className={c % 2 ? "ink-bleed" : undefined} stroke={STORM_COLORS[c]} strokeWidth="2.2" />
            ))}
          </g>
        ))}
      </svg>

      {/* The hole: solid, ragged black ink on top, one layer per boil frame. */}
      <div aria-hidden className="boil absolute inset-0">
        {FRAMES.map((fr, i) => (
          <svg key={i} className="spot-layer absolute inset-0 h-full w-full" {...VIEW} style={{ "--boil-i": i } as React.CSSProperties}>
            <g filter="url(#ink-rough)">
              <path d={fr.hole} fill="#050506" />
              <path d={fr.satellites} fill="#050506" />
            </g>
          </svg>
        ))}
      </div>
    </>
  );
}
