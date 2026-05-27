import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/province/gets";
import { count } from "@/app/actions/province/count";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AdminProvincesClient } from "./_components/admin-provinces-client";
import { ReqType, provinceSchema } from "@/types/declarations";

interface SearchParams {
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminProvincesPage({
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

  const setQuery: ReqType["main"]["province"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: sortBy as "name" | "english_name" | "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (search) {
    setQuery.search = search;
  }

  const response = await gets(setQuery, {
    _id: 1,
    name: 1,
    english_name: 1,
    photo: { _id: 1, name: 1 },
    cities: { _id: 1, name: 1 },
  });

  const totalRes = await count({}, { qty: 1 as const });

  let provinces: provinceSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    provinces = response.body || [];
  } else {
    error = response?.body?.message || "Failed to fetch provinces";
  }

  const totalCount =
    totalRes?.success && totalRes.body && typeof totalRes.body === "object"
      ? ((totalRes.body as Record<string, unknown>)?.qty as number) ?? 0
      : 0;

  const queryString = `${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  const prevPageUrl = page > 1 ? `/admin/provinces?page=${page - 1}${queryString}` : "";
  const nextPageUrl = provinces.length >= 20 ? `/admin/provinces?page=${page + 1}${queryString}` : "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("searchProvinces") || "Search provinces..."}
            defaultValue={search}
            className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>
        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
          {t("search") || "Search"}
        </Button>
        {search && (
          <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
            <Link href="/admin/provinces">
              {t("clear") || "Clear"}
            </Link>
          </Button>
        )}
      </form>

      <AdminProvincesClient
        provinces={provinces}
        totalCount={totalCount}
        error={error}
        search={search}
        prevPageUrl={prevPageUrl}
        nextPageUrl={nextPageUrl}
      />
    </div>
  );
}
