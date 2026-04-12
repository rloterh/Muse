import type { CaseStudy, Homepage, JournalPost, Service, TeamMember } from "@/types";

export const fallbackCaseStudies: CaseStudy[] = [
  {
    _id: "luminary",
    title: "Luminary Rebrand",
    slug: { current: "luminary" },
    client: "Luminary Health",
    excerpt: "Complete visual identity for a wellness platform.",
    year: 2025,
    color: "#4A7C6F",
    sector: "Health Tech",
    engagement: "Brand transformation",
    featured: true,
    status: "published",
    timeline: "12 weeks",
    teamSize: "6 specialists",
    scope: "Brand, web, and launch communications",
    deliverables: ["Brand strategy", "Visual identity", "Marketing site"],
    projectFacts: [
      {
        label: "Audience",
        value: "Growth-stage healthcare teams",
        detail: "Positioned for operators, clinicians, and commercial buyers.",
      },
      {
        label: "Launch window",
        value: "Q1 2025",
        detail: "Timed to product expansion and a new funding milestone.",
      },
      {
        label: "Platform stack",
        value: "Next.js + Sanity",
        detail: "Fast editorial updates with a premium narrative layer.",
      },
    ],
    outcomes: [
      {
        label: "Launch lift",
        value: "38%",
        context: "Higher branded search volume in the first quarter.",
      },
      { label: "Conversion", value: "2.4x", context: "Improvement in demo-request conversion." },
    ],
    milestones: [
      {
        phase: "Discover",
        title: "Clarified the category story",
        summary:
          "We aligned leadership on a sharper healthcare positioning strategy before any visual work began.",
      },
      {
        phase: "Design",
        title: "Built a premium visual system",
        summary:
          "A restrained editorial palette and motion language helped the product feel credible and calm.",
      },
      {
        phase: "Launch",
        title: "Connected story to conversion",
        summary:
          "The new site paired proof-rich storytelling with clearer demo-request pathways for enterprise buyers.",
      },
    ],
    links: [
      { label: "Launch story", href: "/contact" },
      { label: "Request similar engagement", href: "/contact" },
    ],
    coverImage: null,
    services: [{ _id: "brand-strategy", title: "Branding" }],
  },
  {
    _id: "prism",
    title: "Prism Dashboard",
    slug: { current: "prism" },
    client: "Prism Analytics",
    excerpt: "Data visualization suite for enterprise analytics.",
    year: 2025,
    color: "#6366F1",
    sector: "Enterprise SaaS",
    engagement: "Product design system",
    featured: true,
    status: "review",
    timeline: "16 weeks",
    teamSize: "8 operators",
    scope: "UX architecture, dashboard system, and rollout toolkit",
    deliverables: ["UX architecture", "Dashboard design", "Frontend implementation"],
    projectFacts: [
      {
        label: "Core challenge",
        value: "Dense analyst workflows",
        detail: "The platform had depth, but critical paths were hard to scan and trust quickly.",
      },
      {
        label: "Stakeholders",
        value: "Product, data, and revenue teams",
        detail: "The system had to align internal operators around one reporting language.",
      },
      {
        label: "Delivery rhythm",
        value: "Weekly release cadence",
        detail: "The design system was built to support continuous product rollout.",
      },
    ],
    outcomes: [
      {
        label: "Task completion",
        value: "+41%",
        context: "Analyst workflows completed faster after redesign.",
      },
      {
        label: "Adoption",
        value: "92%",
        context: "Feature adoption across pilot teams in six weeks.",
      },
    ],
    milestones: [
      {
        phase: "Map",
        title: "Prioritized high-value workflows",
        summary:
          "We ranked analyst journeys by revenue sensitivity and data confidence requirements.",
      },
      {
        phase: "Systemize",
        title: "Created a scalable dashboard grammar",
        summary:
          "Patterns were codified for navigation, comparison states, and evidence hierarchy.",
      },
      {
        phase: "Roll out",
        title: "Shipped with internal enablement",
        summary:
          "We paired UI delivery with adoption guidance so product and CS teams could support launch.",
      },
    ],
    links: [{ label: "Talk to the product team", href: "/contact" }],
    coverImage: null,
    services: [{ _id: "product-design", title: "Product Design" }],
  },
  {
    _id: "vanta",
    title: "Vanta Launch",
    slug: { current: "vanta" },
    client: "Vanta Security",
    excerpt: "Marketing site and brand launch for a cybersecurity startup.",
    year: 2024,
    color: "#C8956C",
    sector: "Cybersecurity",
    engagement: "Launch campaign",
    featured: true,
    status: "scheduled",
    timeline: "10 weeks",
    teamSize: "5 specialists",
    scope: "Narrative, interactive launch site, and campaign assets",
    deliverables: ["Launch messaging", "Interactive site", "Campaign toolkit"],
    projectFacts: [
      {
        label: "Market",
        value: "Security-conscious mid-market teams",
        detail: "The narrative needed trust without losing startup velocity.",
      },
      {
        label: "Primary KPI",
        value: "Pipeline quality",
        detail: "The launch focused on attracting more qualified technical buyers.",
      },
    ],
    coverImage: null,
    services: [{ _id: "web-development", title: "Web Development" }],
  },
  {
    _id: "echo",
    title: "Echo Spatial",
    slug: { current: "echo" },
    client: "Echo Audio",
    excerpt: "Immersive audio product experience with spatial sound.",
    year: 2024,
    color: "#DC2626",
    sector: "Consumer Audio",
    engagement: "Immersive product storytelling",
    status: "published",
    deliverables: ["3D motion system", "Spatial storyboards", "Product microsite"],
    timeline: "9 weeks",
    teamSize: "4 specialists",
    scope: "Immersive storytelling and motion-led commerce support",
    coverImage: null,
    services: [{ _id: "motion-3d", title: "3D / WebGL" }],
  },
  {
    _id: "meridian",
    title: "Meridian OS",
    slug: { current: "meridian" },
    client: "Meridian Labs",
    excerpt: "Operating system design language and component library.",
    year: 2024,
    color: "#0EA5E9",
    sector: "Developer Tools",
    engagement: "Design systems",
    status: "published",
    timeline: "20 weeks",
    teamSize: "9 contributors",
    scope: "Design language, governance, and product rollout support",
    coverImage: null,
    services: [{ _id: "product-design-2", title: "Product Design" }],
  },
  {
    _id: "terraform",
    title: "Terraform Identity",
    slug: { current: "terraform" },
    client: "TerraForm Co",
    excerpt: "Sustainable architecture firm identity and web presence.",
    year: 2023,
    color: "#8B5CF6",
    sector: "Architecture",
    engagement: "Identity and launch",
    status: "draft",
    timeline: "8 weeks",
    teamSize: "5 contributors",
    scope: "Brand refresh and web presence",
    coverImage: null,
    services: [{ _id: "branding-2", title: "Branding" }],
  },
];

