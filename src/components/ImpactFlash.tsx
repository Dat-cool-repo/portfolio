"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Line = { x1: number; y1: number; x2: number; y2: number; w: number; c: string };
type Bolt = { points: string; w: number };
type Dot = { cx: number; cy: number; r: number };
type Impact = {
  id: number;
  x: number;
  y: number;
  color: string;
  word: string;
  linesA: Line[];
  linesB: Line[];
  bolts: Bolt[];
  kirby: Dot[];
  vw: number;
  vh: number;
};

// Min gap between full-screen impacts; each impact is one light/dark cycle,
// so this keeps flashes well under the WCAG 2.3.1 limit of 3 per second.
const COOLDOWN_MS = 1500;
const DURATION_MS = 760;

/** Dispatch on window with { color, word } to play a full-screen impact. */
export const IMPACT_EVENT = "impact";

// ---- FX on/off preference (persisted per visitor) ----
const FX_EVENT = "fx-change";
function readFx() {
  try {
    return localStorage.getItem("fx") !== "off";
  } catch {
    return true;
  }
}
function subscribeFx(cb: () => void) {
  window.addEventListener(FX_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(FX_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function setFx(on: boolean) {
  try {
    localStorage.setItem("fx", on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event(FX_EVENT));
}

// ---- Random scene generation (fresh each impact, like hand-drawn frames) ----
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function speedLines(count: number, palette: string[]): Line[] {
  const angle = (rand(-24, -12) * Math.PI) / 180;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  return Array.from({ length: count }, () => {
    const len = rand(18, 75);
    const x1 = rand(-20, 110);
    const y1 = rand(-5, 115);
    return {
      x1,
      y1,
      x2: x1 + dx * len,
      y2: y1 + dy * len,
      w: Math.random() < 0.18 ? rand(8, 16) : rand(1.5, 5),
      c: palette[Math.floor(Math.random() * palette.length)],
    };
  });
}

function bolts(count: number): Bolt[] {
  return Array.from({ length: count }, () => {
    let x = rand(0, 100);
    let y = rand(0, 100);
    const pts = [`${x},${y}`];
    for (let i = 0; i < 4; i++) {
      x += rand(-14, 14);
      y += (i % 2 ? -1 : 1) * rand(6, 14);
      pts.push(`${x},${y}`);
    }
    return { points: pts.join(" "), w: rand(4, 9) };
  });
}

// Kirby dots: clusters of overlapping black dots around the impact point.
function kirbyDots(cx: number, cy: number, spread: number): Dot[] {
  const dots: Dot[] = [];
  for (let c = 0; c < 5; c++) {
    const a = rand(0, Math.PI * 2);
    const d = rand(spread * 0.6, spread * 1.3);
    const ox = cx + Math.cos(a) * d;
    const oy = cy + Math.sin(a) * d;
    const n = Math.floor(rand(5, 10));
    for (let i = 0; i < n; i++) {
      dots.push({ cx: ox + rand(-38, 38), cy: oy + rand(-38, 38), r: rand(5, 22) });
    }
  }
  return dots;
}

function restartClass(el: Element, name: string) {
  el.classList.remove(name);
  void (el as HTMLElement).offsetWidth; // force reflow so the animation replays
  el.classList.add(name);
}

/**
 * Full-screen Spider-Verse style impact frames. Hovering an element marked
 * [data-impact] plays: a magenta duotone frame, a jump-cut to acid green, then
 * colored speed lines rushing out from the element while the page shakes.
 */
export default function ImpactFlash() {
  const [impact, setImpact] = useState<Impact | null>(null);
  const fxOn = useSyncExternalStore(subscribeFx, readFx, () => true);
  useEffect(() => {
    document.documentElement.classList.toggle("fx-off", !fxOn);
  }, [fxOn]);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = -Infinity;
    let clearTimer: ReturnType<typeof setTimeout>;
    let duotoneTimer: ReturnType<typeof setTimeout>;

    // Shared trigger for hover impacts and section-change impacts. Touch
    // devices skip them: the full-screen blend layers are what phones can't
    // afford (see the touch lite mode in globals.css).
    const fire = (cx: number, cy: number, spread: number, color: string, word: string) => {
      if (reduce.matches || !canHover.matches || !readFx()) return;
      const now = performance.now();
      if (now - last < COOLDOWN_MS) return;
      last = now;
      setImpact({
        id: now,
        x: cx,
        y: cy,
        color,
        word,
        linesA: speedLines(46, ["#000", "#000", "#ff2e88", "#fff"]),
        linesB: speedLines(40, ["#000", "#fff", "#fff"]),
        bolts: bolts(4),
        kirby: kirbyDots(cx, cy, spread),
        vw: window.innerWidth,
        vh: window.innerHeight,
      });
      restartClass(document.documentElement, "impact-active");
      // Marks just the two duotone frames, so held modes can resume right after.
      restartClass(document.documentElement, "impact-duotone");
      clearTimeout(duotoneTimer);
      duotoneTimer = setTimeout(() => document.documentElement.classList.remove("impact-duotone"), DURATION_MS * 0.3);

      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        setImpact(null);
        document.documentElement.classList.remove("impact-active");
      }, DURATION_MS);
    };

    const onOver = (e: PointerEvent) => {
      if (!canHover.matches || e.pointerType !== "mouse") return;
      const target = (e.target as Element).closest<HTMLElement>("[data-impact]");
      if (!target) return;
      // Only fire on entry, not when moving between children of the same target.
      const from = (e.relatedTarget as Element | null)?.closest("[data-impact]");
      if (from === target) return;
      const rect = target.getBoundingClientRect();
      fire(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        Math.max(rect.width, rect.height) * 0.6,
        target.dataset.impact || "var(--accent-1)",
        target.dataset.impactWord || "POW!",
      );
    };

    // Programmatic impacts, e.g. crossing into a new section (SectionThemes.tsx).
    const onImpact = (e: Event) => {
      const { color, word } = (e as CustomEvent<{ color: string; word: string }>).detail;
      fire(window.innerWidth / 2, window.innerHeight / 2, Math.min(window.innerWidth, 900) * 0.35, color, word);
    };
    window.addEventListener(IMPACT_EVENT, onImpact);

    document.addEventListener("pointerover", onOver);
    return () => {
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener(IMPACT_EVENT, onImpact);
      clearTimeout(clearTimer);
      clearTimeout(duotoneTimer);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setFx(!fxOn)}
        aria-pressed={fxOn}
        data-cursor-hover
        className="fx-toggle fixed bottom-4 right-4 z-40 block border-[3px] border-black bg-paper px-3 py-1 font-mono text-xs font-bold uppercase text-paper-ink shadow-[4px_4px_0_0_var(--accent-2)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:bottom-20 sm:right-6"
        title="Toggle full-screen impact effects"
      >
        FX: {fxOn ? "On" : "Off"}
      </button>

      {/* Rough brush edge for the lettering and lines. */}
      <svg aria-hidden className="pointer-events-none fixed h-0 w-0">
        <filter id="impact-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
      </svg>

      {impact && (
        <div
          key={impact.id}
          aria-hidden
          className="impact-screen"
          style={
            {
              "--x": `${impact.x}px`,
              "--y": `${impact.y}px`,
              "--burst": impact.color,
            } as React.CSSProperties
          }
        >
          <div className="impact-layer impact-color" />
          <div className="impact-layer impact-dots" />

          <svg className="impact-layer impact-frame-a" viewBox="0 0 100 100" preserveAspectRatio="none">
            <g filter="url(#impact-rough)">
              {impact.linesA.map((l, i) => (
                <line key={i} {...lineProps(l)} />
              ))}
              {impact.bolts.map((b, i) => (
                <polyline
                  key={i}
                  points={b.points}
                  fill="none"
                  stroke="#000"
                  strokeWidth={b.w}
                  strokeLinejoin="miter"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </svg>

          <svg className="impact-layer impact-frame-b" viewBox="0 0 100 100" preserveAspectRatio="none">
            <g filter="url(#impact-rough)">
              {impact.linesB.map((l, i) => (
                <line key={i} {...lineProps(l)} />
              ))}
            </g>
          </svg>

          <div className="impact-layer impact-rays" />

          <svg className="impact-layer impact-kirby" viewBox={`0 0 ${impact.vw} ${impact.vh}`}>
            {impact.kirby.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#000" />
            ))}
          </svg>

          <div className="impact-layer impact-word-wrap">
            <span className="impact-word-big">{impact.word}</span>
          </div>
        </div>
      )}
    </>
  );
}

function lineProps(l: Line) {
  return {
    x1: l.x1,
    y1: l.y1,
    x2: l.x2,
    y2: l.y2,
    stroke: l.c,
    strokeWidth: l.w,
    strokeLinecap: "square" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
}
