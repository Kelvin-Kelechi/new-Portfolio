"use client";
import { useMemo, useState } from "react";
import { stack, stackRings, type StackEntry } from "@/app/lib/content";

const DOMAINS = ["Interface", "Platform", "Mobile", "Operations"] as const;
type Domain = (typeof DOMAINS)[number];

const SIZE = 620;
const CENTER = SIZE / 2;
/* Innermost ring is the tightest orbit — closest to the centre means most
   central to the work, which is the opposite of most radars and the right way
   round for a portfolio. The inner radius is generous rather than minimal:
   arc length is what gives labels room, and the busiest ring sits innermost. */
const RADII = [96, 152, 208, 262];
/**
 * Label type size, in viewBox units — NOT rendered pixels.
 *
 * The SVG scales its viewBox down to fit the column, so what lands on screen is
 * `LABEL_SIZE × (renderedWidth / viewBoxWidth)`. At the original 10 that
 * resolved to 6.19px on a 1440px screen: measured, not estimated. Roughly 11px
 * is the floor where mono text stays readable, so the radar was rendering as
 * texture rather than as labels.
 *
 * 17 is chosen by working backwards from the target — with the wider column and
 * gutter below the scale settles near 0.77, which puts these at ~13px.
 */
const LABEL_SIZE = 17;
/**
 * Horizontal breathing room in the viewBox for outward-anchored labels.
 *
 * The longest label ("Event-driven design", 19 chars) is ~195 units wide at 17
 * and hangs off the outermost ring's flank; at the previous 78 it ran past the
 * viewBox edge and was cut mid-word.
 *
 * Kept as tight as the content allows, because this is dead width: every unit
 * here is a unit the rings do not get when the box is scaled to the column,
 * which pushes the rendered type back down again.
 */
const LABEL_GUTTER = 150;

/**
 * Quantise to two decimals before these numbers reach the DOM.
 *
 * `Math.sin` and `Math.cos` are implementation-defined in ECMAScript — Node
 * and V8-in-the-browser can disagree in the last binary digit. That is enough
 * to make the server's `cy="100.09618943233423"` differ from the client's
 * `100.09618943233426` and throw a hydration mismatch on every load. Two
 * decimals is far below one rendered pixel and identical on both sides.
 */
const round = (value: number) => Math.round(value * 100) / 100;

/**
 * A tech radar rather than a bar chart.
 *
 * The deliberate omission here is percentages. "JavaScript — 92%" was never
 * information; nobody can defend the eight. Rings state something checkable
 * instead: how readily I reach for a thing. Radius is the whole encoding —
 * inner means more central to the work — and the legend says exactly what each
 * ring means. Domain is handled by the filter rather than by angle, because
 * fixed 90° sectors cannot hold six labels without overlapping.
 *
 * ── On mobile the diagram stays; the labels go ──────────────────────────────
 *
 * Two viewBoxes over one geometry, swapped at `lg`. Both draw the same rings
 * and the same points; only the desktop one draws the names beside them.
 *
 * The split is there because exactly one part of the chart fails at 390px, and
 * it is not the diagram. The binding constraint is arc length between
 * neighbouring points: at that width the gap closes to about 14px, so adjacent
 * labels collide however the anchors are solved — shrinking the type to avoid
 * the collision and enlarging it to be readable are the same dial turned
 * opposite ways. The rings and dots have no such problem. They encode by
 * radius, they read fine small, and they are the part that says what the
 * section is about before a word is read.
 *
 * So the phone keeps the shape of the answer — how much sits at each distance
 * from the centre — and the ring list underneath names every point with its
 * note inline, which is a better reading experience there than a label crammed
 * against a dot would be. The mobile box is also drawn tight to the rings
 * rather than carrying the desktop label gutter, so the full width goes to the
 * circle instead of to 300 units of empty margin.
 *
 * The SVG is aria-hidden and duplicated as a real list, so the section is
 * fully available to a screen reader without trying to make a scatter plot
 * navigable. The dots are reachable by keyboard regardless — see `<Dot>`.
 */