export const fallbackServices: Service[] = [
  {
    _id: "brand-strategy",
    title: "Brand Strategy",
    description:
      "We uncover what makes your brand unique and build a strategic foundation that guides every creative decision.",
    icon: "bar-chart-3",
    features: [
      "Brand positioning",
      "Competitive analysis",
      "Audience research",
      "Messaging framework",
      "Brand architecture",
    ],
    order: 1,
    deliveryModel: "Discovery sprint and executive workshop",
    faqs: [
      {
        question: "When is brand strategy the right engagement?",
        answer:
          "It is best when positioning is unclear, new offers are emerging, or teams need strategic alignment before design or launch work starts.",
      },
    ],
  },
  {
    _id: "visual-identity",
    title: "Visual Identity",
    description:
      "Complete identity systems that are distinctive, scalable, and built to last across every touchpoint.",
    icon: "palette",
    features: [
      "Logo & mark design",
      "Typography systems",
      "Color palettes",
      "Brand guidelines",
      "Asset libraries",
    ],
    order: 2,
    deliveryModel: "Identity program with rollout toolkit",
    faqs: [
      {
        question: "What does the rollout toolkit include?",
        answer:
          "We typically include assets, guidance, and implementation patterns so the identity holds together across web, product, and marketing surfaces.",
      },
    ],
  },
  {
    _id: "digital-design",
    title: "Digital Design",
    description:
      "User interfaces and experiences that are intuitive, beautiful, and grounded in real user behavior.",
    icon: "layers",
    features: ["UI/UX design", "Design systems", "Prototyping", "User research", "Accessibility"],
    order: 3,
    deliveryModel: "Design sprints and product squads",
    faqs: [
      {
        question: "Do you work inside existing product teams?",
        answer:
          "Yes. We often embed with product and engineering teams to accelerate delivery while keeping the system maintainable.",
      },
    ],
  },
  {
    _id: "web-development",
    title: "Web Development",
    description:
      "High-performance applications built with modern frameworks, deployed on edge infrastructure.",
    icon: "code-2",
    features: [
      "Next.js / React",
      "Headless CMS",
      "E-commerce",
      "API integrations",
      "Performance optimization",
    ],
    order: 4,
    deliveryModel: "Product engineering pod with launch support",
    faqs: [
      {
        question: "Can development engagements include CMS and performance work?",
        answer:
          "Yes. Content modeling, headless CMS integration, performance tuning, and launch-readiness are common parts of the delivery.",
      },
    ],
  },
  {
    _id: "motion-3d",
    title: "Motion & 3D",
    description:
      "Cinematic animations, WebGL experiences, and immersive environments that push the boundaries of the web.",
    icon: "video",
    features: [
      "Three.js / WebGL",
      "GSAP animations",
      "Video production",
      "Interactive experiences",
      "Spatial design",
    ],
    order: 5,
    deliveryModel: "Motion concept to production rollout",
    faqs: [
      {
        question: "How do you keep 3D and motion performant?",
        answer:
          "We scope motion to the moments that matter, load media progressively, and keep reduced-motion behavior in mind from the start.",
      },
    ],
  },
  {
    _id: "product-design",
    title: "Product Design",
    description:
      "End-to-end product thinking from concept to launch, for apps and platforms people love to use.",
    icon: "smartphone",
    features: [
      "Product strategy",
      "Interaction design",
      "Design sprints",
      "Usability testing",
      "Launch support",
    ],
    order: 6,
    deliveryModel: "Embedded design leadership for complex products",
    faqs: [
      {
        question: "Can product design run alongside brand or marketing work?",
        answer:
          "Yes. We often connect product UX decisions to positioning, onboarding, and go-to-market storytelling so the experience feels coherent.",
      },
    ],
  },
];

