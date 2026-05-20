"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CountryForm, CountryFormValues } from "./country-form";
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

export function AddCountryDialog() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: CountryFormValues) => {
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
          title: t("success") || "Success",
          description: t("countryCreated") || "Country has been created successfully.",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.error || res?.body?.message || t("failedToCreateCountry") || "Failed to create country.",
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="me-2 h-4 w-4" />
          {t("addCountry") || "Add Country"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addCountry") || "Add Country"}</DialogTitle>
          <DialogDescription>
            {t("addCountryDescription") || "Create a new country with war description fields"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CountryForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
