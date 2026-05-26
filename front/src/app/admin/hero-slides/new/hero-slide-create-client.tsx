"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { add } from "@/app/actions/heroSlide/add";
import { HeroSlideMainForm, type SlideMainFormValues } from "../_components/hero-slide-main-form";
import { HeroSlideMediaForm } from "../_components/hero-slide-media-form";
import { LiveSlidePreview } from "../_components/live-slide-preview";
import { ImageIcon, Info } from "lucide-react";

export function HeroSlideCreateClient() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageId, setImageId] = useState<string>("");

  const [previewValues, setPreviewValues] = useState({
    title: "",
    subtitle: "",
    gradient: "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
    ctaText: "",
    ctaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    isActive: true,
  });

  const handleMainSubmit = async (values: SlideMainFormValues) => {
    startTransition(async () => {
      try {
        const res = await add(
          {
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
            description: t("slideCreated") || "Hero slide has been created successfully.",
          });
          router.push("/admin/hero-slides");
          router.refresh();
        } else {
          toast({
            variant: "destructive",
            title: t("error"),
            description: res?.body?.message || t("failedToCreateSlide") || "Failed to create hero slide",
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

  const updatePreview = (field: string, value: string | boolean) => {
    setPreviewValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      className="space-y-6 p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-xl bg-crimson/10 p-3">
            <ImageIcon className="h-6 w-6 text-crimson-light" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-px w-8 bg-crimson" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                {t("adminPanel")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
              {t("addSlide") || "New Hero Slide"}
            </h1>
            <p className="text-slate-body mt-1 text-sm">
              {t("addSlideDescription") || "Create a new hero slide for the homepage"}
            </p>
          </div>
        </div>
      </div>

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
                  className="data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
                >
                  <Info className="h-4 w-4 me-1.5" />
                  {t("mainInfo") || "Main Info"}
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
                >
                  <ImageIcon className="h-4 w-4 me-1.5" />
                  {t("media") || "Media"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-0">
                <HeroSlideMainForm
                  onSubmit={handleMainSubmit}
                  isPending={isPending}
                  submitLabel={t("create") || "Create Slide"}
                  isEditing={false}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <div className="space-y-6">
                  <HeroSlideMediaForm
                    imageId={imageId}
                    onImageChange={setImageId}
                  />

                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs text-slate-body/60">
                      {t("saveBeforeCreate") || "Switch to Main Info tab to create the slide"}
                    </p>
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
              imageName={undefined}
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
