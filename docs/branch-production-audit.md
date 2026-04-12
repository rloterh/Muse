# Muse Branch Production Audit

## Audit date

- 2026-04-11
- Branch: `feature/phase-4-admin-commerce-infra`

## Executive summary

The branch is in a strong production-ready state for application code:

- builds cleanly
- lint and type checks pass
- smoke verification passes when network-backed dependencies are reachable
- auth, moderation, inquiry operations, and billing scaffolding are all implemented

The remaining blockers are operational rather than code-level:

- Supabase CLI is not linked in this workspace, so production migrations cannot be pushed from the repo alone
- Stripe live/test environment variables still need to be configured in the target environment
- final live-environment Lighthouse and accessibility verification should be run against the deployed domain, not only locally

## Phase-by-phase status

### Phase 1 - Foundation Platform

- Status: complete
- Evidence:
  - role-aware auth shell
  - account menu and logout flow
  - admin surface
  - server-first content routing and centralized site settings

### Phase 2 - Content Experience

- Status: complete
- Evidence:
  - richer Sanity schemas and fallback content contracts
  - work filtering and richer case-study structure
  - journal/editorial surfaces
  - improved content rendering and asset handling

### Phase 3 - Conversion and Operations

- Status: complete
- Evidence:
  - enhanced inquiry intake and qualification
  - reporting and conversion tracking
  - capability deck flow
  - discovery CTA architecture

### Phase 4 - Admin, Commerce, Infrastructure

- Status: code-complete, production setup pending
- Evidence:
  - Supabase-backed auth and RBAC
  - persisted moderation and inquiry lifecycle operations
  - unified admin activity feed
  - Stripe-ready checkout, portal, webhook, and billing events
  - Docker parity, CI coverage, env docs, and operations runbook

### Phase 5 - Polish, Performance, Launch Hardening

- Status: materially advanced, final deployed-domain checks still recommended
- Evidence:
  - reduced-motion guardrails added across reveal, GSAP, smooth scroll, custom cursor, preloader, navigation, and hero scene
  - keyboard/accessibility improvements via skip link, dialog semantics, and account-menu semantics
  - smoke suite hardened to validate the hero more reliably

## Verification completed

- `npm run lint`
- `npm run typecheck`
- `npm run content:check`
- `npm run build`
- `npm run qa:smoke`

## Remaining external follow-through

### Required before production launch

- Link the Supabase CLI or provide a production connection path, then apply migrations including `202604111100_create_billing_events.sql`
- Configure Stripe environment variables and webhook destination
- Confirm Cloudflare cache bypass rules for `/auth`, `/admin`, `/api/admin/*`, and `/api/billing/*`

### Recommended final validation

- Run Lighthouse against the deployed production domain
- Run a real keyboard-only pass on the deployed site
- Validate reduced-motion behavior in a browser with the OS accessibility setting enabled
- Send one live-like invite, password reset, and billing webhook test event

### Current deployed-domain check

- `https://muse-beige.vercel.app/` returned `200 OK`
- `https://muse-beige.vercel.app/auth` returned `404 Not Found`
- `https://muse-beige.vercel.app/admin` returned `404 Not Found`

This indicates the live deployment is serving a public homepage but is not currently exposing the authenticated app routes expected by this branch. Merge-prep for code is strong; deployment promotion still needs attention.

## Current risk profile

- Low code risk for compile/runtime regressions based on current verification
- Medium deployment risk until envs, webhook configuration, route deployment parity, and DB migration application are completed
- Low UX risk after the reduced-motion and accessibility shell improvements, with final live audit still advisable
