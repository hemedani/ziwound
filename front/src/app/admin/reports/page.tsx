import { getTranslations, getLocale } from "next-intl/server";
import { gets as getReports } from "@/app/actions/report/gets";
import { count as countReports } from "@/app/actions/report/count";
import { gets as getCategories } from "@/app/actions/category/gets";
import { get as getCountry } from "@/app/actions/country/get";
import { get as getProvince } from "@/app/actions/province/get";
import { get as getCity } from "@/app/actions/city/get";
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
    pendingCountRes,
    approvedCountRes,
    rejectedCountRes,
    highPriorityCountRes,
  ] = await Promise.all([
    getReports(setQuery, reportsProjection),
    getCategories({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
    getTags({ page: 1, limit: 200 }, { _id: 1, name: 1 }),
    countReports({ status: "Pending" }, { qty: 1 }),
    countReports({ status: "Approved" }, { qty: 1 }),
    countReports({ status: "Rejected" }, { qty: 1 }),
    countReports({ priority: "High" }, { qty: 1 }),
  ]);

  // The location filters are now searchable selects that query on demand, so
  // the only labels the page still needs are the ones currently applied.
  const locationProjection = { _id: 1, name: 1, english_name: 1 } as const;
  const firstId = (value: string) => (value ? value.split(",")[0] : "");
  const [hostileCountryRes, attackedCountryRes, attackedProvinceRes, attackedCityRes] =
    await Promise.all([
      hostileCountryIds ? getCountry({ _id: firstId(hostileCountryIds) }, locationProjection) : null,
      attackedCountryIds ? getCountry({ _id: firstId(attackedCountryIds) }, locationProjection) : null,
      attackedProvinceIds ? getProvince({ _id: firstId(attackedProvinceIds) }, locationProjection) : null,
      attackedCityIds ? getCity({ _id: firstId(attackedCityIds) }, locationProjection) : null,
    ]);

  const firstRow = (res: unknown) => {
    const body = (res as { body?: unknown } | null)?.body;
    if (!Array.isArray(body) || body.length === 0) return undefined;
    const row = body[0] as { _id?: string; name?: string; english_name?: string };
    if (!row._id) return undefined;
    return { _id: row._id, name: row.name || row.english_name || row._id };
  };

  const extractList = (res: any) =>
    res?.success
      ? Array.isArray(res.body)
        ? res.body
        : res.body?.list || []
      : [];

  const reports = extractList(reportsResponse);
  const categories = extractList(categoriesResponse);
  const tags = extractList(tagsResponse);

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
  };

  const selectedLocationLabels = {
    hostileCountry: firstRow(hostileCountryRes),
    attackedCountry: firstRow(attackedCountryRes),
    attackedProvince: firstRow(attackedProvinceRes),
    attackedCity: firstRow(attackedCityRes),
  };

  // Build query string for pagination URLs
  const buildQuery = (overrides: Partial<Record<string, string>>) => {
    const sp = new URLSearchParams();
    const p = resolvedSearchParams;
    const push = (key: string, val: string | undefined) => {
      if (val && val !== "all" && val !== "") sp.set(key, val);
    };
    push("search", p.search);
    push("status", p.status);
    push("priority", p.priority);
    push("category", p.category);
    push("selected_language", p.selected_language);
    push("tagIds", p.tagIds);
    push("hostileCountryIds", p.hostileCountryIds);
    push("attackedCountryIds", p.attackedCountryIds);
    push("attackedProvinceIds", p.attackedProvinceIds);
    push("attackedCityIds", p.attackedCityIds);
    push("crimeOccurredFrom", p.crimeOccurredFrom);
    push("crimeOccurredTo", p.crimeOccurredTo);
    push("createdAtFrom", p.createdAtFrom);
    push("createdAtTo", p.createdAtTo);
    if (p.sortBy && p.sortBy !== "createdAt") push("sortBy", p.sortBy);
    if (p.sortOrder && p.sortOrder !== "desc") push("sortOrder", p.sortOrder);
    // Apply overrides
    Object.entries(overrides || {}).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  };

  const queryBase = buildQuery({});
  const prevPageUrl = page > 1 ? `/admin/reports?page=${page - 1}${queryBase ? `&${queryBase.slice(1)}` : ""}` : "";
  const nextPageUrl = reports.length >= 15 ? `/admin/reports?page=${page + 1}${queryBase ? `&${queryBase.slice(1)}` : ""}` : "";

  return (
    <AdminReportsClient
      reports={reports}
      statsCounts={statsCounts}
      filterOptions={filterOptions}
      selectedLocationLabels={selectedLocationLabels}
      error={error}
      prevPageUrl={prevPageUrl}
      nextPageUrl={nextPageUrl}
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
