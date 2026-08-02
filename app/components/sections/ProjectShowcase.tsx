import Link from "next/link";
import Plate from "@/app/components/ui/Plate";
import DeviceFrame from "@/app/components/ui/DeviceFrame";
import Tilt from "@/app/components/motion/Tilt";
import Icon from "@/app/components/ui/Icon";
import ScreenshotCarousel from "@/app/components/ui/ScreenshotCarousel";
import type { Project } from "@/app/lib/content";

/**
 * One project, as a full-width composition.
 *
 * The layout alternates side to side down the page. That is not decoration —
 * a column of identical cards is read top-to-bottom at a constant speed and
 * skimmed, where a zig-zag forces the eye to reset at every row, which is what
 * makes a five-project list feel like five projects instead of one list.
 *
 * Three layers build the depth: a blurred colour bloom at the back, an
 * outlined index numeral over it, and the device frame in front. All three sit
 * in the same stacking context and respond to one hover on the card.
 *
 * Server component. Only <Tilt> crosses the client boundary, and only on the
 * frame — everything else, including the whole hover choreography, is CSS.
 */

/**
 * Screenshots for the Looking to Hire app carousel.
 * Each screenshot shows a different feature of the application.
 */
const SCREENSHOTS: readonly { src: string; alt: string }[] = [
  {
    src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/e2/d5/2e/e2d52eee-74e4-5e2c-03b0-bef31f9bee20/Simulator_Screenshot_-_iPhone_16e_-_2025-12-03_at_11.41.04.png/600x1300bb.png",
    alt: "Looking to Hire - Home screen with personalized job recommendations",
  },
  {
    src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/d8/d3/44/d8d344cb-65df-7cb9-3d06-417393f98081/Simulator_Screenshot_-_iPhone_16e_-_2025-12-03_at_11.41.22.png/600x1300bb.png",
    alt: "Looking to Hire - Job details and apply interface",
  },
  {
    src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a1/6e/45/a16e45dd-eeb9-c0e3-66f2-f7a3aae59c33/Simulator_Screenshot_-_iPhone_16e_-_2025-12-03_at_11.41.11.png/600x1300bb.png",
    alt: "Looking to Hire - Application tracking dashboard",
  },
  {
    src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/62/d7/90/62d7905c-ac7a-5912-4a3f-46090d4b3f8b/Simulator_Screenshot_-_iPhone_16e_-_2025-12-03_at_11.44.03.png/600x1300bb.png",
    alt: "Looking to Hire - In-app messaging with employers",
  },
  {
    src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/91/e1/ba/91e1ba8f-c2cc-8a80-0203-f1547abba378/Simulator_Screenshot_-_iPhone_16e_-_2025-12-04_at_08.54.40.png/600x1300bb.png",
    alt: "Looking to Hire - User profile and resume management",
  },
];

/**
 * Each project's colour, from the bright fill set.
 *
 * Assigned by position rather than stored on the project, because it is a
 * property of the *composition* — what matters is that adjacent rows differ,
 * which is a fact about the list, not about any one project. Five tones for
 * five projects; the modulo keeps it correct if the list grows.
 */
const TONES = [
  "var(--violet)",
  "var(--mint)",
  "var(--amber)",
  "var(--sky)",
  "var(--coral)",
] as const;

