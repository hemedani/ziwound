import { Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Language = "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru";

interface WarInfoField {
  key: string;
  label: string;
  value: Record<Language, string> | string | undefined;
}

interface WarInfoSectionProps {
  fields: WarInfoField[];
  locale: string;
  sectionTitle: string;
  className?: string;
}

function extractLocalizedText(
  field: Record<Language, string> | string | undefined,
  locale: string
): string {
  if (typeof field === "object" && field !== null) {
    return field[locale as Language] || field.en || "";
  }
  if (typeof field === "string") return field;
  return "";
}

export function WarInfoSection({ fields, locale, sectionTitle, className }: WarInfoSectionProps) {
  const populatedFields = fields.filter((f) => extractLocalizedText(f.value, locale).trim().length > 0);

  if (populatedFields.length === 0) return null;

  return (
    <div className={`rounded-2xl glass-light border border-white/[0.06] overflow-hidden ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06] min-w-0">
        <div className="shrink-0 bg-white/5 rounded-lg p-2">
          <Shield className="h-4 w-4 text-gold" />
        </div>
        <h2 className="text-lg font-semibold text-offwhite truncate">{sectionTitle}</h2>
        <span className="text-xs text-slate-body/40 ms-auto shrink-0">
          {populatedFields.length} {populatedFields.length === 1 ? "section" : "sections"}
        </span>
      </div>

      {/* Accordion */}
      <Accordion type="multiple" defaultValue={[populatedFields[0]?.key]} className="px-6">
        {populatedFields.map((field) => {
          const content = extractLocalizedText(field.value, locale);
          return (
            <AccordionItem
              key={field.key}
              value={field.key}
              className="border-white/[0.06] py-2 first:pt-4 last:pb-4"
            >
              <AccordionTrigger className="text-sm font-medium text-gold hover:text-gold/80 hover:no-underline uppercase tracking-wider py-3">
                {field.label}
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className="text-sm text-slate-body/80 leading-relaxed prose prose-invert prose-sm max-w-none prose-a:text-crimson-light prose-a:no-underline hover:prose-a:underline [overflow-wrap:anywhere] break-words"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
