import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import ComicPage from "./ComicPage";
import InkFling from "./InkFling";
import { PROJECTS } from "@/data/projects";
import { RESEARCH } from "@/data/research";

const drift = (i: number) =>
  ({ "--drift-dur": `${6 + (i % 2) * 1.5}s`, "--drift-delay": `${-i * 2.1}s`, "--drift-amp": "6px" }) as React.CSSProperties;

export default function Projects() {
  return (
    <ComicPage
      id="projects"
      page={3}
      chapter="Chapter 02 · Projects & research"
      title="Things I've built"
      next="Continued on page 04"
      tilt={0.4}
    >
      {/* One strip per row with wide gutters, so hover impacts never collide. */}
      <div className="relative space-y-16 px-1 pb-6 pt-4 sm:space-y-20 sm:px-4">
        <InkFling />
        {PROJECTS.map((project, i) => (
          <Reveal key={project.title} delay={0.05} className="relative z-10 hover:z-20">
            <div className="drift" style={drift(i)}>
              <ProjectCard project={project} index={i} />
            </div>
          </Reveal>
        ))}

        {/* Research files, drawn into the same sketchbook. */}
        <div id="research" className="relative z-10 scroll-mt-24 pt-6">
          <div className="title-panel">
            <span className="caption relative -rotate-2">Research files</span>
            <h3 className="font-display misprint relative mt-4 text-4xl uppercase leading-none tracking-wide text-foreground sm:text-5xl">
              Questions I&apos;ve chased
            </h3>
          </div>
        </div>
        {RESEARCH.map((item, i) => {
          const index = PROJECTS.length + i;
          return (
            <Reveal key={item.title} delay={0.05} className="relative z-10 hover:z-20">
              <div className="drift" style={drift(index)}>
                <ProjectCard
                  project={{ title: item.title, blurb: item.summary, tags: [], year: item.year, href: item.href }}
                  index={index}
                  caption={`Research file #${String(i + 1).padStart(2, "0")}`}
                  glyph="?!"
                  venue={item.venue}
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </ComicPage>
  );
}
