type Language = "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru";

export function extractLocalizedText(
  field: Record<Language, string> | string | undefined,
  locale: string
): string {
  if (typeof field === "object" && field !== null) {
    return field[locale as Language] || field.en || "";
  }
  if (typeof field === "string") return field;
  return "";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
