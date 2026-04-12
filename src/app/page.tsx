import { HomePageClient } from "@/components/pages/home-page-client";
import { resolveHomepageContent } from "@/lib/content/resolvers";

export default async function HomePage() {
  const { homepage, services } = await resolveHomepageContent();

  return <HomePageClient homepage={homepage} services={services} />;
}
