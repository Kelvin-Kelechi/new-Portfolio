"use client";
import { useEffect, useRef, useState } from "react";

type Options = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

/**
 * Fires when an element enters the viewport.
 *
 * The rootMargin default only pulls in the bottom edge, so a reveal triggers
 * slightly before the element is fully on screen. Shrinking the root on all
 * four sides (the obvious-looking `-100px`) combines badly with a low
 * threshold and can stop short trailing sections from ever firing.
 *
 * Under reduced motion this short-circuits to true and never attaches an
 * observer — a reveal stuck at opacity 0 is a blank page, which is a far worse
 * outcome than a missing animation.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.08,
  rootMargin = "0px 0px -12% 0px",
  once = true,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-motion") === "reduced";

    if (reduced || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    /*
     * Failsafe against the observer never reporting — a starved compositor,
     * an odd embedded webview, a bug in this hook. Because content is hidden
     * until observed, any of those would leave the page below the fold blank.
     *
     * Critically, this is armed only while the element is OUT of view and is
     * cleared the moment the observer fires. An unconditional timer (the
     * naive version of this guard) reveals every section a fixed delay after
     * mount, which silently defeats scroll reveal entirely — everything below
     * the fold animates off-screen and is already visible by the time you
     * scroll to it.
     */
    let failsafe = 0;
    const arm = () => {
      if (!failsafe) failsafe = window.setTimeout(() => setIsInView(true), 4000);
    };
    const disarm = () => {
      if (failsafe) {
        window.clearTimeout(failsafe);
        failsafe = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        disarm();
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    arm();

    return () => {
      observer.disconnect();
      disarm();
    };
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
}

export default useScrollReveal;