export const fallbackTeamMembers: TeamMember[] = [
  {
    _id: "alex-rivera",
    name: "Alex Rivera",
    role: "Founder & Creative Director",
    bio: "Leads strategy and creative direction across brand, digital, and motion engagements.",
    order: 1,
  },
  {
    _id: "maya-chen",
    name: "Maya Chen",
    role: "Head of Design",
    bio: "Shapes interface systems and editorial visual language with a focus on polish and clarity.",
    order: 2,
  },
  {
    _id: "james-okafor",
    name: "James Okafor",
    role: "Lead Developer",
    bio: "Builds performant digital experiences that balance ambition with maintainability.",
    order: 3,
  },
  {
    _id: "sofia-laurent",
    name: "Sofia Laurent",
    role: "Strategy Director",
    bio: "Connects research, positioning, and messaging into a coherent product narrative.",
    order: 4,
  },
  {
    _id: "kai-tanaka",
    name: "Kai Tanaka",
    role: "Motion Designer",
    bio: "Crafts restrained motion systems and cinematic transitions that support the story.",
    order: 5,
  },
  {
    _id: "zara-patel",
    name: "Zara Patel",
    role: "Project Manager",
    bio: "Keeps multidisciplinary projects focused, predictable, and high-quality from kickoff to launch.",
    order: 6,
  },
];

