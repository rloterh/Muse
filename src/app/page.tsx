import { HomePageClient } from "@/components/pages/home-page-client";
import { fallbackHomepage, fallbackServices } from "@/lib/content/fallback-data";
import { getHomepageData, getServices } from "@/lib/sanity/fetchers";
import type { Homepage, Service } from "@/types";

export default async function HomePage() {
  let homepage: Homepage = fallbackHomepage;
  let services: Service[] = fallbackServices;

  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const [homepageData, servicesData] = await Promise.all([
        getHomepageData(),
        getServices(),
      ]);

      if (homepageData) {
        homepage = {
          ...fallbackHomepage,
          ...homepageData,
          featuredWork: homepageData.featuredWork?.length ? homepageData.featuredWork : fallbackHomepage.featuredWork,
          clientLogos: homepageData.clientLogos?.length ? homepageData.clientLogos : undefined,
          testimonials: homepageData.testimonials?.length ? homepageData.testimonials : fallbackHomepage.testimonials,
        };
      }

      if (servicesData.length > 0) {
        services = servicesData;
      }
    } catch {
      homepage = fallbackHomepage;
      services = fallbackServices;
    }
  }

  return <HomePageClient homepage={homepage} services={services} />;
}
