import {
  nav,
  projects,
  stack,
  process,
  timeline,
  socials,
  writing,
  openSource,
  speaking,
  certifications,
  awards,
  site,
} from "@/app/lib/content";

export type SearchGroup =
  | "Navigate"
  | "Work"
  | "Technology"
  | "Method"
  | "Experience"
  | "Writing"
  | "Elsewhere"
  | "Actions";

export type SearchItem = {
  id: string;
  group: SearchGroup;
  title: string;
  /** Second line in the result row. */
  hint?: string;
  /** Extra tokens matched against but never displayed. */
  keywords?: string;
  /** In-page anchor or route. Mutually exclusive with `action`. */
  href?: string;
  /** Opens in a new tab. */
  external?: boolean;
  /** Client-side command, resolved by the palette. */
  action?:
    | "theme"
    | "motion"
    | "reading"
    | "shortcuts"
    | "resume"
    | "copy-email"
    | "top"
    | "assistant";
};

/**
 * The whole site, flattened into one searchable list.
 *
 * Built once at module scope — it is derived entirely from static content, so
 * rebuilding it per keystroke would be wasted work. Sections with no data
 * contribute no rows, which is what keeps the palette honest: if there are no
 * talks, "speaking" simply finds nothing rather than showing an empty heading.
 */
export const searchIndex: readonly SearchItem[] = [
  ...nav.map<SearchItem>((item) => ({
    id: `nav:${item.href}`,
    group: "Navigate",
    title: item.label,
    hint: `Section ${item.n}`,
    href: item.href,
  })),

  ...projects.map<SearchItem>((project) => ({
    id: `work:${project.slug}`,
    group: "Work",
    title: project.title,
    hint: `${project.year} · ${project.role} · ${project.summary}`,
    keywords: `${project.stack.join(" ")} ${project.category} ${project.detail}`,
    href: `/work/${project.slug}`,
  })),

  ...stack.map<SearchItem>((entry) => ({
    id: `stack:${entry.name}`,
    group: "Technology",
    title: entry.name,
    hint: `${entry.ring} · ${entry.domain}${entry.note ? ` — ${entry.note}` : ""}`,
    keywords: projects
      .filter((p) => p.stack.includes(entry.name))
      .map((p) => p.title)
      .join(" "),
    href: "#stack",
  })),

  ...process.map<SearchItem>((step) => ({
    id: `method:${step.n}`,
    group: "Method",
    title: `${step.n} — ${step.title}`,
    hint: step.description,
    keywords: step.outputs.join(" "),
    href: "#method",
  })),

  ...timeline.map<SearchItem>((entry) => ({
    id: `timeline:${entry.period}`,
    group: "Experience",
    title: `${entry.role} · ${entry.org}`,
    hint: entry.period,
    keywords: `${entry.summary} ${entry.highlights.join(" ")}`,
    href: "#trajectory",
  })),

  ...writing.map<SearchItem>((entry) => ({
    id: `writing:${entry.title}`,
    group: "Writing",
    title: entry.title,
    hint: `${entry.date} · ${entry.summary}`,
    href: entry.href ?? "#contact",
    external: Boolean(entry.href),
  })),

  ...openSource.map<SearchItem>((entry) => ({
    id: `oss:${entry.name}`,
    group: "Writing",
    title: entry.name,
    hint: `${entry.role} · ${entry.description}`,
    href: entry.href ?? "#contact",
    external: Boolean(entry.href),
  })),

  ...speaking.map<SearchItem>((entry) => ({
    id: `talk:${entry.title}`,
    group: "Writing",
    title: entry.title,
    hint: `${entry.year} · ${entry.event}`,
    href: entry.href ?? "#contact",
    external: Boolean(entry.href),
  })),

  ...[...certifications, ...awards].map<SearchItem>((entry) => ({
    id: `credential:${entry.title}`,
    group: "Experience",
    title: entry.title,
    hint: `${entry.year} · ${entry.org}`,
    href: entry.href ?? "#trajectory",
    external: Boolean(entry.href),
  })),

  /* Only linked socials become rows — an unlinked one has nowhere to go. */
  ...socials
    .filter((social) => social.href)
    .map<SearchItem>((social) => ({
      id: `social:${social.kind}`,
      group: "Elsewhere",
      title: social.label,
      hint: social.handle,
      href: social.href!,
      /* mailto: is a handoff to another app, not a page — opening it in a new
         tab leaves a blank one behind that never closes. */
      external: social.kind !== "email",
    })),

  {
    id: "action:assistant",
    group: "Actions",
    title: "Ask about my experience",
    hint: "Put a question to the site itself",
    keywords: "ai assistant chat question ask help",
    action: "assistant",
  },
  {
    id: "action:resume",
    group: "Actions",
    title: "Download CV",
    hint: site.resume.meta,
    keywords: "resume cv pdf download",
    action: "resume",
  },
  {
    id: "action:theme",
    group: "Actions",
    title: "Toggle theme",
    hint: "Switch between dark and light",
    keywords: "dark light mode appearance colour color",
    action: "theme",
  },
  {
    id: "action:motion",
    group: "Actions",
    title: "Toggle reduced motion",
    hint: "Turn animation off or back on",
    keywords: "accessibility a11y animation motion",
    action: "motion",
  },
  {
    id: "action:reading",
    group: "Actions",
    title: "Toggle reading mode",
    hint: "Strip ornament, widen the text",
    keywords: "accessibility a11y focus read plain",
    action: "reading",
  },
  {
    id: "action:shortcuts",
    group: "Actions",
    title: "Keyboard shortcuts",
    hint: "Show every binding",
    keywords: "keys hotkeys bindings help",
    action: "shortcuts",
  },
  {
    id: "action:copy-email",
    group: "Actions",
    title: "Copy email address",
    hint: contactHint(),
    keywords: "mail contact hire reach",
    action: "copy-email",
  },
  {
    id: "action:top",
    group: "Actions",
    title: "Back to top",
    keywords: "scroll home start",
    action: "top",
  },
];

