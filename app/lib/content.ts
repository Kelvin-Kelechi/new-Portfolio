/**
 * SINGLE SOURCE OF CONTENT FOR THE SITE.
 *
 * Every component reads from here — no copy is hardcoded in JSX, and the
 * command palette, search index, SEO metadata, JSON-LD, and the AI assistant's
 * grounding context are all derived from this file.
 *
 * Four conventions worth knowing before you edit:
 *
 *   1. `href: null` renders a non-interactive row instead of a dead `href="#"`.
 *      Nothing on this site links to nowhere.
 *
 *   2. `image: null` falls back to a typographic plate. That is a designed
 *      state, not a missing asset — real screenshots slot in without any
 *      component change.
 *
 *   3. EMPTY ARRAY = HIDDEN SECTION. Testimonials, awards, certifications,
 *      open source, speaking, and per-project metrics all render nothing when
 *      empty. The components are built and wired; add data and they appear.
 *      This is deliberate: an invented testimonial or a fabricated "+47%
 *      conversion" is the one thing on a portfolio that can be checked and
 *      disproved. Fill these with real material or leave them empty.
 *
 *   4. Grep `TODO(slot)` to find everything still holding placeholder material.
 */

/* ═══════════════════════════════  TYPES  ═══════════════════════════════ */

export type Category = "Product" | "Platform" | "Mobile" | "Interface";

/** A single before/after or outcome number on a case study. */
export type Metric = {
  /** The number itself, e.g. "2.4s" or "99.95%". Rendered large. */
  value: string;
  /** What it measures. One short line. */
  label: string;
  /** Optional prior value, renders as a struck-through "from X". */
  from?: string;
};

export type CaseSection = {
  heading: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  /** TODO(slot): real year shipped. */
  year: string;
  category: Category;
  /** TODO(slot): your actual role — "Solo build", "Lead frontend", etc. */
  role: string;
  /** How long it ran. Shown in the case-study meta rail. */
  duration: string;
  /** One line. Sits in the index row next to the title. */
  summary: string;
  /** Two or three sentences. Shows on the preview plate and inline thumb. */
  detail: string;
  stack: readonly string[];
  /** TODO(slot): live URL. `null` renders the row as non-interactive + "SOON". */
  href: string | null;
  /** TODO(slot): repository URL. */
  repo: string | null;
  /** TODO(slot): screenshot. `null` renders the typographic plate. */
  image: { src: string; alt: string } | null;
  /** Promoted to the full-bleed spotlight above the index. One project only. */
  featured?: boolean;

  /* ── Case study body. Everything below drives /work/[slug]. ── */

  /** The situation before you started. Two or three sentences. */
  context: string;
  /** Ordered narrative sections: approach, architecture, hard parts. */
  sections: readonly CaseSection[];
  /** How the system is put together. Rendered as a flow diagram. */
  architecture: readonly string[];
  /** The genuinely difficult problems and what you did about them. */
  challenges: readonly { problem: string; resolution: string }[];
  /**
   * TODO(slot): measurable outcomes. LEFT EMPTY ON PURPOSE — see note 3 above.
   * The impact band renders only when this has entries.
   * Example: { value: "1.1s", label: "Largest Contentful Paint", from: "4.3s" }
   */
  metrics: readonly Metric[];
};

export type StackRing = "Daily" | "Fluent" | "Working" | "Watching";

export type StackEntry = {
  name: string;
  ring: StackRing;
  /** Grouping for the radar's angular axis. */
  domain: "Interface" | "Platform" | "Mobile" | "Operations";
  /** Optional one-line opinion. Shown on hover/focus. */
  note?: string;
};

export type ProcessStep = {
  n: string;
  title: string;
  description: string;
  /** Concrete artefacts this phase produces. */
  outputs: readonly string[];
};

export type TimelineEntry = {
  period: string;
  role: string;
  org: string;
  /** `null` renders the org as plain text rather than a link. */
  href: string | null;
  summary: string;
  highlights: readonly string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  org: string;
  /** TODO(slot): link to the person, so the quote is verifiable. */
  href: string | null;
};

