"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ProvinceForm, ProvinceFormValues } from "../province-form";
import { update } from "@/app/actions/province/update";
import { updateRelations } from "@/app/actions/province/updateRelations";
import { provinceSchema } from "@/types/declarations";

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
      // First update the province basic info (without countryId)
      const res = await update(
        {
          _id: province._id!,
          name: data.name,
          english_name: data.english_name,
          wars_history: data.wars_history || "",
          conflict_timeline: data.conflict_timeline || "",
          casualties_info: data.casualties_info || "",
          notable_battles: data.notable_battles || "",
          occupation_info: data.occupation_info || "",
          destruction_level: data.destruction_level || "",
          civilian_impact: data.civilian_impact || "",
          mass_graves_info: data.mass_graves_info || "",
          war_crimes_events: data.war_crimes_events || "",
          liberation_info: data.liberation_info || "",
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

      // Then update relations if country changed
      if (data.countryId !== province.country?._id) {
        const relationRes = await updateRelations(
          {
            _id: province._id!,
            country: data.countryId,
          },
          { _id: 1 },
        );

        if (!relationRes?.success) {
          toast({
            variant: "destructive",
            title: tCommon("error"),
            description:
              relationRes?.error || relationRes?.body?.message || t("failedToUpdateProvinceRelations") || "Failed to update province relations.",
          });
          return;
        }
      }

      toast({
        title: tCommon("success"),
        description: t("provinceUpdated") || "Province updated successfully",
      });
      router.refresh();
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

  const defaultValues = {
    name: province.name,
    english_name: province.english_name,
    countryId: province.country?._id || "",
    wars_history: province.wars_history || "",
    conflict_timeline: province.conflict_timeline || "",
    casualties_info: province.casualties_info || "",
    notable_battles: province.notable_battles || "",
    occupation_info: province.occupation_info || "",
    destruction_level: province.destruction_level || "",
    civilian_impact: province.civilian_impact || "",
    mass_graves_info: province.mass_graves_info || "",
    war_crimes_events: province.war_crimes_events || "",
    liberation_info: province.liberation_info || "",
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
