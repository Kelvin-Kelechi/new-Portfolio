"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/app/components/chrome/Header";
import CommandPalette from "@/app/components/chrome/CommandPalette";
import ShortcutsSheet from "@/app/components/chrome/ShortcutsSheet";
import Assistant from "@/app/components/chrome/Assistant";
import Cursor from "@/app/components/chrome/Cursor";
import ScrollProgress from "@/app/components/chrome/ScrollProgress";
import { useTheme } from "@/app/lib/prefs";

export type Overlay = "palette" | "shortcuts" | "assistant" | null;

/**
 * Every persistent piece of interface that is not page content.
 *
 * One component owns overlay state because the overlays are mutually
 * exclusive and share an Escape handler — splitting them would mean three
 * competing keydown listeners and a stack of z-indexes to reconcile.
 *
 * The keyboard layer lives here too, for the same reason: a single listener
 * that knows what is currently open can decide correctly whether a keystroke
 * is a shortcut or ordinary typing.
 */
export default function Chrome() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const { toggle: toggleTheme } = useTheme();
  /** Tracks the `g` prefix for two-key navigation chords. */
  const chord = useRef<number>(0);
  /** Focus is returned here when an overlay closes. */
  const restoreFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((next: Exclude<Overlay, null>) => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    setOverlay(next);
  }, []);

  const close = useCallback(() => {
    setOverlay(null);
    /* Returning focus is the difference between an overlay that a keyboard
       user can dismiss and one that strands them at the top of the document. */
    restoreFocus.current?.focus?.();
    restoreFocus.current = null;
  }, []);

  /* Scroll lock while any overlay is open. Restores whatever was there rather
     than hardcoding "auto", which would clobber an inherited value. */
  useEffect(() => {
    if (!overlay) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlay]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      /* A shortcut must never eat a keystroke meant for a text field. */
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      /* ⌘K works everywhere, including inside the palette's own input, so it
         can toggle the palette closed. */
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOverlay((current) => {
          if (current === "palette") {
            restoreFocus.current?.focus?.();
            return null;
          }
          restoreFocus.current = document.activeElement as HTMLElement | null;
          return "palette";
        });
        return;
      }

      if (event.key === "Escape" && overlay) {
        event.preventDefault();
        close();
        return;
      }

      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (overlay) return;

      /* Two-key chord: `g` then a destination, within 900ms. */
      if (event.key.toLowerCase() === "g") {
        chord.current = Date.now();
        return;
      }
      if (chord.current && Date.now() - chord.current < 900) {
        chord.current = 0;
        const destination = GOTO[event.key.toLowerCase()];
        if (destination) {
          event.preventDefault();
          document
            .querySelector(destination)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      chord.current = 0;

      switch (event.key) {
        case "/":
          event.preventDefault();
          open("palette");
          break;
        case "?":
          event.preventDefault();
          open("shortcuts");
          break;
        case "t":
        case "T":
          event.preventDefault();
          toggleTheme();
          break;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [overlay, open, close, toggleTheme]);

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Header
        onOpenPalette={() => open("palette")}
        onOpenAssistant={() => open("assistant")}
      />
      {overlay === "palette" && (
        <CommandPalette onClose={close} onOpen={open} />
      )}
      {overlay === "shortcuts" && <ShortcutsSheet onClose={close} />}
      {overlay === "assistant" && <Assistant onClose={close} />}
    </>
  );
}

const GOTO: Record<string, string> = {
  h: "#top",
  e: "#ethos",
  w: "#work",
  m: "#method",
  s: "#stack",
  t: "#trajectory",
  c: "#contact",
};
