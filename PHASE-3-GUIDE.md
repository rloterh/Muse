# Muse — Phase 3: Sanity Live Data, Contact API & Content Enrichment

## Overview
**Duration:** 2 weeks (4 sprints)  
**Goal:** Wire Sanity CMS live data into all pages, portable text rendering for case studies, contact form with email API, and image optimization with blur placeholders.

---

## Sprint Breakdown

### Sprint 3.1 — Sanity Data Integration (Days 1-4)
- Server-side fetching with ISR for all CMS pages
- Homepage: dynamic featured work, testimonials from Sanity
- Work page: live case study grid from CMS
- Case study detail: full portable text rendering
- About page: team + services from Sanity

### Sprint 3.2 — Portable Text & Rich Content (Days 5-7)
- @portabletext/react for rich content blocks
- Custom serializers for images, code blocks, callouts
- Case study gallery with lightbox
- Image blur placeholder generation

### Sprint 3.3 — Contact Form API (Days 8-10)
- Server action for form submission
- Email notification via Resend (or stub)
- Form validation with error states
- Success/error feedback with animations
- Rate limiting

### Sprint 3.4 — Image Optimization & Polish (Days 11-14)
- next/image for all CMS images with blur placeholders
- Sanity image URL builder with responsive sizes
- OG image generation for case studies
- Loading states for all dynamic pages

---

## New Dependencies

```bash
npm install @portabletext/react resend
```
