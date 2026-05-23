import { getTranslations, getLocale } from "next-intl/server";
import { gets as getReports } from "@/app/actions/report/gets";
import { count as countReports } from "@/app/actions/report/count";
import { gets as getCategories } from "@/app/actions/category/gets";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import { gets as getTags } from "@/app/actions/tag/gets";
import { AdminReportsClient } from "./reports-client";
import { ReqType } from "@/types/declarations";

export const metadata = {
  title: "Reports Management — ZiWound Admin",
  description: "Manage and review war crime reports",
};

interface SearchParams {
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
  createdAtFrom?: string;
  createdAtTo?: string;
  tagIds?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const locale = await getLocale();
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "all";
  const priority = resolvedSearchParams.priority || "all";
  const category = resolvedSearchParams.category || "all";
  const selected_language = resolvedSearchParams.selected_language || "all";
  const tagIds = resolvedSearchParams.tagIds || "";
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
  const createdAtFrom = resolvedSearchParams.createdAtFrom
    ? new Date(resolvedSearchParams.createdAtFrom)
    : undefined;
  const createdAtTo = resolvedSearchParams.createdAtTo
    ? new Date(resolvedSearchParams.createdAtTo)
    : undefined;
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["report"]["gets"]["set"] = {
    page,
    limit: 15,
  };
  if (search) setQuery.search = search;
  if (status !== "all")
    setQuery.status = status as ReqType["main"]["report"]["gets"]["set"]["status"];
  if (priority !== "all")
    setQuery.priority = priority as ReqType["main"]["report"]["gets"]["set"]["priority"];
  if (category !== "all") setQuery.categoryIds = [category];
  if (selected_language !== "all")
    setQuery.selected_language =
      selected_language as ReqType["main"]["report"]["gets"]["set"]["selected_language"];
  if (tagIds) setQuery.tagIds = tagIds.split(",").filter(Boolean);
  if (hostileCountryIds)
    setQuery.hostileCountryIds = hostileCountryIds.split(",").filter(Boolean);
  if (attackedCountryIds)
    setQuery.attackedCountryIds = attackedCountryIds.split(",").filter(Boolean);
  if (attackedProvinceIds)
    setQuery.attackedProvinceIds = attackedProvinceIds.split(",").filter(Boolean);
  if (attackedCityIds)
    setQuery.attackedCityIds = attackedCityIds.split(",").filter(Boolean);
  if (crimeOccurredFrom) setQuery.crimeOccurredFrom = crimeOccurredFrom;
  if (crimeOccurredTo) setQuery.crimeOccurredTo = crimeOccurredTo;
  if (createdAtFrom) setQuery.createdAtFrom = createdAtFrom;
  if (createdAtTo) setQuery.createdAtTo = createdAtTo;
  setQuery.sortBy =
    sortBy as ReqType["main"]["report"]["gets"]["set"]["sortBy"];
  setQuery.sortOrder =
    sortOrder as ReqType["main"]["report"]["gets"]["set"]["sortOrder"];

  const reportsProjection = {
    _id: 1,
    title: 1,
    status: 1,
    priority: 1,
    description: 1,
    selected_language: 1,
    hostileCountries: { _id: 1, name: 1 },
    attackedCountries: { _id: 1, name: 1 },
    attackedProvinces: { _id: 1, name: 1 },
    attackedCities: { _id: 1, name: 1 },
    crime_occurred_at: 1,
    createdAt: 1,
    category: { _id: 1, name: 1 },
    tags: { _id: 1, name: 1 },
    documents: { _id: 1, title: 1 },
  } as const;

  const [
    reportsResponse,
    categoriesResponse,
    tagsResponse,
    countriesResponse,
    provincesResponse,
    citiesResponse,
    pendingCountRes,
    approvedCountRes,
    rejectedCountRes,
    highPriorityCountRes,
  ] = await Promise.all([
    getReports(setQuery, reportsProjection),
    getCategories({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
    getTags({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
    getCountries({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
    getProvinces({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
    getCities({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
    countReports({ filter: { status: "Pending" } } as any, { qty: 1 }),
    countReports({ filter: { status: "Approved" } } as any, { qty: 1 }),
    countReports({ filter: { status: "Rejected" } } as any, { qty: 1 }),
    countReports({ filter: { priority: "High" } } as any, { qty: 1 }),
  ]);

  const extractList = (res: any) =>
    res?.success
      ? Array.isArray(res.body)
        ? res.body
        : res.body?.list || []
      : [];

  const reports = extractList(reportsResponse);
  const categories = extractList(categoriesResponse);
  const tags = extractList(tagsResponse);
  const countries = extractList(countriesResponse);
  const provinces = extractList(provincesResponse);
  const cities = extractList(citiesResponse);

  const getCount = (res: any) =>
    res?.success && typeof res.body === "object"
      ? (res.body as { qty?: number }).qty ?? 0
      : 0;

  const statsCounts = {
    pending: getCount(pendingCountRes),
    approved: getCount(approvedCountRes),
    rejected: getCount(rejectedCountRes),
    highPriority: getCount(highPriorityCountRes),
    total: getCount(pendingCountRes) + getCount(approvedCountRes) + getCount(rejectedCountRes),
  };

  const error =
    !reportsResponse?.success
      ? reportsResponse?.body?.message || "Failed to fetch reports"
      : null;

  const filterOptions = {
    categories,
    tags,
    countries,
    provinces,
    cities,
  };

  return (
    <AdminReportsClient
      reports={reports}
      statsCounts={statsCounts}
      filterOptions={filterOptions}
      error={error}
      currentParams={{
        page,
        search,
        status,
        priority,
        category,
        selected_language,
        tagIds,
        hostileCountryIds,
        attackedCountryIds,
        attackedProvinceIds,
        attackedCityIds,
        crimeOccurredFrom: resolvedSearchParams.crimeOccurredFrom || "",
        crimeOccurredTo: resolvedSearchParams.crimeOccurredTo || "",
        createdAtFrom: resolvedSearchParams.createdAtFrom || "",
        createdAtTo: resolvedSearchParams.createdAtTo || "",
        sortBy,
        sortOrder,
      }}
    />
  );
}
