# Boletapp: historia del proyecto (spec de diseño)

Página: `/projects/boletapp` (ruta existente `src/app/(site)/projects/[slug]`). La historia reemplaza las viñetas genéricas
registrándose en `projectScrollytelling` (`src/components/sections/Projects/stories/index.ts`).
Bilingüe: todo texto con `es ? "…" : "…"` como en `IeTowerScrollytelling.tsx` (copy inline, no en el diccionario i18n).

## Reglas duras
- Sin nombres de clientes ni organizadores reales, sin PII, sin cifras de negocio (ventas, órdenes, usuarios, fees).
  Los eventos que se muestran son ficticios: «Noche de Clave», «Perreo Neón Vol. 4», etc. y la org «Noche Pacífica».
- El QR antifraude se describe SOLO como «QR rotativo con HMAC» / "HMAC-based rotating QR". Nada de períodos de derivación,
  formatos de payload, nombres de claves, algoritmos de KMS, ni pasos replicables. Lo mismo para todo el stack: qué y por qué,
  nunca el paso a paso (la empresa puede reactivarse).
- Repo privado: sin enlace a GitHub. El sitio vivo (boletapp.co) se enlaza como "Visit the archived site" solo si responde.
- Estado final honesto: «En producción de julio a noviembre de 2026. Apps aprobadas en App Store y Google Play. Cerré la empresa
  en noviembre de 2026.» / "In production from July to November 2026, with apps approved on the App Store and Google Play.
  I closed the company in November 2026."
- Rendimiento (memoria del repo): nada de capas `position: fixed` a pantalla completa que se repinten por frame, nada de
  `filter`/`mask` animados sobre secciones, posiciones por frame en CSS vars o refs (nunca useState), canvas sin
  reasignar width/height por frame, pausar animaciones fuera de viewport (IntersectionObserver), `prefers-reduced-motion`
  respetado en TODO (estado final estático). La sustancia nunca depende de que una animación termine.
- Sin dependencias nuevas. Disponibles: framer-motion, gsap, lucide-react, tailwind v4.
- Comentarios de CSS solo ASCII (Lightning CSS rompe con box-drawing Unicode).

## Piel de producto
El cromo de la página es el del portafolio (tema claro/oscuro). Dentro de los `StoryStage` y en las réplicas usamos la piel
de Boletapp, siempre oscura (es "la pantalla del producto"), en ambos temas:
- ink `#06070C`, ink-2 `#0E1424`, cobalto `#1457D9`, dorado `#F4B91A`, blanco, gris `#8A93A6`.
- Tipografía: la del portafolio para prosa; dentro de las réplicas, titulares itálicos bold (Bricolage Grotesque si ya está
  cargada en el portafolio; si no, la fuente display del sitio con `font-style: italic; font-weight: 800`).
- Esquinas 24-28 px, sombra profunda, borde 1 px blanco al 8 %.

## Estructura (orden de la página)

0. **Réplica del hero de boletapp.co** (`BoletappHeroReplica`), a ancho de contenido, tarjeta redondeada de 28 px,
   alto `min(88vh, 860px)`, video de rumba en loop a sangre. Al entrar en viewport por primera vez corre la intro de marca:
   máscara SVG del wordmark «Boletapp» que escala desde la «t» hasta destapar el video (1150 ms
   cubic-bezier(.76,0,.24,1), 220 ms de espera, sin fundido de opacidad). Luego, el titular «Tu boleta,» + palabra rodante
   en dorado con resplandor que cicla (sin complique / en el celular / sin recargos / de una), subtítulo y dos botones falsos
   («Ver la app», «Ver eventos»). Pie de la tarjeta, chip pequeño: «Réplica del hero de boletapp.co» / "Replica of the
   boletapp.co hero". Reduce-motion: sin intro, primera palabra fija.
   Debajo, banda meta: rol («Fundador técnico y único desarrollador»), período («jun – nov 2026»), estado («Cerrado»),
   chips de stack, y botón «Ver el video (1:27)» que hace scroll al capítulo del video.

1. **01 · El problema.** Stage: un celular con un pantallazo de boleta que se "reenvía" 3 veces (copias que se apilan) y un
   sello rojo «Ya usada» sobre las copias. Prosa: el pantallazo por WhatsApp entra dos veces, comisiones de RRPP que nadie
   cuadra, mesas reservadas que no se pagan. Tono: fundador explicando, no pitch.

2. **02 · Una plataforma, cuatro superficies.** Stage: cuatro tarjetas que entran escalonadas: Web del fan · App del fan ·
   Panel y app Pro · La puerta. Prosa: qué es Boletapp en una frase, para quién (vida nocturna y conciertos en Colombia),
   marca blanca total (el fan compra bajo la marca del local).

3. **03 · Para el fan.** Stage: réplica del cilindro 3D «Lo que se viene» (`BoletappCylinder`) con los 6 afiches ficticios
   girando y el titular DENTRO de la escena 3D (tarjetas de atrás pasan detrás del texto). Después, clip
   `videos/boletapp/fan-web.mp4` en marco de navegador. Prosa: descubrir, elegir, pagar con medios locales (tarjeta, PSE,
   Nequi), la boleta llega al correo y a la app.

