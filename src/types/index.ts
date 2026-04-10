export type PortableTextBlock = unknown;
export type SanityAssetReference = { asset: unknown; alt?: string; caption?: string };
export type SanityImageSource = SanityAssetReference | null;

export interface CaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  client: string;
  excerpt: string;
  year: number;
  color: string;
  coverImage: SanityImageSource;
  sector?: string;
  engagement?: string;
  featured?: boolean;
  status?: "draft" | "review" | "scheduled" | "published";
  deliverables?: string[];
  outcomes?: { label: string; value: string; context?: string }[];
  gallery?: SanityAssetReference[];
  services?: Service[];
  challenge?: PortableTextBlock[];
  approach?: PortableTextBlock[];
  results?: PortableTextBlock[];
  testimonial?: { quote: string; author: string; role: string };
  nextProject?: Pick<CaseStudy, "_id" | "title" | "slug" | "coverImage">;
  imageCount?: number;
}

export interface Service {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  icon?: string;
  features?: string[];
  order?: number;
  deliveryModel?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: SanityImageSource;
  social?: { linkedin?: string; twitter?: string; dribbble?: string };
  order?: number;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

export interface Homepage {
  heroHeadline: string;
  heroSubline: string;
  featuredWork: CaseStudy[];
  clientLogos?: SanityAssetReference[];
  testimonials?: Testimonial[];
}

export type ViewerRole = "guest" | "client" | "editor" | "admin";

export interface ViewerSession {
  id: string;
  name: string;
  email: string;
  role: ViewerRole;
  title: string;
  company?: string;
  permissions: string[];
}

export interface ModerationTask {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "case-study" | "content" | "inquiry" | "service";
  priority: "low" | "medium" | "high";
  status: "Needs review" | "Scheduled" | "Published" | "In progress";
}

export interface SiteMetric {
  label: string;
  value: number;
  suffix?: string;
  note?: string;
}

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  contactEmail: string;
  contactPhone: string;
  offices: string[];
  socials: { label: string; href: string }[];
  navLinks: { label: string; href: string; num: string }[];
  spotlightMetrics: SiteMetric[];
  moderationQueue: ModerationTask[];
}
