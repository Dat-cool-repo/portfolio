"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";
import SpiderSense from "./SpiderSense";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? "border-b-[3px] border-black bg-background/95" : "border-b-[3px] border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-10">
        <a
          href="#home"
          data-cursor-hover
          className="tingle-host font-display misprint glitch-hover relative text-3xl uppercase tracking-wider"
        >
          Dat<span className="text-accent-3">.</span>
          <SpiderSense length={18} gap={5} perSide={0} perEnd={1} />
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.filter((i) => i.href !== "#home").map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-cursor-hover
                className="tingle-host font-display relative text-lg uppercase tracking-widest text-foreground decoration-accent-1 decoration-[3px] underline-offset-4 transition-colors hover:text-accent-3 hover:underline"
              >
                {item.label}
                <SpiderSense length={22} gap={4} perSide={1} perEnd={2} />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            data-cursor-hover
            className="tingle-host ink-btn relative rotate-1 bg-accent-3 px-3 py-1 text-base text-paper-ink"
          >
            Get in touch
            <SpiderSense length={18} gap={6} perSide={1} perEnd={2} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ink-btn -rotate-2 bg-paper px-2 py-1 text-paper-ink md:hidden"
          >
            {open ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
          </button>
        </div>
      </nav>

      {/* Phone menu: a comic panel of chapter links. */}
      {open && (
        <div id="mobile-menu" className="px-4 pb-5 md:hidden">
          <ul className="panel pop-in grid gap-2 p-4" style={{ "--shadow": "var(--accent-1)" } as React.CSSProperties}>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display flex items-center justify-between border-[3px] border-black bg-white px-4 py-2 text-2xl uppercase tracking-wider text-paper-ink shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {item.label}
                  <span className="font-mono text-xs font-bold">CH. {String(i).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
