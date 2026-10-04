import { mulberry32 } from "@/lib/flame";
import { boilFrames, hatch, scribble, sketchCircle, smooth, spiral, wander, wobblyLine } from "@/lib/sketch";

/*
 * The Spot's dimension, drawn like an unfinished comic page that's coming
 * apart: blue pencil construction lines, sketched portal holes with spinning
 * vortex spirals, ink dripping out of them, tangled energy lines across the
 * screen, and drifting scribble clusters. Every layer is drawn four times
 * with fresh jitter and the frames swap ~12x a second ("line boil"), while
 * whole groups also spin and drift, so nothing ever sits still.
 */

const W = 1600;
const H = 1000;
const FRAME_COUNT = 4;

const PORTALS: [number, number, number][] = [
  [130, 210, 120],
  [1480, 640, 150],
  [230, 830, 70],
  [1430, 150, 60],
  [800, 1060, 190],
  [40, 560, 50],
  [1570, 960, 80],
];

// Scattered scribble clusters: x, y, w, h.
const layoutRand = mulberry32(9001);
const SCRIBBLES = Array.from({ length: 22 }, () => {
  const left = layoutRand() < 0.5;
  return [
    left ? 20 + layoutRand() * 320 : 1260 + layoutRand() * 320,
    layoutRand() * H,
    70 + layoutRand() * 140,
    50 + layoutRand() * 120,
  ] as [number, number, number, number];
});
const HATCHES = Array.from({ length: 14 }, () => [
  layoutRand() < 0.5 ? layoutRand() * 360 : 1240 + layoutRand() * 360,
  layoutRand() * H,
  (layoutRand() - 0.5) * 2.4,
]) as [number, number, number][];

// Drifting groups: each gets its own slow, stepped rotation/drift.
const DRIFTERS = SCRIBBLES.map(() => ({
  dur: `${(5 + layoutRand() * 7).toFixed(1)}s`,
  delay: `${(-layoutRand() * 10).toFixed(1)}s`,
  dx: `${Math.round((layoutRand() - 0.5) * 60)}px`,
  dy: `${Math.round((layoutRand() - 0.5) * 60)}px`,
  rot: `${Math.round((layoutRand() - 0.5) * 70)}deg`,
}));

const FRAMES = boilFrames(FRAME_COUNT, 4242, (layout, jitter) => {
  const vp1: [number, number] = [-300, 420];
  const vp2: [number, number] = [1900, 380];
  const guides = [
    ...[0, 120, 260, 520, 700, 860, 1000].map((y) => wobblyLine(vp1, [W * 0.55, y], jitter, 3, 0)),
    ...[40, 220, 300, 560, 700, 980].map((y) => wobblyLine(vp2, [W * 0.45, y], jitter, 3, 0)),
    wobblyLine([0, 400], [W, 392], jitter, 4),
    wobblyLine([0, 612], [W, 620], jitter, 4),
    wobblyLine([360, 0], [380, H], jitter, 4),
    wobblyLine([1230, 0], [1215, H], jitter, 4),
  ];

  const portals = PORTALS.map(([x, y, r], k) => ({
    x,
    y,
    fill: smooth(
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const rr = r * (0.9 + jitter() * 0.18);
        return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as [number, number];
      }),
      true,
    ),
    rims: [
      sketchCircle([x, y], r * 1.03, jitter, 1.3),
      sketchCircle([x, y], r * 1.12, jitter, 0.9),
      sketchCircle([x, y], r * 1.22, jitter, 0.6),
    ].join(""),
    construction: sketchCircle([x, y], r * 1.6, jitter, 1.05) + sketchCircle([x, y], r * 1.85, jitter, 0.5),
    vortex: [0, 2.1, 4.2].map((s) => spiral([x, y], r * 1.9, r * 0.95, 1.4, jitter, s + k)).join(""),
    // Ink running down out of the portal.
    drips: Array.from({ length: 3 }, (_, i) => {
      const dx = x + (i - 1) * r * 0.45 + (jitter() - 0.5) * 10;
      const len = r * (0.8 + jitter() * 1.4);
      return wobblyLine([dx, y + r * 0.8], [dx + (jitter() - 0.5) * 12, y + r + len], jitter, 2.5, 0);
    }).join(""),
  }));

  // Long tangled energy lines whipping across the margins.
  const energy = [
    wander([-50, 100], [420, 980], jitter, 70, 10),
    wander([1650, 80], [1180, 940], jitter, 70, 10),
    wander([-50, 900], [380, 40], jitter, 60, 10),
    wander([1650, 880], [1220, 60], jitter, 60, 10),
    wander([-80, 500], [1680, 520], jitter, 120, 16),
  ].join("");

  return {
    guides: guides.join(""),
    portals,
    energy,
    scribbles: SCRIBBLES.map(([x, y, w, h]) => scribble([x, y], w, h, layout, jitter, 7 + Math.floor(layout() * 6))),
    hatches: HATCHES.map(([x, y, a]) => hatch([x, y], 80, a, 8, jitter)).join(""),
    paint: [
      wobblyLine([-40, 760], [420, 690], jitter, 16),
      wobblyLine([1250, 260], [1650, 200], jitter, 16),
      wobblyLine([980, 980], [1500, 930], jitter, 16),
      wobblyLine([-20, 300], [300, 340], jitter, 14),
    ].join(""),
  };
});

