import type { MetadataRoute } from "next";

// TODO: replace pbfmachine.com with the production domain after Vercel setup.
const SITE_URL = "https://pbfmachine.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
