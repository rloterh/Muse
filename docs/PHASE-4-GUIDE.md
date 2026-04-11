# Muse - Phase 4: Admin, Commerce, Infrastructure

## Overview
**Duration:** 1-2 weeks  
**Goal:** Replace preview-only operations with production-grade auth, moderation, billing, and deployment hardening.

---

## Delivered in this phase

### Auth and RBAC
- Supabase-backed auth flows
- Profile-backed role mapping
- Protected server components and route handlers
- Invite and password-reset onboarding flows

### Moderation and operations
- Persisted inquiry lifecycle updates
- Persisted moderation queue with ownership and approval history
- Unified admin activity feed across inquiry and moderation actions
- Revenue operations panel with billing readiness and event visibility

### Commerce
- Stripe-ready checkout session route for retainers
- Stripe-ready billing portal route
- Verified billing webhook ingestion route
- Downloadable retainer brief generation for commercial handoff

### Infrastructure
- Docker parity build
- CI checks for lint, types, content sanity, and build
- Playwright smoke workflow
- Phase 4 operations runbook for Cloudflare, Vercel, envs, cache, and backup posture

## Phase 4 verification

- `npm run lint`
- `npm run typecheck`
- `npm run content:check`
- `npm run build`
- `npm run qa:smoke`

## Required follow-through outside the repo

- Apply Supabase migration `202604111100_create_billing_events.sql`
- Set live or test Stripe environment variables
- Point Stripe webhooks at `/api/billing/webhook`
- Configure Cloudflare cache bypass rules for authenticated and billing routes
