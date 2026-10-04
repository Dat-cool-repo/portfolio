"use client";

import { useEffect, useState } from "react";
import { SCENES } from "@/lib/scenes";
import { IMPACT_EVENT } from "./ImpactFlash";

// How long scrolling must be still before we commit to a new section.
const SETTLE_MS = 180;

/**
 * Watches which section sits under the middle of the viewport. When scrolling
 * settles in a new section (so a nav click's smooth scroll doesn't fire an
 * impact for every section it passes), it fires a full-screen impact frame and
 * swaps <html data-scene>, cutting the backdrop to that section's dimension
 * underneath the flash. Also renders the "dimension" caption in the corner.
 */
export default function SectionThemes() {
  const [current, setCurrent] = useState(SCENES[0].id);

  useEffect(() => {
    const html = document.documentElement;
    let pending: string | null = null;
    let armed = false;
    let settle: ReturnType<typeof setTimeout> | undefined;

    const commit = () => {
      if (!pending || html.dataset.scene === pending) return;
      const scene = SCENES.find((s) => s.id === pending);
      if (!scene) return;
      if (armed) {
        window.dispatchEvent(
          new CustomEvent(IMPACT_EVENT, {
            detail: { color: scene.color, word: scene.word },
          }),
        );
      }
      html.dataset.scene = scene.id;
      setCurrent(scene.id);
    };
    const schedule = () => {
      clearTimeout(settle);
      settle = setTimeout(commit, SETTLE_MS);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        pending = hit.target.id;
        schedule();
      },
      // A one-pixel line across the middle of the viewport.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const s of SCENES) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }

    // Any scroll movement pushes the commit back until things are still.
    const onScroll = () => {
      if (pending && pending !== html.dataset.scene) schedule();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // No flash for the starting position (page load or refresh mid-page).
    const arm = setTimeout(() => {
      commit();
      armed = true;
    }, 400);

    // Held full-screen modes while a box is hovered: Experience holds the
    // purple impact negative, About turns the page into a punk photocopy.
    // One loop reads the real :hover state every frame (so scrolling under a
    // still mouse can't desync it), sets <html data-hold>, and cuts the
    // overlay's hole around the hovered panel as it drifts.
    // Mouse: the hovered box. Touch (no real hover): a tap holds a box and
    // fires its impact; tapping it again, tapping elsewhere or scrolling
    // away releases it. The held box gets .is-held, which all the CSS keys off.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const BOXES = ".exp-box, .punk-box";
    let touchHeld: HTMLElement | null = null;
    let touchY = 0;
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const box = (e.target as Element).closest<HTMLElement>(BOXES);
      if (!box || box === touchHeld) {
        touchHeld = null;
        return;
      }
      touchHeld = box;
      touchY = window.scrollY;
      if (box.dataset.impact) {
        window.dispatchEvent(
          new CustomEvent(IMPACT_EVENT, {
            detail: {
              color: box.dataset.impact,
              word: box.dataset.impactWord || "POW!",
            },
          }),
        );
      }
    };
    const onTouchScroll = () => {
      if (touchHeld && Math.abs(window.scrollY - touchY) > 160)
        touchHeld = null;
    };
    document.addEventListener("pointerup", onTap);
    window.addEventListener("scroll", onTouchScroll, { passive: true });

    let held: HTMLElement | null = null;
    let lastRect = "";
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const box = canHover.matches
        ? document.querySelector<HTMLElement>(".exp-box:hover, .punk-box:hover")
        : touchHeld;
      if (box !== held) {
        held?.classList.remove("is-held");
        box?.classList.add("is-held");
        held = box;
      }
      const mode = !box
        ? ""
        : box.classList.contains("exp-box")
          ? "exp"
          : "punk";
      if ((html.dataset.hold ?? "") !== mode) {
        if (mode) html.dataset.hold = mode;
        else delete html.dataset.hold;
      }
      if (!box) return;
      // Measure the (non-thrashing) wrapper, and only touch the CSS vars when
      // the rect actually moves: every change repaints the full-screen overlays.
      const pad = mode === "exp" ? 6 : 70;
      const r = box.getBoundingClientRect();
      const rect = `${Math.round(r.left - pad)} ${Math.round(r.top - pad)} ${Math.round(r.right + pad)} ${Math.round(r.bottom + pad)}`;
      if (rect === lastRect) return;
      lastRect = rect;
      const [x1, y1, x2, y2] = rect.split(" ");
      html.style.setProperty("--hx1", `${x1}px`);
      html.style.setProperty("--hy1", `${y1}px`);
      html.style.setProperty("--hx2", `${x2}px`);
      html.style.setProperty("--hy2", `${y2}px`);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerup", onTap);
      window.removeEventListener("scroll", onTouchScroll);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settle);
      clearTimeout(arm);
    };
  }, []);

  const scene = SCENES.find((s) => s.id === current) ?? SCENES[0];
  return (
    <>
      {/* Held full-screen modes while a box is hovered (see loop above). */}
      <div aria-hidden className="hold-impact">
        <span className="hold-impact-lines" />
        <span className="hold-impact-dots" />
      </div>
      <div aria-hidden className="hold-box">
        <span className="hold-box-bars" />
        <span className="hold-box-dots" />
        <span className="hold-box-shards" />
        <span className="hold-box-scan" />
      </div>
      <div aria-hidden className="hold-punk">
        <span className="hold-punk-gray" />
        <span className="hold-punk-ink" />
        <span className="hold-punk-strips" />
      </div>
      <p
        key={scene.id}
        aria-live="polite"
        className="dimension-tag pop-in fixed bottom-6 left-6 z-40 hidden border-[3px] border-black bg-paper px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-paper-ink shadow-[4px_4px_0_0_var(--accent-1)] sm:block"
      >
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent-1 align-middle" />
        Now entering: {scene.label}
      </p>
    </>
  );
}
