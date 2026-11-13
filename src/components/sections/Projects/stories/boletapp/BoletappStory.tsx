"use client";

import { useRef } from "react";
import { Globe, LayoutDashboard, ScanLine, Smartphone } from "lucide-react";
import type { Locale } from "@/domain/i18n";
import { StoryBeat, StoryChapter, StoryProse, StoryStage, StoryStat } from "../../story/StoryScene";
import AppStoreShowcase from "./AppStoreShowcase";
import BoletappCylinder from "./BoletappCylinder";
import BoletappHeroReplica from "./BoletappHeroReplica";
import DoorScanner from "./DoorScanner";
import InfraDiagram from "./InfraDiagram";
import { BrowserFrame, ClipVideo, PhoneFrame, useInView, usePrefersReducedMotion } from "./ProductFrames";
import RotatingTicket, { QrArt } from "./RotatingTicket";

type Props = { isDark: boolean; lang: Locale };

const V = "/videos/boletapp";
const VIDEO_ANCHOR = "boletapp-video";

/** A small static Boletapp ticket, used where the QR does not need to move. */
function MiniTicket({ es, seed }: { es: boolean; seed: number }) {
  return (
    <div className="bp-mini-ticket">
      <div className="bp-ticket-head">
        <span className="bp-ticket-org">Noche Pacífica</span>
        <span className="bp-ticket-title">Perreo Neón Vol. 4</span>
      </div>
      <div className="bp-ticket-body">
        <QrArt seed={seed} label={es ? "QR de la boleta (ilustrativo)" : "Ticket QR (illustrative)"} />
      </div>
    </div>
  );
}

/** Chapter 01: one screenshot, forwarded three times, stamped at the door. */
function ForwardedScreenshot({ es }: { es: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, true);
  return (
    <div ref={ref} className="bp-fwd" data-on={on ? "true" : undefined}>
      <PhoneFrame className="bp-fwd-phone">
        <div className="bp-fwd-screen">
          <MiniTicket es={es} seed={7} />
        </div>
      </PhoneFrame>
      <div className="bp-fwd-stack" aria-hidden>
        <span className="bp-fwd-tag">{es ? "Reenviado 3 veces" : "Forwarded 3 times"}</span>
        {[0, 1, 2].map((i) => (
          <div key={i} className="bp-fwd-copy" style={{ ["--i" as string]: i }}>
            <MiniTicket es={es} seed={7} />
          </div>
        ))}
        <span className="bp-stamp">{es ? "Ya usada" : "Already used"}</span>
      </div>
    </div>
  );
}

