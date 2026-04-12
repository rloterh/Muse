# Muse — Phase 2: Three.js Hero, GSAP Scroll & WebGL

## Overview
**Duration:** 2 weeks (4 sprints)  
**Goal:** Three.js 3D hero scene with interactive geometry, GSAP ScrollTrigger for parallax and horizontal scroll, custom magnetic cursor, and scroll-triggered text animations.

---

## Sprint Breakdown

### Sprint 2.1 — Three.js Hero Scene (Days 1-4)
- React Three Fiber setup with Suspense fallback
- Floating geometric shapes (torus, octahedron, icosahedron)
- Mouse-reactive camera movement
- Custom shader material with copper/gold tones
- Performance: adaptive DPR, frame limiting on low-end

### Sprint 2.2 — GSAP ScrollTrigger (Days 5-8)
- GSAP + ScrollTrigger registration
- Parallax text reveals on homepage
- Horizontal scroll section for featured work
- Pin-and-scrub sections
- Number counter animations on stats

### Sprint 2.3 — Custom Cursor & Micro-interactions (Days 9-11)
- Magnetic cursor that scales on interactive elements
- Cursor blend mode for contrast on dark/light
- Hover magnetic pull on buttons and links
- Smooth scroll with Lenis

### Sprint 2.4 — Integration & Polish (Days 12-14)
- Wire Three.js into homepage hero slot
- Combine GSAP + Framer Motion without conflicts
- Preloader with progress bar
- Reduced motion fallbacks
- Performance audit (60fps target)

---

## New Dependencies

```bash
npm install three @react-three/fiber @react-three/drei gsap @studio-freight/lenis
npm install -D @types/three
```
