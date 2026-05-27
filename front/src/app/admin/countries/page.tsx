import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/country/gets";
import { count } from "@/app/actions/country/count";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AdminCountriesClient } from "./_components/admin-countries-client";
import { ReqType, countrySchema } from "@/types/declarations";

interface SearchParams {
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminCountriesPage({
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

  const setQuery: ReqType["main"]["country"]["gets"]["set"] = {
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
    provinces: { _id: 1, name: 1 },
  });

  const totalRes = await count({}, { qty: 1 as const });

  let countries: countrySchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    countries = response.body || [];
  } else {
    error = response?.body?.message || "Failed to fetch countries";
  }

  const totalCount =
    totalRes?.success && totalRes.body && typeof totalRes.body === "object"
      ? ((totalRes.body as Record<string, unknown>)?.qty as number) ?? 0
      : 0;

  const queryString = `${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  const prevPageUrl = page > 1 ? `/admin/countries?page=${page - 1}${queryString}` : "";
  const nextPageUrl = countries.length >= 20 ? `/admin/countries?page=${page + 1}${queryString}` : "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("searchCountries") || "Search countries..."}
            defaultValue={search}
            className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>
        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
          {t("search") || "Search"}
        </Button>
        {search && (
          <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
            <Link href="/admin/countries">
              {t("clear") || "Clear"}
            </Link>
          </Button>
        )}
      </form>

      <AdminCountriesClient
        countries={countries}
        totalCount={totalCount}
        error={error}
        search={search}
        prevPageUrl={prevPageUrl}
        nextPageUrl={nextPageUrl}
      />
    </div>
  );
}
