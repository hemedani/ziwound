import { object, optional, string } from "lesan";

export const localizedWarInfo = object({
  fa: optional(string()),
  en: optional(string()),
  ar: optional(string()),
  zh: optional(string()),
  pt: optional(string()),
  es: optional(string()),
  nl: optional(string()),
  tr: optional(string()),
  ru: optional(string()),
});
