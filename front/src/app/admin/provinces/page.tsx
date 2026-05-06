import { getTranslations } from "next-intl/server";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCountries } from "@/app/actions/country/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ProvincesTable } from "./provinces-table";
import { ReqType, provinceSchema } from "@/types/declarations";

export default async function AdminProvincesPage({
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

  const setQuery: ReqType["main"]["province"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: sortBy as "createdAt" | "updatedAt" | "name",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (search) {
    setQuery.search = search;
  }

  const response = await getProvinces(setQuery, {
    _id: 1,
    name: 1,
    english_name: 1,
    country: {
      _id: 1,
    },
  });

  const countriesResponse = await getCountries(
    { page: 1, limit: 1000 },
    { _id: 1, name: 1, english_name: 1 }
  );

  let provinces: provinceSchema[] = [];
  let countries: any[] = [];
  let error: string | null = null;

  if (response?.success) {
    provinces = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch provinces";
  }

  if (countriesResponse?.success && Array.isArray(countriesResponse.body)) {
    countries = countriesResponse.body;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("provincesManagement") || "Provinces Management"}
          </h1>
          <p className="text-slate-body mt-1">
            {t("provincesManagementDescription") || "Manage provinces and their war description information"}
          </p>
        </div>
        <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
          <Link href="/admin/provinces/new">
            {t("addProvince") || "Add Province"}
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
        <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-slate-body" />
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
        </form>
      </div>

      <ProvincesTable provinces={provinces} countries={countries} error={error} />

      <div className="flex items-center justify-end gap-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link
              href={`/admin/provinces?page=${page - 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {provinces.length >= 20 ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link
              href={`/admin/provinces?page=${page + 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("next") || "Next"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("next") || "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
