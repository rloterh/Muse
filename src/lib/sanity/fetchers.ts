import {
  CASE_STUDIES_QUERY,
  CASE_STUDY_QUERY,
  HOMEPAGE_QUERY,
  JOURNAL_POST_QUERY,
  JOURNAL_POSTS_QUERY,
  SERVICES_QUERY,
  TEAM_QUERY,
  fetchSanity,
} from "./client";
import type { CaseStudy, Homepage, JournalPost, Service, TeamMember } from "@/types";

async function fetchCached<T>(
  query: string,
  params?: Record<string, unknown>,
  revalidate = 60
): Promise<T> {
  return fetchSanity<T>(query, params ?? {}, {
    next: { revalidate },
  });
}

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
  return studies.map((study) => study.slug.current);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return fetchCached<TeamMember[]>(TEAM_QUERY);
}

export async function getServices(): Promise<Service[]> {
  return fetchCached<Service[]>(SERVICES_QUERY);
}

export async function getJournalPosts(): Promise<JournalPost[]> {
  return fetchCached<JournalPost[]>(JOURNAL_POSTS_QUERY);
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  return fetchCached<JournalPost | null>(JOURNAL_POST_QUERY, { slug }, 30);
}

export function caseStudyMetadata(study: CaseStudy) {
  return {
    title: `${study.title} - ${study.client}`,
    description: study.excerpt ?? `Case study: ${study.title} for ${study.client}`,
    openGraph: {
      title: study.title,
      description: study.excerpt ?? "",
      type: "article" as const,
    },
  };
}
