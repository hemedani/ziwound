import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import { count as countCountries } from "@/app/actions/country/count";
import { count as countProvinces } from "@/app/actions/province/count";
import { count as countCities } from "@/app/actions/city/count";
import { countrySchema, provinceSchema, citySchema } from "@/types/declarations";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { Globe, MapPin, Building2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LocationCard } from "@/components/organisms/location-card";
import { ExploreFilters } from "./_components/explore-filters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

type LocationType = "countries" | "provinces" | "cities";
const VALID_TYPES: LocationType[] = ["countries", "provinces", "cities"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });
  if (!VALID_TYPES.includes(type as LocationType)) return { title: t("title") };
  return {
    title: `${t(`${type === "countries" ? "countriesTab" : type === "provinces" ? "provincesTab" : "citiesTab"}`)} — ${t("title")}`,
    description: t("description"),
  };
}

interface ExploreTypePageProps {
  params: Promise<{ locale: string; type: string }>;
  searchParams: Promise<{ search?: string; page?: string; countryIds?: string; provinceIds?: string }>;
}

export const dynamic = "force-dynamic";

export default async function ExploreTypePage({ params, searchParams }: ExploreTypePageProps) {
  const { locale, type } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "explore" });

  if (!VALID_TYPES.includes(type as LocationType)) {
    notFound();
  }

  const tab = type as LocationType;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const countryIds = resolvedSearchParams.countryIds ? resolvedSearchParams.countryIds.split(",").filter(Boolean) : [];
  const provinceIds = resolvedSearchParams.provinceIds ? resolvedSearchParams.provinceIds.split(",").filter(Boolean) : [];

  const translations = {
    countriesTab: t("countriesTab"),
    provincesTab: t("provincesTab"),
    citiesTab: t("citiesTab"),
    country: t("country"),
    province: t("province"),
    city: t("city"),
    provinces: t("provinces"),
    cities: t("cities"),
    reports: t("reports"),
    viewDetails: t("viewDetails"),
    overline: t("overline"),
    title: t("title"),
    description: t("description"),
    searchPlaceholder:
      tab === "countries"
        ? t("searchPlaceholder")
        : tab === "provinces"
          ? t("searchProvincesPlaceholder")
          : t("searchCitiesPlaceholder"),
    search: t("search"),
    clear: t("clear"),
    noResults: tab === "countries" ? t("noCountries") : tab === "provinces" ? t("noProvinces") : t("noCities"),
    noResultsDescription: t("noResultsDescription"),
    previous: t("previous"),
    next: t("next"),
    backToExplore: t("backToExplore"),
    filterByCountry: t("filterByCountry"),
    filterByProvince: t("filterByProvince"),
    page: t("page"),
  };

  const [countryCountRes, provinceCountRes, cityCountRes, countriesRes] = await Promise.all([
    countCountries({}, { qty: 1 }),
    countProvinces({}, { qty: 1 }),
    countCities({}, { qty: 1 }),
    tab !== "countries" ? getCountries(
      { page: 1, limit: 500, sortBy: "name", sortOrder: "asc" },
      { _id: 1, name: 1, english_name: 1 }
    ) : Promise.resolve(null),
  ]);

  const totalCountries = countryCountRes?.success ? (countryCountRes.body as { qty?: number })?.qty ?? 0 : 0;
  const totalProvinces = provinceCountRes?.success ? (provinceCountRes.body as { qty?: number })?.qty ?? 0 : 0;
  const totalCities = cityCountRes?.success ? (cityCountRes.body as { qty?: number })?.qty ?? 0 : 0;

  const allCountries = countriesRes?.success ? (countriesRes.body || []) as Array<{ _id: string; name: string; english_name?: string }> : [];

  /* ── province options for the city-province filter ── */
  let provinceOptions: Array<{ _id: string; name: string }> = [];
  if (tab === "cities") {
    const provRes = await getProvinces(
      { page: 1, limit: 500, countryIds: countryIds.length > 0 ? countryIds : undefined, sortBy: "name" as const, sortOrder: "asc" as const },
      { _id: 1, name: 1 }
    );
    if (provRes?.success) provinceOptions = (provRes.body || []) as Array<{ _id: string; name: string }>;
  }

  /* ── fetch locations ── */
  let locations: Array<countrySchema | provinceSchema | citySchema> = [];
  let hasMore = false;

  if (tab === "countries") {
    const response = await getCountries(
      { page, limit: 24, search, sortBy: "name", sortOrder: "asc" },
      {
        _id: 1, name: 1, english_name: 1,
        photo: { _id: 1, name: 1 },
        wars_history: 1, casualties_info: 1,
        provinces: { _id: 1, name: 1 },
        cities: { _id: 1, name: 1 },
        hostileReports: { _id: 1 }, attackedReports: { _id: 1 },
      }
    );
    if (response?.success) { locations = response.body || []; hasMore = locations.length >= 24; }
  } else if (tab === "provinces") {
    const response = await getProvinces(
      { page, limit: 24, search, countryIds: countryIds.length > 0 ? countryIds : undefined, sortBy: "name", sortOrder: "asc" },
      {
        _id: 1, name: 1, english_name: 1,
        photo: { _id: 1, name: 1 },
        wars_history: 1, casualties_info: 1,
        country: { _id: 1, name: 1 },
        cities: { _id: 1, name: 1 },
        attackedByReports: { _id: 1 },
      }
    );
    if (response?.success) { locations = response.body || []; hasMore = locations.length >= 24; }
  } else {
    const response = await getCities(
      { page, limit: 24, search, countriesId: countryIds.length > 0 ? countryIds : undefined, provinceIds: provinceIds.length > 0 ? provinceIds : undefined, sortBy: "name", sortOrder: "asc" },
      {
        _id: 1, name: 1, english_name: 1,
        photo: { _id: 1, name: 1 },
        wars_history: 1, casualties_info: 1,
        country: { _id: 1, name: 1 },
        province: { _id: 1, name: 1 },
        attackedByReports: { _id: 1 },
      }
    );
    if (response?.success) { locations = response.body || []; hasMore = locations.length >= 24; }
  }

  const hasActiveFilters = !!(search || countryIds.length > 0 || provinceIds.length > 0);
  const currentUrl = `/${locale}/explore/${tab}`;

  const clearFiltersUrl = () => {
    const params = new URLSearchParams();
    if (page !== 1) params.set("page", "1");
    const qs = params.toString();
    return qs ? `${currentUrl}?${qs}` : currentUrl;
  };

  const paginationHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (countryIds.length > 0) params.set("countryIds", countryIds.join(","));
    if (provinceIds.length > 0) params.set("provinceIds", provinceIds.join(","));
    if (p !== 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${currentUrl}?${qs}` : currentUrl;
  };

  const tabIcons = { countries: Globe, provinces: MapPin, cities: Building2 };
  const TabIcon = tabIcons[tab];

  return (
    <PageContainer showHeader={false} contentClassName="">
      <PageHero
        icon={<Globe className="h-5 w-5 text-crimson" />}
        overline={t("overline")}
        title={t("title")}
        description={t("description")}
      >
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
          {[
            { icon: <Globe className="h-4 w-4 text-crimson" />, value: totalCountries, label: translations.countriesTab },
            { icon: <MapPin className="h-4 w-4 text-crimson" />, value: totalProvinces, label: translations.provincesTab },
            { icon: <Building2 className="h-4 w-4 text-crimson" />, value: totalCities, label: translations.citiesTab },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10">{stat.icon}</div>
              <div>
                <p className="text-lg font-bold text-offwhite leading-none">{stat.value}</p>
                <p className="text-xs text-slate-body/70 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </PageHero>

      <div className="container mx-auto px-4 md:px-8 py-8 pb-20">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "countries" as LocationType, path: "countries", icon: Globe, label: translations.countriesTab },
            { key: "provinces" as LocationType, path: "provinces", icon: MapPin, label: translations.provincesTab },
            { key: "cities" as LocationType, path: "cities", icon: Building2, label: translations.citiesTab },
          ].map(({ key, path, icon: Icon, label }) => {
            const isActive = tab === key;
            const href = `/${locale}/explore/${path}`;
            return (
              <Button
                key={key}
                variant={isActive ? "default" : "ghost"}
                asChild
                className={`h-10 px-5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-crimson/15 text-crimson-light border border-crimson/30 hover:bg-crimson/20"
                    : "text-slate-body hover:text-offwhite hover:bg-white/5 border border-transparent"
                }`}
              >
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </Button>
            );
          })}
        </div>

        <ExploreFilters
          currentUrl={currentUrl}
          search={search}
          searchPlaceholder={translations.searchPlaceholder}
          countryIds={countryIds}
          allCountries={allCountries}
          showCountryFilter={tab !== "countries"}
          showProvinceFilter={tab === "cities"}
          provinceIds={provinceIds}
          provinceOptions={provinceOptions}
          hasActiveFilters={hasActiveFilters}
          filterByCountryLabel={translations.filterByCountry}
          filterByProvinceLabel={translations.filterByProvince}
          searchLabel={translations.search}
          clearLabel={translations.clear}
          clearFiltersUrl={clearFiltersUrl()}
        />

        {/* Results count */}
        {locations.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-body/60">
              {locations.length}{hasMore ? "+" : ""}{" "}
              {tab === "countries" ? translations.countriesTab?.toLowerCase() : tab === "provinces" ? translations.provincesTab?.toLowerCase() : translations.citiesTab?.toLowerCase()}
            </p>
          </div>
        )}

        {/* Grid or Empty */}
        {locations.length === 0 ? (
          <EmptyState
            icon={TabIcon}
            title={translations.noResults}
            description={translations.noResultsDescription}
            action={
              hasActiveFilters ? (
                <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
                  <Link href={clearFiltersUrl()}>{translations.clear}</Link>
                </Button>
              ) : undefined
            }
            className="border-white/[0.06] bg-white/[0.02] min-h-[500px]"
          />
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {locations.map((location) => (
                <div key={location._id} className="break-inside-avoid mb-5">
                  <LocationCard
                    location={location as Parameters<typeof LocationCard>[0]["location"]}
                    locale={locale}
                    type={tab === "countries" ? "country" : tab === "provinces" ? "province" : "city"}
                    translations={translations}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 pt-10">
              {page > 1 ? (
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
                  <Link href={paginationHref(page - 1)}>{translations.previous}</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
                  {translations.previous}
                </Button>
              )}
              <span className="text-sm text-slate-body/50 px-3">{t("page")} {page}</span>
              {hasMore ? (
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
                  <Link href={paginationHref(page + 1)}>{translations.next}</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
                  {translations.next}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
