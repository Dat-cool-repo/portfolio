import { mulberry32 } from "@/lib/flame";

/**
 * Ink blobs flung outward from the edges of the project strips, as if the
 * void were leaking into the page. Drawn over the page gutters, flung outward from the strip edges.
 */
const rand = mulberry32(777);
const BLOBS = Array.from({ length: 70 }, () => {
  // Spawn along the left or right edge of the strip column, or in a gutter.
  const side = rand();
  const left = side < 0.5 ? rand() * 5 : 95 + rand() * 5;
  const top = rand() * 100;
  const outward = left < 50 ? -1 : 1;
  const dur = 2.2 + rand() * 2.6;
  const size = 10 + rand() * 34;
  return {
    left: `${left.toFixed(2)}%`,
    top: `${top.toFixed(2)}%`,
    width: size,
    height: size * (0.7 + rand() * 0.6),
    "--dx": `${Math.round(outward * (30 + rand() * 90))}px`,
    "--dy": `${Math.round((rand() - 0.6) * 90)}px`,
    "--rot": `${Math.round((rand() - 0.5) * 240)}deg`,
    "--dur": `${dur.toFixed(2)}s`,
    "--steps": Math.round(dur * 12),
    "--delay": `${(-rand() * dur).toFixed(2)}s`,
  } as React.CSSProperties;
});

export default function InkFling() {
  return (
    <div aria-hidden className="ink-fling">
      {BLOBS.map((style, i) => (
        <i key={i} className="ink-blob" style={style} />
      ))}
    </div>
  );
}
