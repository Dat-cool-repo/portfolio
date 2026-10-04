import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * A section laid out as a printed comic-book page: newsprint sheet, page
 * header strip, dark title panel, panels separated by gutters, and a
 * "continued" caption. A second sheet peeks out behind it.
 */
export default function ComicPage({
  id,
  page,
  chapter,
  title,
  next,
  tilt = 0,
  children,
}: {
  id: string;
  page: number;
  chapter: string;
  title: string;
  next?: string;
  tilt?: number;
  children: ReactNode;
}) {
  const pageNo = String(page).padStart(2, "0");

  return (
    <section
      id={id}
      className="mx-auto max-w-6xl scroll-mt-16 px-4 py-28 sm:px-10 sm:py-44"
    >
      <Reveal>
        <div
          className="drift relative"
          style={
            {
              rotate: `${tilt}deg`,
              "--drift-dur": `${8 + (page % 3)}s`,
              "--drift-delay": `${-page * 1.3}s`,
              "--drift-amp": "8px",
            } as React.CSSProperties
          }
        >
          {/* The next sheet in the stack, peeking out. */}
          <div
            aria-hidden
            className="comic-page-under"
            style={{ rotate: `${tilt > 0 ? -1.4 : 1.4}deg` }}
          />

          <div className="comic-page">
            <div className="comic-page-strip">
              <span>Dat. Comics</span>
              <span className="hidden sm:inline">Vol. 01 · Issue #26</span>
              <span>Page {pageNo}</span>
            </div>

            <div className="title-panel">
              <div
                aria-hidden
                className="speed-lines pointer-events-none absolute inset-0 opacity-80"
              />
              <span className="caption relative -rotate-2">{chapter}</span>
              <h2 className="font-display misprint relative mt-4 text-5xl uppercase leading-none tracking-wide text-foreground sm:text-6xl">
                {title}
              </h2>
            </div>

            <div className="mt-[var(--gutter)]">{children}</div>
          </div>

          {next && <p className="caption comic-page-next">{next} ▸</p>}
        </div>
      </Reveal>
    </section>
  );
}