function contactHint() {
  return "Put it on the clipboard";
}

/**
 * Subsequence match, then rank.
 *
 * Subsequence rather than substring so "anlytdb" still finds "Analytics
 * Dashboard" — typing fast with dropped letters is the normal case in a
 * palette. Scoring rewards, in order: a title prefix, a title hit anywhere,
 * then contiguity, so exact-ish matches float above scattered ones.
 */
export function searchSite(query: string): readonly SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return searchIndex;

  const scored: { item: SearchItem; score: number }[] = [];

  for (const item of searchIndex) {
    const title = item.title.toLowerCase();
    const haystack =
      `${item.title} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();

    const titleScore = subsequenceScore(title, q);
    const bodyScore = subsequenceScore(haystack, q);
    if (titleScore === null && bodyScore === null) continue;

    let score = 0;
    if (title.startsWith(q)) score += 1000;
    if (title.includes(q)) score += 500;
    if (titleScore !== null) score += 260 - Math.min(titleScore, 260);
    if (bodyScore !== null) score += 60 - Math.min(bodyScore, 60);
    scored.push({ item, score });
  }

  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.item);
}

/**
 * Compactness penalty for `query` as a subsequence of `text` — lower is a
 * tighter match — or `null` when `query` is not a subsequence at all.
 *
 * The null sentinel matters. An earlier version returned -1 for "no match"
 * and computed the penalty as `span - query.length`, which is -1 for a
 * *perfect* prefix match ("post" in "postgresql" spans exactly 4 characters).
 * The two collided, so the single best hit in the index scored as a miss and
 * was dropped — typing "post" returned everything except PostgreSQL.
 *
 * The penalty is now measured against the minimum possible span, so a
 * contiguous match is 0 and the value can never be negative.
 */
function subsequenceScore(text: string, query: string): number | null {
  let index = 0;
  let firstHit = -1;
  let lastHit = -1;

  for (const char of query) {
    const found = text.indexOf(char, index);
    if (found === -1) return null;
    if (firstHit === -1) firstHit = found;
    lastHit = found;
    index = found + 1;
  }

  /* Slack between matched characters, plus how far in the match starts, so
     tighter and earlier matches both rank higher. */
  const slack = lastHit - firstHit - (query.length - 1);
  return slack + Math.min(firstHit, 40);
}

/** Groups preserve this order in the palette regardless of match order. */
export const groupOrder: readonly SearchGroup[] = [
  "Actions",
  "Work",
  "Navigate",
  "Technology",
  "Method",
  "Experience",
  "Writing",
  "Elsewhere",
];
