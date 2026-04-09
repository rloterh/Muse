import { AboutPageClient } from "@/components/pages/about-page-client";
import { fallbackTeamMembers } from "@/lib/content/fallback-data";
import { getTeamMembers } from "@/lib/sanity/fetchers";
import type { TeamMember } from "@/types";

export default async function AboutPage() {
  let team: TeamMember[] = fallbackTeamMembers;

  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await getTeamMembers();
      if (data.length > 0) {
        team = data;
      }
    } catch {
      team = fallbackTeamMembers;
    }
  }

  return <AboutPageClient team={team} />;
}
