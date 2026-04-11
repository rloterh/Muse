import type { InquiryPreview, ModerationTask, SiteSettings } from "@/types";
import { inquiryOwners } from "@/lib/inquiries/owners";

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
  trustSignals: [
    {
      label: "Recognized for",
      value: "Craft + clarity",
      description: "Clients rely on Muse when the brief needs both premium presentation and operational rigor.",
    },
    {
      label: "Trusted by",
      value: "Founders to enterprise teams",
      description: "Our work spans launch-stage brands, product teams, and established operators modernizing their story.",
    },
    {
      label: "Engagement style",
      value: "Senior-led, hands-on",
      description: "The same people shaping the strategy stay close through design, build, and launch.",
    },
  ],
  engagementModels: [
    {
      name: "Discovery sprint",
      summary: "A focused strategic engagement that clarifies priorities, risks, and the most credible direction forward.",
      bestFor: "Repositioning, launch planning, and high-stakes new initiatives.",
      timeline: "1-2 weeks",
    },
    {
      name: "Launch program",
      summary: "Brand, product, and marketing surfaces designed together so the public story and execution feel aligned.",
      bestFor: "New product launches, rebrands, and flagship digital experiences.",
      timeline: "6-12 weeks",
    },
    {
      name: "Embedded partnership",
      summary: "Senior support across design, engineering, and iteration for teams that need continued momentum after launch.",
      bestFor: "Ongoing product support, design systems, and growth-stage refinement.",
      timeline: "Monthly or quarterly",
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
      email: "nina@aerflow.example",
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
      assignedOwnerId: "james-okafor",
      assignedTo: "James Okafor",
      nextTouchAt: "2026-04-15T09:00:00.000Z",
      attribution: {
        intent: "proposal",
        referralSource: "Referral",
        landingPath: "/services",
        utmSource: "partner-network",
        utmMedium: "referral",
        utmCampaign: "spring-enterprise-intros",
      },
      history: [
        {
          id: "inquiry-aerflow-activity-1",
          label: "Inquiry received",
          detail: "Proposal-oriented inbound brief captured with strong engineering fit.",
          actor: "System",
          kind: "system",
          createdAt: "2026-04-09T08:30:00.000Z",
        },
        {
          id: "inquiry-aerflow-activity-2",
          label: "Assigned to owner",
          detail: "James Okafor is leading technical qualification and discovery prep.",
          actor: "Sofia Laurent",
          kind: "assignment",
          createdAt: "2026-04-09T10:00:00.000Z",
        },
      ],
    },
    {
      id: "inquiry-verdant",
      company: "Verdant Capital",
      contact: "Amelia Scott",
      email: "amelia@verdant.example",
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
      assignedOwnerId: "sofia-laurent",
      assignedTo: "Sofia Laurent",
      nextTouchAt: "2026-04-17T13:30:00.000Z",
      attribution: {
        intent: "strategy",
        referralSource: "Organic search",
        landingPath: "/journal/what-content-teams-actually-need-from-a-case-study-cms",
        utmSource: "google",
        utmMedium: "organic",
        utmCampaign: "brand-system-search",
      },
      history: [
        {
          id: "inquiry-verdant-activity-1",
          label: "Qualified for strategy",
          detail: "Positioning workshop recommended based on focus and timeline.",
          actor: "System",
          kind: "status",
          createdAt: "2026-04-08T14:45:00.000Z",
        },
      ],
    },
    {
      id: "inquiry-northern",
      company: "Northern Grid",
      contact: "Daniel Brooks",
      email: "daniel@northerngrid.example",
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
      assignedOwnerId: "kai-tanaka",
      assignedTo: "Kai Tanaka",
      nextTouchAt: "2026-04-19T16:00:00.000Z",
      attribution: {
        intent: "capability-deck",
        referralSource: "Conference",
        landingPath: "/",
        utmSource: "field-event",
        utmMedium: "offline",
        utmCampaign: "design-forward-summit",
      },
      history: [
        {
          id: "inquiry-northern-activity-1",
          label: "Proposal drafted",
          detail: "Recommended a phased motion concept sprint before full production scope.",
          actor: "Kai Tanaka",
          kind: "note",
          createdAt: "2026-04-07T11:15:00.000Z",
        },
      ],
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

export const inquiryOwnerOptions = inquiryOwners.map((owner) => owner.name);

export function moderationSummary(tasks: ModerationTask[]) {
  return {
    total: tasks.length,
    urgent: tasks.filter((task) => task.priority === "high").length,
    scheduled: tasks.filter((task) => task.status === "Scheduled").length,
  };
}

export function inquirySummary(inquiries: InquiryPreview[]) {
  const now = Date.now();
  return {
    total: inquiries.length,
    urgent: inquiries.filter((inquiry) => inquiry.routing.priority === "high").length,
    scheduled: inquiries.filter((inquiry) => inquiry.status === "Discovery scheduled").length,
    followUpDue: inquiries.filter((inquiry) => {
      if (!inquiry.nextTouchAt) {
        return false;
      }

      const nextTouchAt = new Date(inquiry.nextTouchAt).getTime();
      return !Number.isNaN(nextTouchAt) && nextTouchAt <= now;
    }).length,
  };
}
