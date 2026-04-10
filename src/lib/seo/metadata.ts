import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://muse.agency";

function ogImage(title: string, subtitle?: string, accent?: string) {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", subtitle);
  if (accent) params.set("accent", accent);
  return `${BASE_URL}/api/og?${params.toString()}`;
}

export const homeMetadata: Metadata = {
  title: "Muse - Creative Agency",
  description:
    "We craft digital experiences that move people. Strategy, design, and technology for brands that refuse to blend in.",
  openGraph: {
    title: "Muse - Creative Agency",
    description: "Digital experiences that move people.",
    url: BASE_URL,
    siteName: "Muse",
    images: [
      {
        url: ogImage("Muse Creative Agency", "Digital experiences that move people"),
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const workMetadata: Metadata = {
  title: "Work",
  description:
    "A curated collection of projects where strategy, design, and technology converge to create meaningful impact.",
  openGraph: {
    title: "Work - Muse",
    description: "Selected projects from Muse Creative Agency.",
    images: [
      {
        url: ogImage("Selected Work", "Strategy, design, and technology"),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const aboutMetadata: Metadata = {
  title: "About",
  description:
    "A small team of strategists, designers, and engineers with outsized ambition. Learn about our values, team, and journey.",
  openGraph: {
    title: "About - Muse",
    description: "Meet the team behind Muse.",
    images: [
      {
        url: ogImage("About Muse", "A small team with outsized ambition"),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const servicesMetadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy, visual identity, digital design, web development, motion & 3D, and product design.",
  openGraph: {
    title: "Services - Muse",
    description: "Everything you need, nothing you don't.",
    images: [
      {
        url: ogImage("Services", "Brand, design, development, motion"),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const contactMetadata: Metadata = {
  title: "Contact",
  description: "Ready to create something remarkable? Get in touch with Muse Creative Agency.",
  openGraph: {
    title: "Contact - Muse",
    description: "Let's create something remarkable together.",
    images: [
      {
        url: ogImage("Get in Touch", "Let's create something remarkable"),
        width: 1200,
        height: 630,
      },
    ],
  },
};

export function caseStudyMeta(
  title: string,
  client: string,
  excerpt: string,
  color?: string
): Metadata {
  return {
    title: `${title} - ${client}`,
    description: excerpt,
    openGraph: {
      title: `${title} - ${client}`,
      description: excerpt,
      type: "article",
      images: [
        {
          url: ogImage(title, `${client} - Case Study`, color),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}
