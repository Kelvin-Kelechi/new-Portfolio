import Link from "next/link";
import { featuredProject } from "@/app/lib/content";
import Plate from "@/app/components/ui/Plate";
import DeviceFrame from "@/app/components/ui/DeviceFrame";
import Tilt from "@/app/components/motion/Tilt";

import Icon from "@/app/components/ui/Icon";

/**
 * One project, given room to breathe, above the index.
 *
 * The argument for a spotlight is attention economics: a visitor who reads
 * exactly one thing on this page should read the best thing, and a flat list
 * of five equal rows guarantees they read the first thing instead.
 */
export default function Spotlight() {
  const project = featuredProject;

  return (
    <article className="reveal-item mt-section grid grid-cols-12 items-center gap-x-gutter gap-y-band">
      <div className="col-span-12 lg:col-span-5">
        <p className="label mb-6 flex items-center gap-3">
          <span className="accent-dot" aria-hidden="true" />
          Featured
        </p>

        <h3 className="text-display leading-[1.02]">{project.title}</h3>

        <p className="text-lead mt-6 max-w-measure text-ink-muted">
          {project.detail}
        </p>

        <dl className="rule-t mt-10 grid grid-cols-2 gap-y-6 pt-row">
          <Meta label="Role" value={project.role} />
          <Meta label="Year" value={project.year} />
          <Meta label="Duration" value={project.duration} />
          <Meta label="Category" value={project.category} />
        </dl>

        <ul className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((technology) => (
            <li
              key={technology}
              className="label outlined rounded-full px-3 py-1.5 text-ink-muted"
            >
              {technology}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href={`/work/${project.slug}`}
            className="btn btn-primary group"
          >
            Read the case study
            <Icon
              name="arrow-right"
              size={17}
              className="transition-transform duration-500 ease-spring group-hover:translate-x-1"
            />
          </Link>

          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label underline-grow flex items-center gap-1.5"
            >
              Visit live
              <Icon name="arrow-up-right" size={13} />
            </a>
          )}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 lg:col-start-7">
        <div data-parallax style={{ "--parallax": 3 } as React.CSSProperties}>
          <Tilt max={5}>
            <DeviceFrame label={project.href ?? project.title}>
              <div className="aspect-[16/10]">
                <Plate
                  project={project}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </DeviceFrame>
          </Tilt>
        </div>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label mb-1.5">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
