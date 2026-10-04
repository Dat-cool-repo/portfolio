import { boilFrames, coil, scribble, wobblyLine } from "@/lib/sketch";

/*
 * An "unfinished sketch" frame around a panel: blue pencil construction lines
 * that overshoot the corners, and a boiling double ink outline. On hover the
 * frame goes haywire: coiled ink squiggles (the Spot's loopy ink) roll along
 * every edge, ink one way and the accent color the other, and knot up in the
 * corners. Drawn in a 0–100 box stretched over the host; strokes don't scale.
 */

// Loop radii per axis. The box is roughly twice as wide as it is tall, so a
// smaller x radius keeps the loops round once stretched.
const RX = 2;
const RY = 4.4;

const FRAMES = boilFrames(4, 99, (layout, jitter, frame) => {
  const edges = (inset: number, amp: number, over: number) =>
    [
      wobblyLine([inset, inset], [100 - inset, inset], jitter, amp, over),
      wobblyLine([100 - inset, inset], [100 - inset, 100 - inset], jitter, amp, over),
      wobblyLine([100 - inset, 100 - inset], [inset, 100 - inset], jitter, amp, over),
      wobblyLine([inset, 100 - inset], [inset, inset], jitter, amp, over),
    ].join("");

  // A spring of loops running clockwise around the box. Each boil frame turns
  // the loops a quarter further, so across the four frames they roll along
  // the edges. `dir` picks which way they roll.
  const coils = (inset: number, scale: number, dir: 1 | -1, offset: number) => {
    const phase = dir * frame * (Math.PI / 2) + offset;
    const sx = inset * 0.45; // side insets in the narrower x units
    const rx = RX * scale;
    const ry = RY * scale;
    return [
      coil([-2, inset], [102, inset], jitter, 15, rx, ry, phase, 0.5),
      coil([100 - sx, -3], [100 - sx, 103], jitter, 7, rx, ry, phase, 0.5),
      coil([102, 100 - inset], [-2, 100 - inset], jitter, 15, rx, ry, phase, 0.5),
      coil([sx, 103], [sx, -3], jitter, 7, rx, ry, phase, 0.5),
    ].join("");
  };
  const knots = [
    [3, 4],
    [97, 4],
    [97, 96],
    [3, 96],
    [50, 1],
    [50, 99],
  ]
    .map(([x, y]) => scribble([x, y], 9, 12, layout, jitter, 6))
    .join("");

  return {
    construction: edges(3.5, 0.25, 0.05),
    ink: edges(3, 0.5, 0.012) + edges(2.6, 0.7, 0.02),
    // Two ink springs of different sizes tangle together; the color one
    // rolls against them.
    chaosInk: coils(2.6, 1, -1, 0) + coils(3.2, 0.6, -1, 2.1) + knots,
    chaosColor: coils(2.2, 0.85, 1, 1.3),
  };
});

export default function SketchFrame() {
  return (
    <svg aria-hidden className="sketch-frame boil" viewBox="0 0 100 100" preserveAspectRatio="none">
      {FRAMES.map((fr, i) => (
        <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
          <path className="sketch-construction" d={fr.construction} />
          <path className="sketch-ink" d={fr.ink} />
          <path className="sketch-chaos sketch-chaos-color ink-bleed" d={fr.chaosColor} />
          <path className="sketch-chaos" d={fr.chaosInk} />
        </g>
      ))}
    </svg>
  );
}
