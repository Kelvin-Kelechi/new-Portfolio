"use client";
import { useEffect, useRef } from "react";
import { shortcuts } from "@/app/lib/content";
import { useMotion, useReading } from "@/app/lib/prefs";
import Icon from "@/app/components/ui/Icon";

/**
 * The `?` sheet: every binding, plus the accessibility controls.
 *
 * Motion and reading mode live here rather than in a floating widget because
 * this is where someone looking for them will actually go, and because a
 * permanent accessibility button is itself another thing on screen.
 */
export default function ShortcutsSheet({ onClose }: { onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const { motion, toggle: toggleMotion } = useMotion();
  const { reading, toggle: toggleReading } = useReading();

  useEffect(() => {
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, []);

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-heading"
        className="overlay-panel glass w-full max-w-lg overflow-hidden rounded-2xl"
      >
        <div className="rule-b flex items-center justify-between px-6 py-4">
          <h2 id="shortcuts-heading" className="label">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors duration-300 hover:text-accent"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <ul className="px-6 py-2">
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut.label}
              className="flex items-center justify-between gap-6 py-2.5"
            >
              <span className="text-ink-muted">{shortcut.label}</span>
              <span className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key, index) =>
                  key === "then" ? (
                    <span key={index} className="label px-0.5">
                      then
                    </span>
                  ) : (
                    <kbd
                      key={index}
                      className="label surface min-w-[1.75rem] rounded px-2 py-1 text-center text-ink"
                    >
                      {key}
                    </kbd>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="rule-t px-6 py-4">
          <p className="label mb-3">Accessibility</p>
          <div className="flex flex-wrap gap-2">
            <Switch
              on={motion === "reduced"}
              onClick={toggleMotion}
              label="Reduce motion"
            />
            <Switch
              on={reading === "on"}
              onClick={toggleReading}
              label="Reading mode"
            />
          </div>
          <p className="mt-3 text-[0.8125rem] text-ink-faint">
            Your system&rsquo;s reduced-motion setting is always respected —
            this only adds to it.
          </p>
        </div>
      </div>
    </div>
  );
}

function Switch({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`label surface flex items-center gap-2.5 rounded-full px-3 py-2 transition-colors duration-300 ${
        on ? "text-accent" : "hover:text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`relative h-3.5 w-6 rounded-full transition-colors duration-300 ${
          on ? "bg-accent" : "bg-rule-strong"
        }`}
      >
        <span
          className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-paper transition-transform duration-300 ease-spring ${
            on ? "translate-x-3" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}
