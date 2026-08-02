/**
 * The two gradient tokens that sit on the hero headline.
 *
 * Both are the reference's `hero__heading-token` shapes, kept at their original
 * viewBoxes and gradients so the colour ramps land exactly where they do in the
 * source:
 *
 *   scallop — 74x74, #FF4F59 -> #FFC4CB, rotate 9s on the easeOutExpo curve
 *   burst   — 68x68, #7539AF -> #F6C6CB, rotate 6s on ease-in-out
 *
 * Two things worth knowing:
 *
 *   - The gradients are `userSpaceOnUse` with coordinates that run well past
 *     the viewBox (x2 of 85.7 on a 74-wide box). That is deliberate in the
 *     original — it puts the light end of the ramp off-shape, so the visible
 *     area only ever shows part of the gradient. Normalising the coordinates
 *     to the box would flatten it.
 *
 *   - The rotation is on `transform`, matching the source's own `rotate`
 *     keyframe, rather than the independent `rotate` property used by the
 *     sticker set. These tokens carry no other transform, so there is nothing
 *     to conflict with, and it keeps the timing directly comparable.
 *
 * Server component, aria-hidden, pointer-events off.
 */

export type TokenName = "scallop" | "burst";

const TOKENS = {
  scallop: {
    viewBox: "0 0 74 74",
    gradientId: "hero-token-scallop",
    gradient: { x1: 36.8106, y1: -0.000976562, x2: 85.7046, y2: 86.7529 },
    stops: [
      { offset: 0.409283, color: "#FF4F59" },
      { offset: 1, color: "#FFC4CB" },
    ],
    d: "M45.3146 4.5941L48.2547 9.05442L53.4636 7.99516C60.6191 6.54038 66.9335 12.903 65.4898 20.1133L64.4386 25.362L68.8651 28.3245C74.9454 32.3946 74.9454 41.3924 68.8651 45.4626L64.4386 48.425L65.4898 53.6737C66.9335 60.884 60.6191 67.2466 53.4636 65.7918L48.2547 64.7326L45.3146 69.1929C41.2753 75.3197 32.3458 75.3197 28.3065 69.1929L25.3665 64.7326L20.1576 65.7918C13.002 67.2466 6.68757 60.884 8.13132 53.6737L9.18254 48.425L4.75604 45.4626C-1.32428 41.3924 -1.32428 32.3946 4.75604 28.3245L9.18254 25.362L8.13132 20.1133C6.68757 12.903 13.002 6.54038 20.1576 7.99516L25.3665 9.05442L28.3065 4.5941C32.3458 -1.53267 41.2753 -1.53267 45.3146 4.5941Z",
    /* 9s on the same easeOutExpo the hands use — the source pairs them. */
    animation: "token-rotate 9s cubic-bezier(0.16, 1, 0.3, 1) 1s infinite",
  },
  burst: {
    viewBox: "0 0 68 68",
    gradientId: "hero-token-burst",
    gradient: { x1: 63.9457, y1: 50.0335, x2: 18.7538, y2: -16.0051 },
    stops: [
      { offset: 0.494234, color: "#7539AF" },
      { offset: 1, color: "#F6C6CB" },
    ],
    d: "M61.8658 51.1417L59.1303 50.8505C55.1377 50.4254 51.8443 53.9555 52.5115 57.9449L52.9683 60.6784C53.2823 62.5562 51.1763 63.8703 49.6478 62.7501L47.4234 61.1195C44.1766 58.7398 39.5724 60.1376 38.1706 63.9285L37.2105 66.526C36.5506 68.3105 34.0746 68.3874 33.3069 66.6474L32.189 64.1145C30.558 60.4178 25.8771 59.3092 22.7824 61.8854L20.6619 63.6507C19.2049 64.8635 17.0225 63.6828 17.2209 61.789L17.5098 59.0327C17.9317 55.0096 14.4284 51.691 10.4693 52.3633L7.75646 52.8236C5.89291 53.14 4.58871 51.0179 5.70042 49.4777L7.31872 47.2364C9.68033 43.9648 8.29315 39.3254 4.53097 37.9129L1.95323 36.9455C0.182174 36.2805 0.105853 33.7856 1.83272 33.012L4.34636 31.8856C8.01508 30.2421 9.11524 25.5254 6.55861 22.4072L4.80664 20.2704C3.60303 18.8023 4.77482 16.6032 6.65424 16.8031L9.38968 17.0943C13.3823 17.5194 16.6757 13.9893 16.0085 9.99995L15.5517 7.26641C15.2377 5.38862 17.3437 4.07446 18.8722 5.19467L21.0965 6.82533C24.3434 9.20498 28.9476 7.80719 30.3493 4.01627L31.3095 1.41884C31.9694 -0.365739 34.4454 -0.442641 35.2131 1.29742L36.331 3.83026C37.962 7.527 42.6429 8.63558 45.7376 6.05942L47.8581 4.29406C49.3151 3.08125 51.4975 4.262 51.2991 6.15577L51.0102 8.91212C50.5883 12.9353 54.0916 16.2538 58.0507 15.5815L60.7635 15.1212C62.6271 14.8048 63.9313 16.9269 62.8196 18.4671L61.2013 20.7084C58.8397 23.98 60.2268 28.6194 63.989 30.0319L66.5668 30.9993C68.3378 31.6643 68.4141 34.1592 66.6873 34.9328L64.1736 36.0592C60.5049 37.7027 59.4047 42.4194 61.9614 45.5376L63.7133 47.6744C64.917 49.1425 63.7452 51.3416 61.8658 51.1417Z",
    /* The purple one is the odd duck: 6s on plain ease-in-out, not the
       easeOutExpo everything else uses. Kept as-is — the mismatch is what
       stops the two tokens turning in visible sympathy. */
    animation: "token-rotate 6s ease-in-out 0s infinite",
  },
} as const;

export default function HeroToken({
  name,
  size,
  className = "",
  style,
}: {
  name: TokenName;
  /** px. The source runs 74 and 68 against a 417px headline. */
  size: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const token = TOKENS[name];

  return (
    <svg
      viewBox={token.viewBox}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none ${className}`}
      style={{
        animation: token.animation,
        transformOrigin: "center",
        ...style,
      }}
    >
      <path d={token.d} fill={`url(#${token.gradientId})`} />
      <defs>
        <linearGradient
          id={token.gradientId}
          x1={token.gradient.x1}
          y1={token.gradient.y1}
          x2={token.gradient.x2}
          y2={token.gradient.y2}
          gradientUnits="userSpaceOnUse"
        >
          {token.stops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
            />
          ))}
        </linearGradient>
      </defs>
    </svg>
  );
}
