"use client";

/* eslint-disable @next/next/no-img-element */
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/language-provider";

/**
 * The About portrait: a single torn-paper photo of Sebastian that crumples and
 * flattens with the scroll. As the section climbs into view the paper
 * uncrumples into a clean photo; as it scrolls past, it crumples again. The
 * crease shading is a diffuse-lit noise texture (public/textures/crumple.webp)
 * blended over the photo and masked to its silhouette, faded out as the paper
 * flattens — and the whole motion is scroll-driven CSS (animation-timeline:
 * view()), no scroll listeners, consistent with the site's paint rules.
 *
 * Only the LinkedIn studio portrait remains (the other cutouts were dropped).
 * Each theme keeps its own skin — the neon cutout on dark, the torn-paper one
 * on light. A soft backdrop glow behind it (a violet halo on dark, a warm wash
 * on light) plus a violet rim on the dark cutout light the silhouette so it
 * reads as an intentional framed photo rather than a floating head.
 */
export default function StickerCluster() {
  const { theme } = useTheme();
  const { lang } = useI18n();
  const isDark = theme === "dark";
  const src = isDark ? "/stickers/neonlinkedin.webp" : "/stickers/paperlinkedin.webp";
  const alt = lang === "es" ? "Retrato de estudio de Sebastián sonriendo" : "Studio portrait of Sebastian smiling";

  return (
    <div
      className="portrait-crumple relative w-[min(78vw,340px)] md:w-full md:max-w-md mx-auto md:mx-0"
      data-skin={isDark ? "neon" : "paper"}
    >
      {/* Preload only the active skin so the first paint is clean. */}
      <link rel="preload" as="image" href={src} />
      {/* Soft backdrop halo so the cutout reads as a framed photo, not a stray
          sticker — especially on dark, where it lights the silhouette. */}
      <span className="portrait-glow" aria-hidden="true" />
      <img className="portrait-photo" src={src} alt={alt} width={446} height={620} loading="eager" />
      {/* Crease shading, masked to the live photo so it never spills past the cutout. */}
      <span className="portrait-wrinkle" aria-hidden="true" style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` }} />
    </div>
  );
}
