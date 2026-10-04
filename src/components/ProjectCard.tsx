import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import SketchFrame from "./SketchFrame";
import SpotPortal from "./SpotPortal";

// The Spot's world is ink, paper and blue pencil, plus a single hot accent.
const ACCENTS = ["#ff2e88"];
const IMPACT_WORDS = ["POW!", "BAM!", "ZAP!", "WHAM!"];

// Black spots on the paper, like the Spot's body. Placed on the edges and
// padding so they never sit on text; the card's overflow clips them.
const SPOTS: [string, string, number][][] = [
  [["100%", "100%", 120], ["0%", "64%", 38], ["58%", "0%", 30], ["84%", "0%", 16], ["30%", "100%", 22]],
  [["0%", "100%", 110], ["100%", "40%", 44], ["40%", "0%", 26], ["70%", "100%", 18], ["100%", "8%", 14]],
];

/**
 * One project as a page torn out of the Spot's sketchbook: boiling ink
 * outline instead of a ruled border, sketch paper with black spots, and the
 * splash cell as a portal hole. Alternates sides row to row.
 */
export default function ProjectCard({
  project,
  index,
  caption,
  glyph,
  venue,
}: {
  project: Project;
  index: number;
  /** Corner caption; defaults to "Issue #NN". */
  caption?: string;
  /** Text inside the portal; defaults to "#NN". */
  glyph?: string;
  /** Optional lab / venue line under the title. */
  venue?: string;
}) {
  const issueNo = String(index + 1).padStart(2, "0");
  const accent = ACCENTS[index % ACCENTS.length];
  const word = IMPACT_WORDS[index % IMPACT_WORDS.length];
  const flip = index % 2 === 1;

  return (
    <div
      data-impact={accent}
      data-impact-word={word}
      className={`impact ${flip ? "md:rotate-[0.7deg]" : "md:-rotate-[0.7deg]"}`}
      style={{ "--burst": accent } as React.CSSProperties}
    >
      <div aria-hidden className="impact-burst" />
      <SketchFrame />

      <article
        data-cursor-hover
        className="spot-card impact-card group grid overflow-hidden md:grid-cols-[2fr_3fr]"
        style={{ "--shadow": accent } as React.CSSProperties}
      >
        {/* Splash cell: a portal hole, or the project screenshot. */}
        <div className={`relative flex min-h-60 items-center justify-center overflow-hidden ${flip ? "md:order-2" : ""}`}>
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          ) : (
            <>
              <SpotPortal accent={accent} />
              <span
                aria-hidden
                className="font-display relative -rotate-6 text-[5.5rem] leading-none text-[#f4efe4] sm:text-[6.5rem]"
                style={{ textShadow: `4px 4px 0 ${accent}` }}
              >
                {glyph ?? `#${issueNo}`}
              </span>
            </>
          )}
          <span className="caption absolute left-3 top-3 rotate-[-2deg]">{caption ?? `Issue #${issueNo}`}</span>
        </div>

        {/* Story cell */}
        <div className="relative flex flex-col p-6 sm:p-8">
          {SPOTS[index % SPOTS.length].map(([left, top, size], i) => (
            <i
              key={i}
              aria-hidden
              className="spot-blob"
              style={{ left, top, width: size, height: size * 0.86, "--blob-d": `${-i * 0.7}s` } as React.CSSProperties}
            />
          ))}

          <div className="relative flex items-start justify-between gap-4">
            {project.year ? (
              <span className="border-2 border-black bg-paper-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper">
                {project.year}
              </span>
            ) : (
              <span />
            )}
            <ArrowUpRight
              size={28}
              strokeWidth={3}
              aria-hidden
              className="shrink-0 text-[#0b0b0b] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </div>

          <h3 className="font-display relative mt-4 text-4xl uppercase leading-none tracking-wide sm:text-5xl">
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          {venue && (
            <p className="relative mt-3 font-mono text-xs font-bold uppercase tracking-wide">
              <span className="bg-paper-ink px-1.5 py-0.5 text-[#ff2e88]">{venue}</span>
            </p>
          )}

          <p className="relative mt-4 flex-1 text-sm leading-relaxed text-paper-ink sm:text-base">
            {project.blurb}
          </p>

          <ul className="relative mt-6 flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="border-2 border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide text-paper-ink"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <div
        aria-hidden
        className={`impact-word burst pointer-events-none absolute -top-8 z-10 flex h-24 w-24 items-center justify-center bg-accent-3 ${
          flip ? "-left-5" : "-right-5"
        }`}
      >
        <span className="font-display text-2xl text-paper-ink">{word}</span>
      </div>
    </div>
  );
}
