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
import { TagForm, TagFormValues } from "./tag-form";
import { update } from "@/app/actions/tag/update";
import { tagSchema } from "@/types/declarations";

interface EditTagDialogProps {
  tag: tagSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTagDialog({ tag, open, onOpenChange }: EditTagDialogProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: TagFormValues) => {
    if (!tag?._id) return;

    try {
      const res = await update(
        { _id: tag._id, ...data },
        { _id: 1, name: 1 }
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("tagUpdated") || "Tag has been updated successfully.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.error || res?.body?.message || t("failedToUpdateTag") || "Failed to update tag.",
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
      <DialogContent className="glass-strong border-white/10">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("editTag") || "Edit Tag"}</DialogTitle>
          <DialogDescription className="text-slate-body">
            {t("editTagDescription") || "Update the details of this tag"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {tag && (
            <TagForm
              initialData={tag}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
