"use client";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { prefersReducedMotion } from "@/app/lib/prefs";

/**
 * Tips a card toward the cursor in 3D and moves a specular highlight with it.
 *
 * Same contract as <Magnetic>: custom properties only, no state, no renders
 * per pointer move. `max` is kept low — six degrees reads as the surface
 * catching light, where twelve reads as a novelty effect.
 */
export default function Tilt({
  children,
  max = 6,
  className = "",
  glare = true,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse" || prefersReducedMotion())
      return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      /* -0.5..0.5 from the centre, so the sign falls out naturally. */
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--ry", `${px * max * 2}deg`);
      element.style.setProperty("--rx", `${-py * max * 2}deg`);
      element.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      element.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
      element.style.setProperty("--go", "1");
    });
  };

  const reset = () => {
    const element = ref.current;
    if (!element) return;
    cancelAnimationFrame(frame.current);
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
    element.style.setProperty("--go", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`tiltable relative ${className}`}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
          style={{
            opacity: "var(--go, 0)",
            background:
              "radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), var(--edge-light), transparent 60%)",
          }}
        />
      )}
    </div>
  );
}
