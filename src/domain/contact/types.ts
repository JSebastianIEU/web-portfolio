export type ContactFormValues = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  honeypot?: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
