import { ServicesPageClient } from "@/components/pages/services-page-client";
import { isStripeConfigured } from "@/lib/billing/env";
import { resolveServices } from "@/lib/content/resolvers";
import { siteSettings } from "@/lib/site/config";

export default async function ServicesPage() {
  const services = await resolveServices();
  const checkoutEnabled = isStripeConfigured();

  return (
    <ServicesPageClient
      services={services}
      retainerPlans={siteSettings.retainerPlans}
      checkoutEnabled={checkoutEnabled}
    />
  );
}
