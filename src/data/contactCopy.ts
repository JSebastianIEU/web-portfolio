import type { Locale } from "@/domain/i18n";
import type { SiteConfig } from "./siteConfig";

export type ContactActionId = "email" | "linkedin" | "calendly";

export type ContactAction = {
  id: ContactActionId;
  hrefKey: keyof SiteConfig;
  external?: boolean;
};

export const contactActions: ContactAction[] = [
  { id: "email", hrefKey: "email" },
  { id: "linkedin", hrefKey: "linkedin", external: true },
  { id: "calendly", hrefKey: "calendly", external: true },
];

export const cvFiles: Record<Locale, string> = {
  en: "JuanSebastianPeñaDonneys_CV_EN.pdf",
  es: "JuanSebastianPeñaDonneys_CV_ES.pdf",
};
