import { WorkPageClient } from "@/components/pages/work-page-client";
import { fallbackCaseStudies } from "@/lib/content/fallback-data";
import { getCaseStudies } from "@/lib/sanity/fetchers";
import type { CaseStudy } from "@/types";

export default async function WorkPage() {
  let projects: CaseStudy[] = fallbackCaseStudies;

  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await getCaseStudies();
      if (data.length > 0) {
        projects = data;
      }
    } catch {
      projects = fallbackCaseStudies;
    }
  }

  return <WorkPageClient projects={projects} />;
}
