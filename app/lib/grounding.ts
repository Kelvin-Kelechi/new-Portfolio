import {
  site,
  ethos,
  projects,
  process,
  stack,
  timeline,
  testimonials,
  awards,
  certifications,
  openSource,
  speaking,
  writing,
  socials,
  contact,
} from "@/app/lib/content";

/**
 * Serialises the entire site into the reference block the assistant reads.
 *
 * Derived from the same content module the pages render, so the assistant's
 * knowledge and the visible site can never drift apart — updating a project
 * updates what the assistant knows in the same commit.
 *
 * Empty sections are rendered explicitly as "none published" rather than
 * omitted. That is deliberate: a model that simply does not see a
 * testimonials section is more likely to improvise one than a model told, in
 * so many words, that there are none.
 */
export function buildGrounding(): string {
  const parts: string[] = [];

  parts.push(
    section("Identity", [
      `Name: ${site.name}`,
      `Role: ${site.role}`,
      `Positioning: ${site.pitch}`,
      `Location: ${site.location} (${site.timezone})`,
      `Years of experience: ${site.yearsExperience}`,
      `Industries: ${site.industries.join(", ")}`,
      `Specialties: ${site.specialties.join(", ")}`,
      `Availability: ${site.available ? site.availability : "Not currently available"}`,
      `Response time: ${contact.responseTime}`,
      `CV: available at ${site.resume.href} (${site.resume.meta})`,
    ]),
  );

  parts.push(
    section("How he describes his work", [ethos.lede, ...ethos.body]),
  );

  parts.push(
    section(
      "Principles",
      ethos.principles.map((p) => `${p.title}: ${p.body}`),
    ),
  );

  parts.push(
    section(
      "Projects",
      projects.map((project) => {
        const lines = [
          `### ${project.title} (${project.year})`,
          `Slug for links: /work/${project.slug}`,
          `Role: ${project.role} · Duration: ${project.duration} · Category: ${project.category}`,
          `Summary: ${project.summary}`,
          `Detail: ${project.detail}`,
          `Stack: ${project.stack.join(", ")}`,
          `Context: ${project.context}`,
          ...project.sections.map((s) => `${s.heading}: ${s.body}`),
          `Architecture: ${project.architecture.join(" → ")}`,
          ...project.challenges.map(
            (c) => `Challenge: ${c.problem} Resolution: ${c.resolution}`,
          ),
          project.metrics.length
            ? `Measured outcomes: ${project.metrics
                .map(
                  (m) =>
                    `${m.label} ${m.value}${m.from ? ` (from ${m.from})` : ""}`,
                )
                .join("; ")}`
            : "Measured outcomes: none published for this project. Do not state or estimate any numbers for it.",
          project.href
            ? `Live: ${project.href}`
            : "Live link: not published yet.",
        ];
        return lines.join("\n");
      }),
    ),
  );

  parts.push(
    section(
      "How he works (his stated process)",
      process.map(
        (step) =>
          `${step.n} ${step.title}: ${step.description} Produces: ${step.outputs.join(", ")}.`,
      ),
    ),
  );

  parts.push(
    section(
      "Technology, by familiarity",
      ["Rings: Daily = reaches for it without thinking; Fluent = productive immediately; Working = has shipped with it; Watching = tracking, not yet in production.",
        ...stack.map(
          (entry) =>
            `${entry.name} — ${entry.ring}, ${entry.domain}${entry.note ? `. Note: ${entry.note}` : ""}`,
        )],
    ),
  );

  parts.push(
    section(
      "Career history",
      timeline.map(
        (entry) =>
          `${entry.period} — ${entry.role}, ${entry.org}. ${entry.summary} Highlights: ${entry.highlights.join("; ")}.`,
      ),
    ),
  );

  parts.push(
    section(
      "Testimonials",
      testimonials.length
        ? testimonials.map(
            (t) => `"${t.quote}" — ${t.name}, ${t.title} at ${t.org}`,
          )
        : ["None published. Do not invent or paraphrase any quote or endorsement."],
    ),
  );

  parts.push(
    section(
      "Awards, certifications, open source, speaking, writing",
      [
        listOrNone("Awards", awards.map((a) => `${a.year} ${a.title} — ${a.org}`)),
        listOrNone(
          "Certifications",
          certifications.map((c) => `${c.year} ${c.title} — ${c.org}`),
        ),
        listOrNone(
          "Open source",
          openSource.map((o) => `${o.name} (${o.role}): ${o.description}`),
        ),
        listOrNone(
          "Speaking",
          speaking.map((s) => `${s.year} ${s.title} at ${s.event}`),
        ),
        listOrNone(
          "Writing",
          writing.map((w) => `${w.date} ${w.title}: ${w.summary}`),
        ),
      ],
    ),
  );

  const linked = socials.filter((social) => social.href);
  parts.push(
    section("Contact", [
      contact.email
        ? `Email: ${contact.email}`
        : "Email: not published on the site yet. Direct visitors to the contact section.",
      linked.length
        ? `Links: ${linked.map((s) => `${s.label} (${s.handle})`).join(", ")}`
        : "Social links: none published yet. Do not guess usernames or URLs.",
      `Contact headline on the site: "${contact.headline}"`,
    ]),
  );

  return parts.join("\n\n");
}

function section(heading: string, lines: readonly string[]): string {
  return `## ${heading}\n${lines.join("\n")}`;
}

function listOrNone(label: string, entries: readonly string[]): string {
  return entries.length
    ? `${label}: ${entries.join("; ")}`
    : `${label}: none published. Do not invent any.`;
}
