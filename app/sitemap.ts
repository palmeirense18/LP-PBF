import type { MetadataRoute } from "next";

// TODO: replace pbfmachine.com with the production domain after Vercel setup.
const SITE_URL = "https://pbfmachine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
