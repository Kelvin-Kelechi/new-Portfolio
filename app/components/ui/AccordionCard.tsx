"use client";
import { useState } from "react";
import Icon, { type IconName } from "@/app/components/ui/Icon";
import { useAccordionGroup } from "@/app/components/ui/Accordion";

/**
 * One sheet in the stacked accordion.
 *
 * Opens on hover. The panel height is a CSS grid track (0fr → 1fr, see
 * `.accordion-panel` in globals.css), so the hover transition needs no JS at
 * all — no height measurement, no state round-trip, nothing on the main thread
 * while the pointer moves down the stack.
 *
 * The button stays a real button anyway. Hover is not an interaction a touch
 * screen or a keyboard has, and a card that only opens on hover is a card two
 * thirds of visitors cannot open. Tap and Enter/Space both go through the
 * group's open id, so `aria-expanded` always matches what is on screen.
 */
export default function AccordionCard({
  id,
  title,
  children,
  icon = "arrow-down",
  tone,
  index = 0,
  alwaysOpen = false,
}: {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  icon?: IconName;
  /** Card fill. Deep enough to carry white text at 4.5:1. */
  tone: string;
  /** Stacking order — later cards sit on top of earlier ones. */
  index?: number;
  /**
   * Renders the sheet permanently expanded, with no control.
   *
   * The bottom sheet of the stack uses this. Nothing covers its lower edge, so
   * there is no band for it to collapse to — shut, it is just a strip of
   * colour with a title. Open, it becomes the base the whole stack sits on.
   */
  alwaysOpen?: boolean;
}) {
  const group = useAccordionGroup();
  /* Fallback for a card used outside an <Accordion>. Inside one the group owns
     the state, which is what keeps the set exclusive — a local boolean per
     card cannot know that a sibling just opened. */
  const [localOpen, setLocalOpen] = useState(false);

  const open = group ? group.openId === id : localOpen;
  const toggle = () =>
    group ? group.toggle(id) : setLocalOpen((wasOpen) => !wasOpen);

  const heading = (
    <h3
      className="flex-1 text-body font-semibold leading-snug text-white md:text-[1.375rem]"
      style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
    >
      {title}
    </h3>
  );

  return (
    <div
      className="accordion-card group relative"
      data-open={open || undefined}
      /* Each card sits above the one before it, so the rounded top edge cuts
         into its neighbour instead of being cut by it. That overlap is the
         whole look — without the z-order the stack reads as a flat list. */
      style={{ zIndex: index + 1 }}
    >
      {/* No lift on hover. Translating the sheet detached its top edge from the
          card behind it and broke the overlap for the length of the
          transition — the one thing holding the stack together. */}
      <div
        className="accordion-sheet relative overflow-hidden"
        style={{ background: tone }}
      >
        {alwaysOpen ? (
          /* A plain header, not a button. There is no state to toggle, and a
             control that cannot change anything is the kind of thing that
             makes a screen reader announce a lie.

             No overlap clearance needed: this is the last sheet, so nothing is
             pulled up over it and its own copy follows immediately below. */
          <div className="px-5 pt-9 md:px-12 md:pt-12">{heading}</div>
        ) : (
          <button
            id={`${id}-trigger`}
            onClick={toggle}
            /*
             * Padding is asymmetric because the overlap is.
             *
             * The NEXT card is pulled up over this one by 44px (mobile) / 56px
             * (desktop) — see <Accordion> — so the last 44/56px of this card is
             * behind its neighbour. At the old symmetric `py-8`/`py-12` the
             * bottom padding was smaller than that overlap, so the next sheet's
             * top edge cut across the descenders of every collapsed title.
             * Measured: 12px of overrun on mobile, 8px on desktop.
             *
             * `pb-` therefore has to be overlap + breathing room. `pt-` is
             * matched to it so the collapsed band stays optically centred —
             * nothing overlaps the top, but a band with 76px under the title
             * and 32px over it reads as broken rather than as deliberate.
             */
            className="w-full cursor-pointer px-5 pb-[4.75rem] pt-8 text-left md:px-12 md:pb-[7rem] md:pt-12"
            aria-expanded={open}
            aria-controls={`${id}-content`}
          >
            <div className="flex items-center justify-between gap-4">
              {heading}

              {/* Points down when shut, up when open. Rotation is a CSS rule
                  next to the panel's (see `.accordion-arrow`) rather than a
                  transform off React state, because hover opens the panel
                  without React knowing anything about it. */}
              <span className="accordion-arrow flex h-8 w-8 shrink-0 items-center justify-center">
                <Icon
                  name={icon}
                  size={24}
                  strokeWidth={2.5}
                  className="text-white"
                />
              </span>
            </div>
          </button>
        )}

        <div
          id={`${id}-content`}
          className="accordion-panel"
          data-always-open={alwaysOpen || undefined}
        >
          <div>
            {/* Padding lives inside the clipped child. On the outer grid item
                it would survive the collapse to 0fr and leave a dead band of
                colour under every shut card. */}
            <div
              className={`px-5 text-white/85 md:px-12 ${
                /* The last sheet runs to the foot of the section and is cut by
                   the block's bottom curve, so it needs enough depth for the
                   scoop to take out of empty colour rather than out of the
                   copy. */
                alwaysOpen ? "pt-6 pb-52 md:pb-72" : "pb-10 md:pb-16"
              }`}
            >
              <div className="max-w-measure space-y-4 text-body leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
