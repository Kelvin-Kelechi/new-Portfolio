import type { ReactNode } from "react";

export type BlockColor =
  | "violet"
  | "coral"
  | "amber"
  | "mint"
  | "sky"
  | "blush"
  | "slate";

/**
 * `lip` — the wide shallow arc used by Method and Contact.
 *
 * `organic` — four different elliptical radii, deliberately asymmetric left to
 * right. Equal radii on both sides read as a rounded rectangle no matter how
 * large they get, because the eye picks up the mirror symmetry immediately.
 * Breaking that symmetry is what makes the shape read as drawn rather than
 * boxed. The horizontal pairs each sum to 100% so the browser never has to
 * scale them down to fit, which would change the shape unpredictably at
 * different widths.
 */
export type BlockShape = "lip" | "organic";

const SHAPES: Record<BlockShape, React.CSSProperties> = {
  lip: {},
  /* Multiples of `--radius-lip` rather than fixed rem, so the asymmetry keeps
     its proportions as the arc depth scales down on narrow screens. At the
     desktop end of the clamp these resolve to 9/6/5/8rem. */
  /* Top corners only. The bottom edge is owned by `.block-curve-bottom`, which
     scoops inward — a border-radius there would bulge outward and the two
     would fight for the same edge. */
  organic: {
    borderStartStartRadius: "62% calc(var(--radius-lip) * 1.8)",
    borderStartEndRadius: "38% calc(var(--radius-lip) * 1.2)",
  },
};

/**
 * A full-bleed band of colour with a curved lip.
 *
 * Two things it handles that a plain `<section class="bg-amber">` would not:
 *
 *   1. It breaks out of the page's max-width container using a
 *      `100vw`/`50%` margin trick, so the colour reaches both viewport edges
 *      while its content stays on the same grid as every other section.
 *      `100vw` is deliberate over `100%` — it ignores the parent's width, which
 *      is the entire point of a full-bleed element.
 *
 *   2. It applies `on-color`, which rewrites the local ink scale to near-black.
 *      Every child component — headings, labels, muted copy, icons, rules —
 *      then renders dark-on-bright automatically, identically in both themes.
 *      That is what keeps one colour system across the theme toggle instead of
 *      needing a dark and a light variant of every section.
 */
export default function ColorBlock({
  color,
  children,
  curveTop = true,
  /* On by default: every block scoops inward at the bottom. */
  curveBottom = true,
  shape = "lip",
  className = "",
  id,
  ...rest
}: {
  color: BlockColor;
  children: ReactNode;
  curveTop?: boolean;
  curveBottom?: boolean;
  shape?: BlockShape;
  className?: string;
  id?: string;
  [key: `aria-${string}`]: string | undefined;
}) {
  const organic = shape === "organic";

  return (
    <div
      id={id}
      {...rest}
      /* The bottom scoop is a mask, not a radius, so it applies to BOTH shapes
         — `organic` only overrides the top corners. */
      className={`on-color relative isolate ${
        !organic && curveTop ? "block-curve-top" : ""
      } ${curveBottom ? "block-curve-bottom" : ""} ${className}`}
      style={{
        background: `var(--${color})`,
        /* Full-bleed: pull out to the viewport edges regardless of any
           container this sits inside. */
        width: "100vw",
        marginInline: "calc(50% - 50vw)",
        ...SHAPES[shape],
      }}
    >
      {children}
    </div>
  );
}
