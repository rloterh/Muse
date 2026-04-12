import type { ModerationTask, SiteSettings } from "@/types";

export const siteSettings: SiteSettings = {
  brandName: "Muse",
  brandTagline: "Creative systems for ambitious brands.",
  contactEmail: "hello@muse.agency",
  contactPhone: "+1 (555) 123-4567",
  offices: ["Brooklyn, New York", "London, United Kingdom"],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
  ],
  navLinks: [
    { label: "Work", href: "/work", num: "01" },
    { label: "About", href: "/about", num: "02" },
    { label: "Journal", href: "/journal", num: "03" },
    { label: "Services", href: "/services", num: "04" },
    { label: "Contact", href: "/contact", num: "05" },
  ],
  spotlightMetrics: [
    {
      label: "Projects delivered",
      value: 47,
      note: "Multi-disciplinary launches across brand, product, and motion.",
    },
    {
      label: "Industry awards",
      value: 12,
      note: "Recognized for craft, performance, and storytelling.",
    },
    {
      label: "Years in business",
      value: 8,
      note: "Senior operators with startup speed and enterprise rigor.",
    },
    {
      label: "Client retention",
      value: 99,
      suffix: "%",
      note: "Long-term partnerships built on measurable outcomes.",
    },
  ],
  moderationQueue: [
    {
      id: "queue-luminary",
      title: "Luminary Rebrand",
      description: "Review hero media captions and publish the new outcomes block before launch.",
      href: "/work/luminary",
      kind: "case-study",
      priority: "high",
      status: "Needs review",
    },
    {
      id: "queue-inquiry",
      title: "New enterprise inquiry",
      description: "Route the manufacturing proposal to strategy and schedule discovery.",
      href: "/contact",
      kind: "inquiry",
      priority: "medium",
      status: "In progress",
    },
    {
      id: "queue-service",
      title: "Motion retainer package",
      description: "Publish the updated delivery model and pricing language after QA.",
      href: "/services",
      kind: "service",
      priority: "low",
      status: "Scheduled",
    },
  ],
};

export const budgetRanges = ["Under $10k", "$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"];

export const serviceOptions = [
  "Brand Strategy",
  "Visual Identity",
  "Digital Design",
  "Web Development",
  "Motion & 3D",
  "Product Design",
];

export function moderationSummary(tasks: ModerationTask[]) {
  return {
    total: tasks.length,
    urgent: tasks.filter((task) => task.priority === "high").length,
    scheduled: tasks.filter((task) => task.status === "Scheduled").length,
  };
}
