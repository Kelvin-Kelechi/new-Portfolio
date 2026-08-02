/**
 * Splits text into per-character spans carrying a staggered `--i`.
 *
 * A server component: the reveal itself is pure CSS driven by the nearest
 * <Reveal> ancestor, so character-level animation costs zero JavaScript.
 *
 * Accessibility is handled by hiding the split markup from assistive tech and
 * exposing the original string once — otherwise a screen reader announces the
 * headline one letter at a time.
 */
export default function SplitText({
  children,
  className = "",
  /** Offset so a second line continues the first line's stagger. */
  start = 0,
}: {
  children: string;
  className?: string;
  start?: number;
}) {
  const characters = Array.from(children);

  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {characters.map((character, index) =>
          character === " " ? (
            /* A bare space collapses inside an inline-block, taking the word
               gap with it. */
            <span key={index}>&nbsp;</span>
          ) : (
            <span
              key={index}
              className="reveal-char inline-block"
              style={{ "--i": start + index } as React.CSSProperties}
            >
              {character}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
