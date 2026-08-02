import Reveal from "@/app/components/motion/Reveal";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { timeline } from "@/app/lib/content";
import Icon from "@/app/components/ui/Icon";

/**
 * Career history as a scannable timeline.
 *
 * Recruiters read this section more carefully than any other, so it is
 * optimised for scanning rather than for effect: period on the left where the
 * eye lands first, role and organisation as the largest text in the row, and
 * highlights as short lines rather than paragraphs.
 */
export default function Trajectory() {
  return (
    <Reveal
      as="section"
      id="trajectory"
      aria-labelledby="trajectory-heading"
      className="shell py-section"
    >
      <SectionHeading
        n="05"
        id="trajectory-heading"
        aside="Most recent first"
      >
        Trajectory
      </SectionHeading>

      <ol className="mt-section">
        {timeline.map((entry, index) => (
          <li
            key={`${entry.period}-${entry.role}`}
            className="reveal-item rule-t group grid grid-cols-12 gap-x-gutter gap-y-4 py-band"
            style={{ "--i": index } as React.CSSProperties}
          >
            <div className="col-span-12 md:col-span-3">
              <p className="label transition-colors duration-500 group-hover:text-accent">
                {entry.period}
              </p>
            </div>

            <div className="col-span-12 md:col-span-5">
              <h3 className="text-title" style={{ fontFamily: "var(--font-display)" }}>
                {entry.role}
              </h3>
              <p className="mt-1 text-ink-muted">
                {entry.href ? (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-grow inline-flex items-center gap-1.5"
                  >
                    {entry.org}
                    <Icon name="arrow-up-right" size={13} />
                  </a>
                ) : (
                  entry.org
                )}
              </p>
              <p className="mt-4 max-w-measure text-ink-muted">{entry.summary}</p>
            </div>

            <div className="col-span-12 md:col-span-4">
              <ul className="space-y-2">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-[0.9375rem] text-ink-muted"
                  >
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="mt-1 text-accent"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
