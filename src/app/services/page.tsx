import { ServicesPageClient } from "@/components/pages/services-page-client";
import { resolveServices } from "@/lib/content/resolvers";

export default async function ServicesPage() {
  const services = await resolveServices();

  return <ServicesPageClient services={services} />;
}
