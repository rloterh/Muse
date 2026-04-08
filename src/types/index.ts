export interface CaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  client: string;
  excerpt: string;
  year: number;
  color: string;
  coverImage: any;
  gallery?: { asset: any; alt?: string; caption?: string }[];
  services?: Service[];
  challenge?: any[];
  approach?: any[];
  results?: any[];
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
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: any;
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
  clientLogos?: { asset: any; alt?: string }[];
  testimonials?: Testimonial[];
}
