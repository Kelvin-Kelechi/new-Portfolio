import Image from "next/image";
import { site } from "@/app/lib/content";

/**
 * The hero illustration stage: the portrait card with both hands around it,
 * in the reference's exact proportions.
 *
 * The whole system hangs off one insight from measuring the source — the
 * containing block IS the card. Every hand is positioned in percentages of the
 * card's own box, which is why the numbers come out round (-78%, -80%, -70%,
 * 70%, -100%) and why the site's own markup carries `--hand-top: -78`.
 *
 * That means the composition survives any card size: change the stage width
 * and the four hands move with it, keeping the grip. The card's aspect ratio is
 * pinned to the source's 504x655 for the same reason — at a different ratio the
 * vertical percentages would land the thumbs in the wrong place.
 *
 * Layer order, from the source's z-indexes (brown-hand -1, blue-hand 0, both
 * thumbs 2, card between): the brown hand passes BEHIND the card while the blue
 * hand crosses in FRONT of it. That crossover is what makes the card look held
 * rather than pasted between two decals.
 *
 * The hands are Flutterwave's artwork, kept byte-identical in
 * /public/illustration. Only the placement maths here is mine.
 */

const CARD_ASPECT = 504 / 655;

type Layer = {
  src: string;
  left: number;
  top: number;
  w: number;
  h: number;
  /**
   * A CSS value, not a number — the hands read `var(--scale-*)` from
   * `.hand-stage` so they shrink together at breakpoints. The sway keyframe
   * consumes the same var via `--hand-scale`, so base transform and animation
   * can never disagree about the current scale.
   */
  scale: string;
  z: number;
  /**
   * `hand` layers grip the card and respond to `--hand-pull`. `token` layers
   * are free-floating decoration and must not — pulling them toward the card
   * centre lands them on the photograph and on the stat row below it.
   */
  kind: "hand" | "token";
  /** Present only on the two thumbs — the hands are static. */
  sway?: { duration: number; delay: number; tilt: number };
  /** Present only on the burst token. Full-turn spin, not a sway. */
  spin?: { duration: number };
};

const LAYERS: readonly Layer[] = [
  {
    src: "/illustration/brown-hand.svg",
    kind: "hand",
    left: 60,
    top: -78,
    w: 111.111,
    h: 98.321,
    scale: "var(--scale-brown)",
    z: -1,
  },
  /*
   * The blue pair — the brown pair's geometry, mirrored.
   *
   * The four SVGs are two mirrored hands: brown reaches down-left from the
   * card's top-right, blue reaches up-right from its bottom-left. So the blue
   * pair should be placeable by reflecting the brown one rather than solved
   * from scratch, and an earlier hand-solved placement is what made the two
   * sides look like different illustrations:
   *
   *   - Blue was drawn at 1.0584x native (137.339% of the card's width against
   *     a 654px viewBox) while brown sat at exactly 1.0. Both are native now,
   *     so the one remaining size difference between the sides is the one the
   *     artwork itself carries (654px of blue against 560px of brown).
   *   - Blue's grip point sat at (-4.5%, 96.2%) of the card. Brown's sits at
   *     (84.6%, -12.1%) — just OUTSIDE the top-right corner, which is what
   *     crops the body off-frame and leaves only a thumbnail and a knuckle on
   *     the card. Reflected, that is (15.4%, 112.1%), so the blue pair moves
   *     ~20% right and ~16% down and its fist finally clears the pitch copy
   *     instead of lying across it.
   *
   * Both layers are moved by ONE rigid transform — scale 0.94483 about the old
   * grip point, then translate onto the new one — so the hand and thumb keep
   * the exact relationship the source gives them. Solving them separately is
   * what breaks a pair into two floating shapes.
   *
   * The grip points are the thumbnails: (81%, 39%) inside blue-thumb.svg,
   * (48%, 74%) inside brown-thumb.svg, both measured off the rendered art.
   *
   * `z: -1` on the hand is still a deliberate departure from the source, which
   * runs it at 0 (in front of the card). Here the card is a photograph rather
   * than a UI panel, and a hand crossing a face reads as an obstruction
   * instead of a grip.
   */
  {
    src: "/illustration/blue-hand.svg",
    kind: "hand",
    left: -64.83,
    top: 70.9,
    w: 129.762,
    h: 109.618,
    scale: "var(--scale-blue)",
    z: -1,
  },
  {
    src: "/illustration/blue-thumb.svg",
    kind: "hand",
    left: -94.83,
    top: 70.9,
    w: 126.984,
    h: 100,
    scale: "var(--scale-blue)",
    z: 2,
    sway: { duration: 5, delay: 0, tilt: -5 },
  },
  {
    src: "/illustration/brown-thumb.svg",
    kind: "hand",
    left: 34,
    top: -80,
    w: 105.357,
    h: 91.756,
    scale: "var(--scale-brown)",
    z: 2,
    sway: { duration: 6, delay: 1.5, tilt: -4 },
  },

  /*
   * The two `.hero__illustration-token` shapes, at the source's own insets.
   *
   * The reference sizes these in fixed pixels (194x195 and 454x457), which is
   * safe there because its card is always 504px wide. Ours is smaller and
   * fluid, so the same values are expressed as percentages of the card —
   * 454/504 and 457/655 — which keeps them in proportion at every width
   * instead of ballooning relative to a narrower card.
   *
   * Neither carries the sticker outline the rest of the page uses: these are
   * soft gradient shapes in the source and outlining them would fight the
   * hands they sit beside.
   */
  {
    /* The unanimated coral flower, off the card's left edge. */
    src: "/illustration/token-flower.svg",
    kind: "token",
    left: -20,
    top: 30,
    w: 38.492,
    h: 29.771,
    scale: "1",
    z: 0,
  },
  {
    /* The purple burst, bottom-right, `inset: 84% 0 0 70%` in the source.
       z-4 puts it ABOVE the covering surface (z-3) so it stays whole — the
       surface is there to crop the hand's wrist, and the source's burst is
       never cut. At z-2 it was losing its bottom third to the curve. */
    src: "/illustration/token-burst.svg",
    kind: "token",
    left: 70,
    top: 84,
    w: 90.079,
    h: 69.771,
    scale: "1",
    z: 4,
    spin: { duration: 22 },
  },
];

