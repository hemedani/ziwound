"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CountryForm, CountryFormValues } from "../country-form";
import { update } from "@/app/actions/country/update";
import { countrySchema } from "@/types/declarations";

interface EditCountryFormProps {
  country: countrySchema;
}

export function EditCountryForm({ country }: EditCountryFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CountryFormValues) => {
    setIsLoading(true);

    try {
      const res = await update(
        {
          _id: country._id!,
          name: data.name,
          english_name: data.english_name,
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
          description: t("countryUpdated") || "Country updated successfully",
        });
        router.refresh();
        router.push("/admin/countries");
      } else {
        toast({
          variant: "destructive",
          title: tCommon("error"),
          description:
            res?.error || res?.body?.message || t("failedToUpdateCountry") || "Failed to update country.",
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

  const defaultValues = {
    name: country.name,
    english_name: country.english_name,
    wars_history: country.wars_history || "",
    conflict_timeline: country.conflict_timeline || "",
    casualties_info: country.casualties_info || "",
    international_response: country.international_response || "",
    war_crimes_documentation: country.war_crimes_documentation || "",
    human_rights_violations: country.human_rights_violations || "",
    genocide_info: country.genocide_info || "",
    chemical_weapons_info: country.chemical_weapons_info || "",
    displacement_info: country.displacement_info || "",
    reconstruction_status: country.reconstruction_status || "",
    international_sanctions: country.international_sanctions || "",
    notable_war_events: country.notable_war_events || "",
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <CountryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isEditing={true}
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
