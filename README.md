# Web Portfolio · Next.js + Spline + Motion
Portafolio personal enfocado en experiencias inmersivas con Spline, animaciones 3D al hacer scroll, modo claro/oscuro y contenido bilingüe (ES/EN). Inspirado en el flujo narrativo de [Mitchell Sparrow](https://github.com/MitchellSparrow/portfolioWebsite) y [mitchellsparrow.com](https://www.mitchellsparrow.com/).

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript.
- Tailwind CSS 4 (nuevo pipeline `@tailwindcss/postcss`), diseño con gradientes y glassmorphism.
- Framer Motion para animaciones on-scroll y microinteracciones 3D.
- Spline runtime (`@splinetool/react-spline`) para el hero tridimensional.
- i18n ligero con toggle ES/EN y modo claro/oscuro persistente.

## Cómo ejecutarlo
```bash
npm install
npm run dev
# npm run lint   # valida estilo/TS
# npm run build  # build de producción
```
Abre http://localhost:3000.

## Estructura clave
- `src/app/page.tsx`: layout completo de la landing, secciones, data bilingüe y Spline.
- `src/app/layout.tsx`: fuentes (Space Grotesk + Sora), providers de tema e idioma.
- `src/app/globals.css`: tokens de color, fondos y clases utilitarias como `.glass` y `.text-muted`.
- `src/components/providers/*`: contextos de tema e idioma (persisten en `localStorage`).
- `src/components/ui/*`: toggles de tema e idioma.

## Personaliza rápido
1) **Escena Spline:** cambia `splineSceneUrl` en `src/app/page.tsx` por la URL exportada desde Spline (`Export -> Code -> React/Next`).
2) **Proyectos y texto:** edita los arrays `projects`, `services`, `milestones` y `processSteps` en `src/app/page.tsx` (cada string tiene versión ES/EN).
3) **Contactos:** reemplaza `contactEmail`, el enlace de LinkedIn/GitHub y CTA en la sección `Contact`.
4) **Colores/mood:** ajusta variables en `src/app/globals.css` (`--bg`, `--accent`, `--accent-2`, sombras, etc.).
5) **SEO:** actualiza `metadata` en `src/app/layout.tsx` y añade `favicon/og` en `public/` si lo necesitas.

## Inspiración & diferenciadores
- Hero con Spline + gradientes, tarjetas glass y grillas para dar profundidad.
- Animaciones on-scroll con ligeras rotaciones 3D (`framer-motion`) y micro-hover.
- Modo noche/día diseñado (no solo invertido) y copy bilingüe listo desde el inicio.

## Próximos pasos sugeridos
- Añadir tu PDF de CV y enlaces reales a estudios/casos (botones “View project/Ver proyecto”).
- Integrar analytics (Vercel/GA/Logrocket) y métricas de scroll/engagement.
- Conectar un formulario de contacto (Resend/Formspree) o una agenda (Cal/Calendly).
