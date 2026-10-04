import Reveal from "./Reveal";
import ComicPage from "./ComicPage";
import ZineCut from "./ZineCut";

const SKILL_GROUPS = [
  {
    label: "Languages",
    color: "bg-accent-3",
    skills: ["Python", "C/C++", "Rust", "SQL", "R", "Java", "Bash"],
  },
  {
    label: "Machine learning",
    color: "bg-accent-2",
    skills: [
      "PyTorch",
      "PyTorch Geometric",
      "TensorFlow",
      "Transformers",
      "scikit-learn",
      "XGBoost",
      "Mech interp",
      "RL",
    ],
  },
  {
    label: "ML infra & data",
    color: "bg-accent-1",
    skills: [
      "CUDA",
      "Distributed training",
      "Snowflake",
      "Docker",
      "AWS",
      "Terraform",
      "Redis",
      "PostgreSQL",
      "MCP",
    ],
  },
];

const AWARDS = [
  {
    year: "2026",
    title: "ShellHacks",
    detail:
      "2nd Place Best Use of AWS + Best Use of Tiger Data (transPEAKtation)",
  },
  {
    year: "2025",
    title: "Published at ASABE",
    detail: "AI-driven plant tracking & canopy segmentation, 0.924 IoU",
  },
  {
    year: "2023",
    title: "ACSL — Top 1%",
    detail: "American Computer Science League, ~8,000 competitors",
  },
  {
    year: "2022",
    title: "1 Idea 1 World — Gold",
    detail: "International Invention & Innovation Competition",
  },
];

const SIDE_QUESTS = [
  {
    role: "Quantitative Developer",
    org: "AlgoGators Investment Fund",
    when: "2026–Now",
  },
  {
    role: "Project Captain, Launchpad",
    org: "Dream Team Engineering",
    when: "2024–Now",
  },
  {
    role: "IoT & AI Research Assistant",
    org: "Hanoi Univ. of Science & Technology",
    when: "2023",
  },
];

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export default function About() {
  return (
    <ComicPage
      id="about"
      page={4}
      chapter="Chapter 03 · About"
      title="A little about me"
      next="Finale on the last page"
      tilt={0.4}
    >
      <div className="grid gap-[var(--gutter)] md:grid-cols-[1.4fr_1fr]">
        {/* Origin story: speech-bubble panel */}
        <Reveal>
          <div className="punk-box">
            <ZineCut
              headline="ORIGIN!"
              words={["LATE EDITION", "SHOCK!", "READ ALL ABOUT IT"]}
            />
            <div
              className="panel h-full overflow-hidden p-6 pb-12 sm:p-8 sm:pb-14"
              style={{ "--shadow": "var(--accent-2)" } as React.CSSProperties}
            >
              <div
                aria-hidden
                className="halftone pointer-events-none absolute inset-0"
                style={
                  {
                    "--dot-color": "rgb(34 228 255 / 0.35)",
                    "--dot": "10px",
                  } as React.CSSProperties
                }
              />
              <span className="caption relative -rotate-1">Origin story</span>
              <div className="bubble relative mt-5 space-y-3 p-6 sm:p-7">
                <p className="text-base leading-relaxed sm:text-lg">
                  I&apos;m Dat — a University of Florida student who likes
                  taking ML from a whiteboard idea all the way to production.
                  I&apos;ve interned at Viettel AI and FPT Software in Hanoi and
                  at VSP Vision, and now split my time between research and
                  shipping.
                </p>
                <p className="text-base leading-relaxed sm:text-lg">
                  I&apos;m most drawn to deep learning systems, hardware-aware
                  optimization, and ML that lands somewhere it matters — like
                  healthcare. Right now I&apos;m tracing fine-tuned behaviors
                  back to individual training tokens.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Power-ups panel */}
        <Reveal delay={0.08}>
          <div className="punk-box">
            <ZineCut
              headline="POWER UP"
              words={["SKILLS?!", "NO RULES", "EXTRA!"]}
            />
            <div
              className="panel h-full bg-accent-3 p-6 sm:p-8"
              style={{ "--shadow": "var(--accent-1)" } as React.CSSProperties}
            >
              <p className="font-display text-3xl uppercase tracking-wide">
                Power-ups
              </p>
              <div className="mt-4 space-y-5">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
                      {group.label}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {group.skills.map((skill, i) => (
                        <li
                          key={skill}
                          data-cursor-hover
                          className={`${i % 3 === 0 ? "bg-paper" : group.color} ${TILTS[i % TILTS.length]} border-2 border-black px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-paper-ink shadow-[3px_3px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-0`}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Achievements panel */}
        <Reveal delay={0.04}>
          <div className="punk-box">
            <ZineCut
              headline="WINNER!"
              words={["TROPHIES", "HEADLINE", "OI!"]}
            />
            <div
              className="panel h-full bg-paper-ink p-6 text-foreground sm:p-8"
              style={{ "--shadow": "var(--accent-3)" } as React.CSSProperties}
            >
              <div
                aria-hidden
                className="speed-lines pointer-events-none absolute inset-0 opacity-60"
              />
              <p className="font-display misprint relative text-3xl uppercase tracking-wide">
                Achievements unlocked
              </p>
              <ol className="relative mt-5 space-y-4">
                {AWARDS.map((a) => (
                  <li key={a.title} className="flex gap-4">
                    <span className="caption h-fit shrink-0">{a.year}</span>
                    <div>
                      <p className="font-display text-xl uppercase leading-tight tracking-wide text-accent-3">
                        {a.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-snug text-muted">
                        {a.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Side quests panel */}
        <Reveal delay={0.1}>
          <div className="punk-box">
            <ZineCut
              headline="D.I.Y."
              words={["SIDE GIGS", "UNDERGROUND", "LOUD"]}
            />
            <div
              className="panel h-full p-6 sm:p-8"
              style={{ "--shadow": "var(--accent-2)" } as React.CSSProperties}
            >
              <div
                aria-hidden
                className="halftone-fade pointer-events-none absolute inset-0"
              />
              <p className="font-display relative text-3xl uppercase tracking-wide">
                Side quests
              </p>
              <ul className="relative mt-5 space-y-4">
                {SIDE_QUESTS.map((q) => (
                  <li
                    key={q.org}
                    className="border-l-[5px] border-accent-1 pl-3"
                  >
                    <p className="font-display text-xl uppercase leading-tight tracking-wide">
                      {q.role}
                    </p>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-paper-muted">
                      {q.org} · {q.when}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </ComicPage>
  );
}
