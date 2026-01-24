"use client";

import { useLanguage, type Locale } from "../providers/language-provider";

const options: Array<{ value: Locale; label: string }> = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/60 p-1 text-sm font-medium text-slate-900 shadow-lg shadow-cyan-500/10 backdrop-blur-xl dark:border-white/5 dark:bg-white/10 dark:text-slate-100">
      {options.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLang(opt.value)}
            className={`min-w-[44px] rounded-full px-3 py-1.5 transition ${
              active
                ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
