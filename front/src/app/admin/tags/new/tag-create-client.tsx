"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TagForm, TagFormValues } from "../_components/tag-form";
import { useToast } from "@/components/ui/use-toast";

export function TagCreateClient({
  onSubmit,
}: {
  onSubmit: (formData: FormData) => Promise<unknown>;
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: TagFormValues) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    const res = await onSubmit(formData);

    if (res && typeof res === "object" && "success" in res && !res.success) {
      const err = res as { success: boolean; body?: { message?: string }; error?: string };
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: err.body?.message || err.error || t("failedToCreateTag") || "Failed to create tag",
      });
      return;
    }

    toast({
      title: t("success") || "Success",
      description: t("tagCreated") || "Tag has been created successfully.",
    });
    router.push("/admin/tags");
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/tags"
              className="text-slate-body hover:text-offwhite transition-colors"
            >
              <BackArrow className="h-4 w-4" />
            </Link>
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("tagsManagement") || "Tags"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
            {t("addTag") || "Add Tag"}
          </h1>
          <p className="text-slate-body mt-1 text-sm">
            {t("addTagDescription") || "Create a new tag for reports"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl glass-strong p-5 md:p-8 border border-white/[0.06]">
        <TagForm onSubmit={handleSubmit} onCancel={() => router.push("/admin/tags")} />
      </div>
    </div>
  );
}
