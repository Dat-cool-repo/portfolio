"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { ArrowRight, Mail, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { NAV_ITEMS } from "@/lib/nav-items";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const external = (url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        data-cursor-hover
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 border-[3px] border-black bg-paper px-4 py-2 font-mono text-xs font-bold uppercase text-paper-ink shadow-[4px_4px_0_0_var(--accent-1)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:flex"
      >
        <Terminal size={14} />
        <span>Command menu</span>
        <kbd className="border-2 border-black bg-accent-3 px-1.5 py-0.5 font-mono text-[10px]">
          &#8984;K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-start justify-center bg-black/75 px-4 pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <Command
              label="Command menu"
              className="overflow-hidden border-[3px] border-black bg-paper text-paper-ink shadow-[10px_10px_0_0_var(--accent-2)]"
            >
              <div className="flex items-center gap-2 border-b-[3px] border-black px-4 py-3">
                <Terminal size={16} className="text-paper-muted" />
                <Command.Input
                  autoFocus
                  placeholder="Jump to a section, or find me elsewhere..."
                  className="w-full bg-transparent py-1 text-sm text-paper-ink outline-none placeholder:text-paper-muted"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
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
                      <ArrowRight size={14} />
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Elsewhere" className="px-2 py-1 font-mono text-xs font-bold uppercase text-paper-muted">
                  <Command.Item
                    onSelect={() => external("https://github.com/dat-cool-repo")}
                    className="flex cursor-pointer items-center gap-2 border-2 border-transparent px-3 py-2.5 text-sm text-paper-ink data-[selected=true]:border-black data-[selected=true]:bg-accent-3"
                  >
                    <GithubIcon size={14} /> GitHub
                  </Command.Item>
                  <Command.Item
                    onSelect={() => external("https://www.linkedin.com/in/dat-le-96aa27262")}
                    className="flex cursor-pointer items-center gap-2 border-2 border-transparent px-3 py-2.5 text-sm text-paper-ink data-[selected=true]:border-black data-[selected=true]:bg-accent-3"
                  >
                    <LinkedinIcon size={14} /> LinkedIn
                  </Command.Item>
                  <Command.Item
                    onSelect={() => external("mailto:harydat12@gmail.com")}
                    className="flex cursor-pointer items-center gap-2 border-2 border-transparent px-3 py-2.5 text-sm text-paper-ink data-[selected=true]:border-black data-[selected=true]:bg-accent-3"
                  >
                    <Mail size={14} /> Email
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
