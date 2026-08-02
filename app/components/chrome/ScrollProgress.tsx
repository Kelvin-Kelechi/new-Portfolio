"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Hairline reading-progress bar pinned under the header.
 *
 * Where supported this is a scroll-driven CSS animation, which the compositor
 * runs off the main thread — the bar cannot stutter no matter how busy the
 * page is. The rAF-throttled fallback exists only for browsers without
 * `animation-timeline`, and is detected at runtime rather than assumed.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const [native, setNative] = useState(true);

  useEffect(() => {
    const supported =
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline: scroll()");
    setNative(Boolean(supported));
    if (supported) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const element = bar.current;
      if (!element) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      element.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 z-[60] h-px"
      /* `--header-total`, not `--header-h`. The bar's height excludes the notch
         inset, so on a device with a Dynamic Island the old value floated this
         line inside the header instead of sitting under its bottom edge. */
      style={{ top: "var(--header-total)" }}
    >
      <div
        ref={bar}
        className="h-full origin-left bg-brand"
        style={
          native
            ? ({
                transform: "scaleX(0)",
                animation: "progress linear both",
                animationTimeline: "scroll()",
              } as React.CSSProperties)
            : { transform: "scaleX(0)" }
        }
      />
      {native && (
        <style>{`@keyframes progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
      )}
    </div>
  );
}
