"use client";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { prefersReducedMotion } from "@/app/lib/prefs";

/**
 * Pulls its child gently toward the cursor.
 *
 * Writes CSS custom properties directly — never React state — so a pointer
 * move costs no render. The `magnet` utility owns the transform and the
 * easing; this component only supplies two numbers.
 *
 * Gated three ways: fine pointer only, reduced-motion checked here, and the
 * utility zeroes its own transform under reduced motion as a backstop.
 */
export default function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useRef(false);
  const frame = useRef(0);

  useEffect(() => {
    const check = () => {
      enabled.current =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !prefersReducedMotion();
    };
    check();

    /* The in-page motion toggle mutates an attribute on <html>, which no media
       query reports. Observing it keeps this in sync with the preference
       without a context provider. */
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const move = (event: PointerEvent<HTMLSpanElement>) => {
    const element = ref.current;
    if (!enabled.current || !element) return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const dx = (clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (clientY - (rect.top + rect.height / 2)) * strength;
      element.style.setProperty("--mx", `${dx}px`);
      element.style.setProperty("--my", `${dy}px`);
    });
  };

  const reset = () => {
    const element = ref.current;
    if (!element) return;
    cancelAnimationFrame(frame.current);
    element.style.setProperty("--mx", "0px");
    element.style.setProperty("--my", "0px");
  };

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      /* Reset on blur too, or a keyboard user tabbing away leaves the element
         permanently offset. */
      onBlur={reset}
      className={`magnet inline-block ${className}`}
    >
      {children}
    </span>
  );
}
