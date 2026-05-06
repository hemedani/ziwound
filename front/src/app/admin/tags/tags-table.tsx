"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { remove } from "@/app/actions/tag/remove";
import { useToast } from "@/components/ui/use-toast";
import { tagSchema } from "@/types/declarations";
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
import { EditTagDialog } from "./edit-tag-dialog";

export function TagsTable({ tags, error }: { tags: tagSchema[]; error?: string | null }) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingTag, setEditingTag] = useState<tagSchema | null>(null);
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

  const deleteTagAction = async (id: string) => {
    if (!confirm(t("deleteTagConfirm") || "Are you sure you want to delete this tag?")) return;

    try {
      const res = await remove({ _id: id }, { success: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("tagDeleted") || "Tag deleted successfully",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("failedToDeleteTag") || "Failed to delete tag",
      });
    }
  };

  const handleEditClick = (tag: tagSchema) => {
    setEditingTag(tag);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-body">{t("name")}</TableHead>
              <TableHead className="text-slate-body">{t("color") || "Color"}</TableHead>
              <TableHead className="text-slate-body">{t("icon") || "Icon"}</TableHead>
              <TableHead className="text-slate-body">{t("description") || "Description"}</TableHead>
              <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length === 0 ? (
              <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell colSpan={5} className="h-24 text-center text-slate-body">
                  {t("noTags") || "No tags found"}
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag: tagSchema) => (
                <TableRow key={tag._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-offwhite">{tag.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: tag.color || "#000000" }}
                      />
                      <span className="text-sm text-slate-body">{tag.color || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-offwhite">{tag.icon || "-"}</TableCell>
                  <TableCell className="max-w-md truncate text-slate-body">{tag.description || "-"}</TableCell>
                  <TableCell className="text-end pe-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-white/10">
                        <DropdownMenuLabel className="text-slate-body">{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuItem className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer" onClick={() => handleEditClick(tag)}>
                          <Pencil className="me-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                          onClick={() => deleteTagAction(tag._id!)}
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

      <EditTagDialog tag={editingTag} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
}
