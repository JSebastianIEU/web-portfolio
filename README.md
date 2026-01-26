# Personal Portfolio · Next.js App Router
Portfolio for Juan Sebastian Peña with a custom cursor/spotlight, canvas-based skills network, bilingual copy (ES/EN), and sectionized layout for easy extensions.

## Tech stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS (v4 pipeline) + custom glass/grid styling
- Canvas skills graph with a deterministic simulation
- Resend email API for the contact form
- Context providers for theme and language persistence

## Run locally
```bash
npm install
npm run dev
# npm run lint
```
Open http://localhost:3000.

## Environment
Create a `.env.local` with:
```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=...
CONTACT_FROM_EMAIL=...
```
The contact API short-circuits if any of these are missing.

## Architecture map
- `app/(site)/`: pages (`page.tsx`, `projects/`, `contact/`, dynamic `[slug]`), `SiteChrome` handles header/footer/background.
- `src/components/layout/`: header, footer, social rail, spotlight/grid layers, section shell.
- `src/components/sections/`: About, Skills (desktop canvas + mobile grid), Projects (cards/carousel/modal/detail), Contact (form + actions).
- `src/data/`: `projectsData.ts`, `skillsData.ts`, `navLinks.ts`, `siteConfig.ts`, `contactCopy.ts`.
- `src/domain/`: types + logic (`projects`, `skills` graph helpers, `i18n` copy, `contact` validation).
- `src/lib/`: small helpers (`env`, `cn`, `id`, `safe`).
- `src/services/email/`: Resend client + contact email helper.
- `src/styles/tokens.css`: design tokens and CSS variables.

Content lives in `src/data` and `src/domain/i18n`; UI components only consume that data so adding new projects/skills/copy stays data-driven.
