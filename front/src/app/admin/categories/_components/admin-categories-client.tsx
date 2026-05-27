"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { categorySchema } from "@/types/declarations";
import { CategoryCard } from "./category-card";
import { CategoriesTable } from "../categories-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { remove } from "@/app/actions/category/remove";
import { LayoutGrid, Table2, Plus, ArrowLeft, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

interface AdminCategoriesClientProps {
  categories: categorySchema[];
  totalCount: number;
  error?: string | null;
  search: string;
  prevPageUrl: string;
  nextPageUrl: string;
}

export function AdminCategoriesClient({
  categories,
  totalCount,
  error,
  search,
  prevPageUrl,
  nextPageUrl,
}: AdminCategoriesClientProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const { toast } = useToast();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteCategoryConfirm") || "Are you sure you want to delete this category?")) return;

    setIsDeleting(id);
    try {
      const res = await remove({ _id: id }, { success: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("categoryDeleted") || "Category deleted successfully",
        });
        router.refresh();
      } else {
        throw new Error(res?.body?.message || "Failed to delete");
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("failedToDeleteCategory") || "Failed to delete category",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (error) {
    return <ErrorState title={t("error") || "Error"} description={error} onRetry={() => router.refresh()} />;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin"
                className="text-slate-body hover:text-offwhite transition-colors"
              >
                <BackArrow className="h-4 w-4" />
              </Link>
              <div className="h-px w-8 bg-crimson" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                {t("adminPanel")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
              {t("categoriesManagement") || "Categories Management"}
            </h1>
            <p className="text-slate-body mt-1 text-sm">
              {t("categoriesManagementDescription") || "Manage categories for reports categorization"}
            </p>
          </div>
          <Button asChild className="bg-crimson hover:bg-crimson-light text-white shrink-0">
            <Link href="/admin/categories/new">
              <Plus className="h-4 w-4 me-2" />
              {t("addCategory") || "Add Category"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl glass-strong p-4 border border-white/[0.06] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-crimson/10 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5 text-crimson" />
          </div>
          <div>
            <p className="text-2xl font-bold text-offwhite">{totalCount}</p>
            <p className="text-xs text-slate-body">{t("totalCategories") || "Total Categories"}</p>
          </div>
        </div>
        <div className="rounded-xl glass-strong p-4 border border-white/[0.06] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
            <span className="text-lg leading-none">🎨</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-offwhite">{categories.filter(c => c.color).length}</p>
            <p className="text-xs text-slate-body">{t("categoriesWithColor") || "Categories with color"}</p>
          </div>
        </div>
        <div className="rounded-xl glass-strong p-4 border border-white/[0.06] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <span className="text-lg leading-none">😊</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-offwhite">{categories.filter(c => c.icon).length}</p>
            <p className="text-xs text-slate-body">{t("categoriesWithIcon") || "Categories with icon"}</p>
          </div>
        </div>
      </div>

      {/* View Toggle + Result Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-body">
          {categories.length > 0 ? (
            <>
              <span className="text-offwhite font-medium">{categories.length}</span>
              {" "}{t("itemsShown") || "items shown"}
              {totalCount > categories.length && (
                <span className="text-slate-body/60">
                  {" "}({t("total")}: {totalCount})
                </span>
              )}
            </>
          ) : (
            t("noResults") || "No results"
          )}
        </p>
        <div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-8 w-8 p-0 ${
              viewMode === "grid"
                ? "bg-crimson text-white hover:bg-crimson-light"
                : "text-slate-body hover:text-offwhite hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("table")}
            className={`h-8 w-8 p-0 ${
              viewMode === "table"
                ? "bg-crimson text-white hover:bg-crimson-light"
                : "text-slate-body hover:text-offwhite hover:bg-white/5"
            }`}
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {categories.length === 0 ? (
        <div className="rounded-2xl glass-light border border-white/[0.06] p-12">
          <EmptyState
            title={t("noCategories") || "No categories found"}
            description={t("noCategoriesDescription") || "Try adjusting your filters or create a new category."}
            action={
              <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
                <Link href="/admin/categories/new">
                  <Plus className="h-4 w-4 me-2" />
                  {t("addCategory") || "Add Category"}
                </Link>
              </Button>
            }
          />
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard key={category._id} category={category} onDelete={handleDelete} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl glass-light border border-white/[0.06] overflow-hidden">
          <CategoriesTable categories={categories} onDelete={handleDelete} />
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 py-2">
        {prevPageUrl ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link href={prevPageUrl}>
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {nextPageUrl ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link href={nextPageUrl}>
              {t("next") || "Next"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("next") || "Next"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
