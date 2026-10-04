import { boilFrames, scribble, wander, wobblyLine } from "@/lib/sketch";

/*
 * An "unfinished sketch" frame around a panel: blue pencil construction lines
 * that overshoot the corners, and a boiling double ink outline. On hover the
 * frame goes haywire: tangled ink and accent-colored energy squiggles whip
 * along every edge and knot up in the corners, drifting and tumbling like the
 * Spot backdrop's scribbles. Drawn in a 0–100 box stretched over the host;
 * strokes don't scale.
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

// On hover the squiggles move like the Spot backdrop's scribbles: each knot
// drifts and tumbles on its own clock, and each edge's lines sweep back and
// forth along that edge (they overshoot the corners, so the ends stay covered).
const KNOT_DRIFT = [
  ["2.6s", "-0.4s", "9px", "-7px", "50deg"],
  ["3.1s", "-1.9s", "-8px", "6px", "-44deg"],
  ["2.2s", "-1.1s", "7px", "8px", "38deg"],
  ["3.4s", "-2.6s", "-9px", "-6px", "-56deg"],
  ["2.9s", "-0.8s", "10px", "-5px", "-36deg"],
  ["2.4s", "-1.5s", "-10px", "5px", "42deg"],
];

const EDGE_DRIFT = [
  ["1.9s", "0s", "28px", "-5px", "0.4deg"], // top
  ["2.3s", "-0.7s", "5px", "24px", "-0.8deg"], // right
  ["2.1s", "-1.2s", "-28px", "5px", "-0.4deg"], // bottom
  ["2.5s", "-0.4s", "-5px", "-24px", "0.8deg"], // left
];

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
  // One path per edge (top, right, bottom, left), so each edge can drift.
  const chaos = (offset: number, amp: number) => {
    const so = offset * 0.35;
    const sa = amp * 0.35;
    return [
      wander([-2, offset], [102, offset], jitter, amp, 14),
      wander([100 - so, -2], [100 - so, 102], jitter, sa, 10),
      wander([102, 100 - offset], [-2, 100 - offset], jitter, amp, 14),
      wander([so, 102], [so, -2], jitter, sa, 10),
    ];
  };
  const ink = [chaos(2, 2.2), chaos(4.5, 2.8)];
  const color = [chaos(1, 2.6), chaos(5.5, 2)];
  return {
    construction: edges(3.5, 0.25, 0.05),
    ink: edges(3, 0.5, 0.012) + edges(2.6, 0.7, 0.02),
    chaosInk: EDGE_DRIFT.map((_, e) => ink[0][e] + ink[1][e]),
    chaosColor: EDGE_DRIFT.map((_, e) => color[0][e] + color[1][e]),
    knots: KNOTS.map(([x, y]) => scribble([x, y], 9, 12, layout, jitter, 6)),
  };
});

const driftStyle = ([d, delay, x, y, r]: string[]) =>
  ({ "--drift-d": d, "--drift-delay": delay, "--drift-x": x, "--drift-y": y, "--drift-r": r }) as React.CSSProperties;

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

      {/* Hover-only squiggles, each its own layer so the drift is a cheap move. */}
      {EDGE_DRIFT.map((drift, e) => (
        <svg
          key={e}
          className="frame-drift boil absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={driftStyle(drift)}
        >
          {FRAMES.map((fr, i) => (
            <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
              <path className="sketch-chaos sketch-chaos-color ink-bleed" d={fr.chaosColor[e]} />
              <path className="sketch-chaos" d={fr.chaosInk[e]} />
            </g>
          ))}
        </svg>
      ))}
      {KNOTS.map(([x, y], k) => (
        <svg
          key={k}
          className="frame-drift boil absolute overflow-visible"
          viewBox={`${x - KNOT_BOX} ${y - KNOT_BOX} ${KNOT_BOX * 2} ${KNOT_BOX * 2}`}
          preserveAspectRatio="none"
          style={{
            left: `${x - KNOT_BOX}%`,
            top: `${y - KNOT_BOX}%`,
            width: `${KNOT_BOX * 2}%`,
            height: `${KNOT_BOX * 2}%`,
            ...driftStyle(KNOT_DRIFT[k]),
          }}
        >
          {FRAMES.map((fr, i) => (
            <path key={i} className="sketch-chaos" d={fr.knots[k]} style={{ "--boil-i": i } as React.CSSProperties} />
          ))}
        </svg>
      ))}
    </div>
  );
}
