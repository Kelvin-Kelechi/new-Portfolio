import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, site } from "@/app/lib/content";
import Plate from "@/app/components/ui/Plate";
import DeviceFrame from "@/app/components/ui/DeviceFrame";
import Reveal from "@/app/components/motion/Reveal";
import Magnetic from "@/app/components/motion/Magnetic";
import Icon from "@/app/components/ui/Icon";
import Footer from "@/app/components/Footer";

type Params = { params: Promise<{ slug: string }> };

/* Every case study is known at build time, so all of them are statically
   generated — a recruiter opening one gets a document, not a render. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return { title: "Not found" };

  const description = `${project.summary}. ${project.detail}`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${site.name}`,
      description,
      url: `/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.name}`,
      description,
    },
  };
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  /* Wraps, so the last case study leads back to the first rather than
     dead-ending the reader. */
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.detail,
    dateCreated: project.year,
    creator: { "@type": "Person", name: site.name, url: site.url },
    keywords: project.stack.join(", "),
    url: `${site.url}/work/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main">
        {/* ── Masthead ── */}
        <header className="shell pb-band pt-40">
          <Link
            href="/#work"
            className="label underline-grow group inline-flex items-center gap-2"
          >
            <Icon
              name="arrow-left"
              size={14}
              className="transition-transform duration-500 ease-spring group-hover:-translate-x-1"
            />
            Selected work
          </Link>

          <h1
            className="rise text-mega mt-band max-w-[14ch]"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            {project.title}
          </h1>

          <p
            className="rise text-lead mt-band max-w-measure text-ink-muted"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            {project.detail}
          </p>

          <dl
            className="rise rule-t mt-section grid grid-cols-2 gap-x-gutter gap-y-band pt-row md:grid-cols-4"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <Meta label="Role" value={project.role} />
            <Meta label="Year" value={project.year} />
            <Meta label="Duration" value={project.duration} />
            <Meta label="Category" value={project.category} />
          </dl>
        </header>

        {/* ── Hero visual ── */}
        <div className="shell">
          <div
            className="rise"
            style={{ "--i": 3 } as React.CSSProperties}
            data-parallax
          >
            <DeviceFrame
              kind={project.category === "Mobile" ? "phone" : "browser"}
              label={project.href ?? project.title}
              className={
                project.category === "Mobile" ? "mx-auto max-w-sm" : undefined
              }
            >
              <div
                className={
                  project.category === "Mobile"
                    ? "aspect-[9/16]"
                    : "aspect-[16/9]"
                }
              >
                <Plate
                  project={project}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              </div>
            </DeviceFrame>
          </div>
        </div>

        {/* ── Impact ──
            Renders only when there are real numbers. An empty metrics band
            with placeholder figures would be the single most damaging thing on
            this page: invented performance claims are checkable, and a
            recruiter who catches one discounts everything else. */}
        {project.metrics.length > 0 && (
          <Reveal as="section" className="shell py-section" aria-label="Impact">
            <p className="label rule-b reveal-item pb-row">Measured impact</p>
            <dl className="grid grid-cols-1 gap-x-gutter gap-y-band pt-band sm:grid-cols-2 lg:grid-cols-4">
              {project.metrics.map((metric, position) => (
                <div
                  key={metric.label}
                  className="reveal-item"
                  style={{ "--i": position } as React.CSSProperties}
                >
                  <dd
                    className="text-display leading-none text-accent"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {metric.value}
                  </dd>
                  <dt className="mt-4 text-ink">{metric.label}</dt>
                  {metric.from && (
                    <p className="label mt-1.5">
                      from <span className="line-through">{metric.from}</span>
                    </p>
                  )}
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {/* ── Context + narrative ── */}
        <Reveal as="section" className="shell py-section" aria-label="The work">
          <div className="grid grid-cols-12 gap-x-gutter">
            <p className="label reveal-item col-span-12 mb-8 md:sticky md:top-32 md:col-span-3 md:mb-0 md:self-start">
              The situation
            </p>
            <p className="reveal-item text-title col-span-12 max-w-measure md:col-span-8 md:col-start-5">
              {project.context}
            </p>
          </div>

          {project.sections.map((entry, position) => (
            <div
              key={entry.heading}
              className="reveal-item rule-t mt-section grid grid-cols-12 gap-x-gutter gap-y-6 pt-band"
              style={{ "--i": position } as React.CSSProperties}
            >
              <h2 className="label col-span-12 md:sticky md:top-32 md:col-span-3 md:self-start">
                {entry.heading}
              </h2>
              <p className="text-lead col-span-12 max-w-measure text-ink-muted md:col-span-8 md:col-start-5">
                {entry.body}
              </p>
            </div>
          ))}
        </Reveal>

        {/* ── Architecture ──
            A flow rather than a boxes-and-arrows diagram: the order is the
            information, and a numbered stack reads correctly at every
            breakpoint and in a screen reader. */}
        <Reveal
          as="section"
          className="shell py-section"
          aria-label="Architecture"
        >
          <p className="label rule-b reveal-item pb-row">Architecture</p>
          <ol className="mt-band">
            {project.architecture.map((layer, position) => (
              <li
                key={layer}
                className="reveal-item group flex items-center gap-6 py-5"
                style={{ "--i": position } as React.CSSProperties}
              >
                <span className="label w-8 shrink-0 transition-colors duration-500 group-hover:text-accent">
                  {String(position + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-title flex-1 transition-transform duration-500 ease-editorial group-hover:translate-x-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {layer}
                </span>
                {position < project.architecture.length - 1 && (
                  <Icon name="arrow-down" size={15} className="text-ink-faint" />
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ── Challenges ── */}
        <Reveal
          as="section"
          className="shell py-section"
          aria-label="Problems solved"
        >
          <p className="label rule-b reveal-item pb-row">What was hard</p>
          <div className="mt-band grid grid-cols-12 gap-x-gutter gap-y-band">
            {project.challenges.map((challenge, position) => (
              <article
                key={challenge.problem}
                className="reveal-item surface col-span-12 p-7 md:col-span-6"
                style={{ "--i": position } as React.CSSProperties}
              >
                <p className="label mb-4 text-accent">Problem</p>
                <p className="text-lead text-ink">{challenge.problem}</p>
                <p className="label rule-t mb-4 mt-7 pt-row">Resolution</p>
                <p className="text-ink-muted">{challenge.resolution}</p>
              </article>
            ))}
          </div>
        </Reveal>

        {/* ── Stack + links ── */}
        <Reveal as="section" className="shell py-section" aria-label="Built with">
          <div className="grid grid-cols-12 gap-x-gutter gap-y-band">
            <div className="col-span-12 md:col-span-6">
              <p className="label rule-b reveal-item pb-row">Built with</p>
              <ul className="mt-band flex flex-wrap gap-2">
                {project.stack.map((technology, position) => (
                  <li
                    key={technology}
                    className="reveal-item label surface rounded-full px-4 py-2 text-ink-muted"
                    style={{ "--i": position } as React.CSSProperties}
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <p className="label rule-b reveal-item pb-row">Links</p>
              <ul className="mt-band space-y-3">
                <LinkRow label="Live site" href={project.href} />
                <LinkRow label="Source" href={project.repo} />
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ── Next ── */}
        <Reveal as="section" className="shell py-section" aria-label="Next project">
          <div className="rule-t pt-band">
            <p className="label reveal-item">Next case study</p>
            <Magnetic strength={0.12}>
              <Link
                href={`/work/${next.slug}`}
                className="reveal-item group mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <span className="text-display flex items-center gap-5 transition-colors duration-500 group-hover:text-accent">
                  {next.title}
                  <Icon
                    name="arrow-right"
                    size={34}
                    className="transition-transform duration-500 ease-spring group-hover:translate-x-2"
                  />
                </span>
                <span className="label">{next.summary}</span>
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label mb-2">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function LinkRow({ label, href }: { label: string; href: string | null }) {
  return (
    <li className="reveal-item rule-b flex items-baseline justify-between gap-4 pb-3">
      <span className="label">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-grow flex items-center gap-1.5 text-ink"
        >
          Open
          <Icon name="external" size={13} />
        </a>
      ) : (
        <span className="text-ink-faint">Not published</span>
      )}
    </li>
  );
}
