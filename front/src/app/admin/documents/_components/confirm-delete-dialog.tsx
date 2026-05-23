"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  count = 1,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  count?: number;
}) {
  const t = useTranslations("admin");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm glass-strong border-white/10">
        <DialogHeader>
          <DialogTitle className="text-offwhite flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-crimson-light" />
            {count > 1
              ? t("deleteDocuments") || "Delete Documents"
              : t("delete") || "Delete Document"}
          </DialogTitle>
          <DialogDescription className="text-slate-body">
            {count > 1
              ? (t("deleteDocumentsConfirm") ||
                  `Are you sure you want to delete ${count} documents?`)
              : (t("deleteConfirm") ||
                  "Are you sure you want to delete this document?")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-offwhite hover:bg-white/5"
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="bg-crimson hover:bg-crimson-light text-white"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin me-2" />}
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
