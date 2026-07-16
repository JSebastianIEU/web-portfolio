"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/domain/i18n";
import type { Theme } from "@/lib/serverPrefs";
import { LanguageProvider } from "./language-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({
  children,
  initialLang,
  initialTheme,
}: {
  children: ReactNode;
  initialLang: Locale;
  initialTheme: Theme;
}) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
    </LanguageProvider>
  );
}