4. **04 · La boleta que no se puede reenviar.** Stage interactivo `RotatingTicket`: boleta Boletapp (cabecera negra con
   título del evento ficticio, cuerpo blanco) con un QR que cambia cada 10 s con anillo de cuenta regresiva; botón
   «Hacer pantallazo» que congela una copia al lado y, al pasar el período, la copia muestra «Código vencido» en rojo.
   QR: patrón generado (puntos en cuadrícula pseudo-aleatoria + tres ojos de posición), NO un QR escaneable real.
   Prosa: QR rotativo con HMAC, funciona sin datos, el pantallazo vence. Sin detalles de implementación.

5. **05 · La puerta.** Stage `DoorScanner`: teléfono de portero; entran boletas en fila, veredicto verde «Entra», ámbar «Ya
   entró», rojo «No válida»; un interruptor «Sin señal» que sigue validando y luego «Sincronizando 3 lecturas». Prosa:
   validación offline-first, varias puertas a la vez, un solo uso garantizado al reconciliar.

6. **06 · El organizador.** Stage: clip `videos/boletapp/panel.mp4` en marco de navegador + contadores animados (cifras de
   la org DEMO, ficticias, etiquetadas como «datos de demostración»). Prosa: ventas, aforo en vivo, RRPP con link y comisión,
   clientes, finanzas, marca blanca y editor de planos.

7. **07 · Boletabot.** Stage: clip `videos/boletapp/boletabot.mp4` en navegador + en un costado el clip nativo
   `videos/boletapp/app-pro.mp4` en marco de iPhone. Prosa: asistente del organizador que responde con sus datos, arma
   tablas y gráficas, y no ejecuta nada sin confirmación.

8. **08 · Dos apps, una base de código.** Stage: dos iPhones (`app-fan-qr.mp4`, `app-pro.mp4`) y badges «App Store» y
   «Google Play» con texto «Aprobadas». Prosa: Expo/React Native, dos apps de tienda desde un solo código, publicación.

9. **09 · Infraestructura.** Stage `InfraDiagram` (SVG animado, sin librerías): capas Cliente (web, app fan, app Pro) →
   Vercel (Next.js, BFF) → Cloud Run (API FastAPI modular) → Cloud SQL (PostgreSQL con RLS por organización) y a los lados
   GCS, Cloud KMS, pasarela de pagos, correo, SMS, LLM, CI/CD. Los paquetes de datos viajan por las aristas (puntos que
   recorren el path con `offset-path` o `stroke-dashoffset`, pausados fuera de viewport). Logos en
   `images/projects/boletapp/stack/*.svg`. Grilla de cifras con `StoryStat` (ver «Cifras»). Prosa: por qué cada pieza,
   en una línea cada una, sin paso a paso.

10. **10 · El video.** Video completo `videos/boletapp/product.mp4` (poster `product-poster.jpg`), controles nativos,
    sin autoplay con sonido. Ancla `id="boletapp-video"`.

11. **11 · Cómo terminó.** Estado final honesto (ver reglas), qué aprendí (3 líneas: construir solo de punta a punta, que
    sin alguien en la calle vendiendo un B2B no despega, y operar pagos reales en producción), y que el código queda guardado
    para retomarlo.

## Cifras (del repo, nov 2026; usar redondeadas como aparecen aquí)
- ≈ 370.000 líneas de código (Python, TypeScript, SQL)
- 545 commits en 5 meses (jun – nov 2026)
- 95 migraciones de base de datos
- 20+ módulos de dominio en el backend
- 1.700+ tests en Python y 275 archivos de test en TypeScript
- 96 páginas web y 199 rutas BFF
- 80 pantallas en las apps
- 2 apps publicadas desde una sola base de código

## Assets (rutas públicas)
`public/videos/boletapp/`: rumba-720.mp4, rumba-720.webm, rumba-poster.jpg, fan-web.mp4, panel.mp4, boletabot.mp4,
app-fan-qr.mp4, app-pro.mp4, product.mp4, product-poster.jpg.
`public/images/projects/boletapp/`: flyers/*.webp (6 afiches ficticios), stack/*.svg (logos), thumb.webp.
Si un asset no existe aún, el componente debe renderizar igual (poster o placeholder neutro), nunca romper.

## Archivos
`src/components/sections/Projects/stories/boletapp/`:
- `BoletappHeroReplica.tsx`, `BoletappCylinder.tsx`, `boletappWordmark.ts` (paths del logo) — réplicas.
- `RotatingTicket.tsx`, `DoorScanner.tsx`, `InfraDiagram.tsx`, `ProductFrames.tsx` (BrowserFrame, PhoneFrame, ClipVideo).
- `BoletappStory.tsx` — la historia completa.
Estilos nuevos en `src/app/globals.css` bajo un bloque `/* boletapp story */` con prefijo de clase `bp-`.
