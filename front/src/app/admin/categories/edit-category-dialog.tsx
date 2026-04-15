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
import { CategoryForm } from "./category-form";
import { update } from "@/app/actions/category/update";
import { categorySchema } from "@/types/declarations";

interface EditCategoryDialogProps {
  category: categorySchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    if (!category?._id) return;

    try {
      const res = await update(
        { _id: category._id, ...data },
        { _id: 1, name: 1 }
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("categoryUpdated") || "Category has been updated successfully.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.error || res?.body?.message || t("failedToUpdateCategory") || "Failed to update category.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editCategory") || "Edit Category"}</DialogTitle>
          <DialogDescription>
            {t("editCategoryDescription") || "Update the details of this category"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {category && (
            <CategoryForm
              initialData={category}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
