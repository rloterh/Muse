import type { CaseStudy, Service } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://muse.agency";

export function organizationJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Muse Creative Agency",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: "We craft digital experiences that move people. Strategy, design, and technology for brands that refuse to blend in.",
    foundingDate: "2017",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brooklyn",
      addressRegion: "NY",
      addressCountry: "US",
    },
    sameAs: [
      "https://instagram.com/muse.agency",
      "https://dribbble.com/muse",
      "https://linkedin.com/company/muse-agency",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@muse.agency",
      contactType: "customer service",
    },
  });
}

export function websiteJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Muse",
    url: BASE_URL,
    description: "Creative agency specializing in brand strategy, digital design, and immersive web experiences.",
    publisher: { "@type": "Organization", name: "Muse Creative Agency" },
  });
}

export function caseStudyJsonLd(study: CaseStudy): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.excerpt ?? "",
    url: `${BASE_URL}/work/${study.slug?.current ?? ""}`,
    dateCreated: `${study.year}-01-01`,
    creator: { "@type": "Organization", name: "Muse Creative Agency" },
    client: study.client ? { "@type": "Organization", name: study.client } : undefined,
    keywords: study.services?.map((s: any) => s.title).join(", "),
  });
}

export function serviceJsonLd(service: Service): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description ?? "",
    provider: { "@type": "Organization", name: "Muse Creative Agency" },
    url: `${BASE_URL}/services`,
  });
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  });
}
