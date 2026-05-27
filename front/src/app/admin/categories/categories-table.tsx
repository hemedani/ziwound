"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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

export function CategoriesTable({
  categories,
  onDelete,
}: {
  categories: categorySchema[];
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("admin");

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center text-slate-body">
        {t("noCategories") || "No categories found"}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/[0.06] hover:bg-transparent">
          <TableHead className="text-slate-body">{t("name")}</TableHead>
          <TableHead className="text-slate-body">{t("color") || "Color"}</TableHead>
          <TableHead className="text-slate-body">{t("icon") || "Icon"}</TableHead>
          <TableHead className="text-slate-body hidden md:table-cell">{t("description") || "Description"}</TableHead>
          <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category._id} className="border-white/[0.06] hover:bg-white/[0.02]">
            <TableCell className="font-medium text-offwhite">{category.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border border-white/20"
                  style={{ backgroundColor: category.color || "#6b7280" }}
                />
                <span className="text-sm text-slate-body hidden sm:inline">{category.color || "—"}</span>
              </div>
            </TableCell>
            <TableCell>
              {category.icon ? (
                <span className="text-lg leading-none">{category.icon}</span>
              ) : (
                <span className="text-slate-body/50">—</span>
              )}
            </TableCell>
            <TableCell className="max-w-xs truncate text-slate-body hidden md:table-cell">
              {category.description || <span className="italic text-slate-body/40">—</span>}
            </TableCell>
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
                  <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                    <Link href={`/admin/categories/${category._id}/edit`}>
                      <Pencil className="me-2 h-4 w-4" />
                      {t("edit")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                    onClick={() => onDelete(category._id!)}
                  >
                    <Trash2 className="me-2 h-4 w-4" />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
