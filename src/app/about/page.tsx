import { AboutPageClient } from "@/components/pages/about-page-client";
import { resolveTeamMembers } from "@/lib/content/resolvers";

export default async function AboutPage() {
  const team = await resolveTeamMembers();

  return <AboutPageClient team={team} />;
}
