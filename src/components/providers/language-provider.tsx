"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type Locale = "es" | "en";

type LanguageContextValue = {
  lang: Locale;
  setLang: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Locale>(() => {
    if (typeof window === "undefined") return "es";
    const stored = window.localStorage.getItem("lang");
    const browser = window.navigator.language?.toLowerCase() || "en";
    if (stored === "es" || stored === "en") return stored;
    return browser.startsWith("es") ? "es" : "en";
  });
  const mounted = typeof window !== "undefined";

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang, mounted]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
