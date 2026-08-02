import type { MetadataRoute } from "next";
import { site } from "@/app/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The assistant endpoint is a POST-only streaming route; there is
         nothing there for a crawler to index and every fetch costs tokens. */
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
