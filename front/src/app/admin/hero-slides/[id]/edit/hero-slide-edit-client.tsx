"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { update } from "@/app/actions/heroSlide/update";
import { heroSlideSchema } from "@/types/declarations";
import { HeroSlideMainForm, type SlideMainFormValues } from "../../_components/hero-slide-main-form";
import { HeroSlideMediaForm } from "../../_components/hero-slide-media-form";
import { LiveSlidePreview } from "../../_components/live-slide-preview";
import { ArrowLeft, ArrowRight, ImageIcon, Info, Hash, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSlideEditClientProps {
  slide: heroSlideSchema;
}

export function HeroSlideEditClient({ slide }: HeroSlideEditClientProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageId, setImageId] = useState<string>(slide.image?._id || "");
  const [isMediaSaving, setIsMediaSaving] = useState(false);

  const [previewValues, setPreviewValues] = useState({
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    gradient: slide.gradient || "",
    ctaText: slide.ctaText || "",
    ctaLink: slide.ctaLink || "",
    secondaryCtaText: slide.secondaryCtaText || "",
    secondaryCtaLink: slide.secondaryCtaLink || "",
    isActive: slide.isActive ?? true,
  });

  const handlePreviewChange = useCallback(
    (values: Partial<SlideMainFormValues>) =>
      setPreviewValues((prev) => ({ ...prev, ...values })),
    [],
  );

  const handleMainSubmit = async (values: SlideMainFormValues) => {
    const slideId = slide._id;
    if (!slideId) return;

    startTransition(async () => {
      try {
        const res = await update(
          {
            _id: slideId,
            title: values.title,
            subtitle: values.subtitle,
            gradient: values.gradient,
            ctaText: values.ctaText,
            ctaLink: values.ctaLink,
            secondaryCtaText: values.secondaryCtaText || undefined,
            secondaryCtaLink: values.secondaryCtaLink || undefined,
            order: values.order,
            isActive: values.isActive,
            image: imageId || undefined,
            ...(values.selected_language && values.selected_language !== "all"
              ? {
                  selected_language: values.selected_language as "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru" | "id" | "hi" | "fr" | "ja" | "pa" | "de" | "te" | "mr" | "ta" | "vi" | "ko" | "it" | "sv" | "pl" | "uk" | "ro",
                }
              : {}),
          },
          { _id: 1, title: 1 },
        );

        if (res?.success) {
          toast({
            title: t("success"),
            description: t("slideUpdated") || "Hero slide has been updated successfully.",
          });
          router.refresh();
        } else {
          toast({
            variant: "destructive",
            title: t("error"),
            description: res?.body?.message || t("failedToUpdateSlide") || "Failed to update hero slide",
          });
        }
      } catch {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("unexpectedError") || "An unexpected error occurred",
        });
      }
    });
  };

  const handleMediaSave = async () => {
    const slideId = slide._id;
    if (!slideId) return;
    if (imageId === (slide.image?._id || "")) {
      toast({ title: t("success"), description: t("noChanges") || "No changes" });
      return;
    }

    setIsMediaSaving(true);
    try {
      const res = await update(
        {
          _id: slideId,
          title: slide.title,
          subtitle: slide.subtitle,
          gradient: slide.gradient,
          ctaText: slide.ctaText,
          ctaLink: slide.ctaLink,
          order: slide.order,
          isActive: slide.isActive,
          image: imageId || undefined,
        },
        { _id: 1, title: 1 },
      );

      if (res?.success) {
        toast({
          title: t("success"),
          description: t("slideImageUpdated") || "Background image updated.",
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error"),
          description: res?.body?.message || t("failedToUpdateSlide") || "Failed to update image",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("unexpectedError") || "An unexpected error occurred",
      });
    } finally {
      setIsMediaSaving(false);
    }
  };

  return (
    <motion.div
      className="space-y-6 p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
          <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/admin/hero-slides"
                  className="text-slate-body hover:text-offwhite transition-colors"
                >
                  <BackArrow className="h-4 w-4" />
                </Link>
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
                {t("editSlide") || "Edit Hero Slide"}
              </h1>
              <p className="text-slate-body mt-1 text-sm">
                {t("editSlideDescription") || "Update the details of this hero slide"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
              >
                <Link href="/admin/hero-slides">
                  {t("cancel") || "Cancel"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            className="rounded-2xl glass-light border border-white/[0.06] p-5 md:p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 mb-6">
                <TabsTrigger
                  value="main"
                  className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite"
                >
                  <Hash className="h-4 w-4 me-1.5" />
                  {t("mainInfo") || "Main Info"}
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite"
                >
                  <ImageIcon className="h-4 w-4 me-1.5" />
                  {t("media") || "Media"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-0">
                <HeroSlideMainForm
                  defaultValues={{
                    title: slide.title,
                    subtitle: slide.subtitle,
                    gradient: slide.gradient,
                    ctaText: slide.ctaText,
                    ctaLink: slide.ctaLink,
                    secondaryCtaText: slide.secondaryCtaText,
                    secondaryCtaLink: slide.secondaryCtaLink,
                    order: slide.order,
                    isActive: slide.isActive,
                    selected_language: slide.selected_language || "all",
                  }}
                  onSubmit={handleMainSubmit}
                  isPending={isPending}
                  submitLabel={t("saveChanges") || "Save Changes"}
                  isEditing={true}
                  onValuesChange={handlePreviewChange}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <div className="space-y-6">
                  <HeroSlideMediaForm
                    imageId={imageId}
                    onImageChange={setImageId}
                  />

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                    <Button
                      type="button"
                      onClick={handleMediaSave}
                      disabled={isMediaSaving}
                      className="bg-crimson hover:bg-crimson-light text-white h-10 px-8"
                    >
                      {isMediaSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin me-2" />
                      ) : (
                        <Save className="h-4 w-4 me-2" />
                      )}
                      {t("saveImage") || "Save Image"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.div
            className="sticky top-24 rounded-2xl glass-light border border-white/[0.06] p-5 md:p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <LiveSlidePreview
              title={previewValues.title}
              subtitle={previewValues.subtitle}
              gradient={previewValues.gradient}
              imageName={slide.image?.name}
              ctaText={previewValues.ctaText}
              secondaryCtaText={previewValues.secondaryCtaText}
              isActive={previewValues.isActive}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
