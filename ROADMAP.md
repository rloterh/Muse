# Muse Enterprise Roadmap

## Product Intent

Muse should evolve from a visually impressive portfolio into a production-grade agency platform that combines cinematic storytelling, operational workflows, client conversion, and controlled content publishing. The experience needs to remain premium and art-directed while gaining the structure expected from a serious product: explicit state ownership, role-aware experiences, moderation tooling, scalable content models, and reliable deployment hygiene.

## Current-State Audit

- Strengths:
  - Distinctive visual direction with Three.js, GSAP, Framer Motion, and a solid dark-cinematic design system.
  - App Router structure is already in place and the public routes are clear.
  - Sanity integration, SEO primitives, and a contact route provide a real production foundation.
- Gaps:
  - The product layer is thin: no auth, no admin shell, no role-aware navigation, no protected workflows, and no operational UI.
  - Content models are still portfolio-demo oriented and do not yet support publishing workflow, richer proof, or editorial governance.
  - The case-study detail route is client-fetch driven, which is weaker for SEO, performance, and maintainability.
  - Shared settings and brand/contact data are duplicated across surfaces.

## Delivery Model

- Integration branch: `dev`
- Phase branches:
  - `feature/phase-1-foundation-platform`
  - `feature/phase-2-content-experience`
  - `feature/phase-3-conversion-operations`
  - `feature/phase-4-admin-commerce-infra`
  - `feature/phase-5-polish-launch-hardening`
- Commit strategy:
  - Split by logical deliverable within each phase.
  - Use intentional messages and `--no-verify`.
  - Merge each completed phase back into `dev` after verification.

## Phase Plan

### Phase 1 — Foundation Platform

**Goal**
Turn Muse into a structured product shell with centralized site config, role-aware navigation, preview auth, admin/moderation scaffolding, and server-first content flow.

**Sprint 1.1**
- Audit current architecture and codify roadmap
- Centralize site settings, navigation, contact, and moderation metadata
- Expand type system for richer case-study and operational states

**Sprint 1.2**
- Add auth-aware account menu with logout
- Add preview access route and role switching for guest/client/editor/admin states
- Add admin/moderation affordances and a moderation center page

**Sprint 1.3**
- Refactor case-study detail route to server-first data fetching
- Consolidate fallback/content resolution patterns
- Remove dead or redundant vars/imports encountered during the refactor

**Success criteria**
- The app has a reusable operational shell rather than public-only brochure pages.
- Navigation/footer/contact/auth surfaces share centralized settings.
- Editors/admins can see meaningful moderation UI and role-based entry points.
- The case-study route is SEO-friendly and no longer demo-only in behavior.

**Risks**
- Real auth and RBAC still need Supabase schema and environment setup later.
- Preview session behavior should not be mistaken for security enforcement.

### Phase 2 — Content Experience

**Goal**
Deepen the storytelling and publishing model so Muse feels like a premium content platform, not just a set of static pages.

**Sprint 2.1**
- Expand Sanity schemas for site settings, case-study outcomes, service delivery models, testimonials, FAQs, and editorial modules
- Add richer work filtering by sector, service, and engagement type
- Add sticky section navigation and structured proof blocks on case studies

**Sprint 2.2**
- Introduce editorial pages such as insights, journal, and studio notes
- Improve portable text rendering for pull quotes, metrics, media callouts, and process timelines
- Add related case studies and featured editorial recommendations

**Sprint 2.3**
- Add polished empty/loading/error states for all primary routes
- Improve asset handling, responsive media, blur placeholders, and narrative transitions

**Success criteria**
- Content teams can manage more than headline/excerpt/image fields.
- Work pages feel curated, searchable, and strategically rich.
- Storytelling blocks look premium and load smoothly.

### Phase 3 — Conversion and Operations

**Goal**
Build the commercial layer around inquiries, client trust, and operational follow-up.

**Sprint 3.1**
- Upgrade the contact flow into a lead-capture funnel with routing metadata, service fit, timeline, and consent
- Add success/error workflows, better validation, anti-spam, and internal notification formatting
- Create inquiry dashboard cards and status views for admin/editor preview

**Sprint 3.2**
- Add trust/credibility surfaces: awards, client roster, capability matrices, FAQs, engagement models
- Add downloadable capability deck / proposal request flow
- Add scheduling-ready CTA architecture for discovery calls

**Sprint 3.3**
- Add analytics/observability hooks, event taxonomy, and conversion instrumentation
- Prepare route-level reporting surfaces for campaign and referral attribution

**Success criteria**
- Muse converts like a serious agency site.
- Inquiry intake carries enough context for operations to act on.
- Admin preview reflects the commercial workflow, not just content review.

### Phase 4 — Admin, Commerce, Infrastructure

**Goal**
Move from preview scaffolding to real enterprise operations.

**Sprint 4.1**
- Integrate Supabase auth, profile tables, role mapping, and protected routes
- Add RBAC-aware server checks in route handlers and server components
- Add real moderation status and content ownership data

**Sprint 4.2**
- Add Stripe subscriptions/invoicing surfaces if the business model requires retainers or gated client resources
- Add PDF/document generation and webhook handling
- Add activity logs and approval trail patterns

**Sprint 4.3**
- Harden infrastructure: Cloudflare/Vercel strategy, Docker parity, environment docs, caching strategy, and backup policies
- Add CI/CD checks for type safety, linting, build, and content model sanity

**Success criteria**
- Preview auth is replaced by real auth.
- Admin and moderation actions have real enforcement and persistence.
- Deployment and operational posture match enterprise expectations.

### Phase 5 — Polish, Performance, Launch Hardening

**Goal**
Push Muse to launch-ready quality across performance, accessibility, and presentation.

**Sprint 5.1**
- Run full accessibility review, focus-state review, contrast review, and keyboard audit
- Add reduced-motion coverage and animation performance guardrails

**Sprint 5.2**
- Conduct Lighthouse and bundle audits
- Optimize WebGL loading, route transitions, and media delivery
- Tune metadata, sitemap, structured data, and social previews

**Sprint 5.3**
- Final QA sweep, content QA, regression testing, and launch checklist
- Prepare handoff docs and operational runbooks

**Success criteria**
- Muse is launch-ready, performant, accessible, and defensible in production.

## Recommended Execution Order

1. Complete Phase 1 before expanding content depth. The platform shell and data contracts need to exist first.
2. Move to Phase 2 once admin preview and centralized settings are stable.
3. Build Phase 3 only after page structure and content architecture are richer, otherwise conversion work will sit on weak foundations.
4. Integrate real Supabase/Stripe infra in Phase 4 when the UX contracts are already validated.
5. Use Phase 5 to harden, not to invent new product scope.

## Definition of Done Per Phase

- Correct behavior verified locally
- No regression in public pages
- Clear role of each new component/store/helper
- Visual quality remains premium and intentional
- Loading, empty, and error states considered
- Changes merged back into `dev` only after reviewable commit history exists
