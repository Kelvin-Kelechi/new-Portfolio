import { now } from "@/app/lib/content";

/**
 * A quiet band between the hero and the first section — "what I'm doing right
 * now", scrolling slowly.
 *
 * The content is duplicated so translating -50% lands exactly on the seam,
 * which is what makes the loop invisible. The duplicate is aria-hidden, so a
 * screen reader hears each item once; the animation pauses on hover and
 * focus, and stops entirely under reduced motion.
 *
 * The edge fades are back now that the band is paper again: against a colour
 * fill a hard edge was right, but on paper the marquee needs to dissolve at the
 * viewport edges rather than being visibly sliced.
 */
export default function Ticker() {
  return (
    /*
      Paper, matching the hero it sits under — the band reads as a continuation
      of the hero rather than a separate stripe, and the marquee is the only
      thing that marks it.

      `on-color` is deliberately NOT here. It pins the ink to near-black, which
      was right on amber but on paper would put black text on a near-black
      background in the dark theme — invisible. Without it the strip inherits
      the theme's own ink and stays legible on both sides of the toggle.

      The elliptical top radius is gone with the colour: an arc cut into paper
      sitting on paper shows nothing and only clips the marquee at the corners.
      `overflow-hidden` stays — the duplicated row depends on it.
    */
    <section
      aria-label="Current status"
      className="reading-hide relative overflow-hidden py-5"
      style={{
        background: "var(--paper)",
        width: "100vw",
        marginInline: "calc(50% - 50vw)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20"
        style={{ background: "linear-gradient(90deg, var(--paper), transparent)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20"
        style={{ background: "linear-gradient(270deg, var(--paper), transparent)" }}
      />

      <div
        className="marquee"
        style={{ "--speed": "52s" } as React.CSSProperties}
      >
        <Row />
        <Row duplicate />
      </div>
    </section>
  );
}

function Row({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={duplicate || undefined}>
      {now.map((entry, index) => (
        <li key={`${entry}-${index}`} className="label flex items-center gap-8 px-8">
          <span className="accent-dot" aria-hidden="true" />
          {entry}
        </li>
      ))}
    </ul>
  );
}
