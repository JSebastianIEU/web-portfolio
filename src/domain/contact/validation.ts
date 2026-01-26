import type { TranslationCopy } from "@/domain/i18n";
import { isEmailValid, sanitizeText } from "@/lib/safe";
import type { ContactFormErrors, ContactFormValues } from "./types";

export function normalizeContactForm(values: ContactFormValues): ContactFormValues {
  return {
    name: sanitizeText(values.name || "", 120),
    email: sanitizeText(values.email || "", 160),
    company: sanitizeText(values.company || "", 160),
    subject: sanitizeText(values.subject || "", 160),
    message: (values.message || "").trim().slice(0, 2000),
    honeypot: sanitizeText(values.honeypot || "", 16),
  };
}

export function validateContactForm(values: ContactFormValues, copy: TranslationCopy["contact"]): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!values.name) errors.name = copy.form.required;
  if (!values.email || !isEmailValid(values.email)) errors.email = copy.form.emailInvalid;
  if (!values.subject) errors.subject = copy.form.required;
  if (!values.message || values.message.length < 20) errors.message = copy.form.messageLength;
  return errors;
}
