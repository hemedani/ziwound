import { getTranslations } from "next-intl/server";
import { count as countReports } from "@/app/actions/report/count";
import { count as countDocuments } from "@/app/actions/document/count";
import { statistics as reportStatistics } from "@/app/actions/report/statistics";
import { dashboardStatistic } from "@/app/actions/user/dashboardStatistic";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { gets as getReports } from "@/app/actions/report/gets";
import {
  FileText, Users, CheckCircle, BookOpen, Tag, ArrowRight,
  BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Clock,
  Globe, MapPin, Calendar, Languages, Layers, Building2, Flag,
} from "lucide-react";
import Link from "next/link";
import { DeepPartial, reportSchema } from "@/types/declarations";

/* ─── Types ─── */
interface CountItem { _id: string; count: number; }
interface GeoCountItem { _id: { lng: number; lat: number }; count: number; }

interface ReportStatsBody {
  total?: { count: number }[];
  statusCounts?: CountItem[];
  priorityCounts?: CountItem[];
  categoryCounts?: CountItem[];
  languageCounts?: CountItem[];
  hostileCountryCounts?: CountItem[];
  attackedCountryCounts?: CountItem[];
  attackedProvinceCounts?: CountItem[];
  attackedCityCounts?: CountItem[];
  monthlyCounts?: CountItem[];
  crimeOccurredMonthlyCounts?: CountItem[];
  geographicCounts?: GeoCountItem[];
}

interface DashboardStatsBody {
  users?: number; provinces?: number; cities?: number;
  categories?: number; tags?: number;
}

/* ─── Components ─── */
function StatCard({ title, value, icon: Icon, href, colorClass, manageLabel }:
  { title: string; value: string | number; icon: React.ElementType; href: string; colorClass: string; manageLabel: string }) {
  return (
    <Link href={href} className="group relative overflow-hidden rounded-2xl glass-light p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] border border-white/[0.06]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-body">{title}</p>
          <p className="mt-2 text-3xl font-bold text-offwhite">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${colorClass}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-crimson opacity-0 transition-opacity group-hover:opacity-100">
        <span>{manageLabel}</span>
        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
      </div>
    </Link>
  );
}

function MiniBarChart({ items, total, barColor = "bg-crimson-light" }:
  { items: CountItem[]; total: number; barColor?: string }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const barWidth = max > 0 ? Math.round((item.count / max) * 100) : 0;
        return (
          <div key={item._id} className="flex items-center gap-3">
            <span className="text-xs font-medium text-offwhite w-16 truncate shrink-0">{item._id}</span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${barWidth}%` }} />
            </div>
            <span className="text-xs font-bold text-offwhite w-8 text-end shrink-0">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProgressRow({ label, count, total, colorClass, barColor, icon: Icon }:
  { label: string; count: number; total: number; colorClass: string; barColor: string; icon: React.ElementType }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-lg p-1.5 ${colorClass}`}><Icon className="h-3.5 w-3.5" /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-offwhite">{label}</span>
          <span className="text-xs font-bold text-offwhite">{count}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function TimelineBarChart({ items, barColor = "bg-crimson-light" }:
  { items: CountItem[]; barColor?: string }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="flex items-end gap-2 h-24">
      {items.map((item) => {
        const height = max > 0 ? Math.round((item.count / max) * 100) : 0;
        return (
          <div key={item._id} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-offwhite">{item.count}</span>
            <div className="w-full bg-white/5 rounded-t-md overflow-hidden flex items-end" style={{ height: "64px" }}>
              <div className={`w-full ${barColor} rounded-t-md transition-all duration-700 opacity-80 hover:opacity-100`} style={{ height: `${height}%` }} />
            </div>
            <span className="text-[10px] text-slate-body truncate w-full text-center">{item._id}</span>
          </div>
        );
      })}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-white/5 rounded-lg p-1.5">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <h3 className="text-sm font-medium text-slate-body">{title}</h3>
    </div>
  );
}

