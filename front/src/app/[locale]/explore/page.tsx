import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/country/gets";
import { countrySchema } from "@/types/declarations";
import Link from "next/link";
import { Search, Globe, MapPin, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function ExplorePage({ params, searchParams }: ExplorePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "explore" });
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";

  const response = await gets(
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
      wars_history: 1,
      conflict_timeline: 1,
      casualties_info: 1,
      provinces: { _id: 1, name: 1, english_name: 1 },
      cities: { _id: 1, name: 1, english_name: 1 },
    }
  );

  let countries: countrySchema[] = [];
  if (response?.success) {
    countries = response.body || [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero header */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.08)_0%,_transparent_70%)]" />
        <div className="container relative px-4 md:px-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("overline")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-body max-w-2xl leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="container px-4 md:px-8 -mt-4 mb-8">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder={t("searchPlaceholder")}
                defaultValue={search}
                className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
              />
            </div>
            <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
              {t("search")}
            </Button>
            {search && (
              <Button type="button" variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
                <Link href={`/${locale}/explore`}>{t("clear")}</Link>
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Countries grid */}
      <div className="container px-4 md:px-8 pb-20">
        {countries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Globe className="h-16 w-16 text-slate-body/20 mb-4" />
            <p className="text-xl font-medium text-offwhite mb-2">{t("noCountries")}</p>
            <p className="text-slate-body">{t("noCountriesDescription")}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <Link
                  key={country._id}
                  href={`/${locale}/explore/countries/${country._id}`}
                  className="group relative overflow-hidden rounded-2xl glass-light p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-offwhite group-hover:text-gold transition-colors">
                        {country.name}
                      </h3>
                      <p className="text-sm text-slate-body">{country.english_name}</p>
                    </div>
                    <div className="rounded-xl p-2 bg-crimson/10 border border-crimson/20">
                      <Globe className="h-5 w-5 text-crimson-light" />
                    </div>
                  </div>

                  {/* War info preview */}
                  <div className="space-y-2 mb-4">
                    {country.wars_history && (
                      <p className="text-sm text-slate-body line-clamp-2">{country.wars_history}</p>
                    )}
                    {country.casualties_info && (
                      <p className="text-sm text-slate-body/70 line-clamp-1">{country.casualties_info}</p>
                    )}
                  </div>

                  {/* Stats badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {country.provinces && country.provinces.length > 0 && (
                      <Badge className="bg-white/5 text-slate-body border-white/10">
                        <MapPin className="h-3 w-3 me-1" />
                        {country.provinces.length} {t("provinces")}
                      </Badge>
                    )}
                    {country.cities && country.cities.length > 0 && (
                      <Badge className="bg-white/5 text-slate-body border-white/10">
                        {country.cities.length} {t("cities")}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-medium text-crimson opacity-0 transition-opacity group-hover:opacity-100">
                    <span>{t("viewDetails")}</span>
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 py-8">
              {page > 1 ? (
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
                  <Link href={`/${locale}/explore?page=${page - 1}${search ? `&search=${search}` : ""}`}>
                    {t("previous")}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
                  {t("previous")}
                </Button>
              )}
              {countries.length >= 24 ? (
                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
                  <Link href={`/${locale}/explore?page=${page + 1}${search ? `&search=${search}` : ""}`}>
                    {t("next")}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
                  {t("next")}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