export default function ProjectShowcase({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const tone = TONES[index % TONES.length];
  /* Mobile projects get phone chrome, everything else a browser. The frame
     says which platform this is before a single word is read. */
  const kind = project.category === "Mobile" ? "phone" : "browser";
  const flipped = index % 2 === 1;

  return (
    <article
      className="showcase reveal-item group relative isolate"
      style={{ "--tone": tone, "--i": index } as React.CSSProperties}
    >
      <div className="showcase-rule h-px w-full" />

      <div className="grid grid-cols-12 items-start gap-x-gutter gap-y-10 py-band lg:gap-y-0">
        {/* ── The visual (carousel for mobile, device frame for others) ───── */}
        <div
          className={`relative col-span-12 lg:col-span-6 ${
            flipped ? "lg:order-2 lg:col-start-7" : "lg:order-1"
          }`}
        >
          <span aria-hidden="true" className="showcase-glow" />

          <span
            aria-hidden="true"
            className={`showcase-index absolute -top-7 z-0 text-[4.5rem] sm:-top-9 sm:text-[6.5rem] lg:-top-12 lg:text-[9rem] ${
              flipped ? "right-1" : "left-1"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div
            data-parallax
            style={{ "--parallax": 2 } as React.CSSProperties}
            className="relative z-[1]"
          >
            {kind === "phone" ? (
              /* Mobile projects: show carousel with screenshots */
              <ScreenshotCarousel
                screenshots={SCREENSHOTS}
                projectName={project.title}
              />
            ) : (
              /* Browser projects: show device frame */
              <Tilt max={4}>
                <div className="showcase-frame rounded-[inherit]">
                  <DeviceFrame label={project.href ?? project.title}>
                    <div className="aspect-[16/10]">
                      <Plate
                        project={project}
                        tone={tone}
                        motif
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    </div>
                  </DeviceFrame>
                </div>
              </Tilt>
            )}
          </div>
        </div>

        {/* ── The content (extended for better fit) ──────────────────────── */}
        <div
          className={`col-span-12 lg:col-span-6 ${
            flipped ? "lg:order-1 lg:col-start-1" : "lg:order-2"
          }`}
        >
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--tone)" }}
            />
            {project.category}
            <span aria-hidden="true" className="text-ink-faint">
              /
            </span>
            {project.year}
            {project.featured && (
              <span
                className="rounded-full px-2 py-0.5 text-ink"
                style={{ background: "var(--tone)", color: "#16150f" }}
              >
                Featured
              </span>
            )}
          </p>

          <h3 className="text-display mt-5 leading-[1.02]">
            {/* `stretch-link` makes this one anchor cover the card, so the
                whole composition is clickable while the accessible name stays
                exactly the project title. */}
            <Link
              href={`/work/${project.slug}`}
              className="stretch-link showcase-title"
            >
              {project.title}
            </Link>
          </h3>

          <p className="text-lead mt-5 max-w-measure text-ink-muted">
            {project.detail}
          </p>

          {/*
            Impact metrics.

            Rendered only when the project actually carries them. Every project
            currently ships `metrics: []`, so this is invisible today — which is
            the correct behaviour and a deliberate one. A fabricated "+47%
            conversion" is the single most checkable claim on a portfolio and
            the fastest way to lose a recruiter who does check.
          */}
          {project.metrics.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="label mb-1.5">{metric.label}</dt>
                  <dd
                    className="text-title"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Role and duration as facts, not badges of achievement. These are
              the two things a recruiter looks for first and neither is
              currently anywhere in the index. */}
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <Fact label="Role" value={project.role} />
            <Fact label="Duration" value={project.duration} />
          </dl>

          <ul className="mt-7 flex flex-wrap gap-2">
            {project.stack.map((technology) => (
              <li
                key={technology}
                className="label glass rounded-full px-3 py-1.5 text-ink-muted"
              >
                {technology}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-8 pb-8">
            <div className="flex flex-wrap items-center gap-6">
              {/* Visual affordance only — the real link is the stretched title,
                  and a second anchor to the same place would make a keyboard user
                  tab through the card twice for one destination. */}
              <span className="label flex items-center gap-2 text-ink transition-colors duration-500 group-hover:text-accent">
                Read the case study
                <Icon
                  name="arrow-right"
                  size={15}
                  className="transition-transform duration-500 ease-spring group-hover:translate-x-1.5"
                />
              </span>

              {project.href && (
                /* z-10 lifts this above the stretched title link so it stays
                   separately clickable rather than being swallowed by it. */
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label underline-grow relative z-10 flex items-center gap-1.5"
                >
                  Visit live
                  <Icon name="arrow-up-right" size={13} />
                </a>
              )}
            </div>

            {/* Extended content area for better visual balance with carousel */}
            {project.sections.length > 0 && (
              <div className="space-y-6 border-t border-rule pt-8">
                <div>
                  <h4 className="label mb-3 text-ink">Key Features</h4>
                  <p className="text-body text-ink-muted leading-relaxed">
                    {project.sections[0].body}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label mb-1.5">{label}</dt>
      <dd className="text-body text-ink">{value}</dd>
    </div>
  );
}