export type Award = { year: string; title: string; org: string; href: string | null };
export type Certification = { year: string; title: string; org: string; href: string | null };
export type OpenSource = { name: string; role: string; description: string; href: string | null };
export type Speaking = { year: string; title: string; event: string; href: string | null };
export type Writing = { date: string; title: string; summary: string; href: string | null };

export type SocialKind = "email" | "github" | "linkedin";

export type Social = {
  kind: SocialKind;
  /** Shown as visible text, which is why these links need no aria-label. */
  label: string;
  /** TODO(slot): the handle/address a visitor actually reads. */
  handle: string;
  /** TODO(slot): real destination. `null` renders as plain text. */
  href: string | null;
};

/* ═══════════════════════════════  IDENTITY  ═══════════════════════════════ */

export const site = {
  name: "Kelvin Anyigor",
  firstName: "Kelvin",
  lastName: "Anyigor",
  role: "Software Engineer",
  /** The one-line positioning statement. Appears in the hero and in metadata. */
  pitch: "I build web and mobile products that hold up under real traffic.",
  location: "Lagos, Nigeria",
  timezone: "UTC+1",
  /** Drives the pulsing availability indicator. */
  available: true,
  availability: "Available for remote work",
  /** Derived from the five-year claim already in the about copy. */
  yearsExperience: 5,
  /** TODO(slot): keep honest — used in the hero stat row. */
  projectsShipped: 20,
  /** Domains, not job titles. What a recruiter scans for first. */
  industries: ["Fintech", "Healthcare", "E-commerce"],
  specialties: ["Product engineering", "Design systems", "Performance", "Offline-first mobile"],
  year: "2026",
  /** TODO(slot): your GitHub username. Enables the contribution graph + live stats. */
  github: null as string | null,
  url: "https://anyigorkelvin.com",
  resume: {
    href: "/resume.pdf",
    filename: "Anyigor-Kelvin-Resume.pdf",
    /** TODO(slot): keep this honest when you update the PDF. */
    meta: "PDF · Updated 2026",
  },
  portrait: {
    src: "/profile.jpg",
    width: 800,
    height: 958,
    alt: "Anyigor Kelvin",
  },
} as const;

/** Short, rotating "what I'm doing right now" strip under the hero. */
export const now: readonly string[] = [
  "Available for remote work",
  "Open to contract and full-time",
  `Based in ${site.location} · ${site.timezone}`,
  "Currently deepening offline-first sync patterns",
  "Reading: Designing Data-Intensive Applications",
];

/* ═══════════════════════════════  ETHOS  ═══════════════════════════════ */

/** First sentence is set larger as a lede, so make it carry weight. */
export const ethos = {
  lede: site.pitch,
  body: [
    "Five years of shipping for high-growth startups and enterprise teams across fintech, healthcare, and e-commerce. Most of that work has been the unglamorous kind that decides whether a product survives contact with users — authentication that does not leak, queries that stay fast at the ninety-fifth percentile, interfaces that degrade gracefully on a bad connection in Lagos.",
    "I care about the seams: the moment a form fails, the second page of results, the screen reader path nobody tested. Good engineering is mostly attention paid where attention is rarely paid.",
  ],
  /** Three convictions. Kept to three so each one lands. */
  principles: [
    {
      title: "Constraints first",
      body: "The interesting decisions happen at the edges — the slow network, the empty state, the hostile input. Design for those and the happy path takes care of itself.",
    },
    {
      title: "Systems over screens",
      body: "A page is a snapshot. A system is what lets the twentieth page cost the same as the second. I build the vocabulary before I build the views.",
    },
    {
      title: "Measured, not guessed",
      body: "Performance and accessibility claims are only worth making with numbers attached. Instrument before, instrument after, and publish the delta.",
    },
  ],
} as const;

/* ═══════════════════════════════  WORK  ═══════════════════════════════ */

