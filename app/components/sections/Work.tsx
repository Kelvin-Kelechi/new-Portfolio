import Reveal from "@/app/components/motion/Reveal";
import SectionHeading from "@/app/components/ui/SectionHeading";
import ProjectShowcase from "@/app/components/sections/ProjectShowcase";
import { projects, featuredProject } from "@/app/lib/content";

/**
 * Selected work.
 *
 * Replaces a spotlight-plus-index arrangement that had two structural
 * problems: the featured project appeared twice — once in the spotlight and
 * again as row 01 of the list underneath — and the list itself was five lines
 * of text with no visual weight, so four of the five projects were represented
 * by a title and a sentence.
 *
 * Now every project gets the same full composition, ordered with the featured
 * one first, and distinguishes itself by colour, device chrome and side rather
 * than by rank. Nothing is repeated and nothing is demoted to a table row.
 *
 * Ordering is computed rather than hand-listed so that flipping `featured` in
 * content.ts is enough to re-rank the section.
 */
export default function Work() {
  const ordered = [
    ...projects.filter((project) => project.slug === featuredProject.slug),
    ...projects.filter((project) => project.slug !== featuredProject.slug),
  ];

  return (
    <Reveal
      as="section"
      id="work"
      aria-labelledby="work-heading"
      className="shell py-section"
    >
      <SectionHeading
        n="02"
        id="work-heading"
        aside={`${String(ordered.length).padStart(2, "0")} projects`}
      >
        Selected work
      </SectionHeading>

      {/* A statement line under the rule. The section had none, which left the
          heading doing two jobs — naming the section and framing the work — and
          it could only manage the first. */}
      <p
        className="text-lead reveal-item mt-band max-w-measure text-ink-muted"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        Production-grade mobile and web applications built from concept to App
        Store. Each case study covers the technical challenges, architecture
        decisions, and lessons learned shipping real products used by thousands.
      </p>

      <div className="mt-section">
        {ordered.map((project, index) => (
          <ProjectShowcase
            key={project.slug}
            project={project}
            index={index}
          />
        ))}
        {/* Closes the last row. Every project draws its own rule above itself,
            so without this the final composition has an open bottom edge. */}
        <div className="h-px w-full bg-rule" />
      </div>
    </Reveal>
  );
}
