/**
 * Decorative sticker shapes.
 *
 * Scallops, bursts and blobs scattered behind content — the organic
 * counterweight to an otherwise strict 12-column grid. Without something like
 * this the bright palette just sits in rectangles and the page reads as a
 * recoloured version of the old one rather than a different design.
 *
 * All are `aria-hidden` and pointer-events-none: they carry no information and
 * must never intercept a click meant for the content they overlap.
 *
 * A server component — these are static paths, so none of it reaches the
 * client bundle.
 */

export type ShapeName = "scallop" | "burst" | "blob" | "star" | "pill";

/**
 * `spin` and `wobble` drive `rotate`, `float` drives `translate`, `beat`
 * drives `scale` — each on its own independent transform property so the
 * static tilt below survives.
 */
export type ShapeAnim = "spin" | "wobble" | "float" | "beat" | "none";

const paths: Record<ShapeName, string> = {
  /* Twelve-petal scallop — the flower-ish mark from the reference. */
  scallop:
    "M50 4c6 0 10 8 15 9s12-5 17-2 2 12 6 16 14 4 15 10-7 10-8 15 5 12 2 17-12 2-16 6-4 14-10 15-10-7-15-8-12 5-17 2-2-12-6-16-14-4-15-10 7-10 8-15-5-12-2-17 12-2 16-6 4-14 10-15Z",
  /* Spiky burst. Fewer, longer points read better at small sizes than a
     many-pointed star, which turns to mush under 40px. */
  burst:
    "M50 2 58 26 78 12 72 36 96 32 80 50l16 18-24-4 6 24-20-14-8 24-8-24-20 14 6-24-24 4 16-18L4 32l24 4-6-24 20 14Z",
  /* Asymmetric blob. Deliberately not a circle — irregularity is what stops
     it reading as a loading spinner. */
  blob: "M52 3c16-2 30 8 37 22s6 32-4 44-28 20-43 16S13 68 9 53 14 20 27 11 36 5 52 3Z",
  star: "M50 6c4 20 20 36 40 40-20 4-36 20-40 40-4-20-20-36-40-40 20-4 36-20 40-40Z",
  pill: "M28 20h44a30 30 0 0 1 0 60H28a30 30 0 0 1 0-60Z",
};

export default function Shape({
  name,
  color,
  size = 80,
  rotate = 0,
  animate = "none",
  /**
   * Seconds. Vary this per instance — the reference runs its shapes at 5s, 6s,
   * 9s and 22s precisely so they never sync up. Give several shapes the same
   * duration and the whole page starts pulsing in time, which reads as a
   * loading state rather than as life.
   */
  duration = 8,
  /** Negative offset so a shape doesn't begin its cycle at mount. */
  delay = 0,
  className = "",
  style,
  /** Draws the sticker outline that ties these to the button and card edges. */
  outline = true,
}: {
  name: ShapeName;
  /** Any CSS colour — normally `var(--violet)` and friends. */
  color: string;
  size?: number;
  rotate?: number;
  animate?: ShapeAnim;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  outline?: boolean;
}) {
  const spinning = animate === "spin" || animate === "wobble";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{
        /* `rotate`, not `transform` — see the keyframes note in globals.css.
           Spin and wobble own this axis, so the static tilt is dropped for
           those two rather than fighting the animation. */
        rotate: spinning ? undefined : `${rotate}deg`,
        animation:
          animate === "none"
            ? undefined
            : `sticker-${animate} ${duration}s ${
                animate === "spin" ? "linear" : "ease-in-out"
              } ${delay}s infinite`,
        ...style,
      }}
    >
      <path
        d={paths[name]}
        fill={color}
        stroke={outline ? "var(--outline)" : "none"}
        strokeWidth={outline ? 2.5 : 0}
        strokeLinejoin="round"
      />
    </svg>
  );
}
