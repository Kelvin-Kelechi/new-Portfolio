import { ImageResponse } from "next/og";
import { projects, site } from "@/app/lib/content";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Pre-render one preview per case study rather than generating on request. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * Per-project link preview. A case study shared into Slack or LinkedIn shows
 * its own title, stack, and year instead of the generic site card — which is
 * the difference between a link that gets clicked and one that gets scrolled
 * past.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fdfbf7",
          color: "#16150f",
          padding: "68px 76px",
          fontFamily: "Trebuchet MS, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex" }}>
            {project ? `${project.year} · ${project.role}` : "Case study"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1.02,
              letterSpacing: -3,
              fontWeight: 800,
            }}
          >
            {project?.title ?? "Case study"}
          </div>
          <div
            style={{ fontSize: 34, color: "rgba(22,21,15,0.72)", display: "flex" }}
          >
            {project?.summary ?? ""}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            borderTop: "2px solid rgba(22,21,15,0.18)",
            paddingTop: 28,
          }}
        >
          {(project?.stack ?? []).slice(0, 5).map((technology) => (
            <div
              key={technology}
              style={{
                display: "flex",
                border: "2px solid #16150f",
                borderRadius: 99,
                padding: "10px 22px",
                fontSize: 22,
                fontFamily: "monospace",
              }}
            >
              {technology}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
