import { site } from "@/app/lib/content";

/**
 * The mark, plus a name that reveals on scroll.
 *
 * There was no icon before this — the header carried a pure text wordmark — so
 * the mark is a monogram built in the same language as the buttons and
 * stickers: coral fill, thick outline, fat radius, hard offset shadow. It reads
 * as a cut-out chip rather than a logo drawn in a different system.
 *
 * The name is ABSOLUTELY POSITIONED, which is the whole trick. Revealing it
 * inline would widen the logo and shove the centred nav sideways on every
 * scroll past the hero — a layout shift on a scroll event, and the worst kind,
 * because it repeats. Out of flow it costs zero layout and the transition is
 * pure opacity + transform, both compositor-only.
 */
export default function Logo({ showName }: { showName: boolean }) {
  const initials = `${site.firstName[0]}${site.lastName[0]}`;

  return (
    <span className="relative flex shrink-0 items-center">
      {/* The mark. Never hidden — it is the constant. */}
      <span
        className="outlined flex h-9 w-9 items-center justify-center text-[0.9375rem] leading-none"
        style={{
          background: "var(--brand)",
          color: "#16150f",
          borderRadius: "0.75rem",
          boxShadow: "2.5px 2.5px 0 0 var(--outline)",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        {initials}
      </span>

      {/*
        `aria-hidden` on the visual name and a permanent sr-only full name on
        the link itself (see Header) — otherwise the accessible name of the home
        link would change as the user scrolls, which is disorienting on a screen
        reader and pointless.
      */}
      <span
        aria-hidden="true"
        /* Steps down to 1rem below `sm`. At `text-title` the wordmark plus the
           mark measures ~200px, and with three icon buttons on the right the
           header runs out of room at 320px — the name would sit under the Ask
           button. Scaling it is better than hiding it: the reveal then works at
           every width, which is the point of it. */
        className="pointer-events-none absolute left-full ml-2.5 whitespace-nowrap text-base leading-none tracking-tight transition-[opacity,transform] duration-500 ease-editorial sm:text-title"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 760,
          opacity: showName ? 1 : 0,
          /* Slides in from the mark rather than from nowhere, so the two read
             as one object unfolding. */
          transform: showName ? "translateX(0)" : "translateX(-0.5rem)",
        }}
      >
        {/* `text-brand`, not a literal `text-[#4dff6a]`. It is the same value,
            but routed through the token the chip and the role pill already use
            — so the surname and the mark beside it can never end up on two
            different greens after an edit to one of them. */}
        {site.firstName} <span className="text-brand">{site.lastName}</span>
      </span>
    </span>
  );
}