function layerStyle(l: Layer): React.CSSProperties {
  return {
    position: "absolute",
    /*
     * Each offset is re-expressed as a distance from the card's centre and
     * scaled per axis, so two variables move all four hands together. Writing
     * `left: 60%` directly would need a separate breakpoint override per layer
     * per axis — sixteen values to keep in sync — and any drift between them
     * visibly breaks the grip. See `.hand-stage` for why x and y differ.
     *
     * The distance measured is from the card's centre to the LAYER'S centre,
     * not to its top-left corner. That distinction is the whole reason the two
     * sides used to diverge on small screens: the pull scaled each box's top
     * edge, and the brown hand's top edge sits 128% from centre while the blue
     * hand's sits 21% away, so one pair got yanked onto the card while its
     * mirror barely moved. Scaling centres keeps a mirrored pair mirrored at
     * every value of the pull.
     *
     * `l.w` resolves against the card's width and `l.h` against its height,
     * which is exactly what `left` and `top` percentages already do, so the
     * half-box terms need no conversion.
     */
    ...(l.kind === "hand"
      ? {
          left: `calc(50% - ${l.w / 2}% + (${l.left + l.w / 2}% - 50%) * var(--hand-pull-x, 1))`,
          top: `calc(50% - ${l.h / 2}% + (${l.top + l.h / 2}% - 50%) * var(--hand-pull-y, 1))`,
        }
      : { left: `${l.left}%`, top: `${l.top}%` }),
    width: `${l.w}%`,
    height: `${l.h}%`,
    /*
     * Required. Every hand here is WIDER than the card it hangs off — 129.762%
     * for the blue hand, 133.333% for the brown — and Tailwind's preflight
     * ships `img { max-width: 100% }`, which silently clamps all of them to the
     * card's width. Height is not clamped, so the result was not merely small
     * but horizontally squashed, and the thumbs sat well short of the corners
     * they are supposed to grip.
     */
    maxWidth: "none",
    zIndex: l.z,
    transformOrigin: "center",
    /* Base transform matches the 0% keyframe. `hand-sway` declares no 100%
       frame, so the return leg interpolates toward this underlying value —
       drop it and the thumb shrinks to scale 1 over the second half of every
       cycle while the rotation returns correctly. */
    /* The burst is the one layer that must NOT carry a base transform: its
       keyframe has only a 100% frame, so the 0% is read from the underlying
       value. A `scale(1)` here would be fine, but `rotate(0deg)` written
       explicitly would be overwritten mid-turn. */
    transform: l.spin
      ? undefined
      : `scale(${l.scale})${l.sway ? " rotate(0deg)" : ""}`,
    ...(l.sway && {
      "--hand-scale": l.scale,
      "--hand-rotation": "0deg",
      "--hand-tilt": `${l.sway.tilt}deg`,
      animation: `hand-sway ${l.sway.duration}s cubic-bezier(0.16, 1, 0.3, 1) ${l.sway.delay}s infinite`,
    }),
    ...(l.spin && {
      animation: `token-spin ${l.spin.duration}s cubic-bezier(0.16, 1, 0.3, 1) infinite`,
    }),
  } as React.CSSProperties;
}

