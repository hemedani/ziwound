import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/country/get";
import { countrySchema } from "@/types/declarations";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { Globe, MapPin, Building2 } from "lucide-react";
import { WarInfoSection } from "@/components/organisms/war-info-section";
import { RelatedLocationsGrid } from "@/components/organisms/related-locations-grid";
import { ReportListCard } from "@/components/organisms/report-list-card";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const res = await get({ _id: id }, { name: 1, english_name: 1 });
  const country = res?.success ? res.body[0] : null;
  const t = await getTranslations({ locale, namespace: "explore" });
  return {
    title: `${country?.name || t("country")} — ${t("title")}`,
    description: t("countryDescription", { name: country?.name || "" }),
  };
}

interface CountryDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const countryWarFields = [
  "wars_history",
  "conflict_timeline",
  "casualties_info",
  "international_response",
  "war_crimes_documentation",
  "human_rights_violations",
  "genocide_info",
  "chemical_weapons_info",
  "displacement_info",
  "reconstruction_status",
  "international_sanctions",
  "notable_war_events",
] as const;

export default async function CountryDetailPage({ params }: CountryDetailPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });

  const countryRes = await get(
    { _id: id },
    {
      _id: 1,
      name: 1,
      english_name: 1,
      photo: { _id: 1, name: 1 },
      wars_history: 1,
      conflict_timeline: 1,
      casualties_info: 1,
      international_response: 1,
      war_crimes_documentation: 1,
      human_rights_violations: 1,
      genocide_info: 1,
      chemical_weapons_info: 1,
      displacement_info: 1,
      reconstruction_status: 1,
      international_sanctions: 1,
      notable_war_events: 1,
      provinces: { _id: 1, name: 1, english_name: 1, photo: { _id: 1, name: 1 }, wars_history: 1, casualties_info: 1 },
      cities: { _id: 1, name: 1, english_name: 1, photo: { _id: 1, name: 1 } },
      hostileReports: { _id: 1, title: 1, description: 1, status: 1 },
      attackedReports: { _id: 1, title: 1, description: 1, status: 1 },
    }
  );

  if (!countryRes?.success) {
    notFound();
  }

  const country = countryRes.body[0] as countrySchema;

  const hostileReports = country.hostileReports || [];
  const attackedReports = country.attackedReports || [];
  const totalReports = hostileReports.length + attackedReports.length;
  const provinces = country.provinces || [];
  const cities = country.cities || [];

  const warFields = countryWarFields.map((key) => ({
    key,
    label: t(key),
    value: (country as unknown as Record<string, unknown>)[key] as Record<string, string> | string | undefined,
  }));

  return (
    <PageContainer showHeader={false} contentClassName="">
      <PageHero
        icon={<Globe className="h-5 w-5 text-crimson" />}
        overline={t("country")}
        title={country.name}
        description={country.english_name || ""}
        backLink={{ href: `/${locale}/explore`, label: t("backToExplore") }}
      >
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
          {[
            ...(provinces.length > 0 ? [{ icon: <MapPin className="h-4 w-4 text-crimson" />, value: provinces.length, label: t("provinces") }] : []),
            ...(cities.length > 0 ? [{ icon: <Building2 className="h-4 w-4 text-crimson" />, value: cities.length, label: t("cities") }] : []),
            ...(totalReports > 0 ? [{ icon: <Globe className="h-4 w-4 text-crimson" />, value: totalReports, label: t("reports") }] : []),
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* War Information */}
            <WarInfoSection
              fields={warFields}
              locale={locale}
              sectionTitle={t("warInformation")}
            />

            {/* Hostile Reports */}
            <ReportListCard
              reports={hostileReports}
              locale={locale}
              title={t("hostileReports")}
            />

            {/* Attacked Reports */}
            <ReportListCard
              reports={attackedReports}
              locale={locale}
              title={t("attackedReports")}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provinces */}
            <RelatedLocationsGrid
              locations={provinces}
              locale={locale}
              type="province"
              title={t("provinces")}
              hrefPrefix={`/${locale}/explore/provinces`}
            />

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