/* ─── Page ─── */
export default async function AdminDashboardPage() {
  const t = await getTranslations({ locale: "fa" });

  const [
    reportsCountRes,
    documentsCountRes,
    blogPostsRes,
    recentReportsRes,
    statsRes,
    dashStatsRes,
  ] = await Promise.all([
    countReports({}, { qty: 1 }),
    countDocuments({}, { qty: "1" }),
    getBlogPosts({ page: 1, limit: 1 }, { _id: 1 }),
    getReports({ page: 1, limit: 5 }, { _id: 1, title: 1, status: 1, createdAt: 1, category: { name: 1 } }),
    reportStatistics({}, {}),
    dashboardStatistic({}, { users: 1, provinces: 1, cities: 1, categories: 1, tags: 1 }),
  ]);

  const totalReports = reportsCountRes?.success && typeof reportsCountRes.body === "object"
    ? (reportsCountRes.body as { qty?: number }).qty ?? 0 : 0;
  const totalDocuments = documentsCountRes?.success && typeof documentsCountRes.body === "object"
    ? (documentsCountRes.body as { qty?: number }).qty ?? 0 : 0;

  let totalBlogPosts = 0;
  if (blogPostsRes?.success) {
    const body = blogPostsRes.body;
    if (Array.isArray(body)) totalBlogPosts = body.length;
    else if (typeof body === "object" && body !== null) {
      totalBlogPosts = (body as { total?: number; list?: unknown[] }).total ?? (body as { list?: unknown[] }).list?.length ?? 0;
    }
  }

  let recentReports: DeepPartial<reportSchema>[] = [];
  if (recentReportsRes?.success) {
    const body = recentReportsRes.body;
    recentReports = Array.isArray(body) ? body : (body as { list?: DeepPartial<reportSchema>[] })?.list || [];
  }

  const statsBody: ReportStatsBody = statsRes?.success && typeof statsRes.body === "object"
    ? (statsRes.body as ReportStatsBody) : {};

  const dashBody: DashboardStatsBody = dashStatsRes?.success && typeof dashStatsRes.body === "object"
    ? (dashStatsRes.body as DashboardStatsBody) : {};

  const totalStatCount = statsBody.total?.[0]?.count ?? totalReports;

  const statusCfg = [
    { key: "Pending", label: t("admin.status_pending"), color: "bg-amber-500/10 text-amber-400 border-amber-500/20", bar: "bg-amber-400", icon: Clock },
    { key: "Approved", label: t("admin.status_approved"), color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-400", icon: ShieldCheck },
    { key: "Rejected", label: t("admin.status_rejected"), color: "bg-crimson/10 text-crimson-light border-crimson/20", bar: "bg-crimson-light", icon: AlertTriangle },
    { key: "InReview", label: t("admin.status_in_review"), color: "bg-blue-500/10 text-blue-400 border-blue-500/20", bar: "bg-blue-400", icon: TrendingUp },
  ];

  const priorityCfg = [
    { key: "High", label: t("admin.priority_high"), color: "bg-crimson/10 text-crimson-light border-crimson/20", bar: "bg-crimson-light", icon: AlertTriangle },
    { key: "Medium", label: t("admin.priority_medium"), color: "bg-amber-500/10 text-amber-400 border-amber-500/20", bar: "bg-amber-400", icon: Clock },
    { key: "Low", label: t("admin.priority_low"), color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-400", icon: ShieldCheck },
  ];

  const statusCounts: Record<string, number> = {};
  statsBody.statusCounts?.forEach((i) => { statusCounts[i._id] = i.count; });

  const priorityCounts: Record<string, number> = {};
  statsBody.priorityCounts?.forEach((i) => { priorityCounts[i._id] = i.count; });

  const topStats = [
    { title: t("admin.totalReports"), value: totalReports, icon: FileText, href: "/admin/reports", colorClass: "bg-crimson shadow-lg shadow-crimson/20" },
    { title: t("admin.totalUsers"), value: dashBody.users ?? 0, icon: Users, href: "/admin/users", colorClass: "bg-gold shadow-lg shadow-gold/20" },
    { title: t("admin.categories"), value: dashBody.categories ?? 0, icon: Layers, href: "/admin/categories", colorClass: "bg-violet-600 shadow-lg shadow-violet-600/20" },
    { title: t("admin.tags"), value: dashBody.tags ?? 0, icon: Tag, href: "/admin/tags", colorClass: "bg-blue-600 shadow-lg shadow-blue-600/20" },
    { title: t("admin.provinces"), value: dashBody.provinces ?? 0, icon: Building2, href: "/admin/provinces", colorClass: "bg-teal-600 shadow-lg shadow-teal-600/20" },
    { title: t("admin.cities"), value: dashBody.cities ?? 0, icon: Globe, href: "/admin/cities", colorClass: "bg-orange-600 shadow-lg shadow-orange-600/20" },
    { title: t("admin.documents"), value: totalDocuments, icon: CheckCircle, href: "/admin/documents", colorClass: "bg-emerald-600 shadow-lg shadow-emerald-600/20" },
    { title: t("admin.blog"), value: totalBlogPosts, icon: BookOpen, href: "/admin/blog", colorClass: "bg-indigo-600 shadow-lg shadow-indigo-600/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="h-px w-8 bg-crimson" />
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">{t("admin.adminPanel")}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-offwhite">{t("admin.dashboard")}</h1>
        <p className="text-slate-body mt-1">{t("admin.dashboardDescription")}</p>
      </div>

      {/* Top Stats Grid — 8 cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {topStats.map((s) => (
          <StatCard key={s.href} {...s} manageLabel={t("common.manage")} />
        ))}
      </div>

      {/* Charts Row 1: Status + Priority */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={BarChart3} title={t("admin.reportsByStatus") || "Reports by Status"} />
          <div className="space-y-3">
            {statusCfg.map((s) => (
              <ProgressRow key={s.key} label={s.label} count={statusCounts[s.key] || 0} total={totalStatCount}
                colorClass={s.color} barColor={s.bar} icon={s.icon} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={TrendingUp} title={t("admin.reportsByPriority") || "Reports by Priority"} />
          <div className="space-y-3">
            {priorityCfg.map((p) => (
              <ProgressRow key={p.key} label={p.label} count={priorityCounts[p.key] || 0} total={totalStatCount}
                colorClass={p.color} barColor={p.bar} icon={p.icon} />
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Category + Language */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Layers} title={t("admin.reportsByCategory") || "Reports by Category"} />
          {(statsBody.categoryCounts?.length ?? 0) > 0 ? (
            <MiniBarChart items={statsBody.categoryCounts!} total={totalStatCount} barColor="bg-violet-400" />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{t("admin.noData") || "No data available"}</div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Languages} title={t("admin.reportsByLanguage") || "Reports by Language"} />
          {(statsBody.languageCounts?.length ?? 0) > 0 ? (
            <MiniBarChart items={statsBody.languageCounts!} total={totalStatCount} barColor="bg-gold" />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{t("admin.noData") || "No data available"}</div>
          )}
        </div>
      </div>

      {/* Timelines Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Calendar} title={t("admin.monthlyCreated") || "Monthly Created Reports"} />
          {(statsBody.monthlyCounts?.length ?? 0) > 0 ? (
            <TimelineBarChart items={statsBody.monthlyCounts!} barColor="bg-crimson-light" />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{t("admin.noData") || "No data available"}</div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Calendar} title={t("admin.crimeMonthly") || "Crime Occurrence by Month"} />
          {(statsBody.crimeOccurredMonthlyCounts?.length ?? 0) > 0 ? (
            <TimelineBarChart items={statsBody.crimeOccurredMonthlyCounts!} barColor="bg-gold" />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{t("admin.noData") || "No data available"}</div>
          )}
        </div>
      </div>

      {/* Geographic + Countries Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Flag} title={t("admin.hostileCountries") || "Hostile Countries"} />
          {(statsBody.hostileCountryCounts?.length ?? 0) > 0 ? (
            <MiniBarChart items={statsBody.hostileCountryCounts!} total={totalStatCount} barColor="bg-crimson-light" />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{t("admin.noData") || "No data available"}</div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Flag} title={t("admin.attackedCountries") || "Attacked Countries"} />
          {(statsBody.attackedCountryCounts?.length ?? 0) > 0 ? (
            <MiniBarChart items={statsBody.attackedCountryCounts!} total={totalStatCount} barColor="bg-amber-400" />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{t("admin.noData") || "No data available"}</div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={MapPin} title={t("admin.topLocations") || "Top Locations"} />
          {(statsBody.geographicCounts?.length ?? 0) > 0 ? (
            <div className="space-y-2.5">
              {statsBody.geographicCounts!.slice(0, 5).map((g) => (
                <div key={`${g._id.lng}-${g._id.lat}`} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    <span className="text-xs text-offwhite">{g._id.lat.toFixed(2)}, {g._id.lng.toFixed(2)}</span>
                  </div>
                  <span className="text-xs font-bold text-offwhite">{g.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{t("admin.noData") || "No data available"}</div>
          )}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
        <h3 className="text-sm font-medium text-slate-body mb-4">{t("admin.recentReports") || "Recent Reports"}</h3>
        {recentReports.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-body/60">
            {t("admin.noRecentReports") || "No recent reports"}
          </div>
        ) : (
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report._id} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 border border-white/[0.04] hover:border-white/10 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-offwhite truncate">{report.title || t("common.noDescription")}</p>
                  <p className="text-xs text-slate-body mt-0.5">
                    {report.category?.name || ""} · {report.createdAt ? new Date(report.createdAt).toLocaleDateString("fa-IR") : ""}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  report.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  report.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  report.status === "Rejected" ? "bg-crimson/10 text-crimson-light border border-crimson/20" :
                  "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>{report.status || t("common.unknown")}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl glass-light p-6 border border-white/[0.06]">
        <h3 className="text-lg font-semibold text-offwhite mb-4">{t("admin.quickActions") || "Quick Actions"}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t("admin.reports") || "Reports", href: "/admin/reports", icon: FileText },
            { label: t("admin.users") || "Users", href: "/admin/users", icon: Users },
            { label: t("admin.blog") || "Blog", href: "/admin/blog", icon: BookOpen },
            { label: t("admin.documents") || "Documents", href: "/admin/documents", icon: CheckCircle },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.04] px-4 py-3 text-sm font-medium text-offwhite hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <action.icon className="h-4 w-4 text-crimson-light" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
