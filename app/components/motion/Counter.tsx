"use client";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/app/lib/prefs";

/**
 * Counts up to `value` once, when scrolled into view.
 *
 * Two details that separate this from the usual implementation:
 *   - The final value is rendered immediately under reduced motion, and it is
 *     what a screen reader announces in every case — the element carries
 *     aria-label with the real number and the ticking digits are aria-hidden.
 *     A counter that reads "one, two, three, four…" to a screen reader is a
 *     regression, not a flourish.
 *   - Easing is applied to the frame time, not the value, so the count
 *     decelerates into place instead of stopping dead.
 */
export default function Counter({
  value,
  suffix = "",
  duration = 1600,
  className = "",
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || done.current) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      done.current = true;
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          /* easeOutExpo — fast off the line, long settle. */
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(Math.round(eased * value));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`nums ${className}`} aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
    </span>
  );
}
