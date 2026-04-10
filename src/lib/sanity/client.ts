import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

type ImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

let sanityClient: SanityClient | null = null;

export function hasSanityEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET
  );
}

function getSanityClient() {
  if (!hasSanityEnv()) {
    throw new Error("Sanity environment variables are not configured.");
  }

  if (!sanityClient) {
    sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-12-01",
      useCdn: true,
    });
  }

  return sanityClient;
}

export function urlFor(source: ImageSource) {
  return imageUrlBuilder(getSanityClient()).image(source);
}

export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: { next?: { revalidate?: number } }
): Promise<T> {
  return getSanityClient().fetch<T>(query, params ?? {}, options);
}

// ============================================
// GROQ QUERIES
// ============================================

export const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(year desc) {
  _id, title, slug, client, excerpt, year, sector, engagement, featured, status, deliverables,
  services[]->{ _id, title },
  coverImage, color,
  "imageCount": count(gallery)
}`;

export const CASE_STUDY_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id, title, slug, client, excerpt, year, color, sector, engagement, featured, status, deliverables,
  outcomes[]{ label, value, context },
  services[]->{ _id, title, slug },
  coverImage, gallery[]{asset, alt, caption},
  challenge, approach, results, timeline, teamSize, scope,
  projectFacts[]{ label, value, detail },
  milestones[]{ phase, title, summary },
  links[]{ label, href },
  testimonial{ quote, author, role },
  nextProject->{ title, slug, coverImage }
}`;

export const TEAM_QUERY = `*[_type == "teamMember"] | order(order asc) {
  _id, name, role, bio, photo, social
}`;

export const SERVICES_QUERY = `*[_type == "service"] | order(order asc) {
  _id, title, slug, description, icon, features, deliveryModel,
  faqs[]{ question, answer }
}`;

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  heroHeadline, heroSubline,
  featuredWork[]->{ _id, title, slug, client, coverImage, color, year, sector, engagement, featured, status },
  clientLogos[]{asset, alt},
  testimonials[]{ quote, author, role, company }
}`;
