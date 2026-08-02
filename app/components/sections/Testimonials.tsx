"use client";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/app/lib/content";
import { prefersReducedMotion } from "@/app/lib/prefs";
import Icon from "@/app/components/ui/Icon";

/**
 * Testimonial carousel.
 *
 * Renders nothing until `testimonials` has entries — see the note at the top
 * of content.ts. Quotes are the most load-bearing claim on a portfolio and
 * the easiest to check, so this is built and left empty rather than filled
 * with plausible-sounding invention.
 *
 * Autoplay stops on hover, on focus, when the tab is hidden, and under
 * reduced motion. A carousel that keeps moving while someone is mid-sentence
 * is a usability bug, not a feature.
 */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const region = useRef<HTMLDivElement>(null);

  const count = testimonials.length;

  useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion()) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % count),
      7000,
    );
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, paused]);

  if (!count) return null;
  const current = testimonials[index];

  return (
    <div
      ref={region}
      className="reveal-item"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="grid grid-cols-12 gap-x-gutter"
      >
        <blockquote className="col-span-12 md:col-span-9">
          <p
            className="text-headline max-w-[22ch] leading-[1.12]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span aria-hidden="true" className="text-accent">
              &ldquo;
            </span>
            {current.quote}
            <span aria-hidden="true" className="text-accent">
              &rdquo;
            </span>
          </p>

          <footer className="mt-8">
            <p className="text-ink">
              {current.href ? (
                <a
                  href={current.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-grow inline-flex items-center gap-1.5"
                >
                  {current.name}
                  <Icon name="arrow-up-right" size={14} />
                </a>
              ) : (
                current.name
              )}
            </p>
            <p className="label mt-1.5">
              {current.title} · {current.org}
            </p>
          </footer>
        </blockquote>
      </div>

      {count > 1 && (
        <div className="rule-t mt-band flex items-center justify-between gap-6 pt-row">
          <ul className="flex gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.map((entry, position) => (
              <li key={entry.name} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={position === index}
                  aria-label={`Testimonial ${position + 1} of ${count}, ${entry.name}`}
                  onClick={() => setIndex(position)}
                  className={`h-1 rounded-full transition-all duration-500 ease-editorial ${
                    position === index
                      ? "w-10 bg-accent"
                      : "w-4 bg-rule-strong hover:bg-ink-faint"
                  }`}
                />
              </li>
            ))}
          </ul>

          <p className="label nums">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
