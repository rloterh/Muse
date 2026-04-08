import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-12-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: any) { return builder.image(source); }

export async function fetchSanity<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {});
}

// ============================================
// GROQ QUERIES
// ============================================

export const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(year desc) {
  _id, title, slug, client, excerpt, year,
  services[]->{ _id, title },
  coverImage, color,
  "imageCount": count(gallery)
}`;

export const CASE_STUDY_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id, title, slug, client, excerpt, year, color,
  services[]->{ _id, title, slug },
  coverImage, gallery[]{asset, alt, caption},
  challenge, approach, results,
  testimonial{ quote, author, role },
  nextProject->{ title, slug, coverImage }
}`;

export const TEAM_QUERY = `*[_type == "teamMember"] | order(order asc) {
  _id, name, role, bio, photo, social
}`;

export const SERVICES_QUERY = `*[_type == "service"] | order(order asc) {
  _id, title, slug, description, icon, features
}`;

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  heroHeadline, heroSubline,
  featuredWork[]->{ _id, title, slug, client, coverImage, color, year },
  clientLogos[]{asset, alt},
  testimonials[]{ quote, author, role, company }
}`;
