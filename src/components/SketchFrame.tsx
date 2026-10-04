import { boilFrames, scribble, twist, wobblyLine } from "@/lib/sketch";

/*
 * An "unfinished sketch" frame around a panel: blue pencil construction lines
 * that overshoot the corners, and a boiling double ink outline. On hover the
 * frame goes haywire: tangled ink and accent-colored energy squiggles whip
 * along every edge and knot up in the corners, swirling like the Spot's
 * spirals. Drawn in a 0–100 box stretched over the host; strokes don't scale.
 */

// Tangled knots at the corners and edge midpoints (0–100 frame units).
const KNOTS: [number, number][] = [
  [3, 4],
  [97, 4],
  [97, 96],
  [3, 96],
  [50, 1],
  [50, 99],
];
const KNOT_BOX = 9;

// Each knot spins in full circles on its own clock: [duration, direction].
const KNOT_SPIN = [
  ["2.4s", 1],
  ["3s", -1],
  ["2.7s", 1],
  ["3.3s", -1],
  ["2.2s", -1],
  ["2.9s", 1],
] as const;

const FRAMES = boilFrames(4, 99, (layout, jitter) => {
  const edges = (inset: number, amp: number, over: number) =>
    [
      wobblyLine([inset, inset], [100 - inset, inset], jitter, amp, over),
      wobblyLine([100 - inset, inset], [100 - inset, 100 - inset], jitter, amp, over),
      wobblyLine([100 - inset, 100 - inset], [inset, 100 - inset], jitter, amp, over),
      wobblyLine([inset, 100 - inset], [inset, inset], jitter, amp, over),
    ].join("");

  return {
    construction: edges(3.5, 0.25, 0.05),
    ink: edges(3, 0.5, 0.012) + edges(2.6, 0.7, 0.02),
    knots: KNOTS.map(([x, y]) => scribble([x, y], 9, 12, layout, jitter, 6)),
  };
});

// The edge lines swirl: every point circles its own small orbit, out of step
// with its neighbors, so the lines corkscrew in place. Eight frames make one
// full turn (0.667s at the boil's 12fps).
const SPIRAL_FRAMES = boilFrames(8, 77, (layout, _jitter, frame) => {
  const phase = (frame / 8) * Math.PI * 2;
  // Energy lines along each edge, wandering in and out of the border. The box
  // stretches far more horizontally than vertically, so side lines use a
  // tighter offset/amplitude to stay off the text.
  const chaos = (offset: number, amp: number) => {
    const so = offset * 0.35;
    const sa = amp * 0.35;
    return [
      twist([-2, offset], [102, offset], layout, phase, amp * 0.45, amp, 14),
      twist([100 - so, -2], [100 - so, 102], layout, phase, sa, sa * 2.2, 10),
      twist([102, 100 - offset], [-2, 100 - offset], layout, phase, amp * 0.45, amp, 14),
      twist([so, 102], [so, -2], layout, phase, sa, sa * 2.2, 10),
    ].join("");
  };

  return {
    ink: chaos(2, 2.2) + chaos(4.5, 2.8),
    color: chaos(1, 2.6) + chaos(5.5, 2),
  };
});

export default function SketchFrame() {
  return (
    <div aria-hidden className="sketch-frame">
      <svg className="boil absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {FRAMES.map((fr, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
            <path className="sketch-construction" d={fr.construction} />
            <path className="sketch-ink" d={fr.ink} />
          </g>
        ))}
      </svg>

      {/* Hover-only squiggles. */}
      <svg className="spiral-boil absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {SPIRAL_FRAMES.map((fr, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
            <path className="sketch-chaos sketch-chaos-color ink-bleed" d={fr.color} />
            <path className="sketch-chaos" d={fr.ink} />
          </g>
        ))}
      </svg>
      {KNOTS.map(([x, y], k) => (
        <svg
          key={k}
          className="frame-spin boil absolute overflow-visible"
          viewBox={`${x - KNOT_BOX} ${y - KNOT_BOX} ${KNOT_BOX * 2} ${KNOT_BOX * 2}`}
          preserveAspectRatio="none"
          style={
            {
              left: `${x - KNOT_BOX}%`,
              top: `${y - KNOT_BOX}%`,
              width: `${KNOT_BOX * 2}%`,
              height: `${KNOT_BOX * 2}%`,
              "--spin-dur": KNOT_SPIN[k][0],
              "--spin-dir": KNOT_SPIN[k][1],
            } as React.CSSProperties
          }
        >
          {FRAMES.map((fr, i) => (
            <path key={i} className="sketch-chaos" d={fr.knots[k]} style={{ "--boil-i": i } as React.CSSProperties} />
          ))}
        </svg>
      ))}
    </div>
  );
}
