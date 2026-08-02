"use client";
import { createElement, type ElementType, type ReactNode } from "react";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Applied verbatim — used for aria-labelledby on sections. */
  [key: `aria-${string}`]: string | undefined;
};

/**
 * Flips `data-reveal="in"` on itself when scrolled into view. Children opt in
 * by carrying the `reveal-item` class; stagger comes from a `--i` custom
 * property. One observer per section, not one per item — a page with two
 * hundred revealed elements still costs eight observers.
 *
 * Children pass straight through, so everything inside can stay a server
 * component. This wrapper never inspects or transforms them, which is what
 * keeps the client bundle to just the hook.
 */
export default function Reveal({ as = "div", children, ...rest }: Props) {
  const { ref, isInView } = useScrollReveal<HTMLElement>();

  return createElement(
    as,
    { ref, "data-reveal": isInView ? "in" : "out", ...rest },
    children,
  );
}
