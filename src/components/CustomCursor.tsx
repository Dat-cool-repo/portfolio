"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Same width as the md:block below: no custom cursor is drawn in narrower
    // windows, so the system cursor must stay there.
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const html = document.documentElement;

    const pos = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    let raf = 0;

    // The ring eases after the dot; the loop sleeps once it has caught up.
    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      raf = Math.abs(pos.x - ring.x) + Math.abs(pos.y - ring.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor-hover]"));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // Leaving the window: hide instead of freezing at the edge.
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    const start = () => {
      html.dataset.customCursor = "";
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseout", onOut);
    };
    const stop = () => {
      delete html.dataset.customCursor;
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      raf = 0;
      setVisible(false);
    };
    const sync = () => (mq.matches ? start() : stop());
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <div
      id="custom-cursor"
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
      aria-hidden
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-3 shadow-[0_0_0_2px_#000]"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] transition-[width,height,border-color,box-shadow] duration-200"
        style={{
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          borderColor: hovering ? "var(--accent-3)" : "var(--accent-2)",
          boxShadow: hovering ? "3px 0 0 var(--accent-1), -3px 0 0 var(--accent-2)" : "2px 0 0 var(--accent-1)",
        }}
      />
    </div>
  );
}
