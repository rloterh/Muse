import { sanityClient, CASE_STUDIES_QUERY, CASE_STUDY_QUERY, TEAM_QUERY, SERVICES_QUERY, HOMEPAGE_QUERY } from "./client";
import type { CaseStudy, Service, TeamMember, Homepage } from "@/types";

/**
 * Fetch with ISR revalidation.
 * In production, content revalidates every 60 seconds.
 */
async function fetchCached<T>(query: string, params?: Record<string, unknown>, revalidate = 60): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {}, {
    next: { revalidate },
  });
}

// ============================================
// PAGE DATA FETCHERS
// ============================================

export async function getHomepageData(): Promise<Homepage | null> {
  return fetchCached<Homepage | null>(HOMEPAGE_QUERY);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return fetchCached<CaseStudy[]>(CASE_STUDIES_QUERY);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  return fetchCached<CaseStudy | null>(CASE_STUDY_QUERY, { slug }, 30);
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const studies = await fetchCached<{ slug: { current: string } }[]>(
    `*[_type == "caseStudy"]{ slug }`
  );
  return studies.map((s) => s.slug.current);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return fetchCached<TeamMember[]>(TEAM_QUERY);
}

export async function getServices(): Promise<Service[]> {
  return fetchCached<Service[]>(SERVICES_QUERY);
}

// ============================================
// METADATA HELPERS
// ============================================

export function caseStudyMetadata(study: CaseStudy) {
  return {
    title: `${study.title} — ${study.client}`,
    description: study.excerpt ?? `Case study: ${study.title} for ${study.client}`,
    openGraph: {
      title: study.title,
      description: study.excerpt ?? "",
      type: "article" as const,
    },
  };
}
