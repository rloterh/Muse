# Muse Phase 4 Operations Runbook

## Scope

This runbook closes the Phase 4 operating layer for Muse:

- Supabase-backed auth and RBAC
- moderation persistence and approval workflows
- Stripe-ready billing checkout and webhook processing
- Docker parity for production builds
- CI coverage for lint, type safety, content sanity, build, and smoke verification

## Production topology

- Edge/application: Vercel should remain the primary app runtime for Next.js routing, ISR, and server actions.
- DNS/WAF: Cloudflare should sit in front for DNS, WAF, bot filtering, and rate limiting.
- Caching: do not duplicate full-page caching at Cloudflare when Vercel and Next.js cache semantics are already in control. Cache static assets aggressively, but leave dynamic admin/auth/billing routes uncached.
- Data: Sanity handles editorial content, Supabase handles auth/profiles/operations, and Stripe handles recurring billing.

## Environment checklist

### Core app

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`

### Supabase auth and ops

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### QA smoke

- `QA_EDITOR_EMAIL`
- `QA_EDITOR_PASSWORD`
- `QA_ADMIN_EMAIL`
- `QA_ADMIN_PASSWORD`

### Stripe billing

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_BILLING_PORTAL_CONFIGURATION_ID` optional but recommended
- `STRIPE_DISCOVERY_SPRINT_PRICE_ID`
- `STRIPE_LAUNCH_PROGRAM_PRICE_ID`
- `STRIPE_EMBEDDED_PARTNERSHIP_PRICE_ID`

## Deployment notes

### Vercel

- Set all production env vars before promoting the branch.
- Point webhook destinations at `/api/billing/webhook`.
- Keep preview environments using Stripe test mode and Supabase preview credentials only.

### Cloudflare

- Use Cloudflare for DNS and WAF, not for overriding authenticated app behavior.
- Bypass cache for `/admin`, `/auth`, `/api/auth/*`, `/api/admin/*`, and `/api/billing/*`.
- Consider rate limiting `/api/contact` and `/api/billing/webhook`.

### Docker

- The checked-in `Dockerfile` remains the parity container for local verification and fallback hosting.
- Validate parity with:

```bash
docker build -t muse .
docker run -p 3000:3000 muse
```

## Billing operations

- Public retainer flows start at `/services`.
- Checkout sessions are created by `/api/billing/checkout`.
- Customer portal sessions are created by `/api/billing/portal`.
- Stripe webhooks are verified and persisted through `/api/billing/webhook`.
- Billing events are stored in `public.billing_events`.

## Backup and recovery posture

- Supabase: enable scheduled backups and point-in-time recovery if the plan supports it.
- Sanity: keep dataset export cadence aligned to release windows.
- Stripe: rely on Stripe event history as system-of-record for billing events, while `billing_events` acts as the app-side audit trail.
- Keep a short rollback note per release with commit SHA, migration list, and affected env changes.

## Verification checklist

- `npm run lint`
- `npm run typecheck`
- `npm run content:check`
- `npm run build`
- `npm run qa:smoke`

## Go-live checklist

- Apply all Supabase migrations, including `202604111100_create_billing_events.sql`.
- Confirm Stripe webhook secret and destination.
- Confirm billing price IDs map to the intended live products.
- Send one invite flow and one password-reset flow in production-like test mode.
- Verify `/services` retainer CTA behavior in both configured and fallback modes.
- Verify `/admin` renders moderation, activity, inquiry, and revenue operations panels without runtime errors.