export const projects: readonly Project[] = [
  {
    slug: "looking-to-hire",
    title: "Looking to Hire",
    year: "2025",
    role: "Mobile Engineer (Flutter)",
    duration: "Ongoing",
    category: "Mobile",
    featured: true,
    summary: "Smarter job matching and hiring platform for connecting talent and employers",
    detail:
      "A modern iOS & Android job search and recruitment app connecting job seekers and employers. Features personalized recommendations, one-tap applications, secure in-app messaging, and profile management.",
    stack: ["Flutter", "Dart", "REST API", "Firebase", "Node.js", "MongoDB"],
    href: "https://apps.apple.com/ng/app/looking-to-hire-job-search/id6752956415",
    repo: null,
    image: {
      src: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/e2/d5/2e/e2d52eee-74e4-5e2c-03b0-bef31f9bee20/Simulator_Screenshot_-_iPhone_16e_-_2025-12-03_at_11.41.04.png/600x1300bb.png",
      alt: "Looking to Hire app - Home screen with job recommendations",
    },
    context:
      "The job market in Nigeria and across Africa is fragmented, with job seekers struggling to find the right opportunities and employers unable to discover qualified talent. Traditional job boards lack personalization and real-time communication, creating friction in both hiring and application workflows.",
    sections: [
      {
        heading: "Product Vision",
        body: "Build a mobile-first job platform that modernizes talent discovery and recruitment. The platform needed to balance dual user needs: job seekers seeking personalized opportunities with one-tap application, and employers looking to hire qualified talent efficiently. Real-time messaging replaces email delays, and profile visibility creates mutual discovery.",
      },
      {
        heading: "Core Features",
        body: "Job seekers build professional profiles and upload resumes in minutes, discovering personalized job opportunities based on skills and experience. One-tap applications with application tracking, secure in-app messaging for direct employer communication, and saved jobs for later consideration. Employers browse qualified candidates, post jobs targeting specific skills, and communicate directly with applicants.",
      },
      {
        heading: "User Experience",
        body: "Clean, intuitive iOS interface designed for mobile-first job hunting. Smooth navigation between job discovery, applications, messaging, and profile management. Push notifications keep users informed of new matches and messages. Optimized for both quick browsing during commutes and deep profile reviews.",
      },
    ],
    architecture: [
      "iOS · Swift with UIKit and modern concurrency",
      "REST API · Job matching and user management endpoints",
      "Firebase · Real-time messaging and push notifications",
      "CoreData · Local profile and application caching",
    ],
    challenges: [
      {
        problem: "Real-time messaging at scale with unreliable connections in emerging markets required robust offline-to-online transitions.",
        resolution: "Implemented local message queuing with Firebase Realtime Database sync, ensuring messages persist locally and transmit when connectivity restores.",
      },
      {
        problem: "Job matching relevance required understanding both job requirements and candidate skills across varying profile completeness.",
        resolution: "Built progressive profiling where users unlock better matches as they complete their profiles, creating incentive for engagement while improving recommendation quality.",
      },
      {
        problem: "Resume parsing from diverse formats and languages needed to extract meaningful job-matching signals.",
        resolution: "Combined rule-based parsing for common formats with keyword extraction, falling back to user-guided tagging for ambiguous sections.",
      },
    ],
    metrics: [],
  },
];

export const featuredProject = projects.find((p) => p.featured) ?? projects[0];

/* ═══════════════════════════════  METHOD  ═══════════════════════════════ */

