/*
 * Spider-sense: a ring of white wiggle lines surrounding an element, every one
 * pointing in at it, vibrating while it's hovered. Place inside a `relative`
 * element with the `tingle-host` class.
 *
 * Each line is drawn pointing down at an anchor on the host's edge; rotating
 * it about that anchor aims it inward from any side or corner.
 */

// A vertical wiggle, 16 wide × 40 tall, ending at the bottom.
const WIGGLE = "M8,0 Q14,5 8,10 Q2,15 8,20 Q14,25 8,30 Q2,35 8,40";

type Anchor = { x: string; y: string; rot: number; delay: number };

function ring(perSide: number, perEnd: number): Anchor[] {
  const out: Anchor[] = [];
  let k = 0;
  const push = (x: string, y: string, rot: number) => out.push({ x, y, rot, delay: (k++ % 3) * 0.08 });
  // Corners first, then spread along each edge.
  push("0%", "0%", -45);
  push("100%", "0%", 45);
  push("100%", "100%", 135);
  push("0%", "100%", -135);
  for (let i = 1; i <= perEnd; i++) {
    const t = `${((i / (perEnd + 1)) * 100).toFixed(1)}%`;
    push(t, "0%", 0);
    push(t, "100%", 180);
  }
  for (let i = 1; i <= perSide; i++) {
    const t = `${((i / (perSide + 1)) * 100).toFixed(1)}%`;
    push("0%", t, -90);
    push("100%", t, 90);
  }
  return out;
}

export default function SpiderSense({
  length = 40,
  gap = 14,
  perSide = 2,
  perEnd = 4,
}: {
  /** Length of each wiggle line in px. */
  length?: number;
  /** Space between the host's edge and the tip of each line. */
  gap?: number;
  /** Lines on the left/right edges and on the top/bottom edges. */
  perSide?: number;
  perEnd?: number;
}) {
  const w = (length * 16) / 40;
  return (
    <span aria-hidden className="tingle">
      {ring(perSide, perEnd).map((a, i) => (
        <span
          key={i}
          className="tingle-arm"
          style={{ left: a.x, top: a.y, rotate: `${a.rot}deg`, "--d": `${a.delay}s` } as React.CSSProperties}
        >
          <svg viewBox="0 0 16 40" style={{ width: w, height: length, left: -w / 2, bottom: gap }}>
            <path d={WIGGLE} className="tingle-outline" />
            <path d={WIGGLE} className="tingle-line" />
          </svg>
        </span>
      ))}
    </span>
  );
}
