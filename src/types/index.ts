import type { TypedObject } from "@portabletext/types";

export type PortableTextBlock = TypedObject & Record<string, unknown>;
export type SanityAssetReference = { asset: unknown; alt?: string; caption?: string };
export type SanityImageSource = SanityAssetReference | null;
export interface ProofMetric {
  label: string;
  value: string;
  context?: string;
}

export interface ProjectFact {
  label: string;
  value: string;
  detail?: string;
}

export interface CaseStudyMilestone {
  phase: string;
  title: string;
  summary: string;
}

export interface ResourceLink {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

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
  outcomes?: ProofMetric[];
  gallery?: SanityAssetReference[];
  services?: Service[];
  challenge?: PortableTextBlock[];
  approach?: PortableTextBlock[];
  results?: PortableTextBlock[];
  timeline?: string;
  teamSize?: string;
  scope?: string;
  projectFacts?: ProjectFact[];
  milestones?: CaseStudyMilestone[];
  links?: ResourceLink[];
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
  faqs?: FAQItem[];
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

export interface JournalPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  featured?: boolean;
  coverImage?: SanityImageSource;
  body: PortableTextBlock[];
  relatedCaseStudies?: string[];
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

export interface UserProfileRecord {
  full_name: string | null;
  title: string | null;
  company: string | null;
  role: string | null;
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

export type InquiryPriority = "low" | "medium" | "high";
export type InquiryStatus = "New" | "Qualified" | "Discovery scheduled" | "Proposal drafted";

export interface InquiryRouting {
  team: string;
  owner: string;
  fit: "Strategic" | "Build-ready" | "Nurture";
  nextStep: string;
  priority: InquiryPriority;
}

export interface InquiryPreview {
  id: string;
  company: string;
  contact: string;
  budget: string;
  timeline: string;
  services: string[];
  source: string;
  region: string;
  status: InquiryStatus;
  routing: InquiryRouting;
  notes: string;
}

export interface SiteMetric {
  label: string;
  value: number;
  suffix?: string;
  note?: string;
}

export interface TrustSignal {
  label: string;
  value: string;
  description: string;
}

export interface EngagementModel {
  name: string;
  summary: string;
  bestFor: string;
  timeline: string;
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
  trustSignals: TrustSignal[];
  engagementModels: EngagementModel[];
  moderationQueue: ModerationTask[];
  inquiryPipeline: InquiryPreview[];
}
