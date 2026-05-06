import { getTranslations } from "next-intl/server";
import { gets as getReports } from "@/app/actions/report/gets";
import { gets as getCategories } from "@/app/actions/category/gets";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ReportsTable } from "./reports-table";
import { ReqType } from "@/types/declarations";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    selected_language?: string;
    hostileCountryIds?: string;
    attackedCountryIds?: string;
    attackedProvinceIds?: string;
    attackedCityIds?: string;
    crimeOccurredFrom?: string;
    crimeOccurredTo?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "all";
  const priority = resolvedSearchParams.priority || "all";
  const category = resolvedSearchParams.category || "all";
  const selected_language = resolvedSearchParams.selected_language || "all";
  const hostileCountryIds = resolvedSearchParams.hostileCountryIds || "";
  const attackedCountryIds = resolvedSearchParams.attackedCountryIds || "";
  const attackedProvinceIds = resolvedSearchParams.attackedProvinceIds || "";
  const attackedCityIds = resolvedSearchParams.attackedCityIds || "";
  const crimeOccurredFrom = resolvedSearchParams.crimeOccurredFrom
    ? new Date(resolvedSearchParams.crimeOccurredFrom)
    : undefined;
  const crimeOccurredTo = resolvedSearchParams.crimeOccurredTo
    ? new Date(resolvedSearchParams.crimeOccurredTo)
    : undefined;
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["report"]["gets"]["set"] = { page, limit: 10 };
  if (search) setQuery.search = search;
  if (status !== "all") setQuery.status = status as ReqType["main"]["report"]["gets"]["set"]["status"];
  if (priority !== "all")
    setQuery.priority = priority as ReqType["main"]["report"]["gets"]["set"]["priority"];
  if (category !== "all") setQuery.categoryIds = [category];
  if (selected_language !== "all")
    setQuery.selected_language = selected_language as ReqType["main"]["report"]["gets"]["set"]["selected_language"];
  if (hostileCountryIds) setQuery.hostileCountryIds = hostileCountryIds.split(",").filter(Boolean);
  if (attackedCountryIds) setQuery.attackedCountryIds = attackedCountryIds.split(",").filter(Boolean);
  if (attackedProvinceIds) setQuery.attackedProvinceIds = attackedProvinceIds.split(",").filter(Boolean);
  if (attackedCityIds) setQuery.attackedCityIds = attackedCityIds.split(",").filter(Boolean);
  if (crimeOccurredFrom) setQuery.crimeOccurredFrom = crimeOccurredFrom;
  if (crimeOccurredTo) setQuery.crimeOccurredTo = crimeOccurredTo;
  setQuery.sortBy = sortBy as ReqType["main"]["report"]["gets"]["set"]["sortBy"];
  setQuery.sortOrder = sortOrder as ReqType["main"]["report"]["gets"]["set"]["sortOrder"];

  // Fetch categories for filter
  const categoriesResponse = await getCategories({ page: 1, limit: 100 }, { _id: 1, name: 1 });
  let categories: { _id: string; name: string }[] = [];
  if (categoriesResponse?.success) {
    categories = Array.isArray(categoriesResponse.body)
      ? categoriesResponse.body
      : categoriesResponse.body?.list || [];
  }

  // Fetch countries, provinces, and cities for filter dropdowns
  const [countriesResponse, provincesResponse, citiesResponse] = await Promise.all([
    getCountries({ page: 1, limit: 100 }, { _id: 1, name: 1 }),
    getProvinces({ page: 1, limit: 100 }, { _id: 1, name: 1 }),
    getCities({ page: 1, limit: 100 }, { _id: 1, name: 1 }),
  ]);

  const countries = countriesResponse?.success
    ? Array.isArray(countriesResponse.body)
      ? countriesResponse.body
      : countriesResponse.body?.list || []
    : [];

  const provinces = provincesResponse?.success
    ? Array.isArray(provincesResponse.body)
      ? provincesResponse.body
      : provincesResponse.body?.list || []
    : [];

  const cities = citiesResponse?.success
    ? Array.isArray(citiesResponse.body)
      ? citiesResponse.body
      : citiesResponse.body?.list || []
    : [];

  // Fetch reports
  const response = await getReports(setQuery, {
    _id: 1,
    title: 1,
    status: 1,
    priority: 1,
    hostileCountries: { _id: 1, name: 1 },
    attackedCountries: { _id: 1, name: 1 },
    attackedProvinces: { _id: 1, name: 1 },
    attackedCities: { _id: 1, name: 1 },
    crime_occurred_at: 1,
    createdAt: 1,
    category: { _id: 1, name: 1 },
    documents: { _id: 1, title: 1 },
  });

  let reports: Array<{
    _id: string;
    title: string;
    status: string;
    priority: string;
    hostileCountries?: Array<{ _id: string; name: string }>;
    attackedCountries?: Array<{ _id: string; name: string }>;
    attackedProvinces?: Array<{ _id: string; name: string }>;
    attackedCities?: Array<{ _id: string; name: string }>;
    crime_occurred_at?: string;
    createdAt: string;
    category?: { _id: string; name: string };
    documents?: Array<{ _id: string; title: string }>;
  }> = [];
  let error: string | null = null;
  if (response?.success) {
    reports = Array.isArray(response.body) ? response.body : response.body?.list || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch reports";
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="h-px w-8 bg-crimson" />
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
            {t("adminPanel")}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-offwhite">{t("reportsManagement")}</h1>
        <p className="text-slate-body mt-1">{t("reportsManagementDescription")}</p>
      </div>

      <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
        <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-slate-body" />
            <Input
              name="search"
              placeholder={t("searchPlaceholder") || "Search..."}
              defaultValue={search}
              className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="status" defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses") || "All Statuses"}</SelectItem>
                <SelectItem value="Pending">{t("status_pending")}</SelectItem>
                <SelectItem value="Approved">{t("status_approved")}</SelectItem>
                <SelectItem value="Rejected">{t("status_rejected")}</SelectItem>
                <SelectItem value="InReview">{t("status_in_review")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="priority" defaultValue={priority}>
              <SelectTrigger>
                <SelectValue placeholder={t("priority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allPriorities") || "All Priorities"}</SelectItem>
                <SelectItem value="Low">{t("priority_low")}</SelectItem>
                <SelectItem value="Medium">{t("priority_medium")}</SelectItem>
                <SelectItem value="High">{t("priority_high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="category" defaultValue={category}>
              <SelectTrigger>
                <SelectValue placeholder={t("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories") || "All Categories"}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="selected_language" defaultValue={selected_language}>
              <SelectTrigger>
                <SelectValue placeholder={t("language") || "Language"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allLanguages") || "All Languages"}</SelectItem>
                <SelectItem value="en">English (en)</SelectItem>
                <SelectItem value="zh">Chinese (zh)</SelectItem>
                <SelectItem value="hi">Hindi (hi)</SelectItem>
                <SelectItem value="es">Spanish (es)</SelectItem>
                <SelectItem value="fr">French (fr)</SelectItem>
                <SelectItem value="ar">Arabic (ar)</SelectItem>
                <SelectItem value="pt">Portuguese (pt)</SelectItem>
                <SelectItem value="ru">Russian (ru)</SelectItem>
                <SelectItem value="ja">Japanese (ja)</SelectItem>
                <SelectItem value="pa">Punjabi (pa)</SelectItem>
                <SelectItem value="de">German (de)</SelectItem>
                <SelectItem value="id">Indonesian (id)</SelectItem>
                <SelectItem value="te">Telugu (te)</SelectItem>
                <SelectItem value="mr">Marathi (mr)</SelectItem>
                <SelectItem value="tr">Turkish (tr)</SelectItem>
                <SelectItem value="ta">Tamil (ta)</SelectItem>
                <SelectItem value="vi">Vietnamese (vi)</SelectItem>
                <SelectItem value="ko">Korean (ko)</SelectItem>
                <SelectItem value="it">Italian (it)</SelectItem>
                <SelectItem value="fa">Persian (fa)</SelectItem>
                <SelectItem value="nl">Dutch (nl)</SelectItem>
                <SelectItem value="sv">Swedish (sv)</SelectItem>
                <SelectItem value="pl">Polish (pl)</SelectItem>
                <SelectItem value="uk">Ukrainian (uk)</SelectItem>
                <SelectItem value="ro">Romanian (ro)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="hostileCountryIds" defaultValue={hostileCountryIds || "all"}>
              <SelectTrigger>
                <SelectValue placeholder={t("hostileCountries") || "Hostile Countries"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allHostileCountries") || "All Hostile Countries"}</SelectItem>
                {countries.map((country: { _id: string; name: string }) => (
                  <SelectItem key={country._id} value={country._id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="attackedCountryIds" defaultValue={attackedCountryIds || "all"}>
              <SelectTrigger>
                <SelectValue placeholder={t("attackedCountries") || "Attacked Countries"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allAttackedCountries") || "All Attacked Countries"}</SelectItem>
                {countries.map((country: { _id: string; name: string }) => (
                  <SelectItem key={country._id} value={country._id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="attackedProvinceIds" defaultValue={attackedProvinceIds || "all"}>
              <SelectTrigger>
                <SelectValue placeholder={t("attackedProvinces") || "Attacked Provinces"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allAttackedProvinces") || "All Attacked Provinces"}</SelectItem>
                {provinces.map((province: { _id: string; name: string }) => (
                  <SelectItem key={province._id} value={province._id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="attackedCityIds" defaultValue={attackedCityIds || "all"}>
              <SelectTrigger>
                <SelectValue placeholder={t("attackedCities") || "Attacked Cities"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allAttackedCities") || "All Attacked Cities"}</SelectItem>
                {cities.map((city: { _id: string; name: string }) => (
                  <SelectItem key={city._id} value={city._id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Input
              type="date"
              name="crimeOccurredFrom"
              placeholder={t("from") || "From"}
            />
          </div>
          <div className="w-full sm:w-48">
            <Input type="date" name="crimeOccurredTo" placeholder={t("to") || "To"} />
          </div>
          <div className="w-full sm:w-48">
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortBy") || "Sort By"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{t("date")}</SelectItem>
                <SelectItem value="title">{t("title")}</SelectItem>
                <SelectItem value="status">{t("status")}</SelectItem>
                <SelectItem value="priority">{t("priority")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortOrder") || "Order"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t("descending") || "Descending"}</SelectItem>
                <SelectItem value="asc">{t("ascending") || "Ascending"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
            {t("applyFilters") || "Filter"}
          </Button>
        </form>
      </div>

      <ReportsTable reports={reports} error={error} />

      <div className="flex items-center justify-end gap-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/reports?page=${page - 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}${priority !== "all" ? `&priority=${priority}` : ""}${category !== "all" ? `&category=${category}` : ""}${selected_language !== "all" ? `&selected_language=${selected_language}` : ""}${hostileCountryIds ? `&hostileCountryIds=${hostileCountryIds}` : ""}${attackedCountryIds ? `&attackedCountryIds=${attackedCountryIds}` : ""}${attackedProvinceIds ? `&attackedProvinceIds=${attackedProvinceIds}` : ""}${attackedCityIds ? `&attackedCityIds=${attackedCityIds}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {reports.length >= 10 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/reports?page=${page + 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}${priority !== "all" ? `&priority=${priority}` : ""}${category !== "all" ? `&category=${category}` : ""}${selected_language !== "all" ? `&selected_language=${selected_language}` : ""}${hostileCountryIds ? `&hostileCountryIds=${hostileCountryIds}` : ""}${attackedCountryIds ? `&attackedCountryIds=${attackedCountryIds}` : ""}${attackedProvinceIds ? `&attackedProvinceIds=${attackedProvinceIds}` : ""}${attackedCityIds ? `&attackedCityIds=${attackedCityIds}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
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
