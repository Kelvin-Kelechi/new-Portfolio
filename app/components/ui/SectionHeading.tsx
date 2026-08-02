import type { ReactNode } from "react";

/**
 * The numbered rule that opens every section.
 *
 * Consistency here is what makes the page read as one document rather than a
 * stack of blocks — the number, the rule, and the optional right-hand aside
 * appear in exactly the same place every time, so the eye stops hunting for
 * where a section begins.
 */
export default function SectionHeading({
  n,
  id,
  children,
  aside,
}: {
  n: string;
  id: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="rule-b flex items-baseline justify-between gap-6 pb-row">
      <h2 id={id} className="label reveal-item flex items-baseline gap-3">
        <span className="text-accent">{n}</span>
        <span aria-hidden="true" className="text-ink-faint">
          —
        </span>
        {children}
      </h2>
      {aside && (
        <p
          className="label reveal-item shrink-0"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {aside}
        </p>
      )}
    </div>
  );
}
