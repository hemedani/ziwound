import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/tag/gets";
import { count } from "@/app/actions/tag/count";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AdminTagsClient } from "./_components/admin-tags-client";
import { ReqType, tagSchema } from "@/types/declarations";

interface SearchParams {
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminTagsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
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

  const response = await gets(setQuery, {
    _id: 1,
    name: 1,
    color: 1,
    icon: 1,
    description: 1,
  });

  const totalRes = await count({}, { qty: 1 as const });

  let tags: tagSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    tags = response.body || [];
  } else {
    error = response?.body?.message || "Failed to fetch tags";
  }

  const totalCount =
    totalRes?.success && totalRes.body && typeof totalRes.body === "object"
      ? ((totalRes.body as Record<string, unknown>)?.qty as number) ?? 0
      : 0;

  const queryString = `${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  const prevPageUrl = page > 1 ? `/admin/tags?page=${page - 1}${queryString}` : "";
  const nextPageUrl = tags.length >= 20 ? `/admin/tags?page=${page + 1}${queryString}` : "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Filter form */}
      <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("searchTags") || "Search tags..."}
            defaultValue={search}
            className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>
        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
          {t("search") || "Search"}
        </Button>
        {search && (
          <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
            <Link href="/admin/tags">
              {t("clear") || "Clear"}
            </Link>
          </Button>
        )}
      </form>

      <AdminTagsClient
        tags={tags}
        totalCount={totalCount}
        error={error}
        search={search}
        prevPageUrl={prevPageUrl}
        nextPageUrl={nextPageUrl}
      />
    </div>
  );
}
