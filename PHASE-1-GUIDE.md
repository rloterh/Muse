# Muse — Phase 1: Scaffold, Design System & Sanity CMS

## Overview
**Duration:** 2 weeks (4 sprints)  
**Goal:** Next.js scaffold with dark cinematic design system, Sanity CMS for case studies, base layout with navigation, and page shells for all routes.

---

## Design Direction
- **Aesthetic:** Dark cinematic luxury — think Awwwards-winning agency sites
- **Fonts:** Syne (geometric display headings) + Outfit (clean body text)
- **Colors:** Near-black (#0A0A0A) backgrounds, copper/gold (#C8956C) accent, off-white (#E8E4DE) text
- **Details:** Film grain overlay, custom magnetic cursor, no border-radius (sharp edges), dramatic negative space
- **Motion:** Orchestrated page loads, scroll-triggered reveals, smooth page transitions

## Sprint Breakdown

### Sprint 1.1 — Project Scaffold & Design System (Days 1-2)
- Next.js 16 + TypeScript + Tailwind CSS 4
- Dark-first design tokens and CSS custom properties
- Base UI components (distinct cinematic aesthetic)
- Film grain overlay, custom cursor, smooth scroll

### Sprint 1.2 — Sanity CMS Schemas (Days 3-5)
- Case study schema (title, slug, client, services, images, content blocks)
- Team member schema
- Service schema
- Homepage configurable content
- GROQ query library

### Sprint 1.3 — Layout & Navigation (Days 6-8)
- Full-screen navigation overlay with stagger animations
- Minimal header with logo + hamburger
- Footer with contact info + social links
- Page transition wrapper (Framer Motion)

### Sprint 1.4 — Page Shells & ISR (Days 9-10)
- Homepage shell (sections for hero, work reel, services, testimonials)
- Work page (case study grid)
- About page (team, values, timeline)
- Services page
- Contact page with form
- ISR configuration for CMS content

---

## Tech Stack

```
next@16.x          react@19.x         typescript@5.7+
tailwindcss@4.x    framer-motion@12.x  gsap@3.12+ (Phase 2)
three@r128 (Phase 2)                   @react-three/fiber (Phase 2)
next-sanity@9.x    @sanity/client@6.x  @sanity/image-url@1.x
lucide-react       clsx               tailwind-merge
```

## Initialization

```bash
npx create-next-app@latest muse \
  --typescript --tailwind --eslint \
  --app --src-dir --import-alias "@/*"

cd muse

npm install framer-motion clsx tailwind-merge lucide-react \
  next-sanity @sanity/client @sanity/image-url
```
