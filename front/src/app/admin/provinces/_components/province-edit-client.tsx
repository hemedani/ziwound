"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProvinceForm, ProvinceFormSubmitData } from "./province-form";
import { useToast } from "@/components/ui/use-toast";
import { update } from "@/app/actions/province/update";
import { provinceSchema } from "@/types/declarations";

export function ProvinceEditClient({ province }: { province: provinceSchema }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: ProvinceFormSubmitData) => {
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
          _id: province._id!,
          name: data.name,
          english_name: data.english_name,
          wars_history: buildLocalized(data.wars_history as Record<string, string>),
          conflict_timeline: buildLocalized(data.conflict_timeline as Record<string, string>),
          casualties_info: buildLocalized(data.casualties_info as Record<string, string>),
          notable_battles: buildLocalized(data.notable_battles as Record<string, string>),
          occupation_info: buildLocalized(data.occupation_info as Record<string, string>),
          destruction_level: buildLocalized(data.destruction_level as Record<string, string>),
          civilian_impact: buildLocalized(data.civilian_impact as Record<string, string>),
          mass_graves_info: buildLocalized(data.mass_graves_info as Record<string, string>),
          war_crimes_events: buildLocalized(data.war_crimes_events as Record<string, string>),
          liberation_info: buildLocalized(data.liberation_info as Record<string, string>),
        },
        { _id: 1, name: 1 },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("provinceUpdated") || "Province has been updated successfully.",
        });
        router.push("/admin/provinces");
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.body?.message || res?.error || t("failedToUpdateProvince") || "Failed to update province.",
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
              href="/admin/provinces"
              className="text-slate-body hover:text-offwhite transition-colors"
            >
              <BackArrow className="h-4 w-4" />
            </Link>
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("provincesManagement") || "Provinces"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
            {t("editProvince") || "Edit Province"}
          </h1>
          <p className="text-slate-body mt-1 text-sm">
            {t("editProvinceDescription") || "Update province information and war documentation"}
          </p>
        </div>
      </div>

      <ProvinceForm
        initialData={province}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/provinces")}
        isEditing
      />
    </div>
  );
}