export const process: readonly ProcessStep[] = [
  {
    n: "01",
    title: "Frame",
    description:
      "Find the actual problem behind the requested feature. Most briefs describe a solution someone already picked; the work starts by testing whether it is the right one.",
    outputs: ["Problem statement", "Success criteria", "Explicit non-goals"],
  },
  {
    n: "02",
    title: "Shape",
    description:
      "Decide the architecture and the vocabulary before writing views. Data model, boundaries, failure modes — the decisions that are expensive to reverse later.",
    outputs: ["Data model", "Interface contracts", "Risk list"],
  },
  {
    n: "03",
    title: "Build",
    description:
      "Vertical slices, shipped continuously. Each slice goes all the way from interface to persistence so integration risk surfaces in week one rather than week ten.",
    outputs: ["Working increments", "Test coverage", "Deploy pipeline"],
  },
  {
    n: "04",
    title: "Harden",
    description:
      "The edges: empty states, slow networks, hostile input, screen readers. Measured against real budgets rather than a local machine on fibre.",
    outputs: ["Performance budget", "Accessibility audit", "Error handling"],
  },
  {
    n: "05",
    title: "Hand over",
    description:
      "Documentation written for the engineer who inherits it, instrumentation that answers questions without me, and a runbook for the things that break at 3am.",
    outputs: ["Architecture notes", "Dashboards", "Runbook"],
  },
];

/* ═══════════════════════════════  STACK  ═══════════════════════════════ */

/**
 * Rings, honestly assigned:
 *   Daily    — reach for it without thinking
 *   Fluent   — productive from day one
 *   Working  — shipped with it, would need a warm-up
 *   Watching — tracking it, not yet in production
 */
export const stack: readonly StackEntry[] = [
  { name: "TypeScript", ring: "Daily", domain: "Interface", note: "Strict mode or it isn't worth having." },
  { name: "React", ring: "Daily", domain: "Interface" },
  { name: "Next.js", ring: "Daily", domain: "Interface", note: "Server components by default; client where interaction demands it." },
  { name: "Tailwind CSS", ring: "Daily", domain: "Interface", note: "Tokens in the theme layer, never magic values in markup." },
  { name: "Design systems", ring: "Fluent", domain: "Interface" },
  { name: "Framer Motion", ring: "Working", domain: "Interface", note: "Reached for only when CSS genuinely cannot." },

  { name: "Node.js", ring: "Daily", domain: "Platform" },
  { name: "PostgreSQL", ring: "Daily", domain: "Platform", note: "Indexes and query plans before caches." },
  { name: "REST & GraphQL", ring: "Fluent", domain: "Platform" },
  { name: "Auth & sessions", ring: "Fluent", domain: "Platform" },
  { name: "Redis", ring: "Fluent", domain: "Platform" },
  { name: "Event-driven design", ring: "Working", domain: "Platform" },

  { name: "React Native", ring: "Fluent", domain: "Mobile" },
  { name: "Expo", ring: "Fluent", domain: "Mobile" },
  { name: "Offline-first sync", ring: "Fluent", domain: "Mobile", note: "The queue and the conflict rule are the whole design." },
  { name: "Flutter", ring: "Working", domain: "Mobile" },

  { name: "Vercel", ring: "Daily", domain: "Operations" },
  { name: "CI/CD", ring: "Fluent", domain: "Operations" },
  { name: "Core Web Vitals", ring: "Fluent", domain: "Operations", note: "Field data over lab data, always." },
  { name: "Observability", ring: "Working", domain: "Operations" },
  { name: "Edge runtimes", ring: "Watching", domain: "Operations" },
];

export const stackRings: readonly StackRing[] = ["Daily", "Fluent", "Working", "Watching"];

/* ═══════════════════════════════  TRAJECTORY  ═══════════════════════════════ */

/** TODO(slot): replace with your real history — this is the section recruiters read closest. */
export const timeline: readonly TimelineEntry[] = [
  {
    period: "2024 — Present",
    role: "Software Engineer",
    org: "Independent",
    href: null,
    summary:
      "Contract product engineering for startups and enterprise teams across fintech, healthcare, and e-commerce.",
    highlights: [
      "End-to-end delivery from data model through deployment",
      "Design-system work that outlived the projects it shipped in",
      "Performance and accessibility remediation on inherited codebases",
    ],
  },
  {
    period: "2022 — 2024",
    role: "Frontend Engineer",
    org: "Product teams",
    href: null,
    summary:
      "Interface and platform work on high-growth products, with a focus on the parts that decide whether a release survives its first week.",
    highlights: [
      "Component libraries adopted across multiple product surfaces",
      "Offline-first mobile features for unreliable-connectivity markets",
      "Instrumentation that turned performance arguments into measurements",
    ],
  },
  {
    period: "2021 — 2022",
    role: "Junior Engineer",
    org: "Early-stage startups",
    href: null,
    summary:
      "Shipped across the stack in small teams where the person who wrote the query also carried the pager.",
    highlights: [
      "Full-stack feature ownership from day one",
      "Learned production the way it is usually learned — by breaking it",
    ],
  },
];

