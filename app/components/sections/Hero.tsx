
import { site } from "@/app/lib/content";
/* Magnetic is deliberately gone from the hero CTAs: `.btn` already owns a
   press-into-its-own-shadow interaction, and a magnetic pull fighting a hard
   offset shadow reads as two effects arguing rather than one gesture. */
import Counter from "@/app/components/motion/Counter";
import Icon from "@/app/components/ui/Icon";
import Shape from "@/app/components/ui/Shape";
import HeroIllustration from "@/app/components/ui/HeroIllustration";
import HeroToken from "@/app/components/ui/HeroToken";

/**
 * The first six seconds.
 *
 * A server component — the entrance is pure CSS (`.rise` + `--i`), so the
 * most animated part of the page ships almost no JavaScript. Only the two
 * magnetic buttons and one counter cross the client boundary.
 *
 * The composition deliberately breaks the grid: the portrait starts in
 * column 6 and rises above the headline's baseline on large screens, so the
 * layout never reads as two tidy halves. Symmetry here would look like a
 * template.
 */
export default function Hero() {
  return (
    <section
      id="top"
      /*
        `overflow-hidden` again. It was briefly `overflow-x-clip` so the blue
        hand could run past this section and be cropped by the amber band below
        — but the hand had to grow so large to reach it that it buried the stat
        row, and still fell short. The crop now happens inside the illustration
        stage instead, so nothing needs to escape this section, and clipping
        here stops any of those oversized layers leaking into Ethos.
      */
      className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden pb-band pt-20 sm:pt-28"
    >
      {/* Three slow-drifting pools of colour. Individually invisible; together
          they stop the background from ever being a flat rectangle. */}
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

            {/*
        Flex column on mobile purely so `order` works; plain block from `sm`.

        The mobile sequence is deliberately NOT the DOM order: name -> pitch ->
        CTAs -> image -> stats. On a 390x844 screen a full-bleed product image
        above the CTAs pushed "See the work" 79px past the fold, and no amount
        of gap-tightening recovers that without shrinking the image to the
        point it stops being the focal point. Putting the conversion content
        first and the image immediately under it is the standard premium
        mobile pattern (Stripe, Linear, Airbnb all do it) — everything
        actionable is reachable without a scroll, and the image becomes the
        reward for taking one.

        Source order is unchanged, so the reading order for assistive tech and
        for keyboard tabbing still runs name -> image -> pitch -> CTAs. The
        visual reshuffle is mobile-only and reverts at `sm`.
      */}
      <div className="shell relative z-10 flex flex-col sm:block">
        {/* gap-x/gap-y rather than a single gap: on a narrow screen this wraps
            to two lines, and one uniform gap leaves a visible hole where the
            separator used to sit. */}
        <p
          className="rise label mb-8 flex flex-wrap items-center gap-x-3 gap-y-1"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <span className="flex items-center gap-3">
            {site.available && <span className="pulse" aria-hidden="true" />}
            {site.availability}
          </span>
          <span aria-hidden="true" className="hidden text-ink-faint sm:inline">
            /
          </span>
          <span>{site.location}</span>
        </p>

                {/* `contents` on mobile dissolves this wrapper so the headline and the
            illustration become direct flex children of the shell and can be
            ordered apart. From `sm` it is a grid again and they sit side by
            side. This avoids rendering <HeroIllustration> twice. */}
        <div className="contents sm:grid sm:grid-cols-12 sm:items-end sm:gap-x-gutter">
          <div
            /* `sm:order-none` matters more than it looks. Grid auto-placement
               walks items in *order-modified* document order, so leaving
               `order-1` on at sm+ puts the illustration (explicit col-start-9)
               down first, moves the cursor past the row end, and pushes this
               auto-placed span-8 headline onto row 2 — which read as a huge
               empty gap above the name on desktop. */
            className="relative order-1 col-span-12 sm:order-none lg:col-span-8"
          >
            {/*
              The two gradient tokens, placed as the reference places them:
              the scallop above and right of the name, the burst low and right
              near the role pill. Both sit at z-4 in the source — ON the type,
              not behind it — which is what makes them read as stuck on rather
              than printed under.

              Positions are percentages of this column so they hold their
              relationship to the headline as it reflows, and both scale down a
              step on small screens where the type is smaller.
            */}
            <HeroToken
              name="scallop"
              size={96}
              className="absolute -top-8 left-[52%] z-20 h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
            />
            {/*
              Anchored to the pill's right corner on mobile, not floated below
              it. The pill runs nearly edge to edge on a phone, so there is no
              clear space underneath — dropping the token there put it straight
              on top of the pitch and swallowed "products that hold". Sitting
              it on the corner keeps it on the name, which is where it belongs,
              and leaves the copy alone.

              From lg the headline is narrow enough that it can move out beside
              the pill as the source has it.
            */}
            <HeroToken
              name="burst"
              size={88}
              className="absolute -bottom-5 right-0 z-20 h-14 w-14 translate-x-1/3 sm:h-[4.5rem] sm:w-[4.5rem] lg:-bottom-6 lg:left-[74%] lg:right-auto lg:h-[5.5rem] lg:w-[5.5rem] lg:translate-x-0"
            />

            <Shape
              name="scallop"
              color="var(--mint)"
              size={64}
              rotate={18}
              animate="float"
              duration={9}
              delay={-2}
              className="sticker -left-10 top-1/3 hidden xl:block"
            />

            <h1 className="text-mega relative z-10">
              <span
                className="rise block"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                {site.firstName}
              </span>
              <span
                className="rise block"
                style={{ "--i": 2 } as React.CSSProperties}
              >
                {site.lastName}
              </span>
              {/* The role goes in a pill: the single loudest borrowed gesture,
                  spent on the line that actually says what he does.
                  Deliberately a step DOWN from mega — at the same size the
                  role wraps to two lines, the stadium radius turns into a
                  giant lozenge, and the accent outweighs the name it is
                  supposed to be annotating. `nowrap` holds that guarantee at
                  every width. */}
              <span
                className="rise mt-4 block"
                style={{ "--i": 3 } as React.CSSProperties}
              >
                <span
                  className="outlined text-headline inline-block whitespace-nowrap -rotate-[1.5deg] px-[0.5em] pb-[0.16em] pt-[0.06em] leading-[1.1]"
                  style={{
                    background: "var(--brand)",
                    color: "#16150f",
                    borderRadius: "var(--radius-pill)",
                    boxShadow: "5px 5px 0 0 var(--outline)",
                  }}
                >
                  {site.role}
                </span>
              </span>
            </h1>
          </div>

          {/*
            The illustration stage: portrait card plus both hands, in the
            reference's proportions. The card's own aspect ratio lives inside
            <HeroIllustration> because every hand position is a percentage of
            it — setting it here too would let the two drift apart.

            The stickers that used to ring the portrait are gone: with four
            hand layers reaching across this corner they were competing for the
            same space, and the hands are the stronger object.
          */}
          <div
            /*
             * Full width on mobile, not `col-span-8 col-start-5`.
             *
             * That old placement left a 143px dead gutter on the left of a
             * 390px screen and squeezed the card to 227px — smaller than the
             * thumb meant to be gripping it. The source runs its card at 351
             * of 390 (90%, centred, 20px gutters) precisely so the product is
             * the focal point and the hands crop against the viewport edges
             * instead of floating in empty space. `col-span-12` inside the
             * shell reproduces that.
             *
             * From `sm` the two-column layout returns and the card moves back
             * beside the headline.
             *
             * Offset with `top`, not margin, at lg: the brown hand needs
             * headroom above the card — the source clears ~0.37x the card's
             * height — but a top margin on an `items-end` grid item makes the
             * item taller, which grows the row and drags the headline and CTAs
             * down with it. `position: top` moves it visually and leaves the
             * layout alone. It does not collide with the `rise` entrance
             * either, which owns `transform`.
             */
            className="rise relative order-4 col-span-12 mt-10 sm:order-none sm:col-span-5 sm:col-start-8 lg:col-span-4 lg:col-start-9 lg:top-24 lg:mt-0"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <HeroIllustration />
          </div>
        </div>

        <p
          className="rise text-lead relative z-10 order-2 mt-8 max-w-measure text-ink-muted sm:mt-band"
          style={{ "--i": 5 } as React.CSSProperties}
        >
          {site.pitch}
        </p>

        {/* Calls to action. Two only — a third would dilute both. */}
        <div
          className="rise relative z-10 order-3 mt-7 flex flex-col items-stretch gap-3 sm:mt-band sm:flex-row sm:flex-wrap sm:items-center"
          style={{ "--i": 6 } as React.CSSProperties}
        >
          <a href="#work" className="btn btn-primary group justify-center py-4 sm:justify-start sm:py-3.5">
            <span>See the work</span>
            <Icon
              name="arrow-right"
              size={17}
              className="transition-transform duration-500 ease-spring group-hover:translate-x-1"
            />
          </a>

          <a href="#contact" className="btn btn-plain group justify-center py-4 sm:justify-start sm:py-3.5">
            Start a conversation
            <Icon
              name="arrow-down"
              size={16}
              className="transition-transform duration-500 ease-spring group-hover:translate-y-0.5"
            />
          </a>
        </div>

        {/* The scannable facts. A recruiter reads this row before any prose. */}
        <dl className="rule-t relative z-10 order-5 mt-12 grid grid-cols-2 gap-x-gutter gap-y-8 pt-row sm:mt-section sm:gap-y-band md:grid-cols-4">
          <Stat
            i={7}
            label="Years shipping"
            value={<Counter value={site.yearsExperience} suffix="+" />}
          />
          <Stat
            i={8}
            label="Projects delivered"
            value={<Counter value={site.projectsShipped} suffix="+" />}
          />
          <Stat
            i={9}
            label="Industries"
            value={site.industries.join(" · ")}
            small
          />
          <Stat i={10} label="Timezone" value={site.timezone} small />
        </dl>
      </div>

      <a
        href="#ethos"
        className="rise label shell group relative z-10 mt-band flex items-center gap-2 text-ink-faint transition-colors hover:text-accent"
        style={{ "--i": 11 } as React.CSSProperties}
      >
        <Icon
          name="arrow-down"
          size={13}
          className="transition-transform duration-500 ease-spring group-hover:translate-y-0.5"
        />
        Scroll
      </a>
    </section>
  );
}

function Stat({
  i,
  label,
  value,
  small = false,
}: {
  i: number;
  label: string;
  value: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div className="rise" style={{ "--i": i } as React.CSSProperties}>
      <dt className="label mb-2">{label}</dt>
      <dd
        className={small ? "text-body text-ink-muted" : "text-headline"}
        style={small ? undefined : { fontFamily: "var(--font-display)" }}
      >
        {value}
      </dd>
    </div>
  );
}
