// ============================================
// SANITY SCHEMAS FOR MUSE
// Add these to your Sanity Studio schemaTypes
// ============================================

export const caseStudySchema = {
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r: any) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "client", title: "Client Name", type: "string" },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 2 },
    { name: "year", title: "Year", type: "number" },
    { name: "sector", title: "Sector", type: "string" },
    { name: "engagement", title: "Engagement Type", type: "string" },
    { name: "color", title: "Accent Color (hex)", type: "string", initialValue: "#C8956C" },
    {
      name: "status",
      title: "Publishing Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: ["draft", "review", "scheduled", "published"],
      },
    },
    { name: "featured", title: "Featured Project", type: "boolean", initialValue: false },
    { name: "deliverables", title: "Deliverables", type: "array", of: [{ type: "string" }] },
    {
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
            { name: "context", type: "text", rows: 2 },
          ],
        },
      ],
    },
    { name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string" },
            { name: "caption", type: "string" },
          ],
        },
      ],
    },
    {
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    },
    { name: "challenge", title: "The Challenge", type: "array", of: [{ type: "block" }] },
    { name: "approach", title: "Our Approach", type: "array", of: [{ type: "block" }] },
    { name: "results", title: "Results", type: "array", of: [{ type: "block" }] },
    { name: "timeline", title: "Timeline", type: "string" },
    { name: "teamSize", title: "Team Size", type: "string" },
    { name: "scope", title: "Scope", type: "string" },
    {
      name: "projectFacts",
      title: "Project Facts",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
            { name: "detail", type: "text", rows: 2 },
          ],
        },
      ],
    },
    {
      name: "milestones",
      title: "Milestones",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "phase", type: "string" },
            { name: "title", type: "string" },
            { name: "summary", type: "text", rows: 3 },
          ],
        },
      ],
    },
    {
      name: "links",
      title: "Project Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "href", type: "string" },
          ],
        },
      ],
    },
    {
      name: "testimonial",
      title: "Testimonial",
      type: "object",
      fields: [
        { name: "quote", type: "text" },
        { name: "author", type: "string" },
        { name: "role", type: "string" },
      ],
    },
    { name: "nextProject", title: "Next Project", type: "reference", to: [{ type: "caseStudy" }] },
  ],
};

export const serviceSchema = {
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "description", title: "Description", type: "text" },
    { name: "icon", title: "Icon Name", type: "string" },
    { name: "features", title: "Features", type: "array", of: [{ type: "string" }] },
    { name: "deliveryModel", title: "Delivery Model", type: "string" },
    {
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string" },
            { name: "answer", type: "text", rows: 3 },
          ],
        },
      ],
    },
    { name: "order", title: "Sort Order", type: "number" },
  ],
};

export const teamMemberSchema = {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "role", title: "Role", type: "string" },
    { name: "bio", title: "Bio", type: "text" },
    { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
    {
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "linkedin", type: "url" },
        { name: "twitter", type: "url" },
        { name: "dribbble", type: "url" },
      ],
    },
    { name: "order", title: "Sort Order", type: "number" },
  ],
};

export const homepageSchema = {
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    { name: "heroHeadline", title: "Hero Headline", type: "string" },
    { name: "heroSubline", title: "Hero Subline", type: "text", rows: 2 },
    {
      name: "featuredWork",
      title: "Featured Work",
      type: "array",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
    },
    {
      name: "clientLogos",
      title: "Client Logos",
      type: "array",
      of: [{ type: "image", fields: [{ name: "alt", type: "string" }] }],
    },
    {
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", type: "text" },
            { name: "author", type: "string" },
            { name: "role", type: "string" },
            { name: "company", type: "string" },
          ],
        },
      ],
    },
  ],
};

export const journalPostSchema = {
  name: "journalPost",
  title: "Journal Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    { name: "publishedAt", title: "Published At", type: "datetime" },
    { name: "readTime", title: "Read Time", type: "string" },
    { name: "category", title: "Category", type: "string" },
    { name: "featured", title: "Featured", type: "boolean", initialValue: false },
    { name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "pullQuote",
          title: "Pull Quote",
          fields: [
            { name: "quote", type: "text", rows: 3 },
            { name: "attribution", type: "string" },
          ],
        },
        {
          type: "object",
          name: "metricGrid",
          title: "Metric Grid",
          fields: [
            {
              name: "items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", type: "string" },
                    { name: "value", type: "string" },
                    { name: "context", type: "text", rows: 2 },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "object",
          name: "processTimeline",
          title: "Process Timeline",
          fields: [
            {
              name: "items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", type: "string" },
                    { name: "title", type: "string" },
                    { name: "summary", type: "text", rows: 3 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "relatedCaseStudies",
      title: "Related Case Studies",
      type: "array",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
    },
  ],
};
