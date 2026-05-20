"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ProvinceForm, ProvinceFormValues } from "../province-form";
import { add } from "@/app/actions/province/add";

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

interface NewProvinceFormProps {
  countries?: Array<{ _id: string; name: string; english_name: string }>;
}

export function NewProvinceForm({ countries = [] }: NewProvinceFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProvinceFormValues) => {
    setIsLoading(true);

    try {
      const res = await add(
        {
          name: data.name,
          english_name: data.english_name,
          countryId: data.countryId,
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
          description: t("provinceCreated") || "Province created successfully",
        });
        router.refresh();
        router.push("/admin/provinces");
      } else {
        toast({
          variant: "destructive",
          title: tCommon("error"),
          description:
            res?.error || res?.body?.message || t("failedToCreateProvince") || "Failed to create province.",
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
    router.push("/admin/provinces");
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <ProvinceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
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
