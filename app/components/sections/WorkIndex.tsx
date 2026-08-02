"use client";
import Link from "next/link";
import { useCallback, useRef, useState, type PointerEvent } from "react";
import Plate from "@/app/components/ui/Plate";
import Icon from "@/app/components/ui/Icon";
import { projects } from "@/app/lib/content";

/**
 * The index of everything, with a cursor-following preview.
 *
 * Pointer position goes straight to CSS custom properties through rAF, so
 * hovering the list costs zero React renders — only `active` (which project)
 * is state, and that changes at most once per row. The trailing-lag feel comes
 * from transitioning `transform` while rAF rewrites the coordinates underneath.
 *
 * The floating preview is decorative and aria-hidden: every fact it shows is
 * already in the row text. Its accessible counterpart is the inline thumbnail,
 * which CSS shows wherever hover cannot work and on keyboard focus.
 */
export default function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const track = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const element = preview.current;
    if (!element) return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty("--px", `${clientX}px`);
      element.style.setProperty("--py", `${clientY}px`);
    });
  }, []);

  return (
    <div
      className="relative"
      onPointerMove={track}
      onPointerLeave={() => setActive(null)}
    >
      <ol className="rule-b">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            className="work-row rule-t group relative"
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            {/* The row rounds and insets on hover rather than filling edge to
                edge — a fat radius appearing under the cursor is the cheapest
                way to carry the sticker language into a plain list. */}
            <Link
              href={`/work/${project.slug}`}
              className="flex flex-col gap-1.5 px-4 py-row transition-[background-color,border-radius,padding] duration-300 ease-editorial hover:bg-paper-raised hover:px-6 md:grid md:grid-cols-12 md:items-baseline md:gap-x-gutter"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              {/* Stacked on mobile; the 12-column grid only engages at md,
                  where columns are wide enough to hold text. `md:contents`
                  dissolves the mobile wrapper into the grid. */}
              <span className="flex items-baseline justify-between gap-4 md:contents">
                <span className="label transition-[color,transform] duration-500 ease-editorial group-hover:translate-x-1 group-hover:text-accent md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="label flex items-center gap-2 md:order-last md:col-span-1 md:justify-self-end">
                  {project.year}
                  <Icon
                    name="arrow-right"
                    size={14}
                    className="opacity-0 transition-[opacity,transform] duration-500 ease-spring group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </span>
              </span>

              <h3 className="text-headline transition-transform duration-500 ease-editorial group-hover:translate-x-[1ch] md:col-span-5 md:col-start-2">
                {project.title}
              </h3>

              <span className="text-body text-ink-muted md:col-span-3 md:col-start-7">
                {project.summary}
              </span>

              <span className="label hidden md:col-span-2 md:col-start-10 md:block">
                {project.category}
              </span>
            </Link>

            <div className="work-thumb pb-row">
              <div className="grid grid-cols-12 gap-x-gutter">
                <div className="col-span-8 col-start-3 aspect-[4/3] max-w-[15rem] md:col-start-2">
                  <Plate project={project} sizes="15rem" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div
        ref={preview}
        aria-hidden="true"
        className="work-preview outlined pointer-events-none fixed left-0 top-0 z-30 h-[19rem] w-[15rem] overflow-hidden"
        style={{
          transform:
            "translate3d(calc(var(--px, -9999px) - 50%), calc(var(--py, 0px) - 50%), 0) rotate(-3deg)",
          borderRadius: "var(--radius-card)",
          boxShadow: "6px 6px 0 0 var(--outline)",
        }}
      >
        {projects.map((project, index) => (
          <div
            key={project.slug}
            className="absolute inset-0 transition-opacity duration-300 ease-editorial"
            style={{ opacity: active === index ? 1 : 0 }}
          >
            <Plate project={project} sizes="15rem" />
          </div>
        ))}
      </div>
    </div>
  );
}
