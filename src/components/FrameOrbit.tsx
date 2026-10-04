"use client";

import { useEffect, useRef } from "react";
import { smooth } from "@/lib/sketch";

type Line = { inset: number; amp: number; speed: number; seed: number; color?: boolean };

// The frame's energy squiggles, in px: distance in from the frame edge, wave
// height, and how fast the line travels clockwise around the box (px/s).
const LINES: Line[] = [
  { inset: 4.5, amp: 11, speed: 150, seed: 1.3, color: true },
  { inset: 25, amp: 9, speed: 95, seed: 4.1, color: true },
  { inset: 9, amp: 10, speed: 120, seed: 2.2 },
  { inset: 20, amp: 12, speed: 75, seed: 7.7 },
];

const FPS = 12; // on twos, like the rest of the ink
const STEP = 16; // px between points along the loop

/** Wavy offset at distance s along the loop: a few incommensurate waves, so the
 * squiggle never visibly repeats as it travels. */
function wave(s: number, seed: number) {
  return (
    0.55 * Math.sin(s / 41 + seed) +
    0.3 * Math.sin(s / 17.3 + seed * 2.7) +
    0.15 * Math.sin(s / 7.9 + seed * 5.1)
  );
}

/** One closed squiggle around a w×h box, shifted `shift` px clockwise. */
function loop(w: number, h: number, line: Line, shift: number) {
  const i = line.inset;
  const corners: [number, number][] = [
    [i, i],
    [w - i, i],
    [w - i, h - i],
    [i, h - i],
  ];
  const pts: [number, number][] = [];
  let s = 0;
  for (let e = 0; e < 4; e++) {
    const [ax, ay] = corners[e];
    const [bx, by] = corners[(e + 1) % 4];
    const len = Math.hypot(bx - ax, by - ay);
    const ux = (bx - ax) / len;
    const uy = (by - ay) / len;
    const n = Math.max(2, Math.round(len / STEP));
    for (let k = 0; k < n; k++) {
      const d = (k / n) * len;
      // Sample the pattern behind this point, so the shape moves forward.
      const o = wave(s + d - shift, line.seed) * line.amp + (Math.random() - 0.5) * 2.2;
      pts.push([ax + ux * d - uy * o, ay + uy * d + ux * o]);
    }
    s += len;
  }
  return smooth(pts, true);
}

/*
 * Hover-only squiggles for SketchFrame: while the card is hovered, each line
 * travels clockwise around the frame at its own speed, redrawn 12 times a
 * second (the redraw jitter doubles as the line boil). Idle cards draw nothing.
 */
export default function FrameOrbit() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const frame = svg?.parentElement;
    const host = frame?.closest<HTMLElement>(".impact");
    if (!svg || !frame || !host) return;
    const paths = [...svg.querySelectorAll("path")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    let start = 0;

    const draw = () => {
      // Layout size, not the hover-scaled rect, so the loop hugs the frame.
      const w = frame.offsetWidth;
      const h = frame.offsetHeight;
      const t = reduce.matches ? 0 : (performance.now() - start) / 1000;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      LINES.forEach((line, k) => paths[k].setAttribute("d", loop(w, h, line, t * line.speed)));
    };
    const enter = () => {
      if (timer) return;
      start = performance.now();
      draw();
      if (!reduce.matches) timer = setInterval(draw, 1000 / FPS);
    };
    const leave = () => {
      clearInterval(timer);
      timer = undefined;
    };

    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    return () => {
      leave();
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <svg ref={svgRef} className="absolute inset-0 h-full w-full overflow-visible">
      {LINES.map((line, k) => (
        <path key={k} className={line.color ? "sketch-chaos sketch-chaos-color ink-bleed" : "sketch-chaos"} />
      ))}
    </svg>
  );
}
