"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ProvinceForm, ProvinceFormValues } from "../province-form";
import { update } from "@/app/actions/province/update";
import { provinceSchema } from "@/types/declarations";

interface EditProvinceFormProps {
  province: provinceSchema;
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
          _id: province._id,
          name: data.name,
          english_name: data.english_name,
          country_id: data.country_id,
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
          description: t("provinceUpdated") || "Province updated successfully",
        });
        router.refresh();
        router.push("/admin/provinces");
      } else {
        toast({
          variant: "destructive",
          title: tCommon("error"),
          description:
            res?.error || res?.body?.message || t("failedToUpdateProvince") || "Failed to update province.",
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

  const defaultValues = {
    name: province.name,
    english_name: province.english_name,
    country_id: province.country_id,
    wars_history: province.wars_history || "",
    conflict_timeline: province.conflict_timeline || "",
    casualties_info: province.casualties_info || "",
    international_response: province.international_response || "",
    war_crimes_documentation: province.war_crimes_documentation || "",
    human_rights_violations: province.human_rights_violations || "",
    genocide_info: province.genocide_info || "",
    chemical_weapons_info: province.chemical_weapons_info || "",
    displacement_info: province.displacement_info || "",
    reconstruction_status: province.reconstruction_status || "",
    international_sanctions: province.international_sanctions || "",
    notable_war_events: province.notable_war_events || "",
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
