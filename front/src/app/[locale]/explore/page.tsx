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
import { Globe, MapPin, Building2, Search, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LocationCard } from "@/components/organisms/location-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LocationType = "countries" | "provinces" | "cities";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });
  return {
    title: `${t("title")} — ZiWound`,
    description: t("description"),
  };
}

interface ExplorePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; page?: string; tab?: string }>;
}

export default async function ExplorePage({ params, searchParams }: ExplorePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "explore" });

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const tab = (resolvedSearchParams.tab as LocationType) || "countries";

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
    noResults: tab === "countries" ? t("noCountries") : tab === "provinces" ? t("noProvinces") : t("noCities"),
    noResultsDescription: t("noResultsDescription"),
    previous: t("previous"),
    next: t("next"),
    backToExplore: t("backToExplore"),
  };

  const [countryCountRes, provinceCountRes, cityCountRes] = await Promise.all([
    countCountries({}, { qty: 1 }),
    countProvinces({}, { qty: 1 }),
    countCities({}, { qty: 1 }),
  ]);

  const totalCountries = countryCountRes?.success ? (countryCountRes.body as { qty?: number })?.qty ?? 0 : 0;
  const totalProvinces = provinceCountRes?.success ? (provinceCountRes.body as { qty?: number })?.qty ?? 0 : 0;
  const totalCities = cityCountRes?.success ? (cityCountRes.body as { qty?: number })?.qty ?? 0 : 0;

  let locations: Array<countrySchema | provinceSchema | citySchema> = [];
  let hasMore = false;

  if (tab === "countries") {
    const response = await getCountries(
      {
        page,
        limit: 24,
        search,
        sortBy: "name",
        sortOrder: "asc",
      },
      {
        _id: 1,
        name: 1,
        english_name: 1,
        photo: { _id: 1, name: 1 },
        wars_history: 1,
        casualties_info: 1,
        provinces: { _id: 1, name: 1 },
        cities: { _id: 1, name: 1 },
        hostileReports: { _id: 1 },
        attackedReports: { _id: 1 },
      }
    );
    if (response?.success) {
      locations = response.body || [];
      hasMore = locations.length >= 24;
    }
  } else if (tab === "provinces") {
    const response = await getProvinces(
      {
        page,
        limit: 24,
        search,
        sortBy: "name",
        sortOrder: "asc",
      },
      {
        _id: 1,
        name: 1,
        english_name: 1,
        photo: { _id: 1, name: 1 },
        wars_history: 1,
        casualties_info: 1,
        country: { _id: 1, name: 1 },
        cities: { _id: 1, name: 1 },
        attackedByReports: { _id: 1 },
      }
    );
    if (response?.success) {
      locations = response.body || [];
      hasMore = locations.length >= 24;
    }
  } else {
    const response = await getCities(
      {
        page,
        limit: 24,
        search,
        sortBy: "name",
        sortOrder: "asc",
      },
      {
        _id: 1,
        name: 1,
        english_name: 1,
        photo: { _id: 1, name: 1 },
        wars_history: 1,
        casualties_info: 1,
        country: { _id: 1, name: 1 },
        province: { _id: 1, name: 1 },
        attackedByReports: { _id: 1 },
      }
    );
    if (response?.success) {
      locations = response.body || [];
      hasMore = locations.length >= 24;
    }
  }

  const paginationHref = (p: number) => {
    const base = `/${locale}/explore`;
    const params = new URLSearchParams();
    if (tab !== "countries") params.set("tab", tab);
    if (search) params.set("search", search);
    params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const clearHref = `/${locale}/explore${tab !== "countries" ? `?tab=${tab}` : ""}`;

  const tabIcons = {
    countries: Globe,
    provinces: MapPin,
    cities: Building2,
  };

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
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10">
              <Globe className="h-4 w-4 text-crimson" />
            </div>
            <div>
              <p className="text-lg font-bold text-offwhite leading-none">{totalCountries}</p>
              <p className="text-xs text-slate-body/70 mt-1">{t("countriesTab")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10">
              <MapPin className="h-4 w-4 text-crimson" />
            </div>
            <div>
              <p className="text-lg font-bold text-offwhite leading-none">{totalProvinces}</p>
              <p className="text-xs text-slate-body/70 mt-1">{t("provincesTab")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10">
              <Building2 className="h-4 w-4 text-crimson" />
            </div>
            <div>
              <p className="text-lg font-bold text-offwhite leading-none">{totalCities}</p>
              <p className="text-xs text-slate-body/70 mt-1">{t("citiesTab")}</p>
            </div>
          </div>
        </div>
      </PageHero>

      <div className="container mx-auto px-4 md:px-8 py-8 pb-20">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "countries" as LocationType, icon: Globe, label: translations.countriesTab },
            { key: "provinces" as LocationType, icon: MapPin, label: translations.provincesTab },
            { key: "cities" as LocationType, icon: Building2, label: translations.citiesTab },
          ].map(({ key, icon: Icon, label }) => {
            const isActive = tab === key;
            const href = `/${locale}/explore${key === "countries" ? "" : `?tab=${key}`}`;
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

        {/* Search bar */}
        <form method="GET" className="max-w-2xl mb-8">
          <input type="hidden" name="tab" value={tab} />
          <div className="relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-1.5 transition-all duration-300 focus-within:border-crimson/40 focus-within:bg-white/[0.06] focus-within:shadow-lg focus-within:shadow-crimson/5">
            <Search className="absolute start-5 h-5 w-5 text-slate-body/50 pointer-events-none" />
            <Input
              name="search"
              placeholder={translations.searchPlaceholder}
              defaultValue={search}
              className="flex-1 border-0 bg-transparent ps-12 pe-12 h-12 text-offwhite placeholder:text-slate-body/40 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                asChild
                className="absolute end-14 h-8 w-8 text-slate-body/50 hover:text-offwhite hover:bg-white/10"
              >
                <Link href={`/${locale}/explore${tab !== "countries" ? `?tab=${tab}` : ""}`}>
                  <X className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button
              type="submit"
              className="h-10 px-6 bg-crimson hover:bg-crimson-light text-white font-medium rounded-xl transition-all duration-300"
            >
              {translations.search}
            </Button>
          </div>
        </form>

        {/* Results count */}
        {locations.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-body/60">
              {locations.length} {tab === "countries" ? translations.countriesTab?.toLowerCase() : tab === "provinces" ? translations.provincesTab?.toLowerCase() : translations.citiesTab?.toLowerCase()}
              {hasMore ? "+" : ""}
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
              search ? (
                <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
                  <Link href={clearHref}>{t("clear")}</Link>
                </Button>
              ) : undefined
            }
            className="border-white/[0.06] bg-white/[0.02] min-h-[500px]"
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <LocationCard
                  key={location._id}
                  location={location as Parameters<typeof LocationCard>[0]["location"]}
                  locale={locale}
                  type={tab === "countries" ? "country" : tab === "provinces" ? "province" : "city"}
                  translations={translations}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 pt-10">
              {page > 1 ? (
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
                  <Link href={paginationHref(page - 1)}>
                    {translations.previous}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
                  {translations.previous}
                </Button>
              )}
              <span className="text-sm text-slate-body/50 px-3">
                {t("page")} {page}
              </span>
              {hasMore ? (
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
                  <Link href={paginationHref(page + 1)}>
                    {translations.next}
                  </Link>
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
