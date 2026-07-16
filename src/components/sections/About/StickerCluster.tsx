"use client";

/* eslint-disable @next/next/no-img-element */
import TiltCard from "@/components/ui/TiltCard";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";

/**
 * Tuning table for the sticker cluster. Positions are % of the cluster box
 * (aspect 4/5); width is % of the box width and height follows each image's
 * own ratio. z stacks front-to-back as linkedin > vangogh > meditando >
 * colombia; tilt is the per-sticker TiltCard max (front stickers respond
 * more); stagger is the entrance delay, back to front; neon is the rim color
 * the sticker glows with on dark-mode hover.
 *
 * The composition leans on colombia's flag as overlap real estate: meditando
 * sits right on top of it, vangogh clips its upper corner, linkedin rides
 * over meditando's leg. Face-safety map (container coords, at rest):
 * colombia x68-90/y4-21, vangogh x16-29/y3-14, meditando x48-57/y50-59,
 * linkedin x13-35/y40-56 - nothing in front of a face covers it. If you
 * retune positions, re-check that rule before shipping.
 */
const STICKERS = [
  {
    id: "colombia",
    neonSrc: "/stickers/neon colombia.png", // literal space in the filename, encoded below
    paperSrc: "/stickers/papercolombia.png",
    neonSize: { w: 596, h: 800 },
    paperSize: { w: 617, h: 800 },
    alt: "Sebastian seated in a cowboy hat, holding a large Colombian flag",
    altES: "Sebastián sentado con sombrero, sosteniendo una bandera de Colombia",
    neon: "#facc15",
    layout: { left: "30%", top: "0%", width: "70%", rot: "5deg", z: 10, tilt: 4, stagger: "0ms" },
  },
  {
    id: "meditando",
    neonSrc: "/stickers/neonmeditando.png",
    paperSrc: "/stickers/papermeditando.png",
    neonSize: { w: 800, h: 756 },
    paperSize: { w: 800, h: 756 },
    alt: "Sebastian meditating cross-legged in a lotus pose, smiling",
    altES: "Sebastián meditando con las piernas cruzadas en pose de loto, sonriendo",
    neon: "#22d3ee",
    layout: { left: "22%", top: "48%", width: "68%", rot: "4deg", z: 20, tilt: 5.5, stagger: "60ms" },
  },
  {
    id: "vangogh",
    neonSrc: "/stickers/neonvangogh.png",
    paperSrc: "/stickers/papervanghog.png", // "vanghog" is the real filename
    neonSize: { w: 660, h: 800 },
    paperSize: { w: 668, h: 800 },
    alt: "Sebastian in a Van Gogh t-shirt pointing both hands up",
    altES: "Sebastián con una camiseta de Van Gogh señalando hacia arriba con ambas manos",
    neon: "#f472b6",
    layout: { left: "-2%", top: "-2%", width: "50%", rot: "-7deg", z: 30, tilt: 7, stagger: "120ms" },
  },
  {
    id: "linkedin",
    neonSrc: "/stickers/neonlinkedin.png",
    paperSrc: "/stickers/paperlinkedin.png",
    neonSize: { w: 553, h: 800 },
    paperSize: { w: 575, h: 800 },
    alt: "Studio portrait of Sebastian smiling",
    altES: "Retrato de estudio de Sebastián sonriendo",
    neon: "#a78bfa",
    layout: { left: "2%", top: "38%", width: "44%", rot: "-6deg", z: 40, tilt: 9, stagger: "180ms" },
  },
];

/* Twinkle positions for the hover sparks, relative to each sticker box. */
const SPARKS = [
  { left: "14%", top: "10%" },
  { left: "86%", top: "26%" },
  { left: "68%", top: "82%" },
];

/**
 * Interactive sticker cutouts replacing the static About portrait. Four photos,
 * two skins each: neon cutouts for dark mode, torn-paper stickers for light
 * mode (their baked black backdrop is flood-filled away so they read as real
 * pegatinas). Both skins stay mounted and crossfade on theme change so the
 * composition never moves. Each sticker reuses the existing TiltCard mechanism
 * scaled per depth; on dark-mode hover the sticker's rim lights up in its own
 * neon color with a few twinkling sparks while its neighbors recede.
 */
export default function StickerCluster() {
  const { theme } = useTheme();
  const { lang } = useI18n();
  const isDark = theme === "dark";
  const activeKey = isDark ? "neonSrc" : "paperSrc";

  return (
    <div
      className="sticker-cluster relative w-full max-w-[320px] md:max-w-sm lg:max-w-md mx-auto md:mx-0"
      style={{ aspectRatio: "4 / 5" }}
      data-skin={isDark ? "neon" : "paper"}
    >
      {/* Preload the active skin so the first paint (and first toggle back) is clean. */}
      {STICKERS.map((s) => (
        <link key={`preload-${s.id}`} rel="preload" as="image" href={encodeURI(s[activeKey])} />
      ))}

      {STICKERS.map((s) => (
        <div
          key={s.id}
          className="sticker-wrap"
          style={{
            left: s.layout.left,
            top: s.layout.top,
            width: s.layout.width,
            "--z": s.layout.z,
            "--stagger": s.layout.stagger,
            "--neon": s.neon,
          } as React.CSSProperties}
        >
          <TiltCard max={s.layout.tilt}>
            <div className="sticker-body" style={{ "--rot": s.layout.rot } as React.CSSProperties}>
              <img
                className="sticker-neon"
                src={encodeURI(s.neonSrc)}
                alt={lang === "es" ? s.altES : s.alt}
                width={s.neonSize.w}
                height={s.neonSize.h}
                loading="lazy"
              />
              <img
                className="sticker-paper"
                src={encodeURI(s.paperSrc)}
                alt=""
                aria-hidden="true"
                width={s.paperSize.w}
                height={s.paperSize.h}
                loading="lazy"
              />
              {SPARKS.map((sp, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="spark"
                  style={{ left: sp.left, top: sp.top, "--d": `${i * 380 + s.layout.z * 8}ms` } as React.CSSProperties}
                />
              ))}
            </div>
          </TiltCard>
        </div>
      ))}
    </div>
  );
}
