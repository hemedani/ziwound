"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CountryForm, CountryFormSubmitData } from "../../_components/country-form";
import { useToast } from "@/components/ui/use-toast";
import { update } from "@/app/actions/country/update";
import { countrySchema } from "@/types/declarations";

export function CountryEditClient({ country }: { country: countrySchema }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: CountryFormSubmitData) => {
    const LANG_CODES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"];

    const buildLocalized = (values: Record<string, string> | undefined) => {
      if (!values) return undefined;
      const obj: Record<string, string> = {};
      for (const lang of LANG_CODES) {
        const val = values[lang];
        if (val?.trim()) obj[lang] = val;
      }
      return Object.keys(obj).length > 0 ? obj : undefined;
    };

    try {
      const res = await update(
        {
          _id: country._id!,
          name: data.name,
          english_name: data.english_name,
          wars_history: buildLocalized(data.wars_history as Record<string, string>),
          conflict_timeline: buildLocalized(data.conflict_timeline as Record<string, string>),
          casualties_info: buildLocalized(data.casualties_info as Record<string, string>),
          international_response: buildLocalized(data.international_response as Record<string, string>),
          war_crimes_documentation: buildLocalized(data.war_crimes_documentation as Record<string, string>),
          human_rights_violations: buildLocalized(data.human_rights_violations as Record<string, string>),
          genocide_info: buildLocalized(data.genocide_info as Record<string, string>),
          chemical_weapons_info: buildLocalized(data.chemical_weapons_info as Record<string, string>),
          displacement_info: buildLocalized(data.displacement_info as Record<string, string>),
          reconstruction_status: buildLocalized(data.reconstruction_status as Record<string, string>),
          international_sanctions: buildLocalized(data.international_sanctions as Record<string, string>),
          notable_war_events: buildLocalized(data.notable_war_events as Record<string, string>),
        },
        { _id: 1, name: 1 },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("countryUpdated") || "Country has been updated successfully.",
        });
        router.push("/admin/countries");
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.body?.message || res?.error || t("failedToUpdateCountry") || "Failed to update country.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/countries"
              className="text-slate-body hover:text-offwhite transition-colors"
            >
              <BackArrow className="h-4 w-4" />
            </Link>
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("countriesManagement") || "Countries"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
            {t("editCountry") || "Edit Country"}
          </h1>
          <p className="text-slate-body mt-1 text-sm">
            {t("editCountryDescription") || "Update country information and war documentation"}
          </p>
        </div>
      </div>

      <CountryForm
        initialData={country}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/countries")}
        isEditing
      />
    </div>
  );
}
