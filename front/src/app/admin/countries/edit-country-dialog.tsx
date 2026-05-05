"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CountryForm, CountryFormValues } from "./country-form";
import { update } from "@/app/actions/country/update";
import { countrySchema } from "@/types/declarations";

interface EditCountryDialogProps {
  country: countrySchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCountryDialog({ country, open, onOpenChange }: EditCountryDialogProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: CountryFormValues) => {
    if (!country?._id) return;

    try {
      const res = await update(
        {
          _id: country._id,
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
          title: t("success") || "Success",
          description: t("countryUpdated") || "Country has been updated successfully.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.error || res?.body?.message || t("failedToUpdateCountry") || "Failed to update country.",
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    }
  };

  const defaultValues = country
    ? {
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
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editCountry") || "Edit Country"}</DialogTitle>
          <DialogDescription>
            {t("editCountryDescription") || "Update country information and war description fields"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CountryForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            defaultValues={defaultValues}
            isEditing
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
