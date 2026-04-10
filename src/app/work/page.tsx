import { WorkPageClient } from "@/components/pages/work-page-client";
import { resolveCaseStudies } from "@/lib/content/resolvers";

export default async function WorkPage() {
  const projects = await resolveCaseStudies();

  return <WorkPageClient projects={projects} />;
}
