import {
  getCaseStudies,
  getCaseStudy,
  getHomepageData,
  getJournalPost,
  getJournalPosts,
  getServices,
  getTeamMembers,
} from "@/lib/sanity/fetchers";
import { hasSanityEnv } from "@/lib/sanity/client";
import {
  fallbackCaseStudies,
  fallbackHomepage,
  fallbackJournalPosts,
  fallbackServices,
  fallbackTeamMembers,
} from "@/lib/content/fallback-data";
import type { CaseStudy, Homepage, JournalPost, Service } from "@/types";

export async function resolveHomepageContent() {
  let homepage: Homepage = fallbackHomepage;
  let services: Service[] = fallbackServices;

  if (!hasSanityEnv()) {
    return { homepage, services };
  }

  try {
    const [homepageData, servicesData] = await Promise.all([getHomepageData(), getServices()]);

    if (homepageData) {
      homepage = {
        ...fallbackHomepage,
        ...homepageData,
        featuredWork: homepageData.featuredWork?.length
          ? homepageData.featuredWork
          : fallbackHomepage.featuredWork,
        clientLogos: homepageData.clientLogos?.length ? homepageData.clientLogos : undefined,
        testimonials: homepageData.testimonials?.length
          ? homepageData.testimonials
          : fallbackHomepage.testimonials,
      };
    }

    if (servicesData.length > 0) {
      services = servicesData;
    }
  } catch {
    homepage = fallbackHomepage;
    services = fallbackServices;
  }

  return { homepage, services };
}

export async function resolveCaseStudies() {
  if (!hasSanityEnv()) {
    return fallbackCaseStudies;
  }

  try {
    const data = await getCaseStudies();
    return data.length > 0 ? data : fallbackCaseStudies;
  } catch {
    return fallbackCaseStudies;
  }
}

export async function resolveCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (!hasSanityEnv()) {
    return fallbackCaseStudies.find((item) => item.slug.current === slug) ?? null;
  }

  try {
    const data = await getCaseStudy(slug);
    return data ?? fallbackCaseStudies.find((item) => item.slug.current === slug) ?? null;
  } catch {
    return fallbackCaseStudies.find((item) => item.slug.current === slug) ?? null;
  }
}

export async function resolveTeamMembers() {
  if (!hasSanityEnv()) {
    return fallbackTeamMembers;
  }

  try {
    const data = await getTeamMembers();
    return data.length > 0 ? data : fallbackTeamMembers;
  } catch {
    return fallbackTeamMembers;
  }
}

export async function resolveServices() {
  if (!hasSanityEnv()) {
    return fallbackServices;
  }

  try {
    const data = await getServices();
    return data.length > 0 ? data : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export async function resolveJournalPosts() {
  if (!hasSanityEnv()) {
    return fallbackJournalPosts;
  }

  try {
    const data = await getJournalPosts();
    return data.length > 0 ? data : fallbackJournalPosts;
  } catch {
    return fallbackJournalPosts;
  }
}

export async function resolveJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  if (!hasSanityEnv()) {
    return fallbackJournalPosts.find((item) => item.slug.current === slug) ?? null;
  }

  try {
    const data = await getJournalPost(slug);
    return data ?? fallbackJournalPosts.find((item) => item.slug.current === slug) ?? null;
  } catch {
    return fallbackJournalPosts.find((item) => item.slug.current === slug) ?? null;
  }
}
