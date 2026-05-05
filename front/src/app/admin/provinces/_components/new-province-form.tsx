"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ProvinceForm, ProvinceFormValues } from "../province-form";
import { add } from "@/app/actions/province/add";

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
