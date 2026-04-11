# Phase 3 Measurement Taxonomy

## Purpose

Phase 3 turns Muse into a measurable conversion platform instead of a visually strong but opaque portfolio. This taxonomy defines the events and attribution fields that now power conversion review, route intelligence, and operational follow-through.

## Attribution contract

Muse stores and forwards the following attribution fields when available:

- `landingPath`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `utmContent`
- `intent`
- `referralSource`
- `referrer`

These values are persisted client-side and carried into inquiry submission so the admin reporting layer can tie commercial outcomes back to route, campaign, and CTA context.

## Event taxonomy

### Core navigation and route awareness

- `page_view`
  - emitted on route changes
  - includes current path and stored attribution context

### Conversion CTA events

- `cta_click`
  - generic primary CTA tracking
  - used for proposal and workflow continuation clicks

- `capability_deck_download`
  - emitted when the downloadable capability deck is requested
  - used from shared conversion panels and contact success/sidebar surfaces

- `discovery_call_click`
  - emitted when the scheduling-ready discovery CTA is clicked
  - used from shared conversion panels and contact surfaces

### Inquiry flow events

- `proposal_mode_viewed`
  - emitted when `/contact` is opened in proposal mode

- `inquiry_submitted`
  - emitted on successful inquiry submission
  - includes path, location, intent, and merged attribution context

- `inquiry_reset`
  - emitted when the user starts another inquiry from the success state

### Admin workflow events

- `brief_reviewed`
  - emitted when an operator logs a review touch from the inquiry brief workflow rail

## Reporting surfaces

The admin conversion layer now summarizes:

- attribution coverage
- campaign tagging coverage
- proposal-intent share
- strategic-fit share
- top sources
- intent mix
- campaign and medium mix
- top landing paths
- route quality by landing path
- stage mix
- owner load
- service demand

## Phase 4 carry-forward

This taxonomy is intentionally front-end first for Phase 3. Phase 4 should extend it by:

- forwarding events to a durable analytics sink
- joining CTA events with persisted inquiry ids where possible
- adding alerting and dashboard ownership
- formalizing naming and retention policy for enterprise reporting
