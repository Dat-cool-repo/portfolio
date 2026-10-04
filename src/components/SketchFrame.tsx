import { boilFrames, scribble, wobblyLine } from "@/lib/sketch";
import FrameOrbit from "./FrameOrbit";

/*
 * An "unfinished sketch" frame around a panel: blue pencil construction lines
 * that overshoot the corners, and a boiling double ink outline. On hover the
 * frame goes haywire: tangled ink and accent-colored energy squiggles whip
 * clockwise around the frame (FrameOrbit.tsx) and the corner knots spin.
 * Drawn in a 0–100 box stretched over the host; strokes don't scale.
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

// Each knot spins clockwise, with the lines, on its own clock.
const KNOT_SPIN = ["2.4s", "3s", "2.7s", "3.3s", "2.2s", "2.9s"];

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

      {/* Hover-only squiggles: they travel clockwise around the frame. */}
      <FrameOrbit />
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
              "--spin-dur": KNOT_SPIN[k],
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