export const fallbackHomepage: Homepage = {
  heroHeadline: "We craft digital experiences that move people",
  heroSubline: "Strategy, design, and technology for brands that refuse to blend in.",
  featuredWork: fallbackCaseStudies.slice(0, 5),
  testimonials: [
    {
      quote:
        "Muse helped us turn a complex product story into a brand people immediately understood and remembered.",
      author: "Sarah Chen",
      role: "CEO",
      company: "Luminary Health",
    },
    {
      quote:
        "The work felt premium from day one, but what impressed us most was how clearly every decision tied back to strategy.",
      author: "Marcus Webb",
      role: "CTO",
      company: "Prism Analytics",
    },
  ],
};

export const fallbackJournalPosts: JournalPost[] = [
  {
    _id: "journal-proof-driven-launches",
    title: "Designing launch stories that convert skeptical buyers",
    slug: { current: "designing-launch-stories-that-convert-skeptical-buyers" },
    excerpt:
      "How we structure proof, pacing, and narrative hierarchy so premium marketing pages feel credible instead of overdesigned.",
    publishedAt: "2026-03-18",
    readTime: "6 min read",
    category: "Strategy",
    featured: true,
    relatedCaseStudies: ["luminary", "vanta"],
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The highest-performing launch pages rarely try to say everything at once. They clarify stakes, establish proof, and then reveal depth in an intentional sequence.",
            marks: [],
          },
        ],
      },
      {
        _type: "pullQuote",
        quote: "Trust is built through structure before it is amplified through visuals.",
        attribution: "Muse strategy team",
      } as never,
      {
        _type: "metricGrid",
        items: [
          {
            label: "Primary narrative",
            value: "1",
            context: "One clear story anchors the page before supporting proof expands it.",
          },
          {
            label: "Proof moments",
            value: "3-5",
            context: "Most launches benefit from a concise set of strong evidence blocks.",
          },
        ],
      } as never,
    ],
  },
  {
    _id: "journal-motion-governance",
    title: "A practical framework for motion systems in premium products",
    slug: { current: "a-practical-framework-for-motion-systems-in-premium-products" },
    excerpt:
      "A simple way to decide where motion earns its place and where it quietly gets out of the way.",
    publishedAt: "2026-02-26",
    readTime: "5 min read",
    category: "Design Systems",
    featured: true,
    relatedCaseStudies: ["echo", "prism"],
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Motion should help users predict what happens next. If animation does not improve comprehension, pacing, or emotional tone, it is probably noise.",
            marks: [],
          },
        ],
      },
      {
        _type: "processTimeline",
        items: [
          {
            label: "01",
            title: "Map the moments that matter",
            summary: "Focus first on transitions, confirmations, and state changes that benefit from added clarity.",
          },
          {
            label: "02",
            title: "Set amplitude limits",
            summary: "Constrain duration, distance, and easing so the system feels coherent rather than improvised.",
          },
          {
            label: "03",
            title: "Respect reduced motion",
            summary: "Every major animation family should have a quieter equivalent that preserves information hierarchy.",
          },
        ],
      } as never,
    ],
  },
  {
    _id: "journal-case-study-ops",
    title: "What content teams actually need from a case-study CMS",
    slug: { current: "what-content-teams-actually-need-from-a-case-study-cms" },
    excerpt:
      "The operational fields and publishing states that turn a beautiful portfolio into a maintainable content system.",
    publishedAt: "2026-01-30",
    readTime: "7 min read",
    category: "Operations",
    relatedCaseStudies: ["prism", "meridian"],
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "A high-quality case-study CMS has to support more than title, excerpt, and images. Teams need proof fields, publishing workflow, reuse patterns, and a way to preserve narrative quality under deadline pressure.",
            marks: [],
          },
        ],
      },
      {
        _type: "callout",
        text: "The most common failure mode is forcing editors to improvise strategic proof inside generic rich-text blocks.",
      } as never,
    ],
  },
];
