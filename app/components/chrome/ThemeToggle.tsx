"use client";
import { useTheme } from "@/app/lib/prefs";

/**
 * Sun and moon share one 24px box and cross-fade with a rotation. Because the
 * icon is driven by the same attribute the CSS reads, it can never disagree
 * with the rendered theme — a common bug when the icon tracks separate state.
 *
 * Two shapes, one component: a bare circle in the header bar, and a labelled
 * full-width row in the mobile drawer. The two crossfading SVGs are wrapped in
 * their own sized, positioned span rather than being absolute against the
 * button — otherwise they centre themselves in whatever box the button happens
 * to be, and in the drawer's row layout they would float in the middle of the
 * row instead of sitting beside the label.
 */
export default function ThemeToggle({
  className = "surface tap-target group flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-accent",
  label,
}: {
  className?: string;
  /** Renders visible text beside the icon. The button keeps its own
      state-describing `aria-label` regardless, so the accessible name always
      says which theme you are switching TO. */
  label?: React.ReactNode;
}) {
  const { theme, toggle } = useTheme();
  const dark = theme !== "light";

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme — T"
    >
      <span
        aria-hidden="true"
        className="relative flex h-4 w-4 shrink-0 items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`absolute transition-[transform,opacity] duration-500 ease-spring ${
            dark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute transition-[transform,opacity] duration-500 ease-spring ${
            dark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        >
          <path d="M20.5 14.3A8.6 8.6 0 1 1 9.7 3.5a6.9 6.9 0 0 0 10.8 10.8Z" />
        </svg>
      </span>
      {label}
    </button>
  );
}
