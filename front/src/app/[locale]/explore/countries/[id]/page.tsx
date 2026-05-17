import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/country/get";
import { countrySchema } from "@/types/declarations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MapPin, ArrowLeft, ChevronRight, FileText, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const warInfoFields = [
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
      provinces: { _id: 1, name: 1, english_name: 1, wars_history: 1, casualties_info: 1 },
      cities: { _id: 1, name: 1, english_name: 1 },
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

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero header */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.08)_0%,_transparent_70%)]" />
        <div className="container relative px-4 md:px-8">
          <Button variant="ghost" asChild className="mb-4 text-slate-body hover:text-offwhite hover:bg-white/5 -ms-3">
            <Link href={`/${locale}/explore`}>
              <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
              {t("backToExplore")}
            </Link>
          </Button>

          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("country")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-2 leading-tight">
            {country.name}
          </h1>
          <p className="text-lg text-slate-body mb-6">{country.english_name}</p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3">
            {country.provinces && country.provinces.length > 0 && (
              <Badge className="bg-white/5 text-slate-body border-white/10 px-3 py-1">
                <MapPin className="h-3.5 w-3.5 me-1.5" />
                {country.provinces.length} {t("provinces")}
              </Badge>
            )}
            {country.cities && country.cities.length > 0 && (
              <Badge className="bg-white/5 text-slate-body border-white/10 px-3 py-1">
                <Globe className="h-3.5 w-3.5 me-1.5" />
                {country.cities.length} {t("cities")}
              </Badge>
            )}
            {totalReports > 0 && (
              <Badge className="bg-crimson/10 text-crimson-light border-crimson/20 px-3 py-1">
                <FileText className="h-3.5 w-3.5 me-1.5" />
                {totalReports} {t("reports")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* War Information */}
            <div className="rounded-2xl glass-light p-6 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/5 rounded-lg p-1.5">
                  <Shield className="h-4 w-4 text-gold" />
                </div>
                <h2 className="text-lg font-semibold text-offwhite">{t("warInformation")}</h2>
              </div>

              <div className="space-y-6">
                {warInfoFields.map((field) => {
                  const fieldValue = (country as Record<string, unknown>)[field] as Record<string, string> | string | undefined;
                  const value = typeof fieldValue === "object" && fieldValue !== null
                    ? (fieldValue[locale] || fieldValue.en || "")
                    : typeof fieldValue === "string"
                      ? fieldValue
                      : "";
                  if (!value) return null;
                  return (
                    <div key={field}>
                      <h3 className="text-sm font-medium text-gold mb-2 uppercase tracking-wider">
                        {t(field)}
                      </h3>
                      <div
                        className="text-sm text-slate-body leading-relaxed prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: value }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hostile Reports */}
            {hostileReports.length > 0 && (
              <div className="rounded-2xl glass-light p-6 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-white/5 rounded-lg p-1.5">
                    <FileText className="h-4 w-4 text-gold" />
                  </div>
                  <h2 className="text-lg font-semibold text-offwhite">{t("hostileReports")}</h2>
                </div>
                <div className="space-y-3">
                  {hostileReports.map((report: any) => (
                    <Link
                      key={report._id}
                      href={`/${locale}/reports/${report._id}`}
                      className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 border border-white/[0.04] hover:border-white/10 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-offwhite truncate">{report.title}</p>
                        <p className="text-xs text-slate-body mt-0.5 line-clamp-1">
                          {report.description}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${report.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          report.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            report.status === "Rejected" ? "bg-crimson/10 text-crimson-light border border-crimson/20" :
                              "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>{report.status}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Attacked Reports */}
            {attackedReports.length > 0 && (
              <div className="rounded-2xl glass-light p-6 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-white/5 rounded-lg p-1.5">
                    <FileText className="h-4 w-4 text-gold" />
                  </div>
                  <h2 className="text-lg font-semibold text-offwhite">{t("attackedReports")}</h2>
                </div>
                <div className="space-y-3">
                  {attackedReports.map((report: any) => (
                    <Link
                      key={report._id}
                      href={`/${locale}/reports/${report._id}`}
                      className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 border border-white/[0.04] hover:border-white/10 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-offwhite truncate">{report.title}</p>
                        <p className="text-xs text-slate-body mt-0.5 line-clamp-1">
                          {report.description}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${report.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          report.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            report.status === "Rejected" ? "bg-crimson/10 text-crimson-light border border-crimson/20" :
                              "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>{report.status}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provinces */}
            {country.provinces && country.provinces.length > 0 && (
              <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-semibold text-offwhite">{t("provinces")}</h3>
                </div>
                <div className="space-y-2">
                  {country.provinces.map((province) => (
                    <Link
                      key={province._id}
                      href={`/${locale}/explore/provinces/${province._id}`}
                      className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-offwhite group-hover:text-gold transition-colors">
                          {province.name}
                        </p>
                        <p className="text-xs text-slate-body">{province.english_name}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-body/50 rtl:rotate-180" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cities */}
            {country.cities && country.cities.length > 0 && (
              <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-semibold text-offwhite">{t("cities")}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {country.cities.map((city) => (
                    <Link
                      key={city._id}
                      href={`/${locale}/explore/cities/${city._id}`}
                      className="inline-flex items-center rounded-lg bg-white/[0.02] px-2.5 py-1 text-xs text-slate-body border border-white/[0.04] hover:border-white/10 hover:text-offwhite transition-colors"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
