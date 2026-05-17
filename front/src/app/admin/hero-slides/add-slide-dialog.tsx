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
import { SlideForm, SlideFormValues } from "./slide-form";
import { add } from "@/app/actions/heroSlide/add";

export function AddSlideDialog() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: SlideFormValues) => {
    try {
      const res = await add(
        {
          title: data.title,
          subtitle: data.subtitle,
          gradient: data.gradient,
          ctaText: data.ctaText,
          ctaLink: data.ctaLink,
          secondaryCtaText: data.secondaryCtaText || undefined,
          secondaryCtaLink: data.secondaryCtaLink || undefined,
          order: data.order,
          isActive: data.isActive,
          image: data.image || undefined,
          ...(data.selected_language && data.selected_language !== "all" ? { selected_language: data.selected_language as "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru" | "id" | "hi" | "fr" | "ja" | "pa" | "de" | "te" | "mr" | "ta" | "vi" | "ko" | "it" | "sv" | "pl" | "uk" | "ro" } : {}),
        },
        { _id: 1, title: 1 }
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("slideCreated") || "Hero slide has been created successfully.",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.error || res?.body?.message || t("failedToCreateSlide") || "Failed to create hero slide.",
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
          {t("addSlide") || "Add Slide"}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("addSlide") || "Add Slide"}</DialogTitle>
          <DialogDescription className="text-slate-body">
            {t("addSlideDescription") || "Create a new hero slide for the homepage"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <SlideForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
