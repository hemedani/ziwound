import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { User, MapPin, FileText, Shield, CheckCircle2, Clock, Award, Globe, Calendar, Mail, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReporterStatsGrid } from "@/components/reporters/reporter-stats-grid";
import { ReporterActivityTimeline } from "@/components/reporters/reporter-activity-timeline";
import { ContributorMap } from "@/components/reporters/contributor-map";
import { ReportCard } from "@/components/war-crimes/report-card";
import { SkeletonList } from "@/components/ui/skeleton-states";
import { ErrorState } from "@/components/ui/error-state";
import { getUser } from "@/app/actions/user/getUser";
import { gets as getReports } from "@/app/actions/report/gets";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { extractLocalizedText, stripHtml } from "@/lib/localized-text";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

const levelConfig: Record<string, { bg: string; text: string; border: string }> = {
  Reporter: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  Editor: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  Researcher: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  Diplomat: { bg: "bg-gold/10", text: "text-gold", border: "border-gold/20" },
  Artist: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  Ghost: { bg: "bg-crimson/10", text: "text-crimson-light", border: "border-crimson/20" },
  Manager: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  Ordinary: { bg: "bg-white/5", text: "text-slate-body", border: "border-white/10" },
};

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "reporters" });

  const userResult = await getUser(
    { _id: id },
    { first_name: 1, last_name: 1, level: 1 },
  );

  if (!userResult.success || !userResult.body) {
    return { title: t("reporterNotFound") };
  }

  const user = userResult.body;
  const name = `${user.first_name} ${user.last_name}`;

  return {
    title: `${name} - ${t("reporterProfile")}`,
    description: `${t("profileOf")} ${name}`,
  };
}

