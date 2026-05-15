// @AI_GENERATED
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/"],
    },
    sitemap: "https://ideawall-kappa.vercel.app/sitemap.xml",
  };
}
// @AI_GENERATED: end
