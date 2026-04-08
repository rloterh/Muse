# Muse — Creative Agency Portfolio

An award-caliber creative agency portfolio built with Next.js, Three.js, GSAP, Framer Motion, and Sanity CMS. Dark cinematic aesthetic designed to win Awwwards.

## Live Features

- **Three.js 3D Hero** — Floating copper & dark geometric shapes with mouse-parallax camera, particle field, and environment lighting
- **GSAP ScrollTrigger** — Parallax text, horizontal scroll work reel, number counter animations, text split reveals, scrub-scale effects
- **Custom Cursor** — Dot + ring with mix-blend-difference, scales on interactive elements, desktop-only
- **Framer Motion** — Page transitions, stagger reveals, navigation overlay animations
- **Smooth Scroll** — Lenis momentum scroll synced with GSAP ticker
- **Preloader** — Progress bar loading screen while WebGL initializes
- **Sanity CMS** — Case studies, team, services, homepage content (works in demo mode without Sanity)
- **Contact API** — Rate-limited form with Resend email notifications
- **Portable Text** — Rich content rendering with custom block serializers
- **Image Optimization** — Sanity URL builder with blur placeholders via next/image
- **SEO** — Dynamic metadata, JSON-LD structured data, sitemap, robots.txt, OG image generation

## Design Direction

| Element | Choice |
|---------|--------|
| **Aesthetic** | Dark cinematic luxury |
| **Display font** | Syne (geometric, architectural) |
| **Body font** | Outfit (clean, modern) |
| **Background** | #0A0A0A (near-black) |
| **Text** | #E8E4DE (warm off-white) |
| **Accent** | #C8956C (copper/gold) |
| **Corners** | Sharp (zero border-radius) |
| **Details** | Film grain overlay, dramatic negative space |

## Tech Stack

```
Next.js 16        React 19           TypeScript 5.7+
Tailwind CSS 4    Three.js (r170)    @react-three/fiber 8
GSAP 3.12         Framer Motion 12   Lenis (smooth scroll)
Sanity CMS        @portabletext/react
```

## Pages

| Page | Route | Features |
|------|-------|----------|
| Home | `/` | Three.js hero, horizontal scroll reel, GSAP parallax, counter stats, marquee |
| Work | `/work` | Case study grid with stagger animations |
| Case Study | `/work/[slug]` | Portable text, gallery, testimonial, next project |
| About | `/about` | Team grid, values, timeline |
| Services | `/services` | Service list with feature tags, 4-step process |
| Contact | `/contact` | Multi-field form with API, service/budget selectors |

## Quick Start

```bash
# 1. Create project
npx create-next-app@latest muse --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd muse

# 2. Install dependencies
npm install framer-motion three @react-three/fiber @react-three/drei \
  gsap @studio-freight/lenis @portabletext/react \
  next-sanity @sanity/client @sanity/image-url \
  clsx tailwind-merge lucide-react
npm install -D @types/three

# 3. Drop in source files
# Copy src/, sanity/, and config files from the zip

# 4. Environment (optional — works without Sanity/Resend)
cp .env.example .env.local

# 5. Run
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (Three.js + GSAP)
│   ├── work/                 # Case study grid + detail
│   ├── about/                # Team, values, timeline
│   ├── services/             # Service offerings
│   ├── contact/              # Contact form
│   ├── api/
│   │   ├── contact/          # Form submission endpoint
│   │   └── og/               # OG image generation
│   ├── sitemap.ts            # Dynamic XML sitemap
│   └── robots.ts             # Crawler directives
├── components/
│   ├── three/                # Three.js hero scene
│   ├── gsap/                 # GSAP scroll animations
│   ├── layout/               # Navigation overlay, footer
│   ├── ui/                   # Reveal, marquee, cursor, preloader, portable text
│   └── providers/            # Page transitions, smooth scroll
├── lib/
│   ├── sanity/               # CMS client, GROQ queries, ISR fetchers
│   ├── seo/                  # Structured data, metadata helpers
│   └── email/                # Resend integration
└── types/                    # TypeScript definitions
```

## Sanity CMS (Optional)

The site works fully in demo mode with static data. To enable CMS:

1. Create a project at [sanity.io](https://sanity.io)
2. Add schemas from `sanity/schemas/index.ts` (caseStudy, service, teamMember, homepage)
3. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`
4. Content revalidates via ISR every 60 seconds

## Deployment

```bash
# Vercel (recommended)
vercel deploy

# Docker
docker build -t muse .
docker run -p 3000:3000 muse
```

Set these environment variables in Vercel:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (if using CMS)
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_APP_URL` = your production domain
- `RESEND_API_KEY` (if using email)
- `CONTACT_EMAIL`

## Performance Targets

- **Lighthouse**: 95+ across all categories
- **Three.js**: Lazy loaded, adaptive DPR, 60fps target
- **GSAP**: Dynamic import, no SSR conflicts
- **Fonts**: `display: swap`, preconnected
- **Images**: next/image with blur placeholders, responsive sizes

## License

MIT
