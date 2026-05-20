"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CityForm, CityFormValues } from "../city-form";
import { update } from "@/app/actions/city/update";
import { updateRelations } from "@/app/actions/city/updateRelations";
import { citySchema } from "@/types/declarations";

const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;

function buildLocalizedObject(values: CityFormValues, fieldName: string) {
  const obj: Record<string, string> = {};
  for (const lang of LANGUAGES) {
    const val = (values as unknown as Record<string, Record<string, string> | undefined>)[fieldName]?.[lang];
    if (val && val.trim()) {
      obj[lang] = val;
    }
  }
  return Object.keys(obj).length > 0 ? obj : undefined;
}

interface EditCityFormProps {
  city: citySchema & { province?: { _id?: string }; country?: { _id?: string } };
  countries?: Array<{ _id: string; name: string; english_name: string }>;
  provinces?: Array<{ _id: string; name: string; english_name: string; country?: { _id?: string } }>;
}

export function EditCityForm({ city, countries = [], provinces = [] }: EditCityFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CityFormValues) => {
    setIsLoading(true);

    try {
      const res = await update(
        {
          _id: city._id!,
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
            res?.error || res?.body?.message || t("failedToUpdateCity") || "Failed to update city.",
        });
        return;
      }

      if (data.provinceId !== city.province?._id || data.photoId !== city.photo?._id) {
        const relationRes = await updateRelations(
          {
            _id: city._id!,
            ...(data.provinceId !== city.province?._id ? { province: data.provinceId } : {}),
            ...(data.countryId !== city.country?._id ? { country: data.countryId } : {}),
            ...(data.photoId !== city.photo?._id ? { photo: data.photoId || undefined } : {}),
          },
          { _id: 1 },
        );

        if (!relationRes?.success) {
          toast({
            variant: "destructive",
            title: tCommon("error"),
            description:
              relationRes?.error || relationRes?.body?.message || t("failedToUpdateCityRelations") || "Failed to update city relations.",
          });
          return;
        }
      }

      toast({
        title: tCommon("success"),
        description: t("cityUpdated") || "City updated successfully",
      });
      router.refresh();
      router.push("/admin/cities");
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
    router.push("/admin/cities");
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

  const defaultValues: Partial<CityFormValues> = {
    name: city.name,
    english_name: city.english_name,
    countryId: city.country?._id || "",
    provinceId: city.province?._id || "",
    photoId: city.photo?._id || "",
    wars_history: {
      fa: extractLangValue(city.wars_history, "fa"),
      en: extractLangValue(city.wars_history, "en"),
      ar: extractLangValue(city.wars_history, "ar"),
      zh: extractLangValue(city.wars_history, "zh"),
      pt: extractLangValue(city.wars_history, "pt"),
      es: extractLangValue(city.wars_history, "es"),
      nl: extractLangValue(city.wars_history, "nl"),
      tr: extractLangValue(city.wars_history, "tr"),
      ru: extractLangValue(city.wars_history, "ru"),
    },
    conflict_timeline: {
      fa: extractLangValue(city.conflict_timeline, "fa"),
      en: extractLangValue(city.conflict_timeline, "en"),
      ar: extractLangValue(city.conflict_timeline, "ar"),
      zh: extractLangValue(city.conflict_timeline, "zh"),
      pt: extractLangValue(city.conflict_timeline, "pt"),
      es: extractLangValue(city.conflict_timeline, "es"),
      nl: extractLangValue(city.conflict_timeline, "nl"),
      tr: extractLangValue(city.conflict_timeline, "tr"),
      ru: extractLangValue(city.conflict_timeline, "ru"),
    },
    casualties_info: {
      fa: extractLangValue(city.casualties_info, "fa"),
      en: extractLangValue(city.casualties_info, "en"),
      ar: extractLangValue(city.casualties_info, "ar"),
      zh: extractLangValue(city.casualties_info, "zh"),
      pt: extractLangValue(city.casualties_info, "pt"),
      es: extractLangValue(city.casualties_info, "es"),
      nl: extractLangValue(city.casualties_info, "nl"),
      tr: extractLangValue(city.casualties_info, "tr"),
      ru: extractLangValue(city.casualties_info, "ru"),
    },
    notable_battles: {
      fa: extractLangValue(city.notable_battles, "fa"),
      en: extractLangValue(city.notable_battles, "en"),
      ar: extractLangValue(city.notable_battles, "ar"),
      zh: extractLangValue(city.notable_battles, "zh"),
      pt: extractLangValue(city.notable_battles, "pt"),
      es: extractLangValue(city.notable_battles, "es"),
      nl: extractLangValue(city.notable_battles, "nl"),
      tr: extractLangValue(city.notable_battles, "tr"),
      ru: extractLangValue(city.notable_battles, "ru"),
    },
    occupation_info: {
      fa: extractLangValue(city.occupation_info, "fa"),
      en: extractLangValue(city.occupation_info, "en"),
      ar: extractLangValue(city.occupation_info, "ar"),
      zh: extractLangValue(city.occupation_info, "zh"),
      pt: extractLangValue(city.occupation_info, "pt"),
      es: extractLangValue(city.occupation_info, "es"),
      nl: extractLangValue(city.occupation_info, "nl"),
      tr: extractLangValue(city.occupation_info, "tr"),
      ru: extractLangValue(city.occupation_info, "ru"),
    },
    destruction_level: {
      fa: extractLangValue(city.destruction_level, "fa"),
      en: extractLangValue(city.destruction_level, "en"),
      ar: extractLangValue(city.destruction_level, "ar"),
      zh: extractLangValue(city.destruction_level, "zh"),
      pt: extractLangValue(city.destruction_level, "pt"),
      es: extractLangValue(city.destruction_level, "es"),
      nl: extractLangValue(city.destruction_level, "nl"),
      tr: extractLangValue(city.destruction_level, "tr"),
      ru: extractLangValue(city.destruction_level, "ru"),
    },
    civilian_impact: {
      fa: extractLangValue(city.civilian_impact, "fa"),
      en: extractLangValue(city.civilian_impact, "en"),
      ar: extractLangValue(city.civilian_impact, "ar"),
      zh: extractLangValue(city.civilian_impact, "zh"),
      pt: extractLangValue(city.civilian_impact, "pt"),
      es: extractLangValue(city.civilian_impact, "es"),
      nl: extractLangValue(city.civilian_impact, "nl"),
      tr: extractLangValue(city.civilian_impact, "tr"),
      ru: extractLangValue(city.civilian_impact, "ru"),
    },
    mass_graves_info: {
      fa: extractLangValue(city.mass_graves_info, "fa"),
      en: extractLangValue(city.mass_graves_info, "en"),
      ar: extractLangValue(city.mass_graves_info, "ar"),
      zh: extractLangValue(city.mass_graves_info, "zh"),
      pt: extractLangValue(city.mass_graves_info, "pt"),
      es: extractLangValue(city.mass_graves_info, "es"),
      nl: extractLangValue(city.mass_graves_info, "nl"),
      tr: extractLangValue(city.mass_graves_info, "tr"),
      ru: extractLangValue(city.mass_graves_info, "ru"),
    },
    war_crimes_events: {
      fa: extractLangValue(city.war_crimes_events, "fa"),
      en: extractLangValue(city.war_crimes_events, "en"),
      ar: extractLangValue(city.war_crimes_events, "ar"),
      zh: extractLangValue(city.war_crimes_events, "zh"),
      pt: extractLangValue(city.war_crimes_events, "pt"),
      es: extractLangValue(city.war_crimes_events, "es"),
      nl: extractLangValue(city.war_crimes_events, "nl"),
      tr: extractLangValue(city.war_crimes_events, "tr"),
      ru: extractLangValue(city.war_crimes_events, "ru"),
    },
    liberation_info: {
      fa: extractLangValue(city.liberation_info, "fa"),
      en: extractLangValue(city.liberation_info, "en"),
      ar: extractLangValue(city.liberation_info, "ar"),
      zh: extractLangValue(city.liberation_info, "zh"),
      pt: extractLangValue(city.liberation_info, "pt"),
      es: extractLangValue(city.liberation_info, "es"),
      nl: extractLangValue(city.liberation_info, "nl"),
      tr: extractLangValue(city.liberation_info, "tr"),
      ru: extractLangValue(city.liberation_info, "ru"),
    },
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <CityForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isEditing={true}
        countries={countries}
        provinces={provinces}
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
