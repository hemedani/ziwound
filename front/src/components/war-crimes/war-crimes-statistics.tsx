import { getTranslations } from "next-intl/server";
import type { DeepPartial, categorySchema } from "@/types/declarations";
import {
  FileText, Layers, Languages, BarChart3, TrendingUp,
  AlertTriangle, ShieldCheck, Clock, Globe, MapPin, Calendar,
  Flag, Building2, Map as MapIcon,
} from "lucide-react";

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

interface WarCrimesStatisticsProps {
  totalCount: number;
  categories: DeepPartial<categorySchema>[];
  statsBody: ReportStatsBody;
  locale: string;
}

const langNames: Record<string, string> = {
  fa: "Persian", en: "English", ar: "Arabic", zh: "Chinese",
  pt: "Portuguese", es: "Spanish", nl: "Dutch", tr: "Turkish",
  ru: "Russian", fr: "French", de: "German", hi: "Hindi",
  ja: "Japanese", pa: "Punjabi", id: "Indonesian", te: "Telugu",
  mr: "Marathi", ta: "Tamil", vi: "Vietnamese", ko: "Korean",
  it: "Italian", sv: "Swedish", pl: "Polish", uk: "Ukrainian",
  ro: "Romanian",
};

const statusCfg = [
  { key: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", bar: "bg-amber-400", icon: Clock },
  { key: "Approved", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-400", icon: ShieldCheck },
  { key: "Rejected", color: "bg-crimson/10 text-crimson-light border-crimson/20", bar: "bg-crimson-light", icon: AlertTriangle },
  { key: "InReview", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", bar: "bg-blue-400", icon: TrendingUp },
];

const priorityCfg = [
  { key: "High", color: "bg-crimson/10 text-crimson-light border-crimson/20", bar: "bg-crimson-light", icon: AlertTriangle },
  { key: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", bar: "bg-amber-400", icon: Clock },
  { key: "Low", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-400", icon: ShieldCheck },
];

function StatCard({ title, value, icon: Icon, colorClass }:
  { title: string; value: string | number; icon: React.ElementType; colorClass: string }) {
  return (
    <div className="rounded-2xl glass-light p-5 border border-white/[0.06] transition-all duration-300 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-body">{title}</p>
          <p className="mt-2 text-3xl font-bold text-offwhite">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${colorClass}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
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
          <span className="text-xs font-bold text-offwhite">{count} ({pct}%)</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function MiniBarChart({ items, total, barColor = "bg-crimson-light", noDataText = "No data" }:
  { items: CountItem[]; total: number; barColor?: string; noDataText?: string }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (items.length === 0) {
    return <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{noDataText}</div>;
  }
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const barWidth = max > 0 ? Math.round((item.count / max) * 100) : 0;
        return (
          <div key={item._id} className="flex items-center gap-3">
            <span className="text-xs font-medium text-offwhite w-20 truncate shrink-0">{item._id}</span>
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

function TimelineBarChart({ items, barColor = "bg-crimson-light", noDataText = "No data" }:
  { items: CountItem[]; barColor?: string; noDataText?: string }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (items.length === 0) {
    return <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">{noDataText}</div>;
  }
  return (
    <div className="flex items-end gap-2 h-28">
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

export async function WarCrimesStatistics({
  totalCount,
  categories,
  statsBody,
  locale,
}: WarCrimesStatisticsProps) {
  const t = await getTranslations({ locale, namespace: "warCrimes" });

  const totalStatCount = statsBody.total?.[0]?.count ?? totalCount;
  const categoryCount = categories.length;
  const langCount = statsBody.languageCounts?.length ?? 0;
  const uniqueCountries = new Set([
    ...(statsBody.hostileCountryCounts || []).map((c) => c._id),
    ...(statsBody.attackedCountryCounts || []).map((c) => c._id),
  ]).size;

  const statusCounts: Record<string, number> = {};
  statsBody.statusCounts?.forEach((i) => { statusCounts[i._id] = i.count; });

  const priorityCounts: Record<string, number> = {};
  statsBody.priorityCounts?.forEach((i) => { priorityCounts[i._id] = i.count; });

  const categoryNameMap = new Map(categories.map((c) => [c._id, c.name]));
  const namedCategoryCounts = (statsBody.categoryCounts || []).map((c) => ({
    ...c,
    _id: categoryNameMap.get(c._id) || c._id,
  }));

  const namedLanguageCounts = (statsBody.languageCounts || []).map((c) => ({
    ...c,
    _id: langNames[c._id] || c._id,
  }));

  const statusLabel: Record<string, string> = {
    Pending: t("status.pending"),
    Approved: t("status.approved"),
    Rejected: t("status.rejected"),
    InReview: t("status.inReview"),
  };

  const priorityLabel: Record<string, string> = {
    High: t("priority.high"),
    Medium: t("priority.medium"),
    Low: t("priority.low"),
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard
          title={t("totalReports")}
          value={totalStatCount}
          icon={FileText}
          colorClass="bg-crimson shadow-lg shadow-crimson/20"
        />
        <StatCard
          title={t("categories")}
          value={categoryCount}
          icon={Layers}
          colorClass="bg-violet-600 shadow-lg shadow-violet-600/20"
        />
        <StatCard
          title={t("languages")}
          value={langCount}
          icon={Languages}
          colorClass="bg-gold shadow-lg shadow-gold/20"
        />
        <StatCard
          title={t("countriesInvolved")}
          value={uniqueCountries}
          icon={Globe}
          colorClass="bg-teal-600 shadow-lg shadow-teal-600/20"
        />
      </div>

      {/* Status + Priority */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={BarChart3} title={t("reportsByStatus")} />
          <div className="space-y-3">
            {statusCfg.map((s) => (
              <ProgressRow key={s.key} label={statusLabel[s.key]} count={statusCounts[s.key] || 0} total={totalStatCount}
                colorClass={s.color} barColor={s.bar} icon={s.icon} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={TrendingUp} title={t("reportsByPriority")} />
          <div className="space-y-3">
            {priorityCfg.map((p) => (
              <ProgressRow key={p.key} label={priorityLabel[p.key]} count={priorityCounts[p.key] || 0} total={totalStatCount}
                colorClass={p.color} barColor={p.bar} icon={p.icon} />
            ))}
          </div>
        </div>
      </div>

      {/* Category + Language */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Layers} title={t("byCategory")} />
          <MiniBarChart items={namedCategoryCounts} total={totalStatCount} barColor="bg-violet-400" noDataText={t("noData")} />
        </div>
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Languages} title={t("reportsByLanguage")} />
          <MiniBarChart items={namedLanguageCounts} total={totalStatCount} barColor="bg-gold" noDataText={t("noData")} />
        </div>
      </div>

      {/* Timelines */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Calendar} title={t("monthlyCreated")} />
          <TimelineBarChart items={statsBody.monthlyCounts || []} barColor="bg-crimson-light" noDataText={t("noData")} />
        </div>
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Calendar} title={t("crimeMonthly")} />
          <TimelineBarChart items={statsBody.crimeOccurredMonthlyCounts || []} barColor="bg-gold" noDataText={t("noData")} />
        </div>
      </div>

      {/* Geographic actors */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Flag} title={t("filters.hostileCountries")} />
          <MiniBarChart items={statsBody.hostileCountryCounts || []} total={totalStatCount} barColor="bg-crimson-light" noDataText={t("noData")} />
        </div>
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={ShieldCheck} title={t("filters.attackedCountries")} />
          <MiniBarChart items={statsBody.attackedCountryCounts || []} total={totalStatCount} barColor="bg-amber-400" noDataText={t("noData")} />
        </div>
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Building2} title={t("filters.attackedProvinces")} />
          <MiniBarChart items={statsBody.attackedProvinceCounts || []} total={totalStatCount} barColor="bg-blue-400" noDataText={t("noData")} />
        </div>
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={MapIcon} title={t("filters.attackedCities")} />
          <MiniBarChart items={statsBody.attackedCityCounts || []} total={totalStatCount} barColor="bg-emerald-400" noDataText={t("noData")} />
        </div>
      </div>

      {/* Top Locations */}
      {(statsBody.geographicCounts?.length ?? 0) > 0 && (
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={MapPin} title={t("topLocations")} />
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {statsBody.geographicCounts!.slice(0, 10).map((g) => (
              <div key={`${g._id.lng}-${g._id.lat}`}
                className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 border border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span className="text-xs text-offwhite">{g._id.lat.toFixed(2)}, {g._id.lng.toFixed(2)}</span>
                </div>
                <span className="text-xs font-bold text-offwhite">{g.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
