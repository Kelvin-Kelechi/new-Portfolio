"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/app/lib/content";
import Logo from "@/app/components/chrome/Logo";
import ThemeToggle from "@/app/components/chrome/ThemeToggle";
import Magnetic from "@/app/components/motion/Magnetic";
import Icon from "@/app/components/ui/Icon";
import { RiRobot2Line, RiMenu3Fill, RiCloseFill } from "react-icons/ri";

export default function Header({
  onOpenPalette,
  onOpenAssistant,
}: {
  onOpenPalette: () => void;
  onOpenAssistant: () => void;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  /* Drives the logo name reveal. On any route other than the home page there is
     no hero to be inside, so it starts revealed. */
  const [pastHero, setPastHero] = useState(!onHome);
  const sentinel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /* A 1px sentinel above the header instead of a scroll listener — the
     browser reports the crossing, so nothing runs on the main thread during
     scroll. */
  useEffect(() => {
    const element = sentinel.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /*
   * Logo-name reveal: observe the hero itself.
   *
   * The top edge of the observation root is pulled down by the header's own
   * height, so the hero stops "intersecting" the moment its bottom clears the
   * header rather than when it clears the viewport. That makes the name arrive
   * exactly as the next section reaches the bar, instead of a screenful later.
   *
   * Reading the variable rather than hardcoding a pixel value keeps this
   * correct at both breakpoints — the bar is 56px on a phone and 68px from
   * `sm` — and through any future change to either.
   */
  useEffect(() => {
    if (!onHome) {
      setPastHero(true);
      return;
    }
    const hero = document.querySelector("#top");
    if (!hero || typeof IntersectionObserver === "undefined") return;

    /* `--header-total`, not `--header-h`: the bar occupies its own height PLUS
       the notch inset, and the reveal should fire when the hero clears what is
       actually painted. Resolved off a probe element rather than parsed, since
       the value is a `calc()` of a rem and an `env()` and `parseFloat` on that
       string yields NaN. */
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;visibility:hidden;height:var(--header-total)";
    document.body.appendChild(probe);
    const headerH = probe.getBoundingClientRect().height || 56;
    probe.remove();

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: `-${Math.round(headerH)}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [onHome]);

  /*
   * Active-section tracking, also observer-driven.
   *
   * rootMargin pins the detection line about a third down the viewport, so a
   * section becomes "current" when it reaches reading position rather than
   * when its first pixel appears. Sorting by document position and taking the
   * last intersecting entry keeps the highlight stable when two short
   * sections are on screen at once.
   */
  useEffect(() => {
    if (!onHome || typeof IntersectionObserver === "undefined") return;
    const sections = nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));
    if (!sections.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = `#${entry.target.id}`;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const current = nav.filter((item) => visible.has(item.href)).pop();
        setActive(current?.href ?? "");
      },
      { rootMargin: "-33% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  /* Escape closes the mobile panel and returns focus to its trigger. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* Lock scroll and move focus into the panel so keyboard users are not
     stranded behind an open overlay. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    /* `a, button` rather than `a`: the first focusable in the drawer is now the
       search button, and querying only anchors would skip it and land focus on
       "Ethos" — quietly making the search row unreachable by keyboard as the
       first stop. */
    panel.current
      ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
      ?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Close on route change — otherwise the panel survives the navigation it
     just triggered. */
  useEffect(() => setOpen(false), [pathname]);

  /* One place that closes and restores focus, so every dismissal path — the
     toggle, a nav link, the CTA, Escape — behaves identically. */
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      <div
        ref={sentinel}
        aria-hidden="true"
        className="absolute top-0 h-px w-full"
      />

      <header
        /*
          The bar is `--header-h` tall and sits BELOW the notch: the safe-area
          inset is padding, not height, so the painted background still runs to
          the physical top of the screen and the controls never slide under a
          Dynamic Island. In a normal browser tab `--safe-top` is 0 and this is
          exactly a plain 56px bar.

          The scrolled state carries a soft shadow as well as the hairline. On
          paper, at 70% opacity, a 1px rule alone is nearly invisible against
          the light sections and the bar reads as floating type with no surface
          under it; the shadow is what separates it from the page.
        */
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-editorial ${
          scrolled
            ? "rule-b bg-paper/70 shadow-[0_1px_24px_-8px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent"
        }`}
        style={{ height: "var(--header-total)", paddingTop: "var(--safe-top)" }}
      >
        {/* gap-3 on mobile rather than gap-6: with only two controls on the
            right there is no crowding to relieve, and a wide gap here just
            steals width from the wordmark at 320. */}
        <div className="shell flex h-full items-center justify-between gap-3 sm:gap-6">
          {/* The accessible name is fixed and complete regardless of what the
              mark is showing, so the home link never renames itself mid-scroll. */}
          {/* `tap-target` matters more here than on the icon buttons: the
              painted mark is a 36px chip, and "go home" is the one control a
              user hits by reflex without looking. */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="tap-target inline-flex shrink-0"
          >
            <Logo showName={pastHero} />
          </Link>

          {onHome && (
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => {
                  const current = active === item.href;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={current ? "true" : undefined}
                        className={`label relative flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors duration-300 hover:text-ink ${
                          current ? "text-ink" : ""
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-1 w-1 rounded-full transition-all duration-500 ease-spring ${
                            current
                              ? "scale-100 bg-accent"
                              : "scale-0 bg-transparent"
                          }`}
                        />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {!onHome && (
            <Link
              href="/#work"
              className="label underline-grow hidden items-center gap-2 lg:flex"
            >
              <Icon name="arrow-left" size={14} />
              All work
            </Link>
          )}

          {/*
            The right cluster, and the main reason the mobile bar read as
            unbalanced: it used to carry three identical 36px circles — Ask,
            theme, menu — with no hierarchy between them, so the eye saw a row
            of undifferentiated dots rather than a primary action and a way in.

            On mobile it is now two controls. Theme is a *preference*, not
            navigation, so it moves into the drawer alongside the other
            preferences, which is where Linear and Airbnb put theirs. It is
            still one tap away, still on `T`, and back in the bar from `sm`
            where there is room for it to earn its place.
          */}
          <div className="flex shrink-0 items-center gap-2">
            {/* The palette trigger is a real button showing its own shortcut —
                discoverability for the pointer user, affordance for everyone
                else. Below `sm` the same action lives at the top of the drawer
                as a full-width row, so search is reachable on a phone; it used
                to be absent from mobile entirely. */}
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={onOpenPalette}
                className="label surface tap-target hidden items-center gap-2.5 rounded-full py-2 pl-3 pr-2.5 transition-colors duration-300 hover:text-ink sm:flex"
                aria-label="Open command palette"
              >
                <Icon name="search" size={14} />
                Search
                <kbd className="flex items-center gap-0.5 rounded bg-paper-sunk px-1.5 py-0.5 text-[0.625rem] text-ink-faint">
                  <span aria-hidden="true">⌘</span>K
                </kbd>
              </button>
            </Magnetic>

            {/* The label collapses to the icon on small screens, so the button
                carries its own accessible name rather than relying on text
                that is not always rendered.

                Borderless below `sm`: no ring, no fill, just the mark. With the
                chrome gone the accent colour is what carries the hierarchy
                against the neutral menu icon beside it. The `surface` pill
                returns at `sm`, where the button also gains its "Ask" label and
                is a labelled control rather than a bare glyph. */}
            <button
              type="button"
              onClick={onOpenAssistant}
              aria-label="Ask about my experience"
              className="label tap-target group flex h-10 w-10 items-center justify-center gap-2 rounded-full transition-colors duration-300 sm:surface sm:h-9 sm:w-auto sm:px-3 sm:text-ink-faint"
            >
              {/* `.ai-mark` owns the colour and the halo. The wrapper is sized
                  to the glyph so the halo's percentage insets resolve against
                  the icon rather than against the whole button — at `sm` the
                  button is a pill several times wider than the mark, and a halo
                  scaled to that box would wash across the "Ask" label. */}
              <span className="ai-mark size-5 shrink-0 sm:size-4">
                <RiRobot2Line
                  size={20}
                  aria-hidden="true"
                  className="size-full transition-transform duration-700 ease-spring group-hover:-rotate-12"
                />
              </span>
              <span className="hidden pr-0.5 sm:inline">Ask</span>
            </button>

            <ThemeToggle className="surface tap-target group hidden h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-accent sm:flex" />

            <button
              ref={trigger}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="tap-target relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:text-accent lg:hidden"
            >
              {/*
                Remix's menu and close marks, crossfading in place.

                RiMenu3Fill is a static glyph, so the two-line morph the old
                hand-drawn MenuIcon did is not available from it. Stacking the
                pair absolutely and counter-rotating them through the swap keeps
                the state change animated and keeps it reading as ONE control
                changing rather than two controls trading places — which is the
                part of the morph that actually mattered.
              */}
              <RiMenu3Fill
                size={24}
                aria-hidden="true"
                className={`absolute transition-[opacity,transform] duration-300 ease-spring ${
                  open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <RiCloseFill
                size={26}
                aria-hidden="true"
                className={`absolute transition-[opacity,transform] duration-300 ease-spring ${
                  open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/*
        The drawer.

        Always mounted, hidden with opacity and pointer-events rather than
        conditionally rendered. Conditional rendering is why it used to appear
        and vanish as a hard cut: an unmounting element cannot transition, so
        there was no way to animate the close no matter what classes it carried.

        `inert` is what makes always-mounted safe — it takes the whole subtree
        out of the accessibility tree AND out of the tab order while closed, so
        a keyboard user never tabs into an invisible menu. React 19 passes it
        through as a real boolean attribute.
      */}
      <div
        id="mobile-nav"
        ref={panel}
        inert={!open}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-editorial lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop as its own layer so it can be near-opaque while the content
            above it stays crisp — blurring a parent would blur the type too. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-paper/95 backdrop-blur-2xl"
        />

        <nav
          aria-label="Primary mobile"
          className="relative flex h-full flex-col"
          /* Clears the fixed bar, notch included, so the drawer's first row
             never starts underneath the logo and close button — which stay
             visible above it at z-50 and are the way back out. */
          style={{ paddingTop: "var(--header-total)" }}
        >
          {/*
            Scrolls if it has to. Six nav rows at display size plus a search row
            do not fit under 600px of viewport height, and a menu that silently
            clips its last item is worse than one that scrolls. `overscroll-
            contain` stops the scroll chaining to the locked body behind it,
            which on iOS is what produces the rubber-band-then-jump.
          */}
          {/* `my-auto` on the group, not on the list. Centring the list alone
              left the search row stranded at the top with ~250px of nothing
              under it; centring search and nav together keeps them reading as
              one panel and puts the slack outside the pair. On a short screen
              `auto` resolves to 0 and the whole group simply scrolls. */}
          <div className="shell flex flex-1 flex-col overflow-y-auto overscroll-contain pb-6 pt-4">
            <div className="my-auto">
              <DrawerItem open={open} index={0}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenPalette();
                  }}
                  className="surface label flex w-full items-center gap-3 rounded-full px-4 py-3.5 text-left transition-colors duration-300 hover:text-ink"
                >
                  <Icon name="search" size={15} />
                  Search everything
                </button>
              </DrawerItem>

              <ul className="mt-5">
                {nav.map((item, index) => (
                  <li key={item.href} className="rule-t">
                    <DrawerItem open={open} index={index + 1}>
                      <a
                        href={onHome ? item.href : `/${item.href}`}
                        onClick={() => setOpen(false)}
                        aria-current={
                          onHome && active === item.href ? "true" : undefined
                        }
                        /* `py-4` floors every row at 56px tall, so even the
                         shortest label is a comfortable target — the type size
                         alone does not guarantee that at the small end of the
                         clamp. */
                        className="group flex items-center gap-4 py-4 text-title transition-colors duration-300 hover:text-accent"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        <span className="label shrink-0">{item.n}</span>
                        {item.label}
                        <Icon
                          name="arrow-right"
                          size={18}
                          className="ml-auto text-ink-faint transition-transform duration-500 ease-spring group-hover:translate-x-1"
                        />
                      </a>
                    </DrawerItem>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/*
            The foot: the one conversion action, the theme preference, and the
            status line. Pinned rather than scrolling with the list — the CTA is
            the reason the menu is open and it should not require a scroll to
            reach on a short screen.
          */}
          <div
            className="shell rule-t shrink-0 pt-5"
            style={{ paddingBottom: "calc(var(--safe-bottom) + 1.5rem)" }}
          >
            <DrawerItem open={open} index={nav.length + 1}>
              <a
                href={onHome ? "#contact" : "/#contact"}
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full justify-center py-4"
              >
                Start a conversation
                <Icon name="arrow-right" size={17} />
              </a>
            </DrawerItem>

            <DrawerItem open={open} index={nav.length + 2}>
              <div className="mt-4 flex items-center justify-between gap-3">
                {/* Availability, not location. Both were here before and the
                    pair had to be truncated to fit beside the theme control;
                    of the two this is the one a recruiter is actually scanning
                    for, and the hero states the location anyway. */}
                <p className="label flex min-w-0 items-center gap-2">
                  {site.available && (
                    <span className="pulse shrink-0" aria-hidden="true" />
                  )}
                  <span className="truncate">{site.availability}</span>
                </p>

                {/* The word drops below 360px and the control becomes a
                    circle. At 320 the status line and a labelled button cannot
                    both fit, and truncating "Available for remote work" to
                    "AVAILABLE FOR REMOT…" costs more than the label does — the
                    icon alone is unambiguous, and the button keeps its
                    aria-label either way. */}
                <ThemeToggle
                  className="surface label tap-target group flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-ink-muted transition-colors duration-300 hover:text-accent"
                  label={
                    <span className="hidden min-[360px]:inline">Theme</span>
                  }
                />
              </div>
            </DrawerItem>
          </div>
        </nav>
      </div>
    </>
  );
}

/**
 * One staggered row of the drawer.
 *
 * The stagger is asymmetric on purpose: rows enter one after another at 40ms
 * apart, and all leave together. A staggered exit is the classic mistake here —
 * it makes dismissing the menu feel slower than opening it, when dismissal
 * should feel instant because the user has already decided.
 *
 * `.rise` is not reused for this. That animation runs once on mount off a CSS
 * `animation`, and this element never unmounts — it has to be a transition
 * driven by the open state, or it would play exactly once per page load and
 * never again.
 */
function DrawerItem({
  open,
  index,
  children,
}: {
  open: boolean;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`transition-[opacity,transform] duration-500 ease-spring ${
        open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      style={{ transitionDelay: open ? `${60 + index * 40}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