export default async function ReporterDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "reporters" });
  const commonT = await getTranslations({ locale, namespace: "common" });
  const adminT = await getTranslations({ locale, namespace: "admin" });

  // Fetch user
  const userResult = await getUser(
    { _id: id },
    {
      _id: 1,
      first_name: 1,
      last_name: 1,
      level: 1,
      is_verified: 1,
      verified: 1,
      verificationBadge: 1,
      bio: 1,
      expertise: 1,
      email: 1,
      avatar: { _id: 1, name: 1, type: 1 },
      city: { _id: 1, name: 1, english_name: 1 },
      province: { _id: 1, name: 1, english_name: 1 },
      createdAt: 1,
      updatedAt: 1,
      reports: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        priority: 1,
        location: 1,
        address: 1,
        crime_occurred_at: 1,
        selected_language: 1,
        category: { _id: 1, name: 1, color: 1 },
        tags: { _id: 1, name: 1, color: 1 },
        attackedCountries: { _id: 1, name: 1 },
        attackedProvinces: { _id: 1, name: 1 },
        attackedCities: { _id: 1, name: 1 },
        hostileCountries: { _id: 1, name: 1 },
      },
    },
  );

  if (!userResult.success || !userResult.body) {
    notFound();
  }

  const user = userResult.body;
  const fullName = `${user.first_name} ${user.last_name}`;
  const level = user.level || "Ordinary";
  const levelCfg = levelConfig[level] || levelConfig.Ordinary;
  const avatarUrl = user.avatar?.name
    ? getImageUploadUrl(user.avatar.name, user.avatar.type as "image" | "video" | "docs")
    : null;

  const reports = user.reports || [];
  const reportCount = reports.length;
  const approvedCount = reports.filter((r: typeof reports[0]) => r.status === "Approved").length;
  const pendingCount = reports.filter((r: typeof reports[0]) => r.status === "Pending").length;
  const inReviewCount = reports.filter((r: typeof reports[0]) => r.status === "InReview").length;

  // Extract map locations from reports
  const mapLocations = reports
    .filter((r: typeof reports[0]) => r.location?.coordinates && r.location.coordinates.length >= 2)
    .map((r: typeof reports[0]) => ({
      lat: r.location.coordinates[1] as number,
      lng: r.location.coordinates[0] as number,
      label: r.title,
      count: 1,
    }));

  // Extract unique countries
  const countryMap = new Map<string, { _id?: string; name?: string }>();
  for (const report of reports) {
    const countries = report.attackedCountries || [];
    for (const country of countries) {
      if (country._id && !countryMap.has(country._id)) {
        countryMap.set(country._id, country);
      }
    }
  }
  const countries = Array.from(countryMap.values());

  // Bio
  const bioHtml = extractLocalizedText(user.bio as Record<string, string> | undefined, locale);
  const bioText = stripHtml(bioHtml);

  // Join date
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
    : null;

  // Recent reports for timeline (sorted by date)
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  const timelineItems = sortedReports.slice(0, 10).map((report) => ({
    report,
    date: String(report.createdAt || report.crime_occurred_at),
    locale,
  }));

  // Recent reports for grid
  const recentReports = sortedReports.slice(0, 6);

  return (
    <PageContainer showHeader={false} contentClassName="">
      <PageHero
        backLink={{ href: `/${locale}/reporters`, label: t("backToReporters") }}
        icon={<User className="h-5 w-5 text-crimson" />}
        overline={t("reporterProfile")}
        title={fullName}
        description={bioText || ""}
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-white/5">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={fullName}
                fill
                unoptimized
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-body/50">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
            )}
            {user.verified && (
              <div className="absolute -bottom-1 -end-1 h-8 w-8 rounded-full bg-emerald-500 border-3 border-background flex items-center justify-center">
                <BadgeCheck className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className={`${levelCfg.bg} ${levelCfg.text} ${levelCfg.border}`}>
                {adminT(`level_${level}`) || level}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-body/60 mb-4">
              {user.city || user.province ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold/60" />
                  {[user.city?.name, user.province?.name].filter(Boolean).join(", ")}
                </span>
              ) : null}
              {joinDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gold/60" />
                  {t("joined")} {joinDate}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {user.is_verified && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5">
                  <Shield className="h-3 w-3" />
                  {t("emailVerified")}
                </Badge>
              )}
              {user.verified && (
                <Badge className="bg-gold/10 text-gold border-gold/20 gap-1.5">
                  <Award className="h-3 w-3" />
                  {t("roleVerified")}
                </Badge>
              )}
              {user.verificationBadge && (
                <Badge className="bg-white/5 text-slate-body border-white/10">
                  {user.verificationBadge}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </PageHero>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <ReporterStatsGrid
              stats={[
                { icon: FileText, value: reportCount, label: t("totalReports"), variant: "crimson" },
                { icon: CheckCircle2, value: approvedCount, label: t("approvedReports"), variant: "emerald" },
                { icon: Clock, value: pendingCount + inReviewCount, label: t("pendingReports"), variant: "gold" },
                { icon: Globe, value: countries.length, label: t("countriesCovered"), variant: "default" },
              ]}
            />

            {/* Bio */}
            {bioText && (
              <div className="rounded-2xl glass-light border border-white/[0.06] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-gold" />
                  <h2 className="text-lg font-semibold text-offwhite">{t("aboutReporter")}</h2>
                </div>
                <div
                  className="prose prose-invert prose-sm max-w-none text-slate-body/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              </div>
            )}

            {/* Expertise */}
            {user.expertise && user.expertise.length > 0 && (
              <div className="rounded-2xl glass-light border border-white/[0.06] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-4 w-4 text-gold" />
                  <h2 className="text-lg font-semibold text-offwhite">{t("expertise")}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.expertise?.map((exp: string, i: number) => (
                    <Badge key={i} className="bg-white/5 text-slate-body border-white/10">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contributions Map */}
            {mapLocations.length > 0 && (
              <div className="rounded-2xl glass-light border border-white/[0.06] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-crimson" />
                  <h2 className="text-lg font-semibold text-offwhite">{t("contributionsMap")}</h2>
                </div>
                <ContributorMap locations={mapLocations} height="h-[350px]" />
              </div>
            )}

            {/* Recent Reports Grid */}
            {recentReports.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gold" />
                    <h2 className="text-lg font-semibold text-offwhite">{t("recentReports")}</h2>
                  </div>
                  {reportCount > 6 && (
                    <Link
                      href={`/${locale}/war-crimes?reporterId=${id}`}
                      className="text-sm text-crimson hover:text-crimson-light transition-colors"
                    >
                      {t("viewAll")} ({reportCount})
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentReports.map((report) => (
                    <ReportCard key={report._id} report={report} locale={locale} />
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-gold" />
                <h2 className="text-lg font-semibold text-offwhite">{t("activityTimeline")}</h2>
              </div>
              <ReporterActivityTimeline
                items={timelineItems}
                emptyMessage={t("noActivity")}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="rounded-2xl glass-strong border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4 text-gold" />
                <h3 className="font-semibold text-offwhite text-sm">{t("contact")}</h3>
              </div>
              {user.email && (
                <p className="text-xs text-slate-body/60 break-all">{user.email}</p>
              )}
            </div>

            {/* Location Card */}
            {(user.city || user.province) && (
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-offwhite text-sm">{t("location")}</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-body/70">
                  {user.city && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-body/40 mb-0.5">
                        {t("city")}
                      </p>
                      <p>{user.city.name}</p>
                    </div>
                  )}
                  {user.province && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-body/40 mb-0.5">
                        {t("province")}
                      </p>
                      <p>{user.province.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Countries Card */}
            {countries.length > 0 && (
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-offwhite text-sm">{t("countriesReported")}</h3>
                </div>
                <div className="space-y-2">
                  {countries.slice(0, 10).map((country) => (
                    <Link
                      key={country._id}
                      href={`/${locale}/explore/countries/${country._id}`}
                      className="flex items-center gap-2 text-sm text-slate-body/70 hover:text-gold transition-colors py-1"
                    >
                      <MapPin className="h-3 w-3 text-crimson/60 shrink-0" />
                      {country.name}
                    </Link>
                  ))}
                  {countries.length > 10 && (
                    <p className="text-xs text-slate-body/40 pt-1">
                      +{countries.length - 10} {t("more")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Report Stats Card */}
            <div className="rounded-2xl glass-strong border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-gold" />
                <h3 className="font-semibold text-offwhite text-sm">{t("reportBreakdown")}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-body/60">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    {t("approved")}
                  </span>
                  <span className="font-semibold text-offwhite">{approvedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-body/60">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {t("pending")}
                  </span>
                  <span className="font-semibold text-offwhite">{pendingCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-body/60">
                    <Shield className="h-3.5 w-3.5 text-blue-400" />
                    {t("inReview")}
                  </span>
                  <span className="font-semibold text-offwhite">{inReviewCount}</span>
                </div>
                <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-offwhite">{t("total")}</span>
                  <span className="font-bold text-crimson">{reportCount}</span>
                </div>
              </div>
            </div>

            {/* Member Since */}
            {joinDate && (
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-offwhite text-sm">{t("memberSince")}</h3>
                </div>
                <p className="text-sm text-slate-body/70">{joinDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
