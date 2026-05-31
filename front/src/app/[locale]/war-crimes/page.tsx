import { getTranslations } from "next-intl/server";
import { gets as getReports } from "@/app/actions/report/gets";
import { count as countReports } from "@/app/actions/report/count";
import { statistics as getReportStatistics } from "@/app/actions/report/statistics";
import { gets as getCategories } from "@/app/actions/category/gets";
import { gets as getTags } from "@/app/actions/tag/gets";
import { PageContainer } from "@/components/layout/page-container";
import { WarCrimesHero } from "@/components/war-crimes/war-crimes-hero";
import { WarCrimesFilters } from "@/components/war-crimes/war-crimes-filters";
import { WarCrimesList } from "@/components/war-crimes/war-crimes-list";
import { WarCrimesMap } from "@/components/war-crimes/war-crimes-map";
import { WarCrimesStatistics } from "@/components/war-crimes/war-crimes-statistics";
import { WarCrimesTimeline } from "@/components/war-crimes/war-crimes-timeline";
import { WarCrimesExport } from "@/components/war-crimes/war-crimes-export";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, BarChart3, Clock } from "lucide-react";
import type {
  DeepPartial,
  ReqType,
  reportSchema,
  categorySchema,
  tagSchema,
} from "@/types/declarations";

export default async function WarCrimesPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    priority?: string;
    categoryId?: string;
    tagIds?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
    bbox?: string;
    hostileCountryIds?: string;
    attackedCountryIds?: string;
    attackedProvinceIds?: string;
    attackedCityIds?: string;
    selected_language?: string;
    crimeOccurredFrom?: string;
    crimeOccurredTo?: string;
  }>;
  params: Promise<{ locale: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations({ locale });

  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 12;
  const search = resolvedSearchParams.search || "";
  const status =
    (resolvedSearchParams.status as ReqType["main"]["report"]["gets"]["set"]["status"]) || undefined;
  const priority =
    (resolvedSearchParams.priority as ReqType["main"]["report"]["gets"]["set"]["priority"]) ||
    undefined;
  const categoryId = resolvedSearchParams.categoryId;
  const tagIds = resolvedSearchParams.tagIds?.split(",").filter(Boolean) || undefined;
  const dateFrom = resolvedSearchParams.dateFrom ? new Date(resolvedSearchParams.dateFrom) : undefined;
  const dateTo = resolvedSearchParams.dateTo ? new Date(resolvedSearchParams.dateTo) : undefined;
  const view = resolvedSearchParams.view || "list";
  const bboxStr = resolvedSearchParams.bbox;
  const bbox = bboxStr
    ? bboxStr
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n))
    : undefined;
  const finalBbox = bbox?.length === 4 ? bbox : undefined;

  const hostileCountryIds = resolvedSearchParams.hostileCountryIds || "";
  const attackedCountryIds = resolvedSearchParams.attackedCountryIds || "";
  const attackedProvinceIds = resolvedSearchParams.attackedProvinceIds || "";
  const attackedCityIds = resolvedSearchParams.attackedCityIds || "";
  const selected_language = resolvedSearchParams.selected_language as ReqType["main"]["report"]["gets"]["set"]["selected_language"] | undefined;
  const crimeOccurredFrom = resolvedSearchParams.crimeOccurredFrom
    ? new Date(resolvedSearchParams.crimeOccurredFrom)
    : undefined;
  const crimeOccurredTo = resolvedSearchParams.crimeOccurredTo
    ? new Date(resolvedSearchParams.crimeOccurredTo)
    : undefined;

  const reportQuery: ReqType["main"]["report"]["gets"]["set"] = {
    page,
    limit,
    search: search || undefined,
    status: status || "Approved",
    priority: priority || undefined,
    categoryIds: categoryId ? [categoryId] : undefined,
    tagIds: tagIds || undefined,
    hostileCountryIds: hostileCountryIds ? hostileCountryIds.split(",").filter(Boolean) : undefined,
    attackedCountryIds: attackedCountryIds ? attackedCountryIds.split(",").filter(Boolean) : undefined,
    attackedProvinceIds: attackedProvinceIds ? attackedProvinceIds.split(",").filter(Boolean) : undefined,
    attackedCityIds: attackedCityIds ? attackedCityIds.split(",").filter(Boolean) : undefined,
    crimeOccurredFrom: crimeOccurredFrom,
    crimeOccurredTo: crimeOccurredTo,
    selected_language: selected_language,
    ...(view === "timeline" ? { sortBy: "crime_occurred_at", sortOrder: "desc" } : {}),
    bbox: finalBbox,
  };

  const response = await getReports(reportQuery, {
    _id: 1,
    title: 1,
    description: 1,
    location: 1,
    address: 1,
    status: 1,
    priority: 1,
    crime_occurred_at: 1,
    hostileCountries: { _id: 1, name: 1 },
    attackedCountries: { _id: 1, name: 1 },
    attackedProvinces: { _id: 1, name: 1 },
    attackedCities: { _id: 1, name: 1 },
    createdAt: 1,
    category: { _id: 1, name: 1, color: 1, icon: 1 },
    tags: { _id: 1, name: 1, color: 1, icon: 1 },
    reporter: { _id: 1, first_name: 1, last_name: 1 },
    documents: {
      _id: 1,
      title: 1,
      documentFiles: { _id: 1, name: 1, mimeType: 1, type: 1 },
    },
  });

  const reports: DeepPartial<reportSchema>[] = response?.success
    ? Array.isArray(response.body)
      ? response.body
      : response.body?.list || []
    : [];

  const countResponse = await countReports({ status: status || "Approved" }, { qty: 1 });
  const totalCount = countResponse?.success ? countResponse.body?.qty || 0 : 0;

  const categoriesResponse = await getCategories(
    { page: 1, limit: 100 },
    { _id: 1, name: 1, color: 1, icon: 1 },
  );
  const categories: DeepPartial<categorySchema>[] = categoriesResponse?.success
    ? Array.isArray(categoriesResponse.body)
      ? categoriesResponse.body
      : categoriesResponse.body?.list || []
    : [];

  const tagsResponse = await getTags({ page: 1, limit: 100 }, { _id: 1, name: 1, color: 1, icon: 1 });
  const tags: DeepPartial<tagSchema>[] = tagsResponse?.success
    ? Array.isArray(tagsResponse.body)
      ? tagsResponse.body
      : tagsResponse.body?.list || []
    : [];

  const statsResponse = await getReportStatistics({}, {});
  const statsBody = statsResponse?.success && typeof statsResponse.body === "object"
    ? (statsResponse.body as Record<string, unknown>)
    : {};

  const totalPages = Math.ceil(totalCount / limit);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalCount);

  const statsBodyTyped = statsBody as {
    total?: { count: number }[];
    languageCounts?: { _id: string; count: number }[];
    hostileCountryCounts?: { _id: string; count: number }[];
    attackedCountryCounts?: { _id: string; count: number }[];
  };

  const totalStatCount = statsBodyTyped.total?.[0]?.count ?? totalCount;
  const langCount = statsBodyTyped.languageCounts?.length ?? 0;
  const uniqueCountries = new Set([
    ...(statsBodyTyped.hostileCountryCounts || []).map((c) => c._id),
    ...(statsBodyTyped.attackedCountryCounts || []).map((c) => c._id),
  ]).size;

  const heroTranslations = {
    overline: t("warCrimes.overline"),
    title: t("warCrimes.title"),
    description: t("warCrimes.description"),
    searchPlaceholder: t("warCrimes.searchPlaceholder"),
    search: t("common.search"),
    totalReports: t("warCrimes.totalReports"),
    countriesInvolved: t("warCrimes.countriesInvolved"),
    languages: t("warCrimes.languages"),
  };

  return (
    <PageContainer showHeader={false}>
      <WarCrimesHero
        locale={locale}
        search={search}
        totalCount={totalStatCount}
        countriesInvolved={uniqueCountries}
        languagesCount={langCount}
        translations={heroTranslations}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col gap-6">
          {/* Filters */}
          <WarCrimesFilters
            locale={locale}
            categories={categories}
            tags={tags}
            initialSearch={search}
            initialStatus={status}
            initialPriority={priority}
            initialCategoryId={categoryId}
            initialTagIds={tagIds}
            initialDateFrom={dateFrom?.toISOString().split("T")[0]}
            initialDateTo={dateTo?.toISOString().split("T")[0]}
            initialHostileCountryIds={hostileCountryIds}
            initialAttackedCountryIds={attackedCountryIds}
            initialAttackedProvinceIds={attackedProvinceIds}
            initialAttackedCityIds={attackedCityIds}
            initialLanguage={selected_language}
            initialCrimeOccurredFrom={crimeOccurredFrom?.toISOString().split("T")[0]}
            initialCrimeOccurredTo={crimeOccurredTo?.toISOString().split("T")[0]}
          />

          {/* View Tabs */}
          <Tabs defaultValue={view} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList className="bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl">
                <TabsTrigger value="list" className="gap-2 rounded-lg data-[state=active]:bg-crimson/15 data-[state=active]:text-crimson-light data-[state=active]:border data-[state=active]:border-crimson/30">
                  <List className="h-4 w-4" />
                  {t("warCrimes.exploreList")}
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2 rounded-lg data-[state=active]:bg-crimson/15 data-[state=active]:text-crimson-light data-[state=active]:border data-[state=active]:border-crimson/30">
                  <Map className="h-4 w-4" />
                  {t("warCrimes.exploreMap")}
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2 rounded-lg data-[state=active]:bg-crimson/15 data-[state=active]:text-crimson-light data-[state=active]:border data-[state=active]:border-crimson/30">
                  <Clock className="h-4 w-4" />
                  {t.has("warCrimes.timeline") ? t("warCrimes.timeline") : "Timeline"}
                </TabsTrigger>
                <TabsTrigger value="statistics" className="gap-2 rounded-lg data-[state=active]:bg-crimson/15 data-[state=active]:text-crimson-light data-[state=active]:border data-[state=active]:border-crimson/30">
                  <BarChart3 className="h-4 w-4" />
                  {t("warCrimes.statistics")}
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                {totalCount > 0 && (
                  <p className="text-sm text-slate-body/50">
                    {t("warCrimes.showing", { from, to, total: totalCount })}
                  </p>
                )}
                <WarCrimesExport searchParams={resolvedSearchParams} locale={locale} />
              </div>
            </div>

            <TabsContent value="list" className="mt-0">
              <WarCrimesList
                reports={reports}
                locale={locale}
                page={page}
                totalPages={totalPages}
                view={view}
              />
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <WarCrimesMap reports={reports} locale={locale} />
            </TabsContent>

            <TabsContent value="statistics" className="mt-0">
              <WarCrimesStatistics
                totalCount={totalCount}
                categories={categories}
                statsBody={statsBody as Record<string, unknown>}
                locale={locale}
              />
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
              <WarCrimesTimeline reports={reports} locale={locale} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
