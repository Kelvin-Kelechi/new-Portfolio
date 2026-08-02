import Image from "next/image";
import type { Project } from "@/app/lib/content";

/**
 * The visual for a project — a screenshot when one exists, otherwise a
 * typographic plate.
 *
 * The fallback is the design, not a placeholder to apologise for: year, title,
 * and stack set on the accent wash, which reads as a deliberate index card
 * rather than a missing image. Adding a real `image` to a Project later
 * changes nothing here.
 */
export default function Plate({
  project,
  sizes = "15rem",
  priority = false,
  tone = "var(--sky)",
  motif = false,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
  /**
   * Fill for the typographic fallback. Passed in rather than fixed, because
   * five plates hardcoded to the same blue is what made the old index read as
   * one project repeated five times. Any value from the bright fill set works —
   * they all carry the `.on-color` ink contract.
   */
  tone?: string;
  /**
   * Draws the abstract interface blocks. Off by default: at the 15rem
   * thumbnail size used elsewhere they collapse into noise, and the plate is
   * better read as a clean index card there. On for the showcase, where the
   * plate is over 1000px wide.
   */
  motif?: boolean;
}) {
  if (project.image) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-paper-sunk">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  /* The fallback plate now carries a real fill rather than a wash of the
     accent — in a palette this saturated, a 14%-alpha tint reads as an
     unfinished state instead of a designed one. */
  return (
    <div
      className="on-color relative flex h-full w-full flex-col justify-between overflow-hidden p-5"
      style={{ background: tone }}
    >
      {/* A faint rule grid, so the plate has texture at large sizes rather
          than reading as a flat swatch. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)",
          backgroundSize: "2.5rem 2.5rem",
        }}
      />

      {/*
        An abstract interface motif.

        At index-thumbnail size the year/title/stack is enough, but blown up to
        1100px in a browser frame the same three lines leave an enormous flat
        field of saturated colour — the plate stops reading as "a product" and
        starts reading as "a swatch". These blocks give it the *shape* of an
        interface at a glance.

        Deliberately geometric and wordless. The moment this carries fake chart
        values or invented copy it becomes a fabricated screenshot, which is
        exactly the claim a portfolio cannot afford to have checked. Blocks in
        tints of the surface read as a wireframe, which is honest about being a
        stand-in until a real screenshot lands in `project.image`.
      */}
      {motif && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
        >
          <span className="absolute left-[6%] top-[16%] h-[7%] w-[22%] rounded-full bg-ink" />
          <span className="absolute left-[6%] top-[30%] h-[46%] w-[22%] rounded-xl bg-ink" />
          <span className="absolute left-[32%] top-[16%] h-[26%] w-[30%] rounded-xl bg-ink" />
          <span className="absolute left-[66%] top-[16%] h-[26%] w-[28%] rounded-xl bg-ink" />
          <span className="absolute left-[32%] top-[48%] h-[28%] w-[62%] rounded-xl bg-ink" />
        </span>
      )}

      <span className="label relative">{project.year}</span>

      <span
        className="text-title relative leading-[1.05] text-ink"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {project.title}
      </span>

      <span className="label rule-t relative pt-3 text-ink-muted">
        {project.stack.slice(0, 3).join(" · ")}
      </span>
    </div>
  );
}
