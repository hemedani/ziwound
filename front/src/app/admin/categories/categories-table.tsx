"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { remove } from "@/app/actions/category/remove";
import { useToast } from "@/components/ui/use-toast";
import { categorySchema } from "@/types/declarations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditCategoryDialog } from "./edit-category-dialog";

export function CategoriesTable({ categories, error }: { categories: categorySchema[]; error?: string | null }) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<categorySchema | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: error,
      });
    }
  }, [error, toast, t]);

  const deleteCategoryAction = async (id: string) => {
    if (!confirm(t("deleteCategoryConfirm") || "Are you sure you want to delete this category?")) return;

    try {
      const res = await remove({ _id: id }, { success: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("categoryDeleted") || "Category deleted successfully",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("failedToDeleteCategory") || "Failed to delete category",
      });
    }
  };

  const handleEditClick = (category: categorySchema) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("color") || "Color"}</TableHead>
              <TableHead>{t("icon") || "Icon"}</TableHead>
              <TableHead>{t("description") || "Description"}</TableHead>
              <TableHead className="text-end pe-4">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noCategories") || "No categories found"}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category: categorySchema) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: category.color || "#000000" }}
                      />
                      <span className="text-sm text-muted-foreground">{category.color || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{category.icon || "-"}</TableCell>
                  <TableCell className="max-w-md truncate">{category.description || "-"}</TableCell>
                  <TableCell className="text-end pe-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Pencil className="me-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteCategoryAction(category._id!)}
                          disabled={isPending}
                        >
                          <Trash2 className="me-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditCategoryDialog category={editingCategory} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
}
