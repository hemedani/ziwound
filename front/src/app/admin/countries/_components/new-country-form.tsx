"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CountryForm, CountryFormValues } from "../country-form";
import { add } from "@/app/actions/country/add";

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
