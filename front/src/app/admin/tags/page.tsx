import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/tag/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TagsTable } from "./tags-table";
import { ReqType, tagSchema } from "@/types/declarations";
import { AddTagDialog } from "./add-tag-dialog";

export default async function AdminTagsPage({
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

  const setQuery: ReqType["main"]["tag"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: sortBy as "createdAt" | "updatedAt" | "name",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (search) {
    setQuery.search = search;
  }

  // Fetch tags
  const response = await gets(setQuery, {
    _id: 1,
    name: 1,
    color: 1,
    icon: 1,
    description: 1,
  });

  let tags: tagSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    tags = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch tags";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("tagsManagement") || "Tags Management"}
          </h1>
          <p className="text-muted-foreground">
            {t("tagsManagementDescription") || "Manage tags for reports categorization"}
          </p>
        </div>
        <AddTagDialog />
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("searchTags") || "Search tags..."}
              defaultValue={search}
              className="ps-8"
            />
          </div>
          <Button type="submit" variant="secondary">
            {t("search") || "Search"}
          </Button>
        </form>
      </div>

      <TagsTable tags={tags} error={error} />

      <div className="flex items-center justify-end space-x-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/tags?page=${page - 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("previous") || "Previous"}
          </Button>
        )}
        {tags.length >= 20 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/tags?page=${page + 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
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
