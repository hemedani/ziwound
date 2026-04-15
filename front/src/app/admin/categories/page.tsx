import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/category/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CategoriesTable } from "./categories-table";
import { ReqType, categorySchema } from "@/types/declarations";
import { AddCategoryDialog } from "./add-category-dialog";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["category"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: sortBy as "createdAt" | "updatedAt" | "name",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (search) {
    setQuery.search = search;
  }

  // Fetch categories
  const response = await gets(setQuery, {
    _id: 1,
    name: 1,
    color: 1,
    icon: 1,
    description: 1,
  });

  let categories: categorySchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    categories = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch categories";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("categoriesManagement") || "Categories Management"}
          </h1>
          <p className="text-muted-foreground">
            {t("categoriesManagementDescription") || "Manage categories for reports categorization"}
          </p>
        </div>
        <AddCategoryDialog />
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("searchCategories") || "Search categories..."}
              defaultValue={search}
              className="ps-8"
            />
          </div>
          <Button type="submit" variant="secondary">
            {t("search") || "Search"}
          </Button>
        </form>
      </div>

      <CategoriesTable categories={categories} error={error} />

      <div className="flex items-center justify-end space-x-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/categories?page=${page - 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("previous") || "Previous"}
          </Button>
        )}
        {categories.length >= 20 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/categories?page=${page + 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("next") || "Next"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("next") || "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
