import { mulberry32 } from "./flame";

/*
 * Hand-drawn sketch primitives for the Spot's "unfinished drawing" look.
 * Every function takes a `jitter` PRNG: drawing the same shape with different
 * jitter seeds gives the frames of a line boil (the redrawn-every-frame wobble).
 */

type Rand = () => number;
type P = [number, number];

const f = (n: number) => n.toFixed(1);

/** Smooth path through points (Catmull-Rom converted to cubic Béziers). */
export function smooth(pts: P[], closed = false): string {
  if (pts.length < 2) return "";
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${f(p[1][0])},${f(p[1][1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

/** A pencil line between two points that wobbles and overshoots its ends. */
export function wobblyLine(a: P, b: P, jitter: Rand, amp = 3, overshoot = 0.06): string {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const steps = Math.max(3, Math.round(len / 60));
  const pts: P[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = -overshoot + (i / steps) * (1 + overshoot * 2);
    const w = (jitter() - 0.5) * 2 * amp;
    pts.push([a[0] + dx * t + nx * w, a[1] + dy * t + ny * w]);
  }
  return smooth(pts);
}

/** A sketched circle: slightly more than one turn, radius drifting as it goes. */
export function sketchCircle(c: P, r: number, jitter: Rand, turns = 1.18): string {
  const n = Math.round(14 * turns);
  const start = jitter() * Math.PI * 2;
  const pts: P[] = [];
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * Math.PI * 2 * turns;
    const rr = r * (0.94 + jitter() * 0.12 + (i / n) * 0.05);
    pts.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr * (0.92 + jitter() * 0.08)]);
  }
  return smooth(pts);
}

/** A tangled scribble filling roughly a w×h box around c. */
export function scribble(c: P, w: number, h: number, layout: Rand, jitter: Rand, loops = 9): string {
  const pts: P[] = [];
  let a = layout() * Math.PI * 2;
  for (let i = 0; i < loops * 3; i++) {
    a += 1.6 + layout() * 1.4;
    const rr = 0.35 + layout() * 0.65;
    pts.push([
      c[0] + Math.cos(a) * (w / 2) * rr + (jitter() - 0.5) * 6,
      c[1] + Math.sin(a) * (h / 2) * rr + (jitter() - 0.5) * 6,
    ]);
  }
  return smooth(pts);
}

/** A rough spiral winding inward toward c (a vortex into a portal). */
export function spiral(c: P, rOuter: number, rInner: number, turns: number, jitter: Rand, start = 0): string {
  const n = Math.round(turns * 16);
  const pts: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + t * turns * Math.PI * 2;
    const r = rOuter + (rInner - rOuter) * t + (jitter() - 0.5) * rOuter * 0.08;
    pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]);
  }
  return smooth(pts);
}

/** A long chaotic curve wandering from a toward b. */
export function wander(a: P, b: P, jitter: Rand, amp: number, points = 9): string {
  const pts: P[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    pts.push([
      a[0] + (b[0] - a[0]) * t + (jitter() - 0.5) * amp * 2,
      a[1] + (b[1] - a[1]) * t + (jitter() - 0.5) * amp * 2,
    ]);
  }
  return smooth(pts);
}

/** Short parallel hatch strokes. */
export function hatch(c: P, size: number, angle: number, count: number, jitter: Rand): string {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  let d = "";
  for (let i = 0; i < count; i++) {
    const o = (i - count / 2) * (size / count) * 1.4;
    const l = size * (0.4 + jitter() * 0.3);
    const ox = c[0] + nx * o + (jitter() - 0.5) * 4;
    const oy = c[1] + ny * o + (jitter() - 0.5) * 4;
    d += `M${f(ox - dx * l)},${f(oy - dy * l)}L${f(ox + dx * l)},${f(oy + dy * l)}`;
  }
  return d;
}

/**
 * A tangled line from a toward b whose points each circle a small orbit, a
 * little out of step with their neighbors. Drawn at successive `phase`s it
 * twists like a corkscrew instead of shifting. Uses `layout` for the shape,
 * so it must be drawn with the same layout sequence every frame.
 */
export function twist(a: P, b: P, layout: Rand, phase: number, rx: number, ry: number, points = 9): string {
  const pts: P[] = [];
  const start = layout() * Math.PI * 2;
  const step = 0.9 + layout() * 0.6;
  const spin = layout() < 0.5 ? 1 : -1;
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const bx = (layout() - 0.5) * rx;
    const by = (layout() - 0.5) * ry;
    const th = spin * phase + start + i * step;
    pts.push([a[0] + (b[0] - a[0]) * t + bx + Math.cos(th) * rx, a[1] + (b[1] - a[1]) * t + by + Math.sin(th) * ry]);
  }
  return smooth(pts);
}

/** Build `frames` boil frames of a drawing: same layout, fresh jitter each. */
export function boilFrames<T>(
  frames: number,
  layoutSeed: number,
  draw: (layout: Rand, jitter: Rand, frame: number) => T,
): T[] {
  return Array.from({ length: frames }, (_, i) => draw(mulberry32(layoutSeed), mulberry32(layoutSeed * 31 + i * 7919), i));
}
