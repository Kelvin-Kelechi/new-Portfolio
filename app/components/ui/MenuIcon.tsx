/**
 * Hamburger that morphs into a close mark.
 *
 * Two lines that meet in the middle and counter-rotate, rather than swapping
 * one glyph for another. The morph is what tells the user the button they just
 * pressed is the same button that will close the panel — a hard cut between a
 * ☰ and an ✕ reads as two different controls.
 *
 * `transform-box` defaults to `view-box` on SVG elements, so a
 * `transform-origin` of `12px 12px` is the centre of the 24px viewBox.
 * Setting it in px rather than `center` avoids the Safari quirk where a
 * percentage origin resolves against the element's own zero-height bounding
 * box and the lines rotate around their left end.
 *
 * Under reduced motion the global rule in globals.css collapses the transition
 * to nothing, so it becomes an instant state change — still correct, just not
 * animated.
 */
export default function MenuIcon({
  open,
  size = 18,
}: {
  open: boolean;
  size?: number;
}) {
  const line = {
    transformOrigin: "12px 12px",
    transition: "transform 400ms var(--ease-spring)",
  } as const;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <line
        x1="3.5"
        y1="9"
        x2="20.5"
        y2="9"
        style={{
          ...line,
          transform: open ? "translateY(3px) rotate(45deg)" : "none",
        }}
      />
      <line
        x1="3.5"
        y1="15"
        x2="20.5"
        y2="15"
        style={{
          ...line,
          transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
        }}
      />
    </svg>
  );
}
