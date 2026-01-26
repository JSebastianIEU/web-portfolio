# Personal Portfolio · Next.js App Router
Portfolio for Juan Sebastian Peña with a custom cursor/spotlight, canvas-based skills network, bilingual copy (ES/EN), and sectionized layout for easy extensions.

## Tech stack
- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS (v4 pipeline) + custom glass/grid styling
- Canvas skills graph simulation
- Resend email API (contact form)
- Theme and language providers

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
- `app/(site)/`: routes only (`page.tsx`, `projects/`, `contact/`, dynamic `[slug]`); UI lives in `src/components`.
- `src/components/layout/`: header, footer, social rail, background grid/spotlight, section shell.
- `src/components/sections/`: About, Skills (desktop canvas + mobile grid), Projects (cards/carousel/modal/detail/detail-screen), Contact, shared CTA.
- `src/data/`: static content (`projectsData.ts`, `skillsData.ts`, `navLinks.ts`, `siteConfig.ts`, `contactCopy.ts`).
- `src/domain/`: types + pure logic (`projects` selectors, `skills` graph helpers, `i18n` copy/types, `contact` validation).
- `src/lib/`: small helpers (`env`, `cn`, `id`, `safe`); `src/services/email/`: Resend client + contact email helper.
- `src/styles/tokens.css`: design tokens and CSS variables; assets live in `public/documents`, `public/logos`, `public/images`.

Content lives in `src/data` and `src/domain/i18n`; UI components consume that data so adding new projects/skills/copy stays data-driven.
