"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Coordination for a set of AccordionCards.
 *
 * Holding the open id here rather than a boolean in each card is what makes
 * the group exclusive: there is one slot, so opening a second card evicts the
 * first by construction. Cards cannot disagree about how many are open,
 * because only one of them can match.
 *
 * Null means every card is shut, which is a legal state — tapping the open
 * card closes it rather than forcing one to always be open.
 */
type AccordionState = {
  openId: string | null;
  toggle: (id: string) => void;
};

/* Null default, not a no-op object. A card can then tell "no Accordion above
   me" apart from "an Accordion that happens to have nothing open" and fall
   back to its own state instead of rendering a control that does nothing. */
export const AccordionContext = createContext<AccordionState | null>(null);

export function useAccordionGroup() {
  return useContext(AccordionContext);
}

export default function Accordion({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    /* Functional update: the next state depends only on the previous one, so
       two taps landing in the same batch still resolve correctly. */
    setOpenId((current) => (current === id ? null : id));
  }, []);

  /* Memoised so the provider value is referentially stable and cards do not
     re-render on every parent render. */
  const value = useMemo(() => ({ openId, toggle }), [openId, toggle]);

  return (
    <AccordionContext.Provider value={value}>
      <div
        /*
         * Cards overlap rather than sit in a spaced column: each one is pulled
         * up over its predecessor so only a band of the card above stays
         * visible. Paired with the per-card z-index, that reads as a stacked
         * deck. A gap between cards would turn the same colours into a plain
         * list.
         *
         * The overlap MUST stay larger than the sheet's corner radius (2.5rem
         * / 3rem — see `.accordion-sheet`). At 40px of overlap against a 56px
         * radius the card behind was still square where the card in front was
         * still curving, so its bottom corners poked out either side of the
         * curve and every seam grew a small step.
         *
         * The negative inline margin on mobile claws back part of `.shell`'s
         * gutter. At the shell's own padding the stack lost 56px of a 390px
         * screen to margin, which is a lot of width to spend on nothing when
         * the cards carry three lines of copy.
         */
        className={`-mx-1.5 [&>*+*]:-mt-11 md:mx-6 md:[&>*+*]:-mt-14 ${className}`}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
