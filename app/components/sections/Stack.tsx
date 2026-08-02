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
/** Horizontal breathing room in the viewBox for outward-anchored labels. */
const LABEL_GUTTER = 78;

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
 * The SVG is aria-hidden and duplicated as a real list below, so the whole
 * section is fully available to a screen reader without trying to make a
 * scatter plot navigable.
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
        const flank = Math.abs(cos) > 0.72;
        return {
          entry,
          x: round(CENTER + cos * radius),
          y: round(CENTER + sin * radius),
          labelX: round(flank ? (cos > 0 ? 9 : -9) : 0),
          /* On the flanks, neighbouring rings land at almost the same height,
             so alternate rings are nudged apart vertically as well as being
             pushed outward — otherwise two long labels stack on one line. */
          labelY: round(
            flank ? 3.5 + (ringIndex % 2 ? 9 : -9) : sin < 0 ? -11 : 17,
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
        <div className="col-span-12 lg:col-span-6">
          {/* The viewBox is wider than the geometry: flank labels are anchored
              outward from the outermost ring, so a box drawn tight to the
              circle clips the longest of them ("Event-driven design"). */}
          <svg
            viewBox={`${-LABEL_GUTTER} 0 ${SIZE + LABEL_GUTTER * 2} ${SIZE}`}
            className="mx-auto w-full max-w-[30rem]"
            aria-hidden="true"
          >
            {/* Rings, outermost first so the inner ones paint on top. */}
            {[...RADII].reverse().map((radius, index) => (
              <circle
                key={radius}
                cx={CENTER}
                cy={CENTER}
                r={radius}
                fill={index === RADII.length - 1 ? "var(--accent-soft)" : "none"}
                stroke="var(--rule)"
                strokeWidth="1"
              />
            ))}

            {points.map(({ entry, x, y, labelX, labelY, anchor }) => {
              const faded = dimmed(entry);
              const active = hovered?.name === entry.name;
              return (
                <g
                  key={entry.name}
                  style={{
                    opacity: faded ? 0.18 : 1,
                    transition: "opacity 400ms var(--ease-editorial)",
                  }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={active ? 6 : 3.5}
                    fill={active ? "var(--accent)" : "var(--ink-muted)"}
                    style={{
                      transition:
                        "r 300ms var(--ease-spring), fill 300ms linear",
                    }}
                  />
                  <text
                    x={x + labelX}
                    y={y + labelY}
                    textAnchor={anchor}
                    fill={active ? "var(--accent)" : "var(--ink-faint)"}
                    /* Paint the fill over a background-coloured stroke so a
                       label stays legible where it crosses a ring line. */
                    stroke="var(--paper)"
                    strokeWidth="3"
                    paintOrder="stroke"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      letterSpacing: "0.03em",
                      transition: "fill 300ms linear",
                    }}
                  >
                    {entry.name}
                  </text>
                </g>
              );
            })}
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
              interaction feel broken. */}
          <p className="rule-t mt-6 min-h-[4.5rem] pt-row text-ink-muted">
            {hovered?.note ??
              (hovered
                ? `${hovered.name} — ${hovered.ring}, ${hovered.domain}.`
                : "Hover or focus an entry for the opinion behind it.")}
          </p>
        </div>
      </div>

      {/* The accessible, and frankly more useful, version of the same data. */}
      <div className="mt-section grid grid-cols-12 gap-x-gutter gap-y-band">
        {stackRings.map((ring) => {
          const entries = stack.filter(
            (entry) => entry.ring === ring && !dimmed(entry),
          );
          if (!entries.length) return null;
          return (
            <section key={ring} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <h3 className="label rule-b pb-3">{ring}</h3>
              <ul className="mt-4 space-y-2">
                {entries.map((entry) => (
                  <li key={entry.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setHovered(entry)}
                      onFocus={() => setHovered(entry)}
                      onMouseLeave={() => setHovered(null)}
                      onBlur={() => setHovered(null)}
                      className="text-left text-ink-muted transition-colors duration-300 hover:text-accent focus-visible:text-accent"
                    >
                      {entry.name}
                    </button>
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