// Percent box for an HTML layer covering user-space rect (x, y, w, h).
const box = (x: number, y: number, w: number, h: number): React.CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  height: `${(h / H) * 100}%`,
});

/*
 * Layering for performance: the big drawings only change when their lines
 * boil. Everything that moves continuously (vortex spin, scribble drift) is
 * its own small <svg> transformed as an HTML element, so the compositor can
 * move it without repainting the full-screen drawing (and its ink filters).
 * The stage reproduces the old viewBox "slice" fit in CSS.
 */
export default function SpotVoid() {
  return (
    <div className="spot-void spot-stage">
      {/* 1. Paint, pencil guides, energy lines, hatching. */}
      <svg className="boil absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`}>
        {FRAMES.map((fr, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
            <path d={fr.paint} fill="none" stroke="#f4efe4" strokeWidth="30" strokeLinecap="round" opacity="0.08" />
            <path d={fr.guides} fill="none" stroke="#5fa8ff" strokeWidth="1.4" opacity="0.5" />
            <path d={fr.energy} fill="none" stroke="#f4efe4" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
            <path d={fr.hatches} fill="none" stroke="#f4efe4" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </g>
        ))}
      </svg>

      {/* 2. Spinning vortices, one small layer each, under the holes. */}
      {PORTALS.map(([x, y, r], k) => {
        const R2 = r * 2.1;
        return (
          <svg
            key={k}
            className="spot-spin boil absolute overflow-visible"
            viewBox={`${x - R2} ${y - R2} ${R2 * 2} ${R2 * 2}`}
            style={{ ...box(x - R2, y - R2, R2 * 2, R2 * 2), "--spin-dur": `${4 + k * 0.9}s`, "--spin-dir": k % 2 ? -1 : 1 } as React.CSSProperties}
          >
            {FRAMES.map((fr, i) => (
              <path
                key={i}
                d={fr.portals[k].vortex}
                style={{ "--boil-i": i } as React.CSSProperties}
                fill="none"
                stroke="#f4efe4"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.6"
              />
            ))}
          </svg>
        );
      })}

      {/* 3. Portal construction circles and dripping ink (under the holes). */}
      <svg className="boil absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`}>
        {FRAMES.map((fr, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
            {fr.portals.map((p, k) => (
              <g key={k}>
                <path d={p.construction} fill="none" stroke="#5fa8ff" strokeWidth="1.5" opacity="0.6" />
                <path d={p.drips} fill="none" stroke="#000" strokeWidth="9" strokeLinecap="round" />
                <path d={p.drips} fill="none" stroke="#f4efe4" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
              </g>
            ))}
          </g>
        ))}
      </svg>

      {/* 4. Ragged holes. Each boil frame is its own small composited layer,
          so the ink-rough filter is rendered once rather than on every swap. */}
      {PORTALS.map(([x, y, r], k) => {
        const m = r * 1.35;
        return (
          <div key={k} className="boil absolute" style={box(x - m, y - m, m * 2, m * 2)}>
            {FRAMES.map((fr, i) => (
              <svg
                key={i}
                className="spot-layer absolute inset-0 h-full w-full overflow-visible"
                viewBox={`${x - m} ${y - m} ${m * 2} ${m * 2}`}
                style={{ "--boil-i": i } as React.CSSProperties}
              >
                <path d={fr.portals[k].fill} fill="#000" filter="url(#ink-rough)" />
              </svg>
            ))}
          </div>
        );
      })}

      {/* 5. Chalk rims over the holes. */}
      <svg className="boil absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`}>
        {FRAMES.map((fr, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
            {fr.portals.map((p, k) => (
              <path key={k} d={p.rims} fill="none" stroke="#f4efe4" strokeWidth="2.6" strokeLinecap="round" />
            ))}
          </g>
        ))}
      </svg>

      {/* 6. Scribble clusters drifting and tumbling, one small layer each. */}
      {SCRIBBLES.map(([x, y, w, h], k) => {
        const d = DRIFTERS[k];
        const mx = w * 0.6 + 14;
        const my = h * 0.6 + 14;
        return (
          <svg
            key={k}
            className="spot-drift boil absolute overflow-visible"
            viewBox={`${x - mx} ${y - my} ${mx * 2} ${my * 2}`}
            style={
              {
                ...box(x - mx, y - my, mx * 2, my * 2),
                "--drift-d": d.dur,
                "--drift-delay": d.delay,
                "--drift-x": d.dx,
                "--drift-y": d.dy,
                "--drift-r": d.rot,
              } as React.CSSProperties
            }
          >
            {FRAMES.map((fr, i) => (
              <path
                key={i}
                d={fr.scribbles[k]}
                style={{ "--boil-i": i } as React.CSSProperties}
                fill="none"
                stroke="#f4efe4"
                strokeWidth={k % 3 ? 1.8 : 2.6}
                strokeLinecap="round"
                opacity={k % 4 ? 0.8 : 0.45}
              />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
