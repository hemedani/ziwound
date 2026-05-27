"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TagForm, TagFormValues } from "../../_components/tag-form";
import { useToast } from "@/components/ui/use-toast";
import { update } from "@/app/actions/tag/update";
import { tagSchema } from "@/types/declarations";

export function TagEditClient({ tag }: { tag: tagSchema }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: TagFormValues) => {
    try {
      const res = await update(
        {
          _id: tag._id!,
          name: data.name,
          description: data.description || "",
          ...(data.color ? { color: data.color } : {}),
          ...(data.icon ? { icon: data.icon } : {}),
        },
        { _id: 1, name: 1 },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("tagUpdated") || "Tag has been updated successfully.",
        });
        router.push("/admin/tags");
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.body?.message || res?.error || t("failedToUpdateTag") || "Failed to update tag.",
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
            {t("editTag") || "Edit Tag"}
          </h1>
          <p className="text-slate-body mt-1 text-sm">
            {t("editTagDescription") || "Update the details of this tag"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl glass-strong p-5 md:p-8 border border-white/[0.06]">
        <TagForm
          initialData={tag}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/tags")}
        />
      </div>
    </div>
  );
}
