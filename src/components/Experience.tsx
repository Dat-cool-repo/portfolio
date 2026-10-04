import Reveal from "./Reveal";
import ComicPage from "./ComicPage";
import { EXPERIENCE } from "@/data/experience";

const STAT_COLORS = ["bg-accent-3", "bg-accent-2", "bg-accent-4"];
const IMPACT_WORDS = ["WHAM!", "BAM!", "KAPOW!", "BOOM!", "ZAP!"];

export default function Experience() {
  return (
    <ComicPage
      id="experience"
      page={2}
      chapter="Chapter 01 · Experience"
      title="Where I've shipped"
      next="Continued on page 03"
      tilt={-0.4}
    >
      <ol className="space-y-[var(--gutter)]">
        {EXPERIENCE.map((job, i) => (
          <li key={job.company}>
            <Reveal delay={i * 0.06}>
              <div
                className="exp-box drift relative"
                data-impact="#b4ff2e"
                data-impact-word={IMPACT_WORDS[i % IMPACT_WORDS.length]}
                style={
                  {
                    "--drift-dur": `${5.5 + (i % 3) * 1.3}s`,
                    "--drift-delay": `${-i * 1.7}s`,
                    "--drift-amp": "5px",
                  } as React.CSSProperties
                }
              >
                <div
                  className="panel overflow-hidden"
                  style={
                    {
                      "--shadow": i % 2 ? "var(--accent-2)" : "var(--accent-1)",
                    } as React.CSSProperties
                  }
                >
                  {/* Title strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-black bg-paper-ink px-6 py-3 sm:px-8">
                    <p className="font-display text-2xl uppercase tracking-wider text-accent-3 sm:text-3xl">
                      {job.company}
                    </p>
                    <span className="caption rotate-1">{job.dates}</span>
                  </div>

                  <div className="relative p-6 sm:p-8">
                    <div
                      aria-hidden
                      className="halftone-fade pointer-events-none absolute inset-0"
                    />

                    <div className="relative">
                      <h3 className="font-display text-3xl uppercase leading-none tracking-wide sm:text-4xl">
                        {job.role}
                      </h3>
                      <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-paper-muted">
                        {job.location}
                      </p>

                      {job.stats.length > 0 && (
                      <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                        {job.stats.map((stat, s) => (
                          <div
                            key={stat.label}
                            className={`${STAT_COLORS[s % STAT_COLORS.length]} border-[3px] border-black px-2 py-2 shadow-[3px_3px_0_0_#000] sm:px-4 sm:py-3 sm:shadow-[4px_4px_0_0_#000]`}
                          >
                            <dt className="sr-only">{stat.label}</dt>
                            <dd>
                              <span className="block font-display text-2xl leading-none sm:text-4xl text-paper-ink">
                                {stat.value}
                              </span>
                              <span className="mt-1 block font-mono text-[9px] font-bold sm:text-[11px] uppercase leading-snug tracking-wide text-paper-ink">
                                {stat.label}
                              </span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                      )}

                      <ul className="mt-7 max-w-3xl list-disc space-y-3 pl-5 text-sm leading-relaxed text-paper-ink marker:text-accent-1 sm:text-base">
                        {job.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>

                      {job.publication && (
                        <div className="relative mt-8 border-[3px] border-black bg-accent-3 p-5 shadow-[5px_5px_0_0_#000] sm:p-6">
                          <span className="burst absolute -right-4 -top-6 flex h-20 w-20 rotate-12 items-center justify-center bg-accent-1">
                            <span className="font-display text-center text-sm leading-none text-paper-ink">
                              Pub&shy;lished!
                            </span>
                          </span>
                          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
                            {job.publication.venue}
                          </p>
                          <p className="font-display mt-2 pr-12 text-2xl uppercase leading-tight tracking-wide sm:text-3xl">
                            {job.publication.href ? (
                              <a
                                href={job.publication.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-[3px] underline-offset-4"
                              >
                                {job.publication.title}
                              </a>
                            ) : (
                              job.publication.title
                            )}
                          </p>
                          <p className="mt-2 font-mono text-xs font-bold">
                            {job.publication.authors}
                          </p>
                          <p className="mt-3 max-w-3xl text-sm leading-relaxed">
                            {job.publication.summary}
                          </p>
                        </div>
                      )}

                      <ul className="mt-7 flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border-2 border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide text-paper-ink"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </ComicPage>
  );
}
