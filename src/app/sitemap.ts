import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://muse.agency";

// Static project slugs (fallback when Sanity not configured)
const STATIC_SLUGS = ["luminary", "prism", "vanta", "echo", "meridian", "terraform"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Try to get slugs from Sanity
  let caseSlugs = STATIC_SLUGS;
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      const { getCaseStudySlugs } = await import("@/lib/sanity/fetchers");
      const slugs = await getCaseStudySlugs();
      if (slugs.length > 0) caseSlugs = slugs;
    }
  } catch {}

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const caseStudyPages: MetadataRoute.Sitemap = caseSlugs.map((slug) => ({
    url: `${BASE_URL}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...caseStudyPages];
}
