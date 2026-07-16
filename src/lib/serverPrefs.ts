import { cookies } from "next/headers";
import type { Locale } from "@/domain/i18n";

export type Theme = "light" | "dark";

export const LANG_COOKIE = "lang";
export const THEME_COOKIE = "theme";

/**
 * Reads the visitor's language/theme from cookies on the server so the initial
 * HTML is rendered in the right locale and theme — no hydration mismatch, no
 * flash. Client toggles keep these cookies in sync (see the providers).
 *
 * Note: calling cookies() opts the route out of static rendering. That's the
 * intended trade-off for correct SSR of a per-visitor preference.
 */
export async function readServerPrefs(): Promise<{ lang: Locale; theme: Theme }> {
  const store = await cookies();
  const lang = store.get(LANG_COOKIE)?.value;
  const theme = store.get(THEME_COOKIE)?.value;
  return {
    lang: lang === "es" || lang === "en" ? lang : "en",
    theme: theme === "dark" || theme === "light" ? theme : "light",
  };
}
