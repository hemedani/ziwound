"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ProvinceForm, ProvinceFormValues } from "../province-form";
import { update } from "@/app/actions/province/update";
import { provinceSchema } from "@/types/declarations";

const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;

function buildLocalizedObject(values: ProvinceFormValues, fieldName: string) {
  const obj: Record<string, string> = {};
  for (const lang of LANGUAGES) {
    const val = (values as unknown as Record<string, Record<string, string> | undefined>)[fieldName]?.[lang];
    if (val && val.trim()) {
      obj[lang] = val;
    }
  }
  return Object.keys(obj).length > 0 ? obj : undefined;
}

interface EditProvinceFormProps {
  province: provinceSchema & { country?: { _id?: string } };
  countries?: Array<{ _id: string; name: string; english_name: string }>;
}

export function EditProvinceForm({ province, countries = [] }: EditProvinceFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProvinceFormValues) => {
    setIsLoading(true);

    try {
      const res = await update(
        {
          _id: province._id!,
          name: data.name,
          english_name: data.english_name,
          wars_history: buildLocalizedObject(data, "wars_history"),
          conflict_timeline: buildLocalizedObject(data, "conflict_timeline"),
          casualties_info: buildLocalizedObject(data, "casualties_info"),
          notable_battles: buildLocalizedObject(data, "notable_battles"),
          occupation_info: buildLocalizedObject(data, "occupation_info"),
          destruction_level: buildLocalizedObject(data, "destruction_level"),
          civilian_impact: buildLocalizedObject(data, "civilian_impact"),
          mass_graves_info: buildLocalizedObject(data, "mass_graves_info"),
          war_crimes_events: buildLocalizedObject(data, "war_crimes_events"),
          liberation_info: buildLocalizedObject(data, "liberation_info"),
        },
        { _id: 1, name: 1 },
      );

      if (!res?.success) {
        toast({
          variant: "destructive",
          title: tCommon("error"),
          description:
            res?.error || res?.body?.message || t("failedToUpdateProvince") || "Failed to update province.",
        });
        return;
      }

      toast({
        title: tCommon("success"),
        description: t("provinceUpdated") || "Province updated successfully",
      });
      router.push("/admin/provinces");
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
    router.push("/admin/provinces");
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

  const defaultValues: Partial<ProvinceFormValues> = {
    name: province.name,
    english_name: province.english_name,
    countryId: province.country?._id || "",
    photoId: province.photo?._id || "",
    wars_history: {
      fa: extractLangValue(province.wars_history, "fa"),
      en: extractLangValue(province.wars_history, "en"),
      ar: extractLangValue(province.wars_history, "ar"),
      zh: extractLangValue(province.wars_history, "zh"),
      pt: extractLangValue(province.wars_history, "pt"),
      es: extractLangValue(province.wars_history, "es"),
      nl: extractLangValue(province.wars_history, "nl"),
      tr: extractLangValue(province.wars_history, "tr"),
      ru: extractLangValue(province.wars_history, "ru"),
    },
    conflict_timeline: {
      fa: extractLangValue(province.conflict_timeline, "fa"),
      en: extractLangValue(province.conflict_timeline, "en"),
      ar: extractLangValue(province.conflict_timeline, "ar"),
      zh: extractLangValue(province.conflict_timeline, "zh"),
      pt: extractLangValue(province.conflict_timeline, "pt"),
      es: extractLangValue(province.conflict_timeline, "es"),
      nl: extractLangValue(province.conflict_timeline, "nl"),
      tr: extractLangValue(province.conflict_timeline, "tr"),
      ru: extractLangValue(province.conflict_timeline, "ru"),
    },
    casualties_info: {
      fa: extractLangValue(province.casualties_info, "fa"),
      en: extractLangValue(province.casualties_info, "en"),
      ar: extractLangValue(province.casualties_info, "ar"),
      zh: extractLangValue(province.casualties_info, "zh"),
      pt: extractLangValue(province.casualties_info, "pt"),
      es: extractLangValue(province.casualties_info, "es"),
      nl: extractLangValue(province.casualties_info, "nl"),
      tr: extractLangValue(province.casualties_info, "tr"),
      ru: extractLangValue(province.casualties_info, "ru"),
    },
    notable_battles: {
      fa: extractLangValue(province.notable_battles, "fa"),
      en: extractLangValue(province.notable_battles, "en"),
      ar: extractLangValue(province.notable_battles, "ar"),
      zh: extractLangValue(province.notable_battles, "zh"),
      pt: extractLangValue(province.notable_battles, "pt"),
      es: extractLangValue(province.notable_battles, "es"),
      nl: extractLangValue(province.notable_battles, "nl"),
      tr: extractLangValue(province.notable_battles, "tr"),
      ru: extractLangValue(province.notable_battles, "ru"),
    },
    occupation_info: {
      fa: extractLangValue(province.occupation_info, "fa"),
      en: extractLangValue(province.occupation_info, "en"),
      ar: extractLangValue(province.occupation_info, "ar"),
      zh: extractLangValue(province.occupation_info, "zh"),
      pt: extractLangValue(province.occupation_info, "pt"),
      es: extractLangValue(province.occupation_info, "es"),
      nl: extractLangValue(province.occupation_info, "nl"),
      tr: extractLangValue(province.occupation_info, "tr"),
      ru: extractLangValue(province.occupation_info, "ru"),
    },
    destruction_level: {
      fa: extractLangValue(province.destruction_level, "fa"),
      en: extractLangValue(province.destruction_level, "en"),
      ar: extractLangValue(province.destruction_level, "ar"),
      zh: extractLangValue(province.destruction_level, "zh"),
      pt: extractLangValue(province.destruction_level, "pt"),
      es: extractLangValue(province.destruction_level, "es"),
      nl: extractLangValue(province.destruction_level, "nl"),
      tr: extractLangValue(province.destruction_level, "tr"),
      ru: extractLangValue(province.destruction_level, "ru"),
    },
    civilian_impact: {
      fa: extractLangValue(province.civilian_impact, "fa"),
      en: extractLangValue(province.civilian_impact, "en"),
      ar: extractLangValue(province.civilian_impact, "ar"),
      zh: extractLangValue(province.civilian_impact, "zh"),
      pt: extractLangValue(province.civilian_impact, "pt"),
      es: extractLangValue(province.civilian_impact, "es"),
      nl: extractLangValue(province.civilian_impact, "nl"),
      tr: extractLangValue(province.civilian_impact, "tr"),
      ru: extractLangValue(province.civilian_impact, "ru"),
    },
    mass_graves_info: {
      fa: extractLangValue(province.mass_graves_info, "fa"),
      en: extractLangValue(province.mass_graves_info, "en"),
      ar: extractLangValue(province.mass_graves_info, "ar"),
      zh: extractLangValue(province.mass_graves_info, "zh"),
      pt: extractLangValue(province.mass_graves_info, "pt"),
      es: extractLangValue(province.mass_graves_info, "es"),
      nl: extractLangValue(province.mass_graves_info, "nl"),
      tr: extractLangValue(province.mass_graves_info, "tr"),
      ru: extractLangValue(province.mass_graves_info, "ru"),
    },
    war_crimes_events: {
      fa: extractLangValue(province.war_crimes_events, "fa"),
      en: extractLangValue(province.war_crimes_events, "en"),
      ar: extractLangValue(province.war_crimes_events, "ar"),
      zh: extractLangValue(province.war_crimes_events, "zh"),
      pt: extractLangValue(province.war_crimes_events, "pt"),
      es: extractLangValue(province.war_crimes_events, "es"),
      nl: extractLangValue(province.war_crimes_events, "nl"),
      tr: extractLangValue(province.war_crimes_events, "tr"),
      ru: extractLangValue(province.war_crimes_events, "ru"),
    },
    liberation_info: {
      fa: extractLangValue(province.liberation_info, "fa"),
      en: extractLangValue(province.liberation_info, "en"),
      ar: extractLangValue(province.liberation_info, "ar"),
      zh: extractLangValue(province.liberation_info, "zh"),
      pt: extractLangValue(province.liberation_info, "pt"),
      es: extractLangValue(province.liberation_info, "es"),
      nl: extractLangValue(province.liberation_info, "nl"),
      tr: extractLangValue(province.liberation_info, "tr"),
      ru: extractLangValue(province.liberation_info, "ru"),
    },
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <ProvinceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isEditing={true}
        countries={countries}
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
