"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@/domain/i18n";
import { getTranslation } from "@/domain/i18n";

type LanguageContextValue = {
  lang: Locale;
  setLang: (locale: Locale) => void;
  t: (key: string) => string;
  dictionary: ReturnType<typeof getTranslation>;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem("lang");
    const browser = window.navigator.language?.toLowerCase() || "en";
    return stored === "es" || stored === "en" ? stored : browser.startsWith("es") ? "es" : "en";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.lang = lang;
    window.localStorage.setItem("lang", lang);
  }, [lang]);

  const dictionary = useMemo(() => getTranslation(lang), [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      dictionary,
      t: (key: string) => {
        const value = key
          .split(".")
          .reduce<unknown>((acc, segment) => {
            if (acc && typeof acc === "object" && segment in acc) {
              return (acc as Record<string, unknown>)[segment];
            }
            return undefined;
          }, dictionary);
        return typeof value === "string" ? value : "";
      },
    }),
    [dictionary, lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useI18n() {
  const ctx = useLanguage();
  return {
    lang: ctx.lang,
    setLang: ctx.setLang,
    t: ctx.t,
    dictionary: ctx.dictionary,
  };
}
