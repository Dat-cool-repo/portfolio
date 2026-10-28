"use client";

import { useEffect, useRef } from "react";
import { Command } from "cmdk";
import { ArrowRight, Mail, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { NAV_ITEMS } from "@/lib/nav-items";

const ITEM =
  "flex cursor-pointer items-center gap-2 border-2 border-transparent px-3 py-2.5 text-sm text-paper-ink data-[selected=true]:border-black data-[selected=true]:bg-accent-3";

/** The ⌘K dialog itself. Split out of CommandPalette so cmdk loads on demand. */
export default function CommandMenu({ onClose }: { onClose: () => void }) {
  // Hand focus back to wherever it was when the menu opened, unless picking
  // a section moved the reader somewhere else.
  const navigated = useRef(false);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => {
      if (!navigated.current) opener?.focus({ preventScroll: true });
    };
  }, []);

  const go = (href: string) => {
    navigated.current = true;
    onClose();
    // A real fragment jump, like the nav links: updates the URL, follows the
    // CSS smooth-scroll setting (off for reduced motion) and moves the Tab
    // starting point to the section.
    if (location.hash !== href) {
      window.location.assign(href);
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector(href)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const external = (url: string) => {
    onClose();
    if (url.startsWith("mailto:")) window.location.href = url;
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center bg-black/75 px-4 pt-[15vh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onClick={(e) => e.stopPropagation()}
        // The search box is the only tab stop; keep focus inside the dialog.
        onKeyDown={(e) => e.key === "Tab" && e.preventDefault()}
        className="w-full max-w-lg"
      >
        <Command
          label="Command menu"
          className="overflow-hidden border-[3px] border-black bg-paper text-paper-ink shadow-[10px_10px_0_0_var(--accent-2)]"
        >
          <div className="flex items-center gap-2 border-b-[3px] border-black px-4 py-3">
            <Terminal size={16} aria-hidden className="text-paper-muted" />
            <Command.Input
              autoFocus
              placeholder="Jump to a section, or find me elsewhere…"
              className="w-full bg-transparent py-1 text-sm text-paper-ink outline-none placeholder:text-paper-muted"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto overscroll-contain p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-paper-muted">
              No results found.
            </Command.Empty>
            <Command.Group heading="Navigate" className="px-2 py-1 font-mono text-xs font-bold uppercase text-paper-muted">
              {NAV_ITEMS.map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => go(item.href)}
                  className="flex cursor-pointer items-center justify-between border-2 border-transparent px-3 py-2.5 text-sm text-paper-ink data-[selected=true]:border-black data-[selected=true]:bg-accent-3"
                >
                  {item.label}
                  <ArrowRight size={14} aria-hidden />
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Elsewhere" className="px-2 py-1 font-mono text-xs font-bold uppercase text-paper-muted">
              <Command.Item onSelect={() => external("https://github.com/dat-cool-repo")} className={ITEM}>
                <GithubIcon size={14} /> GitHub
              </Command.Item>
              <Command.Item onSelect={() => external("https://www.linkedin.com/in/dat-le-96aa27262")} className={ITEM}>
                <LinkedinIcon size={14} /> LinkedIn
              </Command.Item>
              <Command.Item onSelect={() => external("mailto:harydat12@gmail.com")} className={ITEM}>
                <Mail size={14} aria-hidden /> Email
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
