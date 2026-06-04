import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { get as getProvince } from "@/app/actions/province/get";
import { provinceSchema } from "@/types/declarations";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { MapPin, Building2, Globe } from "lucide-react";
import { WarInfoSection } from "@/components/organisms/war-info-section";
import { RelatedLocationsGrid } from "@/components/organisms/related-locations-grid";
import { ReportListCard } from "@/components/organisms/report-list-card";
import { ParentLocationCard } from "@/components/organisms/parent-location-card";

type ProvinceWithPhoto = provinceSchema & {
  photo?: { _id?: string; name: string; mimeType: string; type: "image" | "video" | "docs"; alt_text?: string };
  country?: { _id?: string; name: string; english_name: string; photo?: { _id?: string; name: string; mimeType: string; type: "image" | "video" | "docs"; alt_text?: string } };
  cities?: Array<{ _id?: string; name: string; english_name: string; photo?: { _id?: string; name: string; mimeType: string; type: "image" | "video" | "docs"; alt_text?: string } }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const res = await getProvince({ _id: id }, { name: 1, english_name: 1, country: { name: 1 } });
  const province = res?.success ? res.body[0] : null;
  const t = await getTranslations({ locale, namespace: "explore" });
  return {
    title: `${province?.name || t("province")} — ${t("title")}`,
    description: t("provinceDescription", { name: province?.name || "" }),
  };
}

interface ProvinceDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const provinceWarFields = [
  "wars_history",
  "conflict_timeline",
  "casualties_info",
  "notable_battles",
  "occupation_info",
  "destruction_level",
  "civilian_impact",
  "mass_graves_info",
  "war_crimes_events",
  "liberation_info",
] as const;

export default async function ProvinceDetailPage({ params }: ProvinceDetailPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });

  const provinceRes = await getProvince(
    { _id: id },
    {
      _id: 1,
      name: 1,
      english_name: 1,
      photo: { _id: 1, name: 1 },
      wars_history: 1,
      conflict_timeline: 1,
      casualties_info: 1,
      notable_battles: 1,
      occupation_info: 1,
      destruction_level: 1,
      civilian_impact: 1,
      mass_graves_info: 1,
      war_crimes_events: 1,
      liberation_info: 1,
      country: { _id: 1, name: 1, english_name: 1, photo: { _id: 1, name: 1 } },
      cities: { _id: 1, name: 1, english_name: 1, photo: { _id: 1, name: 1 } },
      attackedByReports: { _id: 1, title: 1, description: 1, status: 1 },
    }
  );

  if (!provinceRes?.success) {
    notFound();
  }

  const province = provinceRes.body[0] as ProvinceWithPhoto;

  const relatedReports = province.attackedByReports || [];
  const cities = province.cities || [];
  const country = province.country;

  const warFields = provinceWarFields.map((key) => ({
    key,
    label: t(key),
    value: (province as unknown as Record<string, unknown>)[key] as Record<string, string> | string | undefined,
  }));

  return (
    <PageContainer showHeader={false} contentClassName="">
      <PageHero
        icon={<MapPin className="h-5 w-5 text-crimson" />}
        overline={t("province")}
        title={province.name}
        description={province.english_name || ""}
        backLink={{ href: "/explore", label: t("backToExplore") }}
      >
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
          {[
            ...(cities.length > 0 ? [{ icon: <Building2 className="h-4 w-4 text-crimson" />, value: cities.length, label: t("cities") }] : []),
            ...(relatedReports.length > 0 ? [{ icon: <Globe className="h-4 w-4 text-crimson" />, value: relatedReports.length, label: t("reports") }] : []),
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

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 min-w-0 space-y-8">
            {/* War Information */}
            <WarInfoSection
              fields={warFields}
              locale={locale}
              sectionTitle={t("warInformation")}
            />

            {/* Related Reports */}
            <ReportListCard
              reports={relatedReports}
              locale={locale}
              title={t("relatedReports")}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Country parent */}
            {country && (
              <ParentLocationCard
                type="country"
                label={t("country")}
                name={country.name}
                englishName={country.english_name}
                href={`/${locale}/explore/countries/${country._id}`}
                photo={country.photo}
              />
            )}

            {/* Cities */}
            <RelatedLocationsGrid
              locations={cities}
              locale={locale}
              type="city"
              title={t("cities")}
              hrefPrefix={`/${locale}/explore/cities`}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
