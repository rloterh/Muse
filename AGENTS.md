# AGENTS.md

## Project mission
Build enterprise-grade, visually premium, maintainable software.
The result must be product-quality, not demo-quality.

## Typical stack assumptions
- Next.js
- React + TypeScript
- Tailwind CSS
- Zustand
- Supabase
- Vercel and/or Cloudflare
- Framer Motion for restrained UI motion
- optional Three.js / WebGL only when justified

## Product engineering standards
- preserve existing architecture unless there is a clear reason to improve it
- favor maintainable solutions over trendy ones
- keep state ownership explicit
- keep data flow understandable
- keep components composable and easy to test
- avoid accidental complexity

## Visual quality bar
The product should feel:
- premium
- clean
- structured
- modern
- polished
- trustworthy

### Design system rules
- typography must be clear and deliberate
- spacing must be consistent across sections and breakpoints
- surfaces, borders, radius, shadows, and color usage must feel intentional
- avoid clutter and over-decoration
- do not ship raw defaults without refinement

### Interaction rules
Handle all critical states:
- default
- hover
- focus
- active / pressed
- disabled
- loading
- empty
- error
- success where relevant

### Motion rules
- use motion to improve clarity and feel
- avoid motion that competes with content
- keep motion performant and restrained
- respect reduced-motion needs if applicable

## Accessibility
- semantic HTML first
- full keyboard usability
- visible focus states
- readable contrast
- labels and helper text where needed

## Data and backend rules
- never assume schema details; verify them
- keep validation close to the boundary
- be careful with auth, permissions, and row-level access patterns
- handle failure paths explicitly
- keep domain logic out of presentation layers when possible

## Performance rules
- avoid wasteful renders
- lazy load where useful
- optimize media-heavy sections
- be cautious with large client-only trees
- be mindful of animation and 3D cost

## Definition of done
A task is not done until:
- it works correctly
- it fits the project quality bar
- edge cases are considered
- regressions are considered
- the result is production-ready
