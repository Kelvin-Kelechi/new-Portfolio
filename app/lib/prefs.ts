"use client";
import { useSyncExternalStore, useCallback } from "react";

/**
 * Three user preferences, each stored as an attribute on <html> and mirrored
 * to localStorage.
 *
 * The DOM attribute — not React state — is the source of truth. The inline
 * script in layout.tsx sets those attributes before first paint, so by the
 * time React hydrates the correct values are already applied. Reading back
 * from the DOM means hydration can never disagree with what the user sees,
 * which is the usual failure of theme switchers built on useState.
 *
 * useSyncExternalStore is what makes that safe: getServerSnapshot returns the
 * documented default, so the server render and the first client render agree
 * even when the stored preference differs.
 */

export type Theme = "dark" | "light";
export type Motion = "full" | "reduced";
export type Reading = "off" | "on";

type Pref = { attr: string; key: string; fallback: string };

const PREFS = {
  theme: { attr: "data-theme", key: "theme", fallback: "dark" },
  motion: { attr: "data-motion", key: "motion", fallback: "full" },
  reading: { attr: "data-reading", key: "reading", fallback: "off" },
} satisfies Record<string, Pref>;

type PrefName = keyof typeof PREFS;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function read(name: PrefName): string {
  if (typeof document === "undefined") return PREFS[name].fallback;
  return (
    document.documentElement.getAttribute(PREFS[name].attr) ??
    PREFS[name].fallback
  );
}

function write(name: PrefName, value: string) {
  const pref = PREFS[name];
  const root = document.documentElement;

  /* "full" and "off" are the absence of the attribute, not a value for it —
     the CSS selectors key on presence, so writing the default would leave a
     dead attribute that reads as if the preference were set. */
  if (value === pref.fallback && name !== "theme") {
    root.removeAttribute(pref.attr);
  } else {
    root.setAttribute(pref.attr, value);
  }

  try {
    localStorage.setItem(pref.key, value);
  } catch {
    /* Private browsing or a storage quota. The attribute is already applied,
       so the preference works for this session and simply will not persist. */
  }
  emit();
}

function usePref<T extends string>(name: PrefName): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(name),
    () => PREFS[name].fallback,
  ) as T;

  const set = useCallback((next: T) => write(name, next), [name]);
  return [value, set];
}

export function useTheme() {
  const [theme, setTheme] = usePref<Theme>("theme");
  const toggle = useCallback(
    () => setTheme(read("theme") === "light" ? "dark" : "light"),
    [setTheme],
  );
  return { theme, setTheme, toggle };
}

export function useMotion() {
  const [motion, setMotion] = usePref<Motion>("motion");
  const toggle = useCallback(
    () => setMotion(read("motion") === "reduced" ? "full" : "reduced"),
    [setMotion],
  );
  return { motion, setMotion, toggle };
}

export function useReading() {
  const [reading, setReading] = usePref<Reading>("reading");
  const toggle = useCallback(
    () => setReading(read("reading") === "on" ? "off" : "on"),
    [setReading],
  );
  return { reading, setReading, toggle };
}

/**
 * True when motion should be suppressed, from either source — the OS setting
 * or the in-page toggle. Components that animate imperatively (cursor,
 * magnetic, tilt) have to check both; CSS handles it via the two rule blocks
 * in globals.css.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.getAttribute("data-motion") === "reduced"
  );
}
