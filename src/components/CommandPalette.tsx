"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Terminal } from "lucide-react";

// cmdk stays out of the first-load bundle: the chunk is fetched when the
// browser goes idle (so the first ⌘K still opens instantly), or on open.
const loadMenu = () => import("./CommandMenu");
const CommandMenu = dynamic(loadMenu, { ssr: false });

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

  useEffect(() => {
    if (!("requestIdleCallback" in window)) {
      const t = setTimeout(loadMenu, 2000);
      return () => clearTimeout(t);
    }
    const id = requestIdleCallback(() => loadMenu());
    return () => cancelIdleCallback(id);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        data-cursor-hover
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 border-[3px] border-black bg-paper px-4 py-2 font-mono text-xs font-bold uppercase text-paper-ink shadow-[4px_4px_0_0_var(--accent-1)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:flex"
      >
        <Terminal size={14} aria-hidden />
        <span>Command menu</span>
        <kbd aria-hidden className="border-2 border-black bg-accent-3 px-1.5 py-0.5 font-mono text-[10px]">
          &#8984;K
        </kbd>
      </button>

      {open && <CommandMenu onClose={() => setOpen(false)} />}
    </>
  );
}
