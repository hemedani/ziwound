"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CountryForm, CountryFormValues } from "../country-form";
import { add } from "@/app/actions/country/add";

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

export function NewCountryForm() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CountryFormValues) => {
    setIsLoading(true);

    try {
      const res = await add(
        {
          name: data.name,
          english_name: data.english_name,
          ...(data.photoId ? { photoId: data.photoId } : {}),
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
          description: t("countryCreated") || "Country created successfully",
        });
        router.refresh();
        router.push("/admin/countries");
      } else {
        toast({
          variant: "destructive",
          title: tCommon("error"),
          description:
            res?.error || res?.body?.message || t("failedToCreateCountry") || "Failed to create country.",
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

  return (
    <div className="rounded-lg border bg-card p-6">
      <CountryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
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
