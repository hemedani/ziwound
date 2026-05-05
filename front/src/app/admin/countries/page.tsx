import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/country/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CountriesTable } from "./countries-table";
import { ReqType, countrySchema } from "@/types/declarations";

export default async function AdminCountriesPage({
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

  const setQuery: ReqType["main"]["country"]["gets"]["set"] = {
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
    english_name: 1,
  });

  let countries: countrySchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    countries = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch countries";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("countriesManagement") || "Countries Management"}
          </h1>
          <p className="text-muted-foreground">
            {t("countriesManagementDescription") || "Manage countries and their war description information"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/countries/new">
            {t("addCountry") || "Add Country"}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("searchCountries") || "Search countries..."}
              defaultValue={search}
              className="ps-8"
            />
          </div>
          <Button type="submit" variant="secondary">
            {t("search") || "Search"}
          </Button>
        </form>
      </div>

      <CountriesTable countries={countries} error={error} />

      <div className="flex items-center justify-end space-x-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/countries?page=${page - 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("previous") || "Previous"}
          </Button>
        )}
        {countries.length >= 20 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/countries?page=${page + 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
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
