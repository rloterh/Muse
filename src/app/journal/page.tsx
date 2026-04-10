import { JournalPageClient } from "@/components/pages/journal-page-client";
import { resolveJournalPosts } from "@/lib/content/resolvers";

export default async function JournalPage() {
  const posts = await resolveJournalPosts();

  return <JournalPageClient posts={posts} />;
}
