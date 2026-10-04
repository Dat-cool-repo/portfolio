# Portfolio

Next.js 16 + Tailwind v4 + Framer Motion. Comic-book styling inspired by *Into the Spider-Verse*: halftone dots, off-register CMY print headlines, ink-bordered panels, caption boxes and speech bubbles — all CSS, no images or WebGL. Includes a custom cursor, scroll reveals and a ⌘K command palette. Animations respect `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/app/page.tsx` — page composition (Nav, Hero, Projects, Research, About, Footer)
- `src/components/` — all UI pieces, including `CustomCursor`, `CommandPalette`, `SectionHeading`
- `src/app/globals.css` — palette tokens and the comic utilities (`.panel`, `.caption`, `.bubble`, `.misprint`, `.halftone`, `.speed-lines`, `.ink-btn`, `.burst`)
- `src/data/projects.ts`, `src/data/research.ts` — **placeholder content, replace with your real projects/research**

## Still placeholder

- Portrait photo: drop it in `public/` and set `PORTRAIT_SRC` in `src/components/ComicPortrait.tsx`.
- Project screenshots and links: add `image` / `href` per project in `src/data/projects.ts`.
- Paper link for the ASABE 2025 publication in `src/data/experience.ts`.

## Notes

- Fonts (Bangers, Space Grotesk, Space Mono) are self-hosted via `next/font/google`; the build downloads them once.
- `npm run build` and `npm run lint` both pass clean.
