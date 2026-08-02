import Reveal from "@/app/components/motion/Reveal";
import SectionHeading from "@/app/components/ui/SectionHeading";
import Testimonials from "@/app/components/sections/Testimonials";
import Icon from "@/app/components/ui/Icon";
import {
  testimonials,
  awards,
  certifications,
  openSource,
  speaking,
  writing,
} from "@/app/lib/content";

/**
 * Everything that corroborates the rest of the site: quotes, credentials,
 * open source, talks, writing.
 *
 * The entire section returns null when there is nothing to show, and each
 * block inside it does the same. An "Awards" heading over an empty space
 * advertises the absence; no heading at all simply reads as a site that
 * doesn't have that section.
 *
 * This is the highest-leverage place to add real material — it is the part of
 * a portfolio that a reader treats as evidence rather than as self-description.
 */
export default function Proof() {
  const hasCredentials =
    awards.length + certifications.length > 0;
  const hasContributions =
    openSource.length + speaking.length + writing.length > 0;

  if (!testimonials.length && !hasCredentials && !hasContributions) return null;

  return (
    <Reveal
      as="section"
      id="proof"
      aria-labelledby="proof-heading"
      className="shell py-section"
    >
      <SectionHeading n="06" id="proof-heading" aside="On the record">
        Proof
      </SectionHeading>

      {testimonials.length > 0 && (
        <div className="mt-section">
          <Testimonials />
        </div>
      )}

      {hasCredentials && (
        <div className="mt-section grid grid-cols-12 gap-x-gutter gap-y-band">
          <List
            title="Awards"
            items={awards.map((award) => ({
              key: award.title,
              lead: award.title,
              meta: `${award.year} · ${award.org}`,
              href: award.href,
            }))}
          />
          <List
            title="Certifications"
            items={certifications.map((certification) => ({
              key: certification.title,
              lead: certification.title,
              meta: `${certification.year} · ${certification.org}`,
              href: certification.href,
            }))}
          />
        </div>
      )}

      {hasContributions && (
        <div className="mt-section grid grid-cols-12 gap-x-gutter gap-y-band">
          <List
            title="Open source"
            items={openSource.map((entry) => ({
              key: entry.name,
              lead: entry.name,
              meta: `${entry.role} · ${entry.description}`,
              href: entry.href,
            }))}
          />
          <List
            title="Speaking"
            items={speaking.map((entry) => ({
              key: entry.title,
              lead: entry.title,
              meta: `${entry.year} · ${entry.event}`,
              href: entry.href,
            }))}
          />
          <List
            title="Writing"
            items={writing.map((entry) => ({
              key: entry.title,
              lead: entry.title,
              meta: `${entry.date} · ${entry.summary}`,
              href: entry.href,
            }))}
          />
        </div>
      )}
    </Reveal>
  );
}

type Item = {
  key: string;
  lead: string;
  meta: string;
  href: string | null;
};

function List({ title, items }: { title: string; items: Item[] }) {
  if (!items.length) return null;

  return (
    <div className="reveal-item col-span-12 md:col-span-6 lg:col-span-4">
      <h3 className="label rule-b pb-3">{title}</h3>
      <ul className="mt-4">
        {items.map((item) => (
          <li key={item.key} className="rule-b py-4 last:border-b-0">
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <span className="flex items-center gap-2 text-ink transition-colors duration-300 group-hover:text-accent">
                  {item.lead}
                  <Icon name="arrow-up-right" size={14} />
                </span>
                <span className="label mt-1.5 block">{item.meta}</span>
              </a>
            ) : (
              <>
                <span className="block text-ink">{item.lead}</span>
                <span className="label mt-1.5 block">{item.meta}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
