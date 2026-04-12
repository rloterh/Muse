import { WorkPageClient } from "@/components/pages/work-page-client";
import { resolveCaseStudies } from "@/lib/content/resolvers";
import { getModerationQueue } from "@/lib/moderation/repository";

export default async function WorkPage() {
  const [projects, moderationTasks] = await Promise.all([
    resolveCaseStudies(),
    getModerationQueue(),
  ]);

  return <WorkPageClient projects={projects} moderationTasks={moderationTasks} />;
}
