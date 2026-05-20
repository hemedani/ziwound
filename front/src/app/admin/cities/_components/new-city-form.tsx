"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CityForm, CityFormValues } from "../city-form";
import { add } from "@/app/actions/city/add";

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

interface NewCityFormProps {
  countries?: Array<{ _id: string; name: string; english_name: string }>;
  provinces?: Array<{ _id: string; name: string; english_name: string; country?: { _id?: string } }>;
}

export function NewCityForm({ countries = [], provinces = [] }: NewCityFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CityFormValues) => {
    setIsLoading(true);

    try {
      const res = await add(
        {
          name: data.name,
          english_name: data.english_name,
          provinceId: data.provinceId,
          countryId: data.countryId,
          isCapital: false,
          ...(data.photoId ? { photoId: data.photoId } : {}),
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

      if (res?.success) {
        toast({
          title: tCommon("success"),
          description: t("cityCreated") || "City created successfully",
        });
        router.refresh();
        router.push("/admin/cities");
      } else {
        toast({
          variant: "destructive",
          title: tCommon("error"),
          description:
            res?.error || res?.body?.message || t("failedToCreateCity") || "Failed to create city.",
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
    router.push("/admin/cities");
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <CityForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
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