/** Chapter 02: the four surfaces, staggered in once. */
function Surfaces({ es }: { es: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, true);
  const items = [
    { Icon: Globe, t: es ? "Web del fan" : "Fan web", d: es ? "Descubrir, comprar, pagar" : "Discover, buy, pay" },
    { Icon: Smartphone, t: es ? "App del fan" : "Fan app", d: es ? "La boleta vive en el celular" : "The ticket lives on the phone" },
    {
      Icon: LayoutDashboard,
      t: es ? "Panel y app Pro" : "Dashboard and Pro app",
      d: es ? "Ventas, aforo, RRPP, finanzas" : "Sales, capacity, promoters, finance",
    },
    { Icon: ScanLine, t: es ? "La puerta" : "The door", d: es ? "Escáner sin señal" : "Scanner with no signal" },
  ];
  return (
    <div ref={ref} className="bp-surfaces" data-on={on ? "true" : undefined}>
      {items.map(({ Icon, t, d }, i) => (
        <div key={t} className="bp-surface" style={{ ["--i" as string]: i }}>
          <Icon size={20} aria-hidden />
          <span className="bp-surface-title">{t}</span>
          <span className="bp-surface-sub">{d}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Boletapp told as a story: the replica of the real hero, then eleven
 * chapters from the problem to how it ended. Copy is inline (ES/EN) like the
 * other stories. Hard rules from docs/boletapp-story.md: no real clients, no
 * PII, no business numbers (the demo org's figures are labelled as such), the
 * anti-fraud QR is only ever "HMAC-based rotating QR", and nothing is a
 * step-by-step recipe.
 */
export default function BoletappStory({ isDark, lang }: Props) {
  const es = lang === "es";
  const reduced = usePrefersReducedMotion();

  const goToVideo = () =>
    document.getElementById(VIDEO_ANCHOR)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

  const stack = ["Next.js", "TypeScript", "Expo", "FastAPI", "PostgreSQL", "Google Cloud", "Vercel"];

  const figures = [
    { v: es ? "≈ 370.000" : "≈ 370,000", l: es ? "líneas de código (Python, TypeScript, SQL)" : "lines of code (Python, TypeScript, SQL)", a: true },
    { v: "545", l: es ? "commits en 5 meses" : "commits in 5 months" },
    { v: "95", l: es ? "migraciones de base de datos" : "database migrations" },
    { v: "20+", l: es ? "módulos de dominio en el backend" : "domain modules in the backend" },
    { v: es ? "1.700+" : "1,700+", l: es ? "tests en Python" : "Python tests" },
    { v: "275", l: es ? "archivos de test en TypeScript" : "TypeScript test files" },
    { v: "96", l: es ? "páginas web" : "web pages" },
    { v: "199", l: es ? "rutas BFF" : "BFF routes" },
    { v: "80", l: es ? "pantallas en las apps" : "app screens" },
    { v: "2", l: es ? "apps publicadas desde una sola base de código" : "store apps from one codebase" },
  ];

  return (
    <div className="flex flex-col">
      {/* 00 - The real hero, rebuilt, plus the meta band */}
      <div className="bp-hero-block">
        <BoletappHeroReplica isDark={isDark} lang={lang} />
        <div className="bp-meta">
          <dl className="bp-meta-facts">
            <div>
              <dt>{es ? "Rol" : "Role"}</dt>
              <dd>{es ? "Fundador técnico y único desarrollador" : "Technical founder and sole developer"}</dd>
            </div>
            <div>
              <dt>{es ? "Período" : "Period"}</dt>
              <dd>{es ? "jun – nov 2026" : "Jun – Nov 2026"}</dd>
            </div>
            <div>
              <dt>{es ? "Estado" : "Status"}</dt>
              <dd>{es ? "Cerrado" : "Closed"}</dd>
            </div>
          </dl>
          <ul className="bp-meta-stack">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <a href="/boletapp" className="bp-meta-video bp-meta-replica" data-cursor="pointer">
            {es ? "Abrir la réplica navegable" : "Open the browsable replica"}
          </a>
          <button type="button" className="bp-meta-video" onClick={goToVideo} data-cursor="pointer">
            {es ? "Ver el video (1:27)" : "Watch the video (1:27)"}
          </button>
        </div>
      </div>

      {/* 01 - The problem */}
      <StoryChapter index="01" eyebrow={es ? "El problema" : "The problem"}>
        <StoryStage>
          <ForwardedScreenshot es={es} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "El pantallazo entra dos veces" : "The screenshot gets in twice"}>
            {es
              ? "En la puerta de una discoteca, la boleta suele ser una imagen. Alguien le toma pantallazo y la manda por WhatsApp; el primero que llega entra y el segundo arma el problema en la fila. El local ni siquiera sabe cuántas boletas de verdad vendió."
              : "At a club door, the ticket is usually just an image. Someone screenshots it and sends it over WhatsApp; whoever arrives first gets in, and the second person starts an argument in the line. The venue doesn't even know how many real tickets it sold."}
          </StoryBeat>
          <StoryBeat title={es ? "Comisiones que nadie cuadra" : "Commissions nobody can reconcile"}>
            {es
              ? "Los RRPP venden por su red y cobran comisión. Sin un link que deje rastro, la cuenta se hace de memoria el martes y termina en discusión."
              : "Promoters sell through their own network and earn a commission. Without a link that leaves a trail, the numbers get done from memory on Tuesday and end in an argument."}
          </StoryBeat>
          <StoryBeat title={es ? "La mesa que nadie paga" : "The table nobody pays for"}>
            {es
              ? "Las mesas se reservan por chat. Si nadie llega, el local se queda con la mesa vacía y sin cobrar la noche."
              : "Tables get booked over chat. If nobody shows up, the venue is left with an empty table and nothing to show for the night."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 02 - One platform, four surfaces */}
      <StoryChapter index="02" eyebrow={es ? "Una plataforma, cuatro superficies" : "One platform, four surfaces"}>
        <StoryStage>
          <Surfaces es={es} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Boletapp en una frase" : "Boletapp in one sentence"}>
            {es
              ? "Una plataforma de boletería y control de acceso para vida nocturna y conciertos en Colombia: el fan compra, la boleta vive en su celular, la puerta la valida y el organizador lo ve todo en vivo."
              : "A ticketing and access-control platform for nightlife and concerts in Colombia: the fan buys, the ticket lives on their phone, the door validates it and the organizer sees everything live."}
          </StoryBeat>
          <StoryBeat title={es ? "Marca blanca total" : "Fully white-label"}>
            {es
              ? "El fan compra en la página del local, con su logo y sus colores. Boletapp no aparece por ningún lado: la relación con el público es del organizador."
              : "The fan buys on the venue's own page, with its logo and colors. Boletapp doesn't appear anywhere: the relationship with the audience belongs to the organizer."}
          </StoryBeat>
          <StoryBeat title={es ? "Cuatro superficies, un backend" : "Four surfaces, one backend"}>
            {es
              ? "La web del fan, la app del fan, el panel con su app Pro y la puerta hablan con la misma API y la misma base de datos."
              : "The fan web, the fan app, the dashboard with its Pro app and the door all talk to the same API and the same database."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 03 - For the fan */}
      <StoryChapter index="03" eyebrow={es ? "Para el fan" : "For the fan"}>
        <div className="md:col-span-2 mb-10">
          <BoletappCylinder lang={lang} />
        </div>
        <StoryStage>
          <BrowserFrame url="noche-pacifica.boletapp.co" className="w-full">
            <ClipVideo
              src={`${V}/fan-web.mp4`}
              poster={`${V}/fan-web-poster.jpg`}
              label={es ? "Compra de una boleta en la web del fan" : "Buying a ticket on the fan web"}
            />
          </BrowserFrame>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Descubrir y elegir" : "Discover and choose"}>
            {es
              ? "Afiches, fechas, tipos de boleta y mesas, pensado primero para el celular, que es donde se compra."
              : "Posters, dates, ticket types and tables, designed phone-first, because that is where people buy."}
          </StoryBeat>
          <StoryBeat title={es ? "Pagar como se paga en Colombia" : "Paying the way Colombia pays"}>
            {es
              ? "Tarjeta, PSE y Nequi en el mismo checkout. Se pide lo mínimo que ese evento necesita: nombre, correo y teléfono."
              : "Card, PSE and Nequi in the same checkout. It asks for the minimum that event needs: name, email and phone."}
          </StoryBeat>
          <StoryBeat title={es ? "La boleta llega sola" : "The ticket just arrives"}>
            {es
              ? "Al correo y a la app, lista para la puerta. Sin descargar nada para comprar."
              : "To the inbox and the app, ready for the door. Nothing to install to buy."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 04 - The ticket you can't forward */}
      <StoryChapter index="04" eyebrow={es ? "La boleta que no se puede reenviar" : "The ticket you can't forward"}>
        <StoryStage>
          <RotatingTicket lang={lang} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Un QR que no se queda quieto" : "A QR that won't sit still"}>
            {es
              ? "Cada boleta lleva un QR rotativo con HMAC: el código cambia cada pocos segundos y solo el celular del dueño de la boleta sabe generarlo."
              : "Every ticket carries an HMAC-based rotating QR: the code changes every few seconds and only the ticket holder's phone knows how to produce it."}
          </StoryBeat>
          <StoryBeat title={es ? "Funciona sin datos" : "Works with no data"}>
            {es
              ? "El código se genera en el teléfono, sin conexión. En la fila de una discoteca la señal es lo primero que falla."
              : "The code is generated on the phone, offline. In a club line, signal is the first thing to go."}
          </StoryBeat>
          <StoryBeat title={es ? "El pantallazo vence" : "The screenshot expires"}>
            {es
              ? "Pruébalo: toma un pantallazo y espera. Para cuando llegue por WhatsApp a otro celular, ese código ya no abre la puerta."
              : "Try it: take a screenshot and wait. By the time it reaches another phone over WhatsApp, that code no longer opens the door."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 05 - The door */}
      <StoryChapter index="05" eyebrow={es ? "La puerta" : "The door"}>
        <StoryStage>
          <DoorScanner lang={lang} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Offline-first" : "Offline-first"}>
            {es
              ? "El portero escanea desde el navegador de cualquier celular. Si se cae la señal, sigue validando en el teléfono; prueba el interruptor."
              : "The doorman scans from any phone's browser. If the signal drops, the phone keeps validating on its own; try the switch."}
          </StoryBeat>
          <StoryBeat title={es ? "Varias puertas a la vez" : "Several doors at once"}>
            {es
              ? "Cada puerta valida por su cuenta. Cuando vuelve la señal, las lecturas se reconcilian y una boleta entra una sola vez, aunque la hayan mostrado en dos puertas."
              : "Each door validates on its own. When signal comes back the reads reconcile, and a ticket gets in exactly once, even if it was shown at two doors."}
          </StoryBeat>
          <StoryBeat title={es ? "Tres respuestas" : "Three answers"}>
            {es
              ? "Entra, Ya entró o No válida. Nada que interpretar a las dos de la mañana."
              : "Admit, Already in or Not valid. Nothing to interpret at two in the morning."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 06 - The organizer */}
      <StoryChapter index="06" eyebrow={es ? "El organizador" : "The organizer"}>
        <StoryStage>
          <div className="flex w-full flex-col gap-6">
            <BrowserFrame url="boletapp.co/org" className="w-full">
              <ClipVideo
                src={`${V}/panel.mp4`}
                poster={`${V}/panel-poster.jpg`}
                label={es ? "Panel del organizador" : "Organizer dashboard"}
              />
            </BrowserFrame>
            <div className="flex flex-col gap-3">
              <span className="bp-demo-tag">{es ? "Datos de demostración" : "Demo data"}</span>
              <div className="bp-demo-grid">
                <StoryStat value={es ? "COP 173.855.000" : "COP 173,855,000"} label={es ? "Ingresos · 90 días" : "Revenue · 90 days"} />
                <StoryStat value={es ? "2.253" : "2,253"} label={es ? "Boletas" : "Tickets"} />
                <StoryStat value={es ? "1.370" : "1,370"} label="Check-ins" />
                <StoryStat value={es ? "517 / 2.850" : "517 / 2,850"} label={es ? "Aforo en vivo" : "Live capacity"} />
              </div>
            </div>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Lo que mira el organizador" : "What the organizer watches"}>
            {es
              ? "Ventas por tipo de boleta y aforo en vivo, la noche del evento y los días antes."
              : "Sales by ticket type and live capacity, on the night and in the days before."}
          </StoryBeat>
          <StoryBeat title={es ? "RRPP con link y comisión" : "Promoters with a link and a commission"}>
            {es
              ? "Cada RRPP vende con su propio link y cada venta queda atada a él, con su comisión calculada. Se acabó la hoja de cálculo del martes."
              : "Each promoter sells with their own link and every sale stays tied to them, commission included. No more Tuesday spreadsheet."}
          </StoryBeat>
          <StoryBeat title={es ? "Clientes, finanzas y planos" : "Customers, finance and floor plans"}>
            {es
              ? "Base de clientes con su consentimiento, finanzas del evento, la página con la marca del local y un editor para dibujar el lugar y sus mesas."
              : "A customer base with consent, event finance, the venue-branded page and an editor to draw the venue and its tables."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 07 - Boletabot */}
      <StoryChapter index="07" eyebrow="Boletabot">
        <StoryStage>
          <div className="bp-bot">
            <BrowserFrame url="boletapp.co/org/boletabot" className="w-full">
              <ClipVideo
                src={`${V}/boletabot.mp4`}
                poster={`${V}/boletabot-poster.jpg`}
                label={es ? "Boletabot respondiendo en el panel" : "Boletabot answering in the dashboard"}
              />
            </BrowserFrame>
            <PhoneFrame className="bp-bot-phone">
              <ClipVideo
                src={`${V}/app-pro.mp4`}
                poster={`${V}/app-pro-poster.jpg`}
                label={es ? "Boletapp Pro en el celular" : "Boletapp Pro on a phone"}
              />
            </PhoneFrame>
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Pregúntale a tus datos" : "Ask your own data"}>
            {es
              ? "Un asistente dentro del panel que responde con los datos del organizador: cuánto se vendió, qué RRPP está rindiendo, cómo va el aforo."
              : "An assistant inside the dashboard that answers from the organizer's own data: how much sold, which promoter is performing, how capacity is going."}
          </StoryBeat>
          <StoryBeat title={es ? "Tablas y gráficas" : "Tables and charts"}>
            {es
              ? "Responde con tablas y gráficas cuando el número solo no alcanza, en la web y en la app Pro."
              : "It answers with tables and charts when a number alone won't do, on the web and in the Pro app."}
          </StoryBeat>
          <StoryBeat title={es ? "Nada sin confirmar" : "Nothing without a yes"}>
            {es
              ? "Puede proponer cambios, pero no ejecuta nada hasta que el organizador lo confirma."
              : "It can propose changes, but it executes nothing until the organizer confirms."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 08 - Two apps, one codebase */}
      <StoryChapter index="08" eyebrow={es ? "Dos apps, una base de código" : "Two apps, one codebase"}>
        <StoryStage>
          <div className="flex flex-col items-center gap-5">
            <div className="bp-apps">
              <PhoneFrame>
                <ClipVideo
                  src={`${V}/app-fan-qr.mp4`}
                  poster={`${V}/app-fan-qr-poster.jpg`}
                  label={es ? "App del fan con la boleta" : "Fan app showing the ticket"}
                />
              </PhoneFrame>
              <PhoneFrame>
                <ClipVideo
                  src={`${V}/app-pro.mp4`}
                  poster={`${V}/app-pro-poster.jpg`}
                  label={es ? "App Pro del equipo" : "Team Pro app"}
                />
              </PhoneFrame>
            </div>
            <div className="bp-stores">
              <span>App Store</span>
              <span>Google Play</span>
              <em>{es ? "Aprobadas" : "Approved"}</em>
            </div>
            <AppStoreShowcase es={es} />
          </div>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Expo y React Native" : "Expo and React Native"}>
            {es
              ? "Una sola base de código, dos apps de tienda: Boletapp para el fan (la boleta y los eventos) y Boletapp Pro para el equipo (la puerta, el panel en vivo y los RRPP)."
              : "One codebase, two store apps: Boletapp for the fan (the ticket and the events) and Boletapp Pro for the team (the door, the live dashboard and promoters)."}
          </StoryBeat>
          <StoryBeat title={es ? "Dentro del monorepo" : "Inside the monorepo"}>
            {es
              ? "Las apps viven junto a la web y la API, y comparten con la web los tipos y el motor del QR."
              : "The apps live next to the web and the API, and share types and the QR engine with the web."}
          </StoryBeat>
          <StoryBeat title={es ? "Publicadas" : "Published"}>
            {es ? "Las dos pasaron la revisión de App Store y Google Play." : "Both passed App Store and Google Play review."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>

      {/* 09 - Infrastructure */}
      <StoryChapter index="09" eyebrow={es ? "Infraestructura" : "Infrastructure"}>
        <StoryStage>
          <InfraDiagram lang={lang} />
        </StoryStage>
        <StoryProse>
          <StoryBeat title="Vercel + Next.js">
            {es
              ? "La web y un BFF: el navegador nunca habla directo con la API."
              : "The web and a BFF: the browser never talks to the API directly."}
          </StoryBeat>
          <StoryBeat title="Cloud Run + FastAPI">
            {es
              ? "Un monolito modular por dominios: un solo despliegue, fronteras claras entre módulos."
              : "A modular monolith split by domain: one deployment, clear boundaries between modules."}
          </StoryBeat>
          <StoryBeat title={es ? "Cloud SQL + PostgreSQL con RLS" : "Cloud SQL + PostgreSQL with RLS"}>
            {es
              ? "Cada organización solo ve sus propias filas, y eso lo garantiza la base de datos, no la buena memoria del código."
              : "Each organization only sees its own rows, and the database guarantees it, not the code's good memory."}
          </StoryBeat>
          <StoryBeat title={es ? "Llaves, archivos y terceros" : "Keys, files and third parties"}>
            {es
              ? "Las llaves sensibles viven en Cloud KMS y los archivos en Cloud Storage. Pagos, correo, SMS y el LLM de Boletabot son proveedores detrás de la API; GitHub Actions corre los tests y despliega."
              : "Sensitive keys live in Cloud KMS and files in Cloud Storage. Payments, email, SMS and Boletabot's LLM are providers behind the API; GitHub Actions runs the tests and deploys."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>
      {/* Outside the chapter so the sticky diagram can never ride over it. */}
      <section className="bp-figures" aria-label={es ? "Cifras del repositorio" : "Repository figures"}>
        {figures.map((f) => (
          <StoryStat key={f.l} value={f.v} label={f.l} accent={f.a} />
        ))}
      </section>

      {/* 10 - The video */}
      <StoryChapter index="10" eyebrow={es ? "El video" : "The video"} id={VIDEO_ANCHOR}>
        <div className="md:col-span-2">
          <ClipVideo
            controls
            src={`${V}/product.mp4`}
            poster={`${V}/product-poster.jpg`}
            label={es ? "Video del producto Boletapp" : "Boletapp product video"}
            className="bp-film"
          />
        </div>
      </StoryChapter>

      {/* 11 - How it ended */}
      <StoryChapter index="11" eyebrow={es ? "Cómo terminó" : "How it ended"}>
        <StoryStage>
          <ol className="bp-timeline">
            <li>
              <span>{es ? "jun 2026" : "Jun 2026"}</span>
              {es ? "Primer commit" : "First commit"}
            </li>
            <li>
              <span>{es ? "jul 2026" : "Jul 2026"}</span>
              {es ? "En producción" : "In production"}
            </li>
            <li>
              <span>iOS · Android</span>
              {es ? "Apps aprobadas en App Store y Google Play" : "Apps approved on the App Store and Google Play"}
            </li>
            <li data-end="true">
              <span>{es ? "nov 2026" : "Nov 2026"}</span>
              {es ? "Cierre de la empresa" : "Company closed"}
            </li>
          </ol>
        </StoryStage>
        <StoryProse>
          <StoryBeat title={es ? "Dónde quedó" : "Where it ended up"}>
            {es
              ? "En producción de julio a noviembre de 2026. Apps aprobadas en App Store y Google Play. Cerré la empresa en noviembre de 2026."
              : "In production from July to November 2026, with apps approved on the App Store and Google Play. I closed the company in November 2026."}
          </StoryBeat>
          <StoryBeat title={es ? "Qué aprendí" : "What I learned"}>
            <ul className="bp-learned">
              <li>
                {es
                  ? "Se puede construir solo de punta a punta: web, apps, backend, pagos e infraestructura."
                  : "One person can build it end to end: web, apps, backend, payments and infrastructure."}
              </li>
              <li>
                {es
                  ? "Un producto B2B no despega sin alguien en la calle vendiéndolo todos los días."
                  : "A B2B product doesn't take off without someone out on the street selling it every day."}
              </li>
              <li>
                {es
                  ? "Operar pagos reales en producción cambia cómo escribes cada línea."
                  : "Running real payments in production changes how you write every line."}
              </li>
            </ul>
          </StoryBeat>
          <StoryBeat title={es ? "El código queda guardado" : "The code is kept"}>
            {es
              ? "El repositorio es privado y queda guardado para retomarlo."
              : "The repository is private and kept, ready to pick back up."}
          </StoryBeat>
        </StoryProse>
      </StoryChapter>
    </div>
  );
}
