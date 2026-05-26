"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  count: number;
}

export function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, isPending, count }: ConfirmDeleteDialogProps) {
  const t = useTranslations("admin");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-offwhite flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-crimson-light" />
            {count > 1
              ? t("deleteSlides") || "Delete Slides"
              : t("deleteSlide") || "Delete Slide"}
          </DialogTitle>
          <DialogDescription className="text-slate-body pt-1">
            {count > 1
              ? (t("deleteSlidesConfirm") || "Are you sure you want to delete {count} slides?").replace("{count}", String(count))
              : t("deleteSlideConfirm") || "Are you sure you want to delete this slide?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="border-white/10 text-slate-body hover:text-offwhite hover:bg-white/10"
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="bg-crimson hover:bg-crimson-light text-white"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin me-1.5" />}
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
