import { ImageResponse } from "next/og";
import { site } from "@/app/lib/content";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The link preview, generated at build time.
 *
 * Drawn rather than photographed so it stays correct when the content file
 * changes, and so it needs no binary asset in the repo. Everything here uses
 * system-available fonts and flat fills — `next/og` renders a Satori subset,
 * not a browser, so gradients on text and most modern CSS silently do nothing.
 */
export default function Image() {
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
          position: "relative",
        }}
      >
        {/* Sticker, matching the hero. Static here — an OG image is a single
            rendered frame, so motion has nowhere to go. */}
        <div
          style={{
            position: "absolute",
            top: 150,
            right: 86,
            width: 128,
            height: 128,
            borderRadius: 999,
            background: "#ffc93c",
            border: "4px solid #16150f",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 99,
              background: "#ff6f4d",
              border: "2px solid #16150f",
            }}
          />
          {site.availability} — {site.location}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 122, lineHeight: 1, letterSpacing: -4, fontWeight: 800 }}>
            {site.firstName}
          </div>
          <div style={{ fontSize: 122, lineHeight: 1, letterSpacing: -4, fontWeight: 800 }}>
            {site.lastName}
          </div>
          {/* The coral pill from the hero, so a shared link and the page it
              opens read as the same object. */}
          <div style={{ display: "flex", marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                background: "#ff6f4d",
                color: "#16150f",
                border: "4px solid #16150f",
                borderRadius: 999,
                padding: "10px 34px 16px",
                fontSize: 62,
                fontWeight: 800,
                letterSpacing: -1,
                boxShadow: "8px 8px 0 0 #16150f",
              }}
            >
              {site.role}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(22,21,15,0.18)",
            paddingTop: 26,
            fontSize: 24,
            fontFamily: "monospace",
            letterSpacing: 1,
          }}
        >
          <div style={{ display: "flex" }}>{site.pitch}</div>
          <div style={{ display: "flex" }}>{site.yearsExperience}+ years</div>
        </div>
      </div>
    ),
    size,
  );
}
