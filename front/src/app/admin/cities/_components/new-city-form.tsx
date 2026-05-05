"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CityForm, CityFormValues } from "../city-form";
import { add } from "@/app/actions/city/add";

interface NewCityFormProps {
  provinces?: Array<{ _id: string; name: string; english_name: string }>;
}

export function NewCityForm({ provinces = [] }: NewCityFormProps) {
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
          province_id: data.province_id,
          wars_history: data.wars_history || "",
          conflict_timeline: data.conflict_timeline || "",
          casualties_info: data.casualties_info || "",
          international_response: data.international_response || "",
          war_crimes_documentation: data.war_crimes_documentation || "",
          human_rights_violations: data.human_rights_violations || "",
          genocide_info: data.genocide_info || "",
          chemical_weapons_info: data.chemical_weapons_info || "",
          displacement_info: data.displacement_info || "",
          reconstruction_status: data.reconstruction_status || "",
          international_sanctions: data.international_sanctions || "",
          notable_war_events: data.notable_war_events || "",
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
