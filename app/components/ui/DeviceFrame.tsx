import type { ReactNode } from "react";

/**
 * Browser and phone chrome around a project visual.
 *
 * Screenshots read as flat rectangles until they sit in something; a frame
 * tells the viewer at a glance whether they are looking at a web product or a
 * mobile one, before they read a single word. The chrome is drawn rather than
 * imaged so it inherits both themes for free.
 */
export default function DeviceFrame({
  kind = "browser",
  label,
  children,
  className = "",
}: {
  kind?: "browser" | "phone";
  /** Shown in the fake address bar. Usually the live URL or the project name. */
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  if (kind === "phone") {
    return (
      <div
        className={`surface overflow-hidden rounded-[2rem] p-2 ${className}`}
        aria-hidden="true"
      >
        <div className="relative overflow-hidden rounded-[1.5rem] bg-paper-sunk">
          {/* Notch. Two elements would be more accurate and less legible. */}
          <span className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-ink/20" />
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`surface overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="rule-b flex items-center gap-2 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        </span>
        {label && (
          <span className="label mx-auto max-w-[60%] truncate rounded bg-paper-sunk px-3 py-1 normal-case tracking-normal">
            {label}
          </span>
        )}
      </div>
      <div className="relative bg-paper-sunk">{children}</div>
    </div>
  );
}
