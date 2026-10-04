import { boilFrames, scribble, wander, wobblyLine } from "@/lib/sketch";

/*
 * An "unfinished sketch" frame around a panel: blue pencil construction lines
 * that overshoot the corners, and a boiling double ink outline. On hover the
 * frame goes haywire: tangled ink and accent-colored energy squiggles whip
 * along every edge and knot up in the corners. Drawn in a 0–100 box
 * stretched over the host; strokes don't scale.
 */
const FRAMES = boilFrames(4, 99, (layout, jitter) => {
  const edges = (inset: number, amp: number, over: number) =>
    [
      wobblyLine([inset, inset], [100 - inset, inset], jitter, amp, over),
      wobblyLine([100 - inset, inset], [100 - inset, 100 - inset], jitter, amp, over),
      wobblyLine([100 - inset, 100 - inset], [inset, 100 - inset], jitter, amp, over),
      wobblyLine([inset, 100 - inset], [inset, inset], jitter, amp, over),
    ].join("");

  // Energy lines racing along each edge, wandering in and out of the border.
  // The box stretches far more horizontally than vertically, so side lines
  // use a tighter offset/amplitude to stay off the text.
  const chaos = (offset: number, amp: number) => {
    const so = offset * 0.35;
    const sa = amp * 0.35;
    return [
      wander([-2, offset], [102, offset], jitter, amp, 14),
      wander([100 - so, -2], [100 - so, 102], jitter, sa, 10),
      wander([102, 100 - offset], [-2, 100 - offset], jitter, amp, 14),
      wander([so, 102], [so, -2], jitter, sa, 10),
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
    chaosInk: chaos(2, 2.2) + chaos(4.5, 2.8) + knots,
    chaosColor: chaos(1, 2.6) + chaos(5.5, 2),
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
