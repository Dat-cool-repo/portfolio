/** Each page section lives in its own "dimension" with a distinct backdrop. */
export type Scene = {
  /** Section element id; also the value of <html data-scene>. */
  id: string;
  label: string;
  /** Onomatopoeia and ray color for the impact frame when entering. */
  word: string;
  color: string;
};

export const SCENES: Scene[] = [
  { id: "home", label: "Earth-26 · Front Page", word: "POW!", color: "#e8112d" },
  { id: "experience", label: "The Impact Zone", word: "WHAM!", color: "#b4ff2e" },
  { id: "projects", label: "The Ink Void", word: "SPLAT!", color: "#ffffff" },
  { id: "about", label: "Earth-138 · Spider-Punk", word: "KRASH!", color: "#e8112d" },
  { id: "contact", label: "Earth-928 · Nueva York", word: "KABOOM!", color: "var(--accent-4)" },
];
