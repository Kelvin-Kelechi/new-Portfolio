"use client";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/app/lib/prefs";

/**
 * A trailing ring that follows the pointer and reacts to what is under it.
 *
 * Three deliberate constraints:
 *   - The native cursor is never hidden. This is additive decoration; if the
 *     component fails or the browser blocks it, the user still has a pointer.
 *   - Position is written to CSS custom properties inside rAF, never to React
 *     state, so moving the mouse costs zero renders.
 *   - Fine pointers only, and never under reduced motion.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    setEnabled(true);

    const element = ring.current;
    if (!element) return;

    const move = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        element.style.setProperty("--cx", `${clientX}px`);
        element.style.setProperty("--cy", `${clientY}px`);
      });
    };

    /* One delegated listener rather than per-element handlers, so the ring
       reacts correctly to content that mounts after this effect runs. */
    const over = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest?.(
        "a, button, [role='button'], input, textarea, select, summary",
      );
      element.style.setProperty("--cs", interactive ? "2" : "1");
      element.style.opacity = interactive ? "0.55" : "1";
    };

    const leave = () => {
      element.style.opacity = "0";
    };
    const enter = () => {
      element.style.opacity = "1";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, []);

  if (!enabled) return null;
  return <div ref={ring} className="cursor-ring" aria-hidden="true" />;
}
