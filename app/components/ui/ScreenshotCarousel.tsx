"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Icon from "@/app/components/ui/Icon";
import DeviceFrame from "@/app/components/ui/DeviceFrame";

type Screenshot = { src: string; alt: string };

/**
 * A gallery of product screenshots in device chrome.
 *
 * It composes <DeviceFrame> rather than drawing its own shell. An earlier
 * version hand-rolled a phone in CSS — rounded border, inset highlight, drop
 * shadow — which put a second, divergent definition of "phone" in the codebase
 * and left no way at all to show a desktop product in browser chrome.
 *
 * The frame wraps ONLY the viewport, never the controls. Passing the whole
 * component as `children` to a frame puts the pills and the caption inside the
 * device screen, printed over the screenshot they describe.
 *
 * Navigation is pills rather than thumbnails, also learned the hard way. The
 * thumbnails were 60×120 with `object-fit: cover`, which on a tall app
 * screenshot cropped to a meaningless sliver of white and rendered as an empty
 * outlined box. A pill carries the same information — how many, which one — at
 * any aspect ratio, which matters now that one component serves both 9:19.5
 * phone captures and 16:9 desktop ones.
 */
export default function ScreenshotCarousel({
  screenshots,
  projectName,
  frame = "phone",
  label,
  aspect = "9 / 19.5",
  priority = false,
}: {
  screenshots: readonly Screenshot[];
  projectName: string;
  /** Chrome to wrap the viewport in. */
  frame?: "phone" | "browser";
  /** Address-bar text for browser chrome. Usually the live URL. */
  label?: string;
  /** CSS aspect-ratio for the viewport. Match the source files. */
  aspect?: string;
  /**
   * Whether this carousel sits above the fold and its first slide is worth
   * preloading. Every project in the Work section renders one of these, and
   * that section is always below the hero — defaulting to `false` keeps a
   * three-project (soon more) index from preloading three off-screen images
   * on every visit. Pass `true` only for a carousel actually in the initial
   * viewport.
   */
  priority?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  /* Autoplay stops permanently at the first deliberate input. Resuming it
     under someone who is reading a particular slide is the whole reason
     auto-advancing galleries are disliked. */
  const [playing, setPlaying] = useState(true);

  const count = screenshots.length;

  useEffect(() => {
    if (!playing || count <= 1) return;
    /* Check the OS setting here, not only in CSS. A media query can shorten
       the slide transition but cannot stop a timer from advancing it. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCurrent((i) => (i + 1) % count), 5200);
    return () => clearInterval(id);
  }, [playing, count]);

  if (count === 0) return null;

  const go = (next: number) => {
    setCurrent((next + count) % count);
    setPlaying(false);
  };

  /* Arrow keys move between slides once focus is inside the gallery, which is
     what a keyboard user expects of a composite widget and what the pills
     alone do not give them. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(current + 1);
    }
  };

  return (
    <div className="shot" onKeyDown={onKeyDown}>
      <DeviceFrame kind={frame} label={label} className="shot-frame">
        <div
          className="shot-viewport"
          style={{ aspectRatio: aspect }}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${projectName} screenshots`}
        >
        <div
          className="shot-track"
          style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
        >
          {screenshots.map((shot, index) => (
            <div
              key={shot.src}
              className="shot-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              /* Off-screen slides leave the accessibility tree, or a screen
                 reader announces all five as though they were on screen. */
              aria-hidden={index !== current}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                /* Only the first slide of an above-the-fold carousel is worth
                   preloading; the rest are behind a click on every viewport.
                   next/image already lazy-loads by default when priority is
                   false, so there is nothing further to set here. */
                priority={priority && index === 0}
                className="shot-image"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(current - 1)}
              className="shot-nav shot-nav-prev"
              aria-label={`Previous ${projectName} screenshot`}
            >
              <Icon name="arrow-left" size={17} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              className="shot-nav shot-nav-next"
              aria-label={`Next ${projectName} screenshot`}
            >
              <Icon name="arrow-right" size={17} strokeWidth={2} />
            </button>
          </>
        )}
        </div>
      </DeviceFrame>

      {count > 1 && (
        <div className="shot-controls">
          <div className="shot-pills">
            {screenshots.map((shot, index) => (
              <button
                key={shot.src}
                type="button"
                onClick={() => go(index)}
                className="shot-pill"
                data-active={index === current || undefined}
                aria-label={`Screenshot ${index + 1}: ${shot.alt}`}
                aria-current={index === current}
              />
            ))}
          </div>
          {/* The caption IS the alt text, so the two cannot drift apart, and a
              sighted visitor gets the same description a screen reader does
              rather than an unlabelled picture. */}
          <p className="shot-caption" aria-live="polite">
            {screenshots[current].alt}
          </p>
        </div>
      )}
    </div>
  );
}
