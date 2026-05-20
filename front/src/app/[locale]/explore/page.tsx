import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import { countrySchema, provinceSchema, citySchema } from "@/types/declarations";
import { Globe, MapPin, Building2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { LocationCard } from "@/components/organisms/location-card";
import { ExploreHero } from "@/components/organisms/explore-hero";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <ExploreHero
        locale={locale}
        search={search}
        activeTab={tab}
        translations={translations}
      />

      {/* Content */}
      <div className="container px-4 md:px-8 pb-20">
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
    </div>
  );
}