export default function HeroIllustration() {
  return (
    <div
      /*
       * `isolate` is load-bearing. Without a stacking context here the layer
       * z-indexes (-1 to 4) compete directly with the rest of the hero, and the
       * paper cover at z-3 paints straight over the pitch copy on small screens.
       * Isolating keeps the whole composition self-contained; the text after it
       * carries z-10 to sit above the stage as a single unit.
       */
      className="hand-stage relative isolate"
      style={{ aspectRatio: `${CARD_ASPECT}` }}
    >
      {LAYERS.map((layer) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={layer.src}
          src={layer.src}
          alt=""
          aria-hidden="true"
          decoding="async"
          /*
            Rendered at every width, as the source does — it shrinks the hands
            rather than hiding them (blue 1.05 -> 0.6, brown 1.2 -> 0.75 at
            390px). See `.hand-stage` for the breakpoints.

            An earlier version hid these below `lg`, because at full desktop
            scale the blue hand landed on top of the pitch copy and made it
            unreadable. The scale ramp fixes the size half of that and the
            stage's `isolate` fixes the rest: the hero's text now carries z-10
            and paints above the whole stage, so a hand may pass behind a
            paragraph but can never obscure it.
          */
          className={`pointer-events-none ${layer.kind === "token" ? "hidden sm:block" : ""}`}
          style={layerStyle(layer)}
        />
      ))}

      {/*
        The surface the blue hand disappears behind.

        The reference crops the wrist against the curved top of its next
        section — a full-bleed yellow band — which works there because the card
        is the only thing in its hero. Ours has the pitch, the CTAs and the stat
        row sitting between the card and the amber band below, so a hand long
        enough to reach that band buries all of it (measured: it covered the
        "Industries" column, and still fell 270px short).

        So the covering surface comes to the hand instead. Paper-coloured rather
        than amber: it reads as the hand passing behind the page itself, gives
        the same crisp curved cut, and does not drop an unexplained colour block
        into the middle of the hero. Wider than the hand on both sides so the cut
        runs edge to edge with no corner peeking out, and z-3 to sit above both
        the hand (-1) and the thumb (2).
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: "-130%",
          width: "280%",
          top: "var(--cover-top, 134%)",
          /*
           * 70%, not 120%. The hand's box bottom sits at 194% of the card's
           * height and this starts at 134%, so 60% is all that needs covering;
           * 70% leaves margin. At 120% it ran several hundred pixels past the
           * hero and painted paper straight over the top of the Ethos section —
           * a white notch across the pink, which is exactly what it looked like.
           * The hero's `overflow-hidden` is the second line of defence.
           */
          height: "70%",
          zIndex: 3,
          background: "var(--paper)",
          borderStartStartRadius: "100% 3.5rem",
          borderStartEndRadius: "100% 3.5rem",
        }}
      />

      {/* The card. z-0 puts it above the brown hand and below the blue one,
          reproducing the source's front-and-back grip. */}
      <div
        data-parallax
        style={
          {
            "--parallax": 3,
            borderRadius: "var(--radius-block)",
            boxShadow: "6px 6px 0 0 var(--outline)",
            zIndex: 0,
          } as React.CSSProperties
        }
        className="outlined absolute inset-0 overflow-hidden"
      >
        {/*
          `object-position: center 28%` rather than `object-top`.

          The card is a 504:655 portrait crop and the source is a square-ish
          headshot, so something has to be trimmed. Anchoring at the very top
          clipped the chin on the way to keeping empty background above the
          head; 28% keeps the face centred in the frame with a little headroom
          and lets the crop fall on the shoulders instead, which is what a
          headshot wants at every breakpoint.

          `sizes` matches the column widths the card actually occupies, so the
          browser never downloads a larger file than it will paint. With `fill`
          the intrinsic dimensions in content.ts are unused — the card's aspect
          ratio governs — which is also why swapping the file cannot shift
          layout.
        */}
        <Image
          src={site.portrait.src}
          alt={site.portrait.alt}
          fill
          priority
          quality={90}
          sizes="(max-width: 640px) 62vw, (max-width: 1024px) 42vw, 32vw"
          className="object-cover object-[center_28%] transition-transform duration-1000 ease-editorial hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}
