import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { get as getCity } from "@/app/actions/city/get";
import { get as getCountry } from "@/app/actions/country/get";
import { get as getProvince } from "@/app/actions/province/get";
import { citySchema } from "@/types/declarations";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Globe, MapPin, Building2, FileText } from "lucide-react";
import { LocationHero } from "@/components/organisms/location-hero";
import { WarInfoSection } from "@/components/organisms/war-info-section";
import { RelatedLocationsGrid } from "@/components/organisms/related-locations-grid";
import { ReportListCard } from "@/components/organisms/report-list-card";
import { ParentLocationCard } from "@/components/organisms/parent-location-card";

type CityWithPhoto = citySchema & {
  photo?: { _id?: string; name: string; mimeType: string; type: "image" | "video" | "docs"; alt_text?: string };
  province?: { _id?: string; name: string; english_name: string; photo?: { _id?: string; name: string; mimeType: string; type: "image" | "video" | "docs"; alt_text?: string } };
  country?: { _id?: string; name: string; english_name: string; photo?: { _id?: string; name: string; mimeType: string; type: "image" | "video" | "docs"; alt_text?: string } };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const res = await get({ _id: id }, { name: 1, english_name: 1, province: { name: 1 }, country: { name: 1 } });
  const city = res?.success ? res.body[0] : null;
  const t = await getTranslations({ locale, namespace: "explore" });
  return {
    title: `${city?.name || t("city")} — ${t("title")}`,
    description: t("cityDescription", { name: city?.name || "" }),
  };
}

interface CityDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

const cityWarFields = [
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

export default async function CityDetailPage({ params }: CityDetailPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });

  const cityRes = await get(
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
      province: { _id: 1, name: 1, english_name: 1, photo: { _id: 1, name: 1 } },
      country: { _id: 1, name: 1, english_name: 1, photo: { _id: 1, name: 1 } },
      attackedByReports: { _id: 1, title: 1, description: 1, status: 1 },
    }
  );

  if (!cityRes?.success) {
    notFound();
  }

  const city = cityRes.body[0] as CityWithPhoto;

  const relatedReports = city.attackedByReports || [];
  const province = city.province;
  const country = city.country;

  const warFields = cityWarFields.map((key) => ({
    key,
    label: t(key),
    value: (city as unknown as Record<string, unknown>)[key] as Record<string, string> | string | undefined,
  }));

  return (
    <PageContainer showHeader={false}>
      <LocationHero
        locale={locale}
        type="city"
        name={city.name}
        englishName={city.english_name}
        photo={city.photo}
        breadcrumbs={[
          ...(country ? [{ label: country.name, href: `/${locale}/explore/countries/${country._id}`, icon: Globe }] : []),
          ...(province ? [{ label: province.name, href: `/${locale}/explore/provinces/${province._id}`, icon: MapPin }] : []),
        ]}
        stats={
          relatedReports.length > 0
            ? [{ icon: FileText, value: relatedReports.length, label: t("reports"), variant: "crimson" as const }]
            : []
        }
        typeLabel={t("city")}
        backToExploreLabel={t("backToExplore")}
      />

      {/* Content */}
      <div className="container px-4 md:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
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
            {/* Province parent */}
            {province && (
              <ParentLocationCard
                type="province"
                label={t("province")}
                name={province.name}
                englishName={province.english_name}
                href={`/${locale}/explore/provinces/${province._id}`}
                photo={province.photo}
              />
            )}

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
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
