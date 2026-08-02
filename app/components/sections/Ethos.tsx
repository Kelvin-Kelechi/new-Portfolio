import Reveal from "@/app/components/motion/Reveal";
import SectionHeading from "@/app/components/ui/SectionHeading";
import ColorBlock from "@/app/components/ui/ColorBlock";
import { ethos } from "@/app/lib/content";

/**
 * Server component — <Reveal> is the only client boundary, and children pass
 * straight through it.
 *
 * The heading sticks to the viewport on desktop while the prose scrolls past,
 * which keeps the reader oriented in a long section without a second nav.
 *
 * Sits on the blush fill with the `organic` shape: asymmetric elliptical
 * corners top and bottom, so it flows into the paper above and below instead
 * of stacking as a panel. `on-color` (inside ColorBlock) flips the ink scale to
 * near-black, so every child here reads correctly in both themes without a
 * single per-theme override.
 */
export default function Ethos() {
  return (
    <Reveal as="section" id="ethos" aria-labelledby="ethos-heading">
      <ColorBlock color="blush" shape="organic" className="py-section">
        <div className="shell">
          <SectionHeading n="01" id="ethos-heading" aside="How I think">
            Ethos
          </SectionHeading>

          <div className="mt-section grid grid-cols-12 gap-x-gutter">
            <div className="col-span-12 md:col-span-8 md:col-start-4">
              <p className="reveal-item text-display max-w-[18ch] leading-[1.04]">
                {ethos.lede}
              </p>

              {ethos.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="reveal-item text-lead mt-10 max-w-measure text-ink-muted"
                  style={{ "--i": 1 + index } as React.CSSProperties}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Three convictions, as numbered rows rather than cards. A card grid
          here is the single most template-looking thing a portfolio can do. */}
          <dl className="mt-section">
            {ethos.principles.map((principle, index) => (
              <div
                key={principle.title}
                className="reveal-item rule-t group grid grid-cols-12 gap-x-gutter gap-y-3 py-band"
                style={{ "--i": index } as React.CSSProperties}
              >
                <dt className="col-span-12 flex items-baseline gap-4 md:col-span-4">
                  <span className="label shrink-0 transition-colors duration-500 group-hover:text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-title transition-transform duration-500 ease-editorial group-hover:translate-x-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {principle.title}
                  </span>
                </dt>
                <dd className="col-span-12 max-w-measure text-ink-muted md:col-span-7 md:col-start-6">
                  {principle.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </ColorBlock>
    </Reveal>
  );
}
