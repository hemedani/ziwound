"use client";

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
import { SlideForm, SlideFormValues } from "./slide-form";
import { update } from "@/app/actions/heroSlide/update";
import { heroSlideSchema } from "@/types/declarations";

interface EditSlideDialogProps {
  slide: heroSlideSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSlideDialog({ slide, open, onOpenChange }: EditSlideDialogProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: SlideFormValues) => {
    if (!slide?._id) return;

    try {
      const res = await update(
        {
          _id: slide._id,
          title: data.title,
          subtitle: data.subtitle,
          gradient: data.gradient,
          ctaText: data.ctaText,
          ctaLink: data.ctaLink,
          secondaryCtaText: data.secondaryCtaText || undefined,
          secondaryCtaLink: data.secondaryCtaLink || undefined,
          order: data.order,
          isActive: data.isActive,
        },
        { _id: 1, title: 1 }
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("slideUpdated") || "Hero slide has been updated successfully.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.error || res?.body?.message || t("failedToUpdateSlide") || "Failed to update hero slide.",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("editSlide") || "Edit Slide"}</DialogTitle>
          <DialogDescription className="text-slate-body">
            {t("editSlideDescription") || "Update the details of this hero slide"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {slide && (
            <SlideForm
              initialData={slide}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