/* ═══════════════════════════════  PROOF  ═══════════════════════════════ */
/* All empty by design — see note 3 at the top of this file. Each section is  */
/* fully built and renders the moment it has entries.                        */

/** TODO(slot): real quotes from real people, with links so they're verifiable. */
export const testimonials: readonly Testimonial[] = [];

/** TODO(slot): awards you actually hold. */
export const awards: readonly Award[] = [];

/** TODO(slot): certifications, with credential URLs. */
export const certifications: readonly Certification[] = [];

/** TODO(slot): open source you've contributed to, with PR or repo links. */
export const openSource: readonly OpenSource[] = [];

/** TODO(slot): talks, workshops, podcasts. */
export const speaking: readonly Speaking[] = [];

/** TODO(slot): engineering writing. Each entry becomes a search-index row. */
export const writing: readonly Writing[] = [];

/* ═══════════════════════════════  CONTACT  ═══════════════════════════════ */

/**
 * Three channels, all live.
 *
 * Trimmed from six: X, Telegram and Phone were placeholder rows pointing at
 * nothing. A contact list padded with dead entries reads as less credible than
 * a short one where every row resolves — and each of these also feeds the
 * search index and the assistant's grounding, where an unlinked row is inert.
 */
export const socials: readonly Social[] = [
  {
    kind: "email",
    label: "Email",
    handle: "nwalikelvin387@gmail.com",
    href: "mailto:nwalikelvin387@gmail.com",
  },
  {
    kind: "github",
    label: "GitHub",
    handle: "Kelvin-Kelechi",
    href: "https://github.com/Kelvin-Kelechi",
  },
  {
    kind: "linkedin",
    label: "LinkedIn",
    handle: "anyigor-kelvin",
    href: "https://linkedin.com/in/anyigor-kelvin",
  },
];

export const contact = {
  headline: "Let's build something worth shipping.",
  /** Sits under the headline. One sentence — the section closes, not opens. */
  standfirst:
    "Open to frontend and product engineering roles, freelance builds, and the kind of problem that does not have an obvious answer yet. Tell me what you are working on.",
  email: "nwalikelvin387@gmail.com" as string | null,
  /** Sets expectations. Recruiters notice when this is stated. */
  responseTime: "Replies within 24 hours",
  /** The primary call to action. */
  cta: "Start a conversation",
} as const;

/* ═══════════════════════════════  NAVIGATION  ═══════════════════════════════ */

export const nav = [
  { href: "#ethos", label: "Ethos", n: "01" },
  { href: "#work", label: "Work", n: "02" },
  { href: "#method", label: "Method", n: "03" },
  { href: "#stack", label: "Stack", n: "04" },
  { href: "#trajectory", label: "Trajectory", n: "05" },
  /* 06 is Proof, which is conditional on having data and is not a nav item.
     The on-page numbers stay continuous once it is populated. */
  { href: "#contact", label: "Contact", n: "07" },
] as const;

/** Rendered in the shortcuts sheet (press ?) and handled in KeyboardShortcuts. */
export const shortcuts = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["/"], label: "Search" },
  { keys: ["T"], label: "Toggle theme" },
  { keys: ["?"], label: "Show shortcuts" },
  { keys: ["G", "then", "W"], label: "Go to work" },
  { keys: ["G", "then", "C"], label: "Go to contact" },
  { keys: ["Esc"], label: "Close overlay" },
] as const;
