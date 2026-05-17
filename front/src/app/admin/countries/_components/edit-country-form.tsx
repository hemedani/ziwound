"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CountryForm, CountryFormValues } from "../country-form";
import { update } from "@/app/actions/country/update";
import { countrySchema } from "@/types/declarations";

const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;

function buildLocalizedObject(values: CountryFormValues, fieldName: string) {
  const obj: Record<string, string> = {};
  for (const lang of LANGUAGES) {
    const val = (values as unknown as Record<string, Record<string, string> | undefined>)[fieldName]?.[lang];
    if (val && val.trim()) {
      obj[lang] = val;
    }
  }
  return Object.keys(obj).length > 0 ? obj : undefined;
}

interface EditCountryFormProps {
  country: countrySchema;
}

export function EditCountryForm({ country }: EditCountryFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CountryFormValues) => {
    setIsLoading(true);

    try {
      const res = await update(
        {
          _id: country._id!,
          name: data.name,
          english_name: data.english_name,
          wars_history: buildLocalizedObject(data, "wars_history"),
          conflict_timeline: buildLocalizedObject(data, "conflict_timeline"),
          casualties_info: buildLocalizedObject(data, "casualties_info"),
          international_response: buildLocalizedObject(data, "international_response"),
          war_crimes_documentation: buildLocalizedObject(data, "war_crimes_documentation"),
          human_rights_violations: buildLocalizedObject(data, "human_rights_violations"),
          genocide_info: buildLocalizedObject(data, "genocide_info"),
          chemical_weapons_info: buildLocalizedObject(data, "chemical_weapons_info"),
          displacement_info: buildLocalizedObject(data, "displacement_info"),
          reconstruction_status: buildLocalizedObject(data, "reconstruction_status"),
          international_sanctions: buildLocalizedObject(data, "international_sanctions"),
          notable_war_events: buildLocalizedObject(data, "notable_war_events"),
        },
        { _id: 1, name: 1 },
      );

      if (res?.success) {
        toast({
          title: tCommon("success"),
          description: t("countryUpdated") || "Country updated successfully",
        });
        router.refresh();
        router.push("/admin/countries");
      } else {
        toast({
          variant: "destructive",
          title: tCommon("error"),
          description:
            res?.error || res?.body?.message || t("failedToUpdateCountry") || "Failed to update country.",
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: tCommon("error"),
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/countries");
  };

  const extractLangValue = (field: Record<string, string> | string | undefined, lang: string): string => {
    if (typeof field === "object" && field !== null) {
      return field[lang] || "";
    }
    if (typeof field === "string") {
      return lang === "en" ? field : "";
    }
    return "";
  };

  const defaultValues: Partial<CountryFormValues> = {
    name: country.name,
    english_name: country.english_name,
    wars_history: {
      fa: extractLangValue(country.wars_history, "fa"),
      en: extractLangValue(country.wars_history, "en"),
      ar: extractLangValue(country.wars_history, "ar"),
      zh: extractLangValue(country.wars_history, "zh"),
      pt: extractLangValue(country.wars_history, "pt"),
      es: extractLangValue(country.wars_history, "es"),
      nl: extractLangValue(country.wars_history, "nl"),
      tr: extractLangValue(country.wars_history, "tr"),
      ru: extractLangValue(country.wars_history, "ru"),
    },
    conflict_timeline: {
      fa: extractLangValue(country.conflict_timeline, "fa"),
      en: extractLangValue(country.conflict_timeline, "en"),
      ar: extractLangValue(country.conflict_timeline, "ar"),
      zh: extractLangValue(country.conflict_timeline, "zh"),
      pt: extractLangValue(country.conflict_timeline, "pt"),
      es: extractLangValue(country.conflict_timeline, "es"),
      nl: extractLangValue(country.conflict_timeline, "nl"),
      tr: extractLangValue(country.conflict_timeline, "tr"),
      ru: extractLangValue(country.conflict_timeline, "ru"),
    },
    casualties_info: {
      fa: extractLangValue(country.casualties_info, "fa"),
      en: extractLangValue(country.casualties_info, "en"),
      ar: extractLangValue(country.casualties_info, "ar"),
      zh: extractLangValue(country.casualties_info, "zh"),
      pt: extractLangValue(country.casualties_info, "pt"),
      es: extractLangValue(country.casualties_info, "es"),
      nl: extractLangValue(country.casualties_info, "nl"),
      tr: extractLangValue(country.casualties_info, "tr"),
      ru: extractLangValue(country.casualties_info, "ru"),
    },
    international_response: {
      fa: extractLangValue(country.international_response, "fa"),
      en: extractLangValue(country.international_response, "en"),
      ar: extractLangValue(country.international_response, "ar"),
      zh: extractLangValue(country.international_response, "zh"),
      pt: extractLangValue(country.international_response, "pt"),
      es: extractLangValue(country.international_response, "es"),
      nl: extractLangValue(country.international_response, "nl"),
      tr: extractLangValue(country.international_response, "tr"),
      ru: extractLangValue(country.international_response, "ru"),
    },
    war_crimes_documentation: {
      fa: extractLangValue(country.war_crimes_documentation, "fa"),
      en: extractLangValue(country.war_crimes_documentation, "en"),
      ar: extractLangValue(country.war_crimes_documentation, "ar"),
      zh: extractLangValue(country.war_crimes_documentation, "zh"),
      pt: extractLangValue(country.war_crimes_documentation, "pt"),
      es: extractLangValue(country.war_crimes_documentation, "es"),
      nl: extractLangValue(country.war_crimes_documentation, "nl"),
      tr: extractLangValue(country.war_crimes_documentation, "tr"),
      ru: extractLangValue(country.war_crimes_documentation, "ru"),
    },
    human_rights_violations: {
      fa: extractLangValue(country.human_rights_violations, "fa"),
      en: extractLangValue(country.human_rights_violations, "en"),
      ar: extractLangValue(country.human_rights_violations, "ar"),
      zh: extractLangValue(country.human_rights_violations, "zh"),
      pt: extractLangValue(country.human_rights_violations, "pt"),
      es: extractLangValue(country.human_rights_violations, "es"),
      nl: extractLangValue(country.human_rights_violations, "nl"),
      tr: extractLangValue(country.human_rights_violations, "tr"),
      ru: extractLangValue(country.human_rights_violations, "ru"),
    },
    genocide_info: {
      fa: extractLangValue(country.genocide_info, "fa"),
      en: extractLangValue(country.genocide_info, "en"),
      ar: extractLangValue(country.genocide_info, "ar"),
      zh: extractLangValue(country.genocide_info, "zh"),
      pt: extractLangValue(country.genocide_info, "pt"),
      es: extractLangValue(country.genocide_info, "es"),
      nl: extractLangValue(country.genocide_info, "nl"),
      tr: extractLangValue(country.genocide_info, "tr"),
      ru: extractLangValue(country.genocide_info, "ru"),
    },
    chemical_weapons_info: {
      fa: extractLangValue(country.chemical_weapons_info, "fa"),
      en: extractLangValue(country.chemical_weapons_info, "en"),
      ar: extractLangValue(country.chemical_weapons_info, "ar"),
      zh: extractLangValue(country.chemical_weapons_info, "zh"),
      pt: extractLangValue(country.chemical_weapons_info, "pt"),
      es: extractLangValue(country.chemical_weapons_info, "es"),
      nl: extractLangValue(country.chemical_weapons_info, "nl"),
      tr: extractLangValue(country.chemical_weapons_info, "tr"),
      ru: extractLangValue(country.chemical_weapons_info, "ru"),
    },
    displacement_info: {
      fa: extractLangValue(country.displacement_info, "fa"),
      en: extractLangValue(country.displacement_info, "en"),
      ar: extractLangValue(country.displacement_info, "ar"),
      zh: extractLangValue(country.displacement_info, "zh"),
      pt: extractLangValue(country.displacement_info, "pt"),
      es: extractLangValue(country.displacement_info, "es"),
      nl: extractLangValue(country.displacement_info, "nl"),
      tr: extractLangValue(country.displacement_info, "tr"),
      ru: extractLangValue(country.displacement_info, "ru"),
    },
    reconstruction_status: {
      fa: extractLangValue(country.reconstruction_status, "fa"),
      en: extractLangValue(country.reconstruction_status, "en"),
      ar: extractLangValue(country.reconstruction_status, "ar"),
      zh: extractLangValue(country.reconstruction_status, "zh"),
      pt: extractLangValue(country.reconstruction_status, "pt"),
      es: extractLangValue(country.reconstruction_status, "es"),
      nl: extractLangValue(country.reconstruction_status, "nl"),
      tr: extractLangValue(country.reconstruction_status, "tr"),
      ru: extractLangValue(country.reconstruction_status, "ru"),
    },
    international_sanctions: {
      fa: extractLangValue(country.international_sanctions, "fa"),
      en: extractLangValue(country.international_sanctions, "en"),
      ar: extractLangValue(country.international_sanctions, "ar"),
      zh: extractLangValue(country.international_sanctions, "zh"),
      pt: extractLangValue(country.international_sanctions, "pt"),
      es: extractLangValue(country.international_sanctions, "es"),
      nl: extractLangValue(country.international_sanctions, "nl"),
      tr: extractLangValue(country.international_sanctions, "tr"),
      ru: extractLangValue(country.international_sanctions, "ru"),
    },
    notable_war_events: {
      fa: extractLangValue(country.notable_war_events, "fa"),
      en: extractLangValue(country.notable_war_events, "en"),
      ar: extractLangValue(country.notable_war_events, "ar"),
      zh: extractLangValue(country.notable_war_events, "zh"),
      pt: extractLangValue(country.notable_war_events, "pt"),
      es: extractLangValue(country.notable_war_events, "es"),
      nl: extractLangValue(country.notable_war_events, "nl"),
      tr: extractLangValue(country.notable_war_events, "tr"),
      ru: extractLangValue(country.notable_war_events, "ru"),
    },
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <CountryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isEditing={true}
      />
      <div className="flex gap-4 pt-6 border-t mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {tCommon("cancel")}
        </Button>
      </div>
    </div>
  );
}