export default function Stack() {
  const [domain, setDomain] = useState<Domain | null>(null);
  const [hovered, setHovered] = useState<StackEntry | null>(null);

  /*
   * Positions are pure geometry over static content, so they are computed once
   * rather than per render.
   *
   * Each ring gets the FULL circle, with its members spread evenly around it
   * and ordered by domain so the four domains stay rotationally grouped. The
   * obvious alternative — give each domain a 90° sector — packs six Interface
   * entries into a quarter turn at the innermost radius, where the arc between
   * neighbours is ~18px and every label overlaps its neighbour into mush.
   * Spreading per ring instead means the busiest ring gets 360° to work with.
   */
  const points = useMemo(() => {
    return stackRings.flatMap((ring, ringIndex) => {
      const inRing = DOMAINS.flatMap((domainName) =>
        stack.filter(
          (entry) => entry.ring === ring && entry.domain === domainName,
        ),
      );
      const radius = RADII[ringIndex] ?? RADII[RADII.length - 1];
      const step = 360 / Math.max(inRing.length, 1);

      return inRing.map((entry, index) => {
        /* Start at the top and go clockwise. Odd rings are offset by half a
           step so a point never sits directly outside another ring's point,
           which is the other way two labels end up on top of each other. */
        const degrees = -90 + step * index + (ringIndex % 2 ? step / 2 : 0);
        const angle = (degrees * Math.PI) / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        /*
         * Label placement is polar, not fixed.
         *
         * Near the top and bottom of the circle a centred label above or below
         * the dot is fine. Near the left and right it is not: two points on
         * adjacent rings sit only ~56px apart horizontally, and a centred
         * ~90px label from each one overlaps the other. So on the flanks the
         * label is anchored to the dot and pushed outward along the radius,
         * which moves neighbouring labels apart instead of into each other.
         */
        /* Threshold lowered from 0.72 to 0.34 — cos(70°), so only the ~40° caps
           at the very top and bottom still centre their label. The safe band
           for a centred label is much narrower at 17 than it was at 10: a
           centred "Core Web Vitals" and a centred "Design systems" on adjacent
           rings overlapped near the top of the circle. Radiating outward
           spreads neighbours apart instead of stacking them. */
        const flank = Math.abs(cos) > 0.34;
        return {
          entry,
          x: round(CENTER + cos * radius),
          y: round(CENTER + sin * radius),
          /* Offsets are multiples of the type size rather than fixed numbers.
             They were tuned by eye against 10px labels; at 17 the same literals
             put the text on top of its own dot. */
          labelX: round(flank ? (cos > 0 ? 1 : -1) * (LABEL_SIZE * 0.75) : 0),
          /* On the flanks, neighbouring rings land at almost the same height,
             so alternate rings are nudged apart vertically as well as being
             pushed outward — otherwise two long labels stack on one line.
             1.05em was picked by measuring every label pair: 0.8 left
             Vercel/CI/CD overlapping by 5×9px, 1.25 traded that for
             Tailwind/Auth at 14×4px, and a four-step per-ring stagger was
             worse still (three overlaps, two above 75px wide). */
          labelY: round(
            flank
              ? LABEL_SIZE * 0.32 + (ringIndex % 2 ? 1 : -1) * (LABEL_SIZE * 1.05)
              : sin < 0
                ? -LABEL_SIZE * 0.9
                : LABEL_SIZE * 1.35,
          ),
          anchor: (flank ? (cos > 0 ? "start" : "end") : "middle") as
            | "start"
            | "end"
            | "middle",
        };
      });
    });
  }, []);

  const dimmed = (entry: StackEntry) => domain !== null && entry.domain !== domain;

  return (
    <>
      <div className="mt-section grid grid-cols-12 items-center gap-x-gutter gap-y-band">
        {/* Seven columns rather than six: the radar is the subject here, and the
            legend beside it is four short rows that ran out of content half way
            down and left an empty block under themselves. */}
        <div className="col-span-12 lg:col-span-7">
          {/* The viewBox is wider than the geometry: flank labels are anchored
              outward from the outermost ring, so a box drawn tight to the
              circle clips the longest of them ("Event-driven design"). */}
          <svg
            viewBox={`${-LABEL_GUTTER} 0 ${SIZE + LABEL_GUTTER * 2} ${SIZE}`}
            /* The old `max-w-[30rem]` pinned the chart at 480px on any screen
               above a laptop, which is what held the viewBox scale at 0.62 and
               the labels at 6px. Letting it fill the column takes the scale to
               ~0.77 and the labels to a readable ~13px. */
            className="radar mx-auto hidden w-full max-w-[44rem] lg:block"
            aria-hidden="true"
          >
            <RadarBody
              points={points}
              dimmed={dimmed}
              hovered={hovered}
              labels
            />
          </svg>

          {/*
            The same diagram, sized for a phone.

            Rings, dots, and the radius encoding are identical — only the inline
            labels are dropped, because they are the one part that genuinely
            cannot fit. At 390px the arc between adjacent points closes to about
            14px, and no type size resolves that: shrinking the text to avoid a
            collision and enlarging it to be readable are the same dial turned
            opposite ways.

            The viewBox is drawn tight to the rings rather than carrying the
            desktop gutter, which exists only to hold outward-anchored labels.
            That is what buys the diagram its size here — the full width goes to
            the circle instead of to 300 units of empty margin.

            So the phone gets the shape of the answer: how much sits at each
            distance from the centre. The ring list underneath names every point
            and carries its note inline.
          */}
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="radar mx-auto mt-2 block w-full max-w-[21rem] lg:hidden"
            aria-hidden="true"
          >
            <RadarBody points={points} dimmed={dimmed} hovered={hovered} />
          </svg>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <p className="label mb-4">Filter by domain</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={domain === null} onClick={() => setDomain(null)}>
              All
            </Chip>
            {DOMAINS.map((name) => (
              <Chip
                key={name}
                active={domain === name}
                onClick={() => setDomain(domain === name ? null : name)}
              >
                {name}
              </Chip>
            ))}
          </div>

          <dl className="rule-t mt-8 pt-row">
            <p className="label mb-4">What the rings mean</p>
            {RING_MEANING.map(([ring, meaning], index) => (
              <div key={ring} className="flex gap-4 py-2">
                <dt className="flex w-24 shrink-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: "var(--accent)",
                      opacity: 1 - index * 0.22,
                    }}
                  />
                  <span className="label text-ink">{ring}</span>
                </dt>
                <dd className="text-[0.9375rem] text-ink-muted">{meaning}</dd>
              </div>
            ))}
          </dl>

          {/* Reserved height so hovering a point does not reflow the column —
              layout shift on hover is the cheapest way to make a good
              interaction feel broken.

              Hidden below `lg` along with the radar: without a pointer there is
              nothing to hover, and the notes are rendered inline in the ring
              list instead. `aria-live` so a keyboard user moving across the
              dots hears each note as it changes. */}
          <p
            aria-live="polite"
            className="rule-t mt-6 hidden min-h-[4.5rem] pt-row text-ink-muted lg:block"
          >
            {hovered?.note ??
              (hovered
                ? `${hovered.name} — ${hovered.ring}, ${hovered.domain}.`
                : "Hover or focus an entry for the opinion behind it.")}
          </p>
        </div>
      </div>

      {/*
        The accessible, and frankly more useful, version of the same data.

        Below `lg` this is the ONLY presentation, which changes what it has to
        do: the note can no longer live behind a hover, because the element that
        showed it is gone and a touch device cannot hover anyway. So each entry
        renders its own note inline under the name at small widths, and reverts
        to the shared hover line at `lg` where the radar is back and repeating
        every note would double the column's height.

        The ring name is the heading rather than a decorative label — this is
        the structure a screen reader walks, and "Daily / Fluent / Working /
        Watching" is the actual information architecture of the section.
      */}
      <div className="mt-section grid grid-cols-12 gap-x-gutter gap-y-band">
        {stackRings.map((ring, ringIndex) => {
          const entries = stack.filter(
            (entry) => entry.ring === ring && !dimmed(entry),
          );
          if (!entries.length) return null;
          const meaning = RING_MEANING.find(([name]) => name === ring)?.[1];
          return (
            <section key={ring} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <h3 className="label rule-b flex items-center gap-2.5 pb-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background: "var(--accent)",
                    opacity: 1 - ringIndex * 0.22,
                  }}
                />
                <span className="text-ink">{ring}</span>
              </h3>

              {/* The ring's meaning, inline on mobile. At `lg` the legend in
                  the right-hand column already says this and repeating it is
                  noise. */}
              {meaning && (
                <p className="mt-3 text-[0.9375rem] text-ink-faint lg:hidden">
                  {meaning}
                </p>
              )}

              <ul className="mt-4 space-y-4 lg:space-y-2">
                {entries.map((entry) => (
                  <li key={entry.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setHovered(entry)}
                      onFocus={() => setHovered(entry)}
                      onMouseLeave={() => setHovered(null)}
                      onBlur={() => setHovered(null)}
                      className="block w-full text-left text-ink-muted transition-colors duration-300 hover:text-accent focus-visible:text-accent"
                    >
                      {entry.name}
                    </button>
                    {/* Inline below `lg` only — see the block comment above. */}
                    {entry.note && (
                      <p className="mt-1 max-w-measure text-[0.875rem] leading-relaxed text-ink-faint lg:hidden">
                        {entry.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

type RadarPoint = {
  entry: StackEntry;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  anchor: "start" | "end" | "middle";
};

/**
 * The rings and the points, shared by both viewBoxes.
 *
 * Extracted so the mobile and desktop diagrams cannot drift apart. They differ
 * in exactly one respect — whether the inline labels are drawn — and that is a
 * prop rather than a second copy of eighty lines of SVG.
 */
function RadarBody({
  points,
  dimmed,
  hovered,
  labels = false,
}: {
  points: readonly RadarPoint[];
  dimmed: (entry: StackEntry) => boolean;
  hovered: StackEntry | null;
  /**
   * Draw the name beside each dot.
   *
   * Off below `lg`. The constraint is arc length, not type size: at 390px the
   * gap between adjacent points closes to ~14px, so labels collide whatever
   * size they are set at. The ring list underneath names every point instead.
   */
  labels?: boolean;
}) {
  return (
    <>
      {/* Rings, outermost first so the inner ones paint on top. Each carries
          its index as `--ring` so the draw-in can stagger from the centre
          outward — see `.radar-ring` in globals.css. */}
      {[...RADII].reverse().map((radius, index) => (
        <circle
          key={radius}
          className="radar-ring"
          style={{ "--ring": RADII.length - 1 - index } as React.CSSProperties}
          cx={CENTER}
          cy={CENTER}
          r={radius}
          fill={index === RADII.length - 1 ? "var(--accent-soft)" : "none"}
          stroke="var(--rule)"
          strokeWidth="1"
        />
      ))}

      {points.map(({ entry, x, y, labelX, labelY, anchor }, index) => {
        const faded = dimmed(entry);
        const active = hovered?.name === entry.name;
        return (
          <g
            key={entry.name}
            className="radar-point"
            /* An explicit flag, not an inline-style probe. The CSS needs to
               cancel the entrance animation while a point is dimmed, and
               matching on `[style*="opacity"]` cannot do that job — the
               transition declaration below contains the substring "opacity" on
               every point, so the guard fired always and killed the entrance
               for all 21. */
            data-dimmed={faded ? "" : undefined}
            style={
              {
                "--point": index,
                opacity: faded ? 0.18 : undefined,
                transition: "opacity 400ms var(--ease-editorial)",
              } as React.CSSProperties
            }
          >
            {/* Halo on the active point. Drawn as a real circle rather than a
                filter so it costs no rasterization, and sized to stay clear of
                the labels around it. Keyboard focus in the list below drives
                `hovered`, so this is what makes the radar legible to someone
                tabbing rather than pointing — and on mobile, where there are no
                labels, it is the whole feedback for a tap. */}
            {active && (
              <circle
                cx={x}
                cy={y}
                /* Was 13, against a 6-unit active dot. The dot is 9 now, which
                   left the ring almost touching it — the halo has to keep
                   visible air around the point to read as a halo rather than as
                   a thick outline. */
                r={19}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                opacity={0.42}
                className="radar-halo"
              />
            )}
            {/* Dots scale with the type. At r=3.5 against 17-unit labels the
                point reads as a speck beside its own name. */}
            <circle
              cx={x}
              cy={y}
              r={active ? 9 : 5.5}
              fill={active ? "var(--accent)" : "var(--ink-muted)"}
              style={{
                transition: "r 300ms var(--ease-spring), fill 300ms linear",
              }}
            />
            {labels && (
              <text
                x={x + labelX}
                y={y + labelY}
                textAnchor={anchor}
                /* `--ink`, not `--ink-faint`. Faint is the weakest tier in the
                   scale and was the right choice while these were decorative
                   texture; now that they are readable they are content, and
                   content does not sit two tiers down. */
                fill={active ? "var(--accent)" : "var(--ink)"}
                /* Paint the fill over a background-coloured stroke so a label
                   stays legible where it crosses a ring line. The halo grows
                   with the type or it stops covering the glyph edges. */
                stroke="var(--paper)"
                strokeWidth="4.5"
                paintOrder="stroke"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: `${LABEL_SIZE}px`,
                  letterSpacing: "0.02em",
                  transition: "fill 300ms linear",
                }}
              >
                {entry.name}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`label surface rounded-full px-3.5 py-2 transition-colors duration-300 ${
        active ? "text-accent" : "hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

const RING_MEANING: readonly [string, string][] = [
  ["Daily", "Reach for it without thinking."],
  ["Fluent", "Productive from day one."],
  ["Working", "Shipped with it; would want a warm-up."],
  ["Watching", "Tracking it, not yet in production."],
];
