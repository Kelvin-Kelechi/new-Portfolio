"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  searchSite,
  groupOrder,
  type SearchItem,
  type SearchGroup,
} from "@/app/lib/search";
import { contact, site } from "@/app/lib/content";
import { useTheme, useMotion, useReading } from "@/app/lib/prefs";
import Icon from "@/app/components/ui/Icon";
import type { Overlay } from "@/app/components/chrome/Chrome";

/**
 * ⌘K palette and global search in one surface.
 *
 * Search is over the whole site — projects, technologies, method steps,
 * experience, writing, and a set of commands — so a visitor who knows what
 * they are looking for never has to scroll to find it. That is the actual
 * argument for a palette on a portfolio: a recruiter checking "have they used
 * Postgres" gets an answer in two keystrokes.
 */
export default function CommandPalette({
  onClose,
  onOpen,
}: {
  onClose: () => void;
  onOpen: (overlay: Exclude<Overlay, null>) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toggle: toggleTheme } = useTheme();
  const { toggle: toggleMotion } = useMotion();
  const { toggle: toggleReading } = useReading();

  const results = useMemo(() => searchSite(query), [query]);

  /*
   * Grouped for display, but `results` stays the flat keyboard order — the two
   * must agree or arrow keys select a different row than the one highlighted.
   * Rebuilding the flat list from the groups guarantees they do.
   *
   * Group ordering is the subtle part. With no query, the canonical order in
   * `groupOrder` is right — Actions first, because that is a menu. The moment
   * there is a query it becomes wrong: a fixed order pins Actions above
   * Technology, so typing "post" buries PostgreSQL under "Back to top" no
   * matter how much better it scored. So when searching, groups are ordered by
   * where their best-scoring member landed, which puts the strongest match on
   * the first row where Enter can reach it.
   */
  const { groups, flat } = useMemo(() => {
    const buckets = new Map<SearchGroup, SearchItem[]>();
    for (const item of results) {
      const bucket = buckets.get(item.group);
      if (bucket) bucket.push(item);
      else buckets.set(item.group, [item]);
    }

    const present = [...buckets.keys()];
    const searching = query.trim().length > 0;
    const order = searching
      ? present.sort(
          (a, b) =>
            results.indexOf(buckets.get(a)![0]) -
            results.indexOf(buckets.get(b)![0]),
        )
      : groupOrder.filter((group) => buckets.has(group));

    const ordered = order.map((group) => ({
      group,
      items: buckets.get(group)!,
    }));
    return { groups: ordered, flat: ordered.flatMap((entry) => entry.items) };
  }, [results, query]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* Keep the highlighted row in view when navigating with the keyboard. */
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  function run(item: SearchItem) {
    if (item.action) {
      switch (item.action) {
        case "theme":
          toggleTheme();
          return;
        case "motion":
          toggleMotion();
          return;
        case "reading":
          toggleReading();
          return;
        case "shortcuts":
          onOpen("shortcuts");
          return;
        case "assistant":
          onOpen("assistant");
          return;
        case "resume":
          window.open(site.resume.href, "_blank", "noopener,noreferrer");
          onClose();
          return;
        case "top":
          onClose();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        case "copy-email":
          if (!contact.email) {
            setToast("No email address set yet");
            return;
          }
          navigator.clipboard
            ?.writeText(contact.email)
            .then(() => setToast("Copied to clipboard"))
            .catch(() => setToast("Could not copy — select it manually"));
          return;
      }
    }

    if (!item.href) return;
    onClose();

    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.href.startsWith("#")) {
      /* Defer past the overlay unmount, or the scroll target is measured
         while the body is still locked and lands short. */
      requestAnimationFrame(() =>
        document
          .querySelector(item.href!)
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
      return;
    }
    router.push(item.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!flat.length) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setCursor((value) => (value + 1) % flat.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setCursor((value) => (value - 1 + flat.length) % flat.length);
        break;
      case "Home":
        event.preventDefault();
        setCursor(0);
        break;
      case "End":
        event.preventDefault();
        setCursor(flat.length - 1);
        break;
      case "Enter":
        event.preventDefault();
        run(flat[cursor]);
        break;
    }
  }

  let index = -1;

  return (
    <div
      className="overlay-backdrop fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette and site search"
        className="overlay-panel glass flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl"
        onKeyDown={onKeyDown}
      >
        <div className="rule-b flex items-center gap-3 px-5">
          <Icon name="search" size={17} className="text-ink-faint" />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search work, technologies, experience…"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent py-4 text-lead outline-none placeholder:text-ink-faint"
          />

          <kbd className="label hidden shrink-0 rounded border border-rule px-1.5 py-1 sm:block">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto py-2">
          {flat.length === 0 && (
            <p className="px-5 py-10 text-center text-ink-faint">
              Nothing matches{" "}
              <span className="text-ink">&ldquo;{query}&rdquo;</span>.
            </p>
          )}

          {groups.map(({ group, items }) => (
            <div key={group} className="mb-1">
              <p className="label px-5 pb-1 pt-3">{group}</p>
              <ul>
                {items.map((item) => {
                  index += 1;
                  const selected = index === cursor;
                  const position = index;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        data-selected={selected}
                        onMouseMove={() => setCursor(position)}
                        onClick={() => run(item)}
                        className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors duration-150 ${
                          selected ? "bg-accent-soft text-ink" : "text-ink-muted"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-3 w-px shrink-0 transition-colors duration-150 ${
                            selected ? "bg-accent" : "bg-transparent"
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-ink">
                            {item.title}
                          </span>
                          {item.hint && (
                            <span className="block truncate text-[0.8125rem] text-ink-faint">
                              {item.hint}
                            </span>
                          )}
                        </span>
                        {item.external && (
                          <Icon
                            name="arrow-up-right"
                            size={14}
                            className="text-ink-faint"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="rule-t flex items-center justify-between gap-4 px-5 py-3">
          {/* aria-live so a screen reader hears the copy confirmation, which is
              otherwise a purely visual acknowledgement. */}
          <p className="label" aria-live="polite">
            {toast ?? `${flat.length} result${flat.length === 1 ? "" : "s"}`}
          </p>
          <p className="label hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1.5">
              <Icon name="arrow-up" size={12} />
              <Icon name="arrow-down" size={12} />
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="return" size={12} />
              Open
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
