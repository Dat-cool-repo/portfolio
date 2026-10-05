/*
 * Shared SVG filter for the Spot's ink, referenced from SVG (filter="url(#…)")
 * and CSS (filter: url(#…)). Rendered once at the root, outside any
 * display:none subtree so they always resolve.
 *  - ink-rough: ragged, splattered edges for black spots (his spots aren't
 *    clean circles).
 *  - hold-tint: the Experience hold's purple multiply (#9a1fc4) as a filter,
 *    for the nav, which sits above that overlay while a box is held.
 */
export default function InkFilters() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="ink-rough" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="hold-tint" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.604 0 0 0 0  0 0.122 0 0 0  0 0 0.769 0 0  0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
