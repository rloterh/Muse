import type { InquiryPreview, ModerationTask, SiteSettings } from "@/types";

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
  inquiryPipeline: [
    {
      id: "inquiry-aerflow",
      company: "Aerflow Robotics",
      contact: "Nina Patel",
      budget: "$50k - $100k",
      timeline: "6-8 weeks",
      services: ["Web Development", "Product Design"],
      source: "Referral",
      region: "London, United Kingdom",
      status: "Discovery scheduled",
      routing: {
        team: "Product + engineering",
        owner: "James Okafor",
        fit: "Build-ready",
        nextStep: "Confirm solution scope and implementation constraints before the discovery call.",
        priority: "high",
      },
      notes:
        "Strong technical fit and an accelerated buying timeline. Needs a sharper content and systems recommendation before scoping.",
    },
    {
      id: "inquiry-verdant",
      company: "Verdant Capital",
      contact: "Amelia Scott",
      budget: "$25k - $50k",
      timeline: "This quarter",
      services: ["Brand Strategy", "Visual Identity"],
      source: "Organic search",
      region: "New York, United States",
      status: "Qualified",
      routing: {
        team: "Brand strategy",
        owner: "Sofia Laurent",
        fit: "Strategic",
        nextStep: "Prepare a positioning workshop outline and competitor audit preview.",
        priority: "medium",
      },
      notes:
        "Clear appetite for positioning and identity work. Likely a strong workshop-led engagement with follow-on rollout.",
    },
    {
      id: "inquiry-northern",
      company: "Northern Grid",
      contact: "Daniel Brooks",
      budget: "$10k - $25k",
      timeline: "Exploring options",
      services: ["Motion & 3D"],
      source: "Conference",
      region: "Toronto, Canada",
      status: "Proposal drafted",
      routing: {
        team: "Motion systems",
        owner: "Kai Tanaka",
        fit: "Nurture",
        nextStep: "Position the engagement as a phased concept sprint before committing to full production scope.",
        priority: "low",
      },
      notes:
        "Strong interest in a wow-factor experience, but the budget/timeline pairing suggests a phased recommendation rather than a full production engagement.",
    },
  ],
};

export const budgetRanges = ["Under $10k", "$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"];
export const timelineOptions = [
  "ASAP",
  "2-4 weeks",
  "4-8 weeks",
  "This quarter",
  "Exploring options",
];
export const projectFocusOptions = [
  "New launch",
  "Rebrand or repositioning",
  "Website redesign",
  "Product experience",
  "Ongoing design support",
];
export const referralSourceOptions = [
  "Referral",
  "Organic search",
  "Social / editorial",
  "Conference",
  "Returning client",
  "Other",
];

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

export function inquirySummary(inquiries: InquiryPreview[]) {
  return {
    total: inquiries.length,
    urgent: inquiries.filter((inquiry) => inquiry.routing.priority === "high").length,
    scheduled: inquiries.filter((inquiry) => inquiry.status === "Discovery scheduled").length,
  };
}
