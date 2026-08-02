/**
 * The icon set.
 *
 * One drawing language throughout: 24px box, 1.5 stroke, round caps and
 * joins, `currentColor`, no fills. That consistency is why a set of hand-drawn
 * paths reads as designed where a grab-bag of library icons reads as assembled
 * — and it is why these replace the text arrows (→ ↗ ↓) that were here before,
 * which render at a different weight and vertical offset in every font.
 *
 * A server component: no state, no client bundle.
 *
 * Every icon is `aria-hidden` by default. Icons here are always decorative —
 * an icon-only control gets its name from an `aria-label` on the button, and a
 * labelled control does not need the glyph announced twice.
 */

export type IconName =
  | "search"
  | "close"
  | "menu"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up"
  | "arrow-down"
  | "arrow-up-right"
  | "download"
  | "send"
  | "check"
  | "spark"
  | "return"
  | "external";

const paths: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.2 16.2 4.3 4.3" />
    </>
  ),
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  menu: <path d="M4 9h16M4 15h16" />,
  "arrow-right": <path d="M4 12h15M13 6l6 6-6 6" />,
  "arrow-left": <path d="M20 12H5M11 18l-6-6 6-6" />,
  "arrow-up": <path d="M12 20V5M6 11l6-6 6 6" />,
  "arrow-down": <path d="M12 4v15M6 13l6 6 6-6" />,
  "arrow-up-right": <path d="M7 17 17 7M8.5 7H17v8.5" />,
  download: (
    <>
      <path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5" />
      <path d="M4.5 16.5v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2" />
    </>
  ),
  /* Paper plane, with the fold line — without it the shape reads as a
     generic triangle at 16px. */
  send: (
    <>
      <path d="M20.5 3.5 3.5 10.2l6.6 2.7 2.7 6.6 7.7-16Z" />
      <path d="m10.1 12.9 4.6-4.6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  /* Four-point star. Reads as "ask the model" without borrowing anyone's
     assistant mark. */
  spark: (
    <path d="M12 3.5c.6 3.3 1.7 4.4 5 5-3.3.6-4.4 1.7-5 5-.6-3.3-1.7-4.4-5-5 3.3-.6 4.4-1.7 5-5Z" />
  ),
  /* Enter/return key glyph, for the palette's Open hint. */
  return: <path d="M20 5v5a3 3 0 0 1-3 3H5M9 9l-4 4 4 4" />,
  external: (
    <>
      <path d="M14 4.5h5.5V10" />
      <path d="m19 5-8 8" />
      <path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
    </>
  ),
};

export default function Icon({
  name,
  size = 16,
  className = "",
  strokeWidth = 1.5,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  );
}
