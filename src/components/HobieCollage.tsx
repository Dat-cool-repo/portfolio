import { boilFrames } from "@/lib/sketch";

/*
 * Spider-Punk backdrop: a photocopied collage of cut-out headline blocks in
 * mismatched type, slapped on at angles. Hobie's world animates at a lower,
 * different frame rate than everything else, so the collage boils slowly
 * (~6fps) — each block shifts and re-tilts like it's being re-pasted.
 */

type Block = { x: number; y: number; w: number; h: number; rot: number; text: string; bg: string; fg: string; font: string; size: number };

const PIECES: Omit<Block, "rot">[] = [
  { x: 40, y: 70, w: 300, h: 70, text: "QUESTION", bg: "#e8112d", fg: "#fff", font: "comic", size: 58 },
  { x: 70, y: 140, w: 290, h: 56, text: "EVERYTHING", bg: "#000", fg: "#ffe14d", font: "mono", size: 40 },
  { x: 1270, y: 90, w: 220, h: 90, text: "DIY!", bg: "#ffe14d", fg: "#000", font: "comic", size: 80 },
  { x: 1300, y: 300, w: 260, h: 60, text: "NO RULES", bg: "#1d3fbb", fg: "#fff", font: "serif", size: 40 },
  { x: 30, y: 420, w: 200, h: 80, text: "LOUD", bg: "#fff", fg: "#e8112d", font: "comic", size: 72 },
  { x: 1340, y: 520, w: 220, h: 64, text: "NOISE", bg: "#000", fg: "#fff", font: "serif", size: 48 },
  { x: 60, y: 640, w: 280, h: 60, text: "THINK 4 URSELF", bg: "#22e4ff", fg: "#000", font: "mono", size: 26 },
  { x: 1280, y: 720, w: 260, h: 84, text: "RIOT", bg: "#e8112d", fg: "#000", font: "comic", size: 78 },
  { x: 40, y: 830, w: 230, h: 56, text: "WHY?!", bg: "#ffe14d", fg: "#1d3fbb", font: "serif", size: 44 },
  { x: 1330, y: 880, w: 230, h: 56, text: "SMASH IT", bg: "#fff", fg: "#000", font: "mono", size: 30 },
  { x: 1450, y: 400, w: 120, h: 120, text: "A", bg: "#000", fg: "#e8112d", font: "comic", size: 100 },
  { x: 250, y: 280, w: 110, h: 110, text: "!", bg: "#1d3fbb", fg: "#ffe14d", font: "comic", size: 96 },
];

const FONT: Record<string, string> = {
  comic: "var(--font-display)",
  mono: "var(--font-mono)",
  serif: "Georgia, 'Times New Roman', serif",
};

const FRAMES = boilFrames(4, 138, (layout, jitter) =>
  PIECES.map((p) => ({
    ...p,
    x: p.x + (jitter() - 0.5) * 10,
    y: p.y + (jitter() - 0.5) * 10,
    rot: (layout() - 0.5) * 22 + (jitter() - 0.5) * 6,
  })),
);

// Torn-edge outline for a w×h block, as an SVG polygon.
function torn(w: number, h: number, seedOffset: number) {
  const pts: string[] = [];
  const n = 10;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * w},${((i + seedOffset) % 2) * 4}`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * w},${h - ((i + seedOffset + 1) % 2) * 4}`);
  return pts.join(" ");
}

export default function HobieCollage() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <g className="boil boil-slow">
        {FRAMES.map((blocks, i) => (
          <g key={i} style={{ "--boil-i": i } as React.CSSProperties}>
            {blocks.map((b, k) => (
              <g key={k} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.rot.toFixed(1)} ${b.w / 2} ${b.h / 2})`}>
                <polygon points={torn(b.w, b.h, k)} fill="#000" transform="translate(6 6)" />
                <polygon points={torn(b.w, b.h, k)} fill={b.bg} stroke="#000" strokeWidth="3" />
                <text
                  x={b.w / 2}
                  y={b.h / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={b.fg}
                  style={{ fontFamily: FONT[b.font], fontSize: b.size, fontWeight: 700 }}
                >
                  {b.text}
                </text>
              </g>
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
