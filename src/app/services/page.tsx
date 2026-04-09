import { ServicesPageClient } from "@/components/pages/services-page-client";
import { fallbackServices } from "@/lib/content/fallback-data";
import { getServices } from "@/lib/sanity/fetchers";
import type { Service } from "@/types";

export default async function ServicesPage() {
  let services: Service[] = fallbackServices;

  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await getServices();
      if (data.length > 0) {
        services = data;
      }
    } catch {
      services = fallbackServices;
    }
  }

  return <ServicesPageClient services={services} />;
}
