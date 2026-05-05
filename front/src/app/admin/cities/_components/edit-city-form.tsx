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
      // First update the city basic info
      const res = await update(
        {
          _id: city._id!,
          name: data.name,
          english_name: data.english_name,
          countryId: data.countryId,
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
            res?.error || res?.body?.message || t("failedToUpdateCity") || "Failed to update city.",
        });
        return;
      }

      // Then update relations if province changed
      if (data.provinceId !== city.province?._id) {
        const relationRes = await updateRelations(
          {
            _id: city._id!,
            province: data.provinceId,
            country: data.countryId,
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

  const defaultValues = {
    name: city.name,
    english_name: city.english_name,
    countryId: city.country?._id || "",
    provinceId: city.province?._id || "",
    wars_history: city.wars_history || "",
    conflict_timeline: city.conflict_timeline || "",
    casualties_info: city.casualties_info || "",
    notable_battles: city.notable_battles || "",
    occupation_info: city.occupation_info || "",
    destruction_level: city.destruction_level || "",
    civilian_impact: city.civilian_impact || "",
    mass_graves_info: city.mass_graves_info || "",
    war_crimes_events: city.war_crimes_events || "",
    liberation_info: city.liberation_info || "",
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
