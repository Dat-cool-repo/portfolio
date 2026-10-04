import { mulberry32 } from "@/lib/flame";
import SpotVoid from "./SpotVoid";
import HobieCollage from "./HobieCollage";

/**
 * Fixed page backdrop with one "dimension" per section. Only the scene named
 * by <html data-scene> is displayed (the rest are display:none, so their
 * particle animations don't run). Everything is generated with a seeded PRNG
 * on the server, so markup is identical on every render.
 */

type Particle = { kind: string; style: React.CSSProperties; text?: string };

const pct = (n: number) => `${n.toFixed(2)}%`;

function particles(
  seed: number,
  count: number,
  kind: string,
  opts: {
    size: [number, number];
    dur: [number, number];
    colors?: string[];
    yRange?: [number, number];
    texts?: string[];
  },
): Particle[] {
  const rand = mulberry32(seed);
  const [y0, y1] = opts.yRange ?? [0, 100];
  return Array.from({ length: count }, () => {
    const size = opts.size[0] + rand() * (opts.size[1] - opts.size[0]);
    const dur = opts.dur[0] + rand() * (opts.dur[1] - opts.dur[0]);
    return {
      kind,
      text: opts.texts ? opts.texts[Math.floor(rand() * opts.texts.length)] : undefined,
      style: {
        left: pct(rand() * 100),
        top: pct(y0 + rand() * (y1 - y0)),
        width: size,
        height: size,
        "--c": opts.colors ? opts.colors[Math.floor(rand() * opts.colors.length)] : undefined,
        "--dur": `${dur.toFixed(2)}s`,
        "--steps": Math.max(2, Math.round(dur * 12)),
        "--delay": `${(-rand() * dur).toFixed(2)}s`,
        "--rot": `${Math.round((rand() - 0.5) * 50)}deg`,
        "--dx": `${Math.round((rand() - 0.5) * 120)}px`,
      } as React.CSSProperties,
    };
  });
}

const SCENE_PARTICLES: Record<string, Particle[]> = {
  home: [
    ...particles(11, 18, "letter", {
      size: [34, 58],
      dur: [2.4, 4],
      colors: ["var(--accent-3)", "#fff", "#1d3fbb", "#000"],
      texts: ["A", "!", "Z", "?", "★", "#", "X", "R", "&", "Ø", "K", "!"],
    }),
    ...particles(12, 10, "spark", { size: [12, 26], dur: [8, 14], colors: ["#fff", "var(--accent-3)"], yRange: [10, 100] }),
  ],
  experience: [
    ...particles(21, 18, "streak", { size: [120, 340], dur: [0.9, 1.8], colors: ["#000", "#000", "#b4ff2e", "#fff"] }),
    ...particles(22, 10, "kirby", { size: [40, 90], dur: [1.6, 2.8] }),
    ...particles(23, 14, "spark", { size: [14, 32], dur: [6, 10], colors: ["#b4ff2e", "#fff", "#000"], yRange: [20, 100] }),
  ],
  projects: [
    ...particles(32, 34, "speck", { size: [3, 8], dur: [6, 12] }),
  ],
  about: [
    ...particles(41, 20, "letter", {
      size: [34, 60],
      dur: [1.2, 3],
      colors: ["var(--accent-3)", "#fff", "#1d3fbb", "#000", "#e8112d"],
      texts: ["A", "!", "Z", "?", "★", "#", "X", "R", "&", "Ø", "K", "!", "P", "U"],
    }),
    ...particles(42, 16, "scrap", { size: [40, 110], dur: [1.5, 3.5], colors: ["#e8112d", "#1d3fbb", "#ffe14d", "#f6f1e4", "#22e4ff"] }),
  ],
  contact: [
    ...particles(61, 26, "ember", { size: [8, 20], dur: [7, 13], colors: ["var(--accent-3)", "#fff", "var(--accent-2)"], yRange: [40, 105] }),
  ],
};

export default function SceneBackground() {
  return (
    <div aria-hidden className="scene-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {Object.entries(SCENE_PARTICLES).map(([id, list]) => (
        <div key={id} className={`scene scene-${id}`}>
          <div className="scene-base" />
          {(id === "about" || id === "home") && <ZineStrips />}
          {id === "about" && <HobieCollage />}
          {id === "experience" && <div className="impact-zone-lines" />}
          {id === "projects" && <SpotVoid />}
          {id === "contact" && <div className="scene-grid" />}
          {list.map((p, i) => (
            <i key={i} className={`pt pt-${p.kind}`} style={p.style}>
              {p.text}
            </i>
          ))}
        </div>
      ))}
      <div className="scene-static" />
    </div>
  );
}

function ZineStrips() {
  return (
    <>
      <div className="zine-strip" style={{ top: "12%", left: "-5%", width: "48%", rotate: "-6deg" }} />
      <div className="zine-strip zine-blue" style={{ top: "38%", right: "-6%", width: "40%", rotate: "4deg" }} />
      <div className="zine-strip" style={{ top: "70%", left: "-4%", width: "36%", rotate: "3deg" }} />
      <div className="zine-strip zine-blue" style={{ top: "84%", right: "-4%", width: "44%", rotate: "-5deg" }} />
    </>
  );
}
