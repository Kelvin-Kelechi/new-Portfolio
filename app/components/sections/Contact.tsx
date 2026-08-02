import Magnetic from "@/app/components/motion/Magnetic";
import Reveal from "@/app/components/motion/Reveal";
import SectionHeading from "@/app/components/ui/SectionHeading";
import ContactMethod from "@/app/components/ui/ContactMethod";
import ContactForm from "@/app/components/sections/ContactForm";
import Icon from "@/app/components/ui/Icon";
import ColorBlock from "@/app/components/ui/ColorBlock";
import Shape from "@/app/components/ui/Shape";
import { contact, site, socials } from "@/app/lib/content";

/**
 * The close.
 *
 * Not a two-column "form on the left, details on the right" — that layout
 * gives the form and the address list equal weight, when the only thing this
 * section has to do is get one message sent. So it is staged instead: a
 * centred close that states the offer and puts one large CTA under it, then
 * the working area underneath, where the form takes the wide column and the
 * channels sit in a narrow rail beside it.
 *
 * Anyone who prefers their own mail client is served by the rail without ever
 * touching the form, which is the point of keeping both.
 */

/** One tone per channel, so the three cards are distinguishable at a glance. */
const METHOD_TONES = ["var(--coral)", "var(--violet)", "var(--sky-deep)"];

export default function Contact() {
  return (
    <Reveal as="section" id="contact" aria-labelledby="contact-heading">
      <ColorBlock color="mint" curveTop curveBottom className="py-section">
        {/* Two slow-drifting washes of colour behind the panels. Blurred far
            past the point of being readable as shapes — they are there to give
            the glass something to refract, which is what stops a frosted panel
            on a flat fill from looking like a grey rectangle. */}
        <span aria-hidden="true" className="contact-aurora" />

        <Shape
          name="burst"
          color="var(--violet)"
          size={116}
          animate="spin"
          duration={18}
          className="sticker -left-14 top-1/3 hidden lg:block"
        />
        <Shape
          name="blob"
          color="var(--amber)"
          size={72}
          rotate={12}
          animate="float"
          duration={7.5}
          delay={-3}
          className="sticker bottom-24 right-10 hidden lg:block"
        />

        <div className="shell relative z-10">
          <SectionHeading
            n="07"
            id="contact-heading"
            aside={contact.responseTime}
          >
            Contact
          </SectionHeading>

          {/* ── The close ───────────────────────────────────────────────── */}
          <div className="mt-section flex flex-col items-center text-center">
            {site.available && (
              <p className="reveal-item availability-pill">
                <span className="pulse" aria-hidden="true" />
                {site.availability}
              </p>
            )}

            <h2
              className="text-display reveal-item mt-8 max-w-[16ch] leading-[1.02]"
              style={
                { fontFamily: "var(--font-display)", "--i": 1 } as React.CSSProperties
              }
            >
              {contact.headline}
            </h2>

            <p
              className="text-lead reveal-item mt-7 max-w-measure text-ink-muted"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {contact.standfirst}
            </p>

            <div
              className="reveal-item mt-11 flex flex-col items-center gap-6 sm:flex-row"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <Magnetic strength={0.22}>
                {/* Jumps to the form rather than opening a mail client. The
                    hard handoff is already offered by the Email card below;
                    the headline CTA should lead somewhere on the page. */}
                <a href="#contact-form" className="btn btn-accent btn-lg group">
                  {contact.cta}
                  <Icon
                    name="arrow-down"
                    size={17}
                    className="transition-transform duration-500 ease-spring group-hover:translate-y-0.5"
                  />
                </a>
              </Magnetic>

              <a
                href={site.resume.href}
                download={site.resume.filename}
                className="btn btn-plain group"
              >
                Download CV
                <Icon
                  name="download"
                  size={16}
                  className="transition-transform duration-500 ease-spring group-hover:translate-y-0.5"
                />
              </a>
            </div>

            <p
              className="label reveal-item mt-8 text-ink-faint"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              {site.location} · {site.timezone} · {site.resume.meta}
            </p>
          </div>

          {/* ── The working area ────────────────────────────────────────── */}
          <div
            id="contact-form"
            className="mt-section grid grid-cols-12 items-start gap-x-gutter gap-y-10 scroll-mt-32"
          >
            <div
              className="reveal-item col-span-12 lg:col-span-7"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <ContactForm />
            </div>

            <div
              className="reveal-item col-span-12 lg:col-span-5"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <p className="label">Or reach me directly</p>

              <ul className="mt-5 space-y-3">
                {socials.map((social, index) => (
                  <li key={social.kind}>
                    <ContactMethod
                      social={social}
                      tone={METHOD_TONES[index % METHOD_TONES.length]}
                    />
                  </li>
                ))}
              </ul>

              <p className="mt-7 max-w-measure text-ink-muted">
                Email is the fastest route, and I read every one that arrives.
                Expect a reply inside a day — usually sooner.
              </p>
            </div>
          </div>
        </div>
      </ColorBlock>
    </Reveal>
  );
}
