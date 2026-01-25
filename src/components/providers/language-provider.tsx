"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/translations";
import { getTranslation } from "@/i18n/translations";

type LanguageContextValue = {
  lang: Locale;
  setLang: (locale: Locale) => void;
  t: (key: string) => string;
  dictionary: ReturnType<typeof getTranslation>;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Locale>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("lang") : null;
    const browser = typeof window !== "undefined" ? window.navigator.language?.toLowerCase() || "en" : "en";
    const initial = stored === "es" || stored === "en" ? stored : browser.startsWith("es") ? "es" : "en";
    setLang(initial as Locale);
  }, []);

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
      t: (key: string) => key.split(".").reduce((acc: any, segment) => acc?.[segment], dictionary) ?? "",
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
