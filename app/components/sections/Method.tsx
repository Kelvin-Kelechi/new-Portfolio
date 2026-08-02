import Reveal from "@/app/components/motion/Reveal";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { process } from "@/app/lib/content";
import Icon from "@/app/components/ui/Icon";
import Accordion from "@/app/components/ui/Accordion";
import AccordionCard from "@/app/components/ui/AccordionCard";
import ColorBlock from "@/app/components/ui/ColorBlock";
import Shape from "@/app/components/ui/Shape";

/**
 * How I build products — the section that answers "what is this person like
 * to work with", which is the question a hiring manager is actually asking
 * while they look at your projects.
 *
 * Redesigned as an interactive accordion with premium card styling. Each step
 * expands to reveal its description and outputs, creating a cleaner, more
 * scannable interface than the previous vertical timeline.
 *
 * The accordion is responsive: cards stack full-width on mobile, and the
 * trigger area is large enough (48px min-height) for touch accessibility.
 * All animations use GPU-accelerated transforms for smooth 60 FPS.
 */
/**
 * Card fills, in stack order.
 *
 * Deep rather than bright, because every card carries white text and the
 * bright set (--violet, --mint, --amber) tops out around 1.8:1 against white.
 * These are the same hues pushed down in luminance until white clears 4.5:1,
 * so the section keeps the site's palette without failing contrast.
 *
 * They also have to separate from the violet ColorBlock behind them, which
 * rules out anything close to #9b7fff.
 */
const TONES = [
  "#4a2a8c", // violet, deepened
  "#1f6f4e", // mint, deepened
  "#8a3b12", // amber, deepened
  "#24447e", // sky, deepened
  "#8f2f2a", // coral, deepened
] as const;

export default function Method() {
  return (
    <Reveal as="section" id="method" aria-labelledby="method-heading">
      {/* Neutral band. The five card fills are the colour in this section now,
          and a violet block behind them put six saturated hues on screen at
          once — the cards stopped reading as the subject. */}
      {/* `pt-section` only. The bottom sheet runs all the way to the foot of
          the block and is cut by its curve, so any bottom padding here would
          leave a band of grey under the stack and break that join. */}
      <ColorBlock color="slate" curveTop curveBottom className="pt-section">
        <Shape
          name="star"
          color="var(--coral)"
          size={54}
          animate="beat"
          duration={2.8}
          className="sticker bottom-24 left-8 hidden xl:block"
        />

        <div className="shell relative z-10">
          <SectionHeading n="03" id="method-heading" aside="Five stops">
            How I build
          </SectionHeading>

          {/* Statement under the heading. Frames what the section does.
              Colour comes from `on-color`'s near-black ink scale — the light
              value hardcoded here was for the violet band and is unreadable on
              the grey one. */}
          <p className="text-lead mt-band max-w-measure text-ink-muted">
            {/* "Open", not "Hover" — half the traffic is on a touch screen
                that has no hover and taps instead. */}
            Each step in my process — from uncovering the problem to shipping
            the solution. Open any step to see what it produces.
          </p>

          {/* Full shell width. Capped at max-w-4xl the stack sat in the left
              two thirds with the right third empty, which made five bright
              cards read as a sidebar. */}
          <Accordion className="mt-section">
            {process.map((step, index) => (
              <AccordionCard
                key={step.n}
                id={`method-step-${step.n}`}
                index={index}
                tone={TONES[index % TONES.length]}
                /* The bottom sheet stays open. Nothing overlaps its lower
                   edge, so it has no band to collapse to — and it doubles as
                   the base the rest of the stack sits on. */
                alwaysOpen={index === process.length - 1}
                title={
                  <span className="flex items-baseline gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[0.75rem] font-mono font-bold tracking-wider"
                      style={{
                        background: "rgba(255,255,255,0.22)",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {step.n}
                    </span>
                    {step.title}
                  </span>
                }
              >
                <div>
                  <p className="mb-4">{step.description}</p>

                  {/* Outputs section with icon bullets. */}
                  <div className="mt-5">
                    <p className="label mb-3 text-white/60">Produces</p>
                    <ul className="space-y-2">
                      {step.outputs.map((output) => (
                        <li
                          key={output}
                          className="flex items-start gap-2.5 text-body"
                        >
                          <Icon
                            name="check"
                            size={16}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-white"
                          />
                          <span>{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionCard>
            ))}
          </Accordion>
        </div>
      </ColorBlock>
    </Reveal>
  );
}
