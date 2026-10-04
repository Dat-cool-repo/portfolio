import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t-[3px] border-black bg-gradient-to-b from-[#0a0820]/85 via-[#0a0820]/55 to-transparent">
      <div aria-hidden className="speed-lines pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-6xl px-6 py-28 sm:px-10">
        <Reveal>
          <span className="caption -rotate-2">Chapter 04 · Contact</span>
          <h2 className="font-display misprint glitch-hover mt-5 max-w-3xl text-6xl uppercase leading-[0.95] tracking-wide sm:text-8xl">
            Let&apos;s <span className="text-accent-3">talk!</span>
          </h2>
          <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
            Open to ML and AI engineering roles — deep learning systems, hardware-aware optimization, and ML for healthcare. Reach out, I reply fast.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="mailto:harydat12@gmail.com"
              data-cursor-hover
              className="ink-btn bg-accent-3 text-paper-ink"
            >
              <Mail size={18} strokeWidth={2.5} /> Email me
            </a>
            <a
              href="https://github.com/dat-cool-repo"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="ink-btn bg-accent-2 text-paper-ink"
            >
              <GithubIcon size={18} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/dat-le-96aa27262"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="ink-btn bg-accent-1 text-paper-ink"
            >
              <LinkedinIcon size={18} /> LinkedIn
            </a>
          </div>
        </Reveal>

        <div className="mt-24 flex flex-col items-center justify-between gap-4 border-[3px] border-black bg-paper-ink px-5 py-4 font-mono text-xs text-muted shadow-[5px_5px_0_0_#000] sm:flex-row">
          <span>&copy; {new Date().getFullYear()} — Built with Next.js &amp; Tailwind.</span>
          <span className="font-display text-base tracking-widest text-accent-3">To be continued…</span>
        </div>
      </div>
    </footer>
  );
}
