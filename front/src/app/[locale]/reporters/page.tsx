import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { ReporterHero } from "@/components/reporters/reporter-hero";
import { ReporterCard } from "@/components/reporters/reporter-card";
import { ReporterSearch } from "@/components/reporters/reporter-search";
import { SkeletonList } from "@/components/ui/skeleton-states";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { getUsers } from "@/app/actions/user/getUsers";
import { countUsers } from "@/app/actions/user/countUsers";
import { gets as getReports } from "@/app/actions/report/gets";
import { Badge } from "@/components/ui/badge";
import { Filter, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    level?: string;
    page?: string;
  }>;
}

const CONTRIBUTOR_LEVELS = ["Reporter", "Editor", "Researcher", "Diplomat", "Artist", "Manager", "Ordinary"];

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reporters" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function ReportersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { search, level, page: pageStr } = await searchParams;
  const t = await getTranslations({ locale, namespace: "reporters" });
  const commonT = await getTranslations({ locale, namespace: "common" });
  const adminT = await getTranslations({ locale, namespace: "admin" });

  const currentPage = parseInt(pageStr || "1", 10);
  const limit = 12;

  // Fetch total user count for stats
  const totalUsersResult = await countUsers({}, {});
  const totalUsers = totalUsersResult.success ? totalUsersResult.body?.qty || 0 : 0;

  // Fetch total report count
  const totalReportsResult = await getReports({ page: 1, limit: 1 }, { _id: 1 });
  const totalReports = totalReportsResult.success ? (totalReportsResult.body?.length || 0) : 0;

  // Build query for getUsers
  const query: {
    page: number;
    limit: number;
    search?: string;
    level?: "Manager" | "Editor" | "Reporter" | "Artist" | "Diplomat" | "Researcher" | "Ordinary";
  } = {
    page: currentPage,
    limit,
  };

  if (level && level !== "all") {
    query.level = level as typeof query.level;
  }
  if (search) {
    query.search = search;
  }

  // Fetch users with pagination
  const usersResult = await getUsers(
    query,
    {
      _id: 1,
      first_name: 1,
      last_name: 1,
      level: 1,
      is_verified: 1,
      verified: 1,
      bio: 1,
      avatar: { _id: 1, name: 1, type: 1 },
      city: { _id: 1, name: 1 },
      province: { _id: 1, name: 1 },
      reports: { _id: 1, status: 1, location: 1, attackedCountries: { _id: 1, name: 1 } },
    },
  );

  if (!usersResult.success) {
    return (
      <div className="container px-4 md:px-8 py-20">
        <ErrorState
          title={commonT("error")}
          description={commonT("unexpectedError")}
          retryText={commonT("tryAgain")}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const users = (usersResult.body || []).filter(
    (u: Record<string, unknown>) => u.level !== "Ghost"
  );

  // Enrich users with report counts and country data
  const enrichedUsers = users.map((user: Record<string, unknown>) => {
    const reports = (user.reports as Array<Record<string, unknown>>) || [];
    const reportCount = reports.length;
    const verifiedCount = reports.filter((r: Record<string, unknown>) => r.status === "Approved").length;

    // Extract unique countries from reports
    const countryMap = new Map<string, { _id?: string; name?: string; english_name?: string }>();
    for (const report of reports) {
      const attackedCountries = (report as { attackedCountries?: Array<{ _id?: string; name?: string }> }).attackedCountries || [];
      for (const country of attackedCountries) {
        if (country._id && !countryMap.has(country._id)) {
          countryMap.set(country._id, country);
        }
      }
    }

    return {
      ...user,
      reportCount,
      verifiedCount,
      countries: Array.from(countryMap.values()),
    };
  });

  // Sort by report count (top contributors first)
  enrichedUsers.sort((a: typeof enrichedUsers[0], b: typeof enrichedUsers[0]) => b.reportCount - a.reportCount);

  // Calculate unique countries across all reporters
  const allCountries = new Set<string>();
  for (const user of enrichedUsers) {
    for (const country of user.countries) {
      if (country._id) allCountries.add(country._id);
    }
  }

  // Top contributors (top 3)
  const topContributors = enrichedUsers.slice(0, 3);

  const totalPages = Math.ceil(totalUsers / limit);
  const hasFilters = search || (level && level !== "all");

  return (
    <PageContainer showHeader={false}>
      <ReporterHero
        locale={locale}
        totalReporters={totalUsers}
        totalReports={totalReports}
        countriesCovered={allCountries.size}
        backToHomeLabel={commonT("back")}
        overlineLabel={t("hallOfContributors")}
        title={t("reportersAndContributors")}
        subtitle={t("pageDescription")}
        reportersLabel={t("reporters")}
        reportsSubmittedLabel={t("reportsSubmitted")}
        countriesCoveredLabel={t("countriesCovered")}
      />

      <div className="container px-4 md:px-8 pb-20">
        {/* Top Contributors Highlight */}
        {topContributors.length > 0 && topContributors[0].reportCount > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t("topContributors")}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topContributors.map((user: typeof topContributors[0], i: number) => (
                <Link
                  key={user._id}
                  href={`/${locale}/reporters/${user._id}`}
                  className="group flex items-center gap-4 rounded-xl glass-light border border-white/[0.06] p-4 transition-all duration-300 hover:border-gold/20 hover:bg-white/[0.04]"
                >
                  <div className="relative h-12 w-12 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg font-bold text-gold">
                    #{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-offwhite truncate group-hover:text-gold transition-colors">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-slate-body/50">
                      {user.reportCount} {t("reports")}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-body/30 group-hover:text-gold transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <ReporterSearch placeholder={t("searchReporters")} defaultValue={search} />

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-body/40" />
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={`/${locale}/reporters${hasFilters ? "?page=1" : ""}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !level || level === "all"
                    ? "bg-crimson/10 text-crimson-light border border-crimson/20"
                    : "bg-white/[0.03] text-slate-body/60 border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                {commonT("all")}
              </Link>
              {CONTRIBUTOR_LEVELS.map((lvl) => (
                <Link
                  key={lvl}
                  href={`/${locale}/reporters?level=${lvl}&page=1${search ? `&search=${search}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    level === lvl
                      ? "bg-crimson/10 text-crimson-light border border-crimson/20"
                      : "bg-white/[0.03] text-slate-body/60 border border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  {adminT(`level_${lvl}`) || lvl}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Reporter Grid */}
        {enrichedUsers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrichedUsers.map((user: typeof enrichedUsers[0]) => (
                <ReporterCard key={user._id} reporter={user} locale={locale} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/${locale}/reporters?page=${currentPage - 1}${level && level !== "all" ? `&level=${level}` : ""}${search ? `&search=${search}` : ""}`}
                    className="px-4 py-2 rounded-lg text-sm bg-white/[0.03] border border-white/[0.06] text-slate-body hover:bg-white/[0.06] hover:text-offwhite transition-all"
                  >
                    {commonT("previous")}
                  </Link>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={`/${locale}/reporters?page=${pageNum}${level && level !== "all" ? `&level=${level}` : ""}${search ? `&search=${search}` : ""}`}
                        className={`h-9 w-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${
                          pageNum === currentPage
                            ? "bg-crimson/10 text-crimson-light border border-crimson/20"
                            : "bg-white/[0.03] text-slate-body/60 border border-white/[0.06] hover:bg-white/[0.06]"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/${locale}/reporters?page=${currentPage + 1}${level && level !== "all" ? `&level=${level}` : ""}${search ? `&search=${search}` : ""}`}
                    className="px-4 py-2 rounded-lg text-sm bg-white/[0.03] border border-white/[0.06] text-slate-body hover:bg-white/[0.06] hover:text-offwhite transition-all"
                  >
                    {commonT("next")}
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Users}
            title={t("noReporters")}
            description={t("noReportersDescription")}
            action={
              hasFilters ? (
                <Link
                  href={`/${locale}/reporters`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-crimson/10 text-crimson-light border border-crimson/20 hover:bg-crimson/20 transition-all"
                >
                  {t("clearFilters")}
                </Link>
              ) : undefined
            }
          />
        )}
      </div>
    </PageContainer>
  );
}
