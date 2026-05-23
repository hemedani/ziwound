"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  FileText,
  Users,
  CheckCircle,
  BookOpen,
  Tag,
  ArrowRight,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Globe,
  MapPin,
  Calendar,
  Languages,
  Layers,
  Building2,
  Flag,
  Gavel,
  Image,
  File,
  UserCheck,
  UserX,
  Activity,
  ScrollText,
  Video,
  HardDrive,
  Plus,
  Library,
  List,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { DeepPartial, reportSchema } from "@/types/declarations";

/* ─── Types ─── */
interface CountItem {
  _id: string;
  count: number;
}
interface GeoCountItem {
  _id: { lng: number; lat: number };
  count: number;
}

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
  users?: number;
  provinces?: number;
  cities?: number;
  categories?: number;
  tags?: number;
  reports?: number;
  documents?: number;
  blogPosts?: number;
  heroSlides?: number;
  countries?: number;
  files?: number;
  warCriminals?: number;
  userByLevel?: { _id: string; count: number }[];
  userByVerification?: { _id: boolean | null; count: number }[];
  reportByStatus?: { _id: string; count: number }[];
  reportByPriority?: { _id: string; count: number }[];
  reportByLanguage?: { _id: string; count: number }[];
  blogPostByStatus?: { _id: boolean; count: number }[];
  heroSlideByStatus?: { _id: boolean; count: number }[];
  fileByType?: { _id: string; count: number; totalSize: number }[];
  warCriminalByStatus?: { _id: string; count: number }[];
  warCriminalByAffiliation?: { _id: string; count: number }[];
  reportsLastWeek?: number;
  reportsLastMonth?: number;
}

interface DashboardClientProps {
  statsBody: ReportStatsBody;
  dashBody: DashboardStatsBody;
  totalReports: number;
  totalDocuments: number;
  totalBlogPosts: number;
  recentReports: DeepPartial<reportSchema>[];
  userData: {
    first_name?: string;
    last_name?: string;
    level: string;
  };
}

/* ─── Animated Counter ─── */
function AnimatedCounter({
  value,
  duration = 2,
  suffix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      },
    });
    return controls.stop;
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  title,
  value,
  icon: Icon,
  href,
  colorClass,
  trend,
  trendUp,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
  colorClass: string;
  trend?: string;
  trendUp?: boolean;
}) {
  const t = useTranslations("admin");
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={href}
        className="group relative overflow-hidden rounded-2xl glass-light p-5 transition-all duration-300 hover:bg-white/[0.04] border border-white/[0.06] block h-full"
      >
        {/* Background decorative glow */}
        <div className="absolute -top-12 -end-12 h-24 w-24 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent blur-2xl" />

        <div className="flex items-start justify-between relative">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-body">{title}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-offwhite">
              <AnimatedCounter value={value} />
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                {trendUp ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-crimson-light" />
                )}
                <span
                  className={`text-xs font-medium ${
                    trendUp ? "text-emerald-400" : "text-crimson-light"
                  }`}
                >
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div
            className={`rounded-xl p-2.5 ${colorClass} shadow-lg shrink-0`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-crimson opacity-0 transition-opacity group-hover:opacity-100">
          <span>{t("manage") || "Manage"}</span>
          <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Mini Bar Chart ─── */
function MiniBarChart({
  items,
  total,
  barColor = "bg-crimson-light",
}: {
  items: CountItem[];
  total: number;
  barColor?: string;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => {
        const barWidth = max > 0 ? Math.round((item.count / max) * 100) : 0;
        return (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs font-medium text-offwhite w-20 truncate shrink-0">
              {item._id}
            </span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${barColor} transition-all duration-700`}
                initial={{ width: "0%" }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs font-bold text-offwhite w-8 text-end shrink-0 tabular-nums">
              {item.count}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Progress Row ─── */
function ProgressRow({
  label,
  count,
  total,
  colorClass,
  barColor,
  icon: Icon,
}: {
  label: string;
  count: number;
  total: number;
  colorClass: string;
  barColor: string;
  icon: React.ElementType;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-lg p-1.5 ${colorClass}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-offwhite">{label}</span>
          <span className="text-xs font-bold text-offwhite tabular-nums">
            {count}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Timeline Bar Chart ─── */
function TimelineBarChart({
  items,
  barColor = "bg-crimson-light",
}: {
  items: CountItem[];
  barColor?: string;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="flex items-end gap-2 h-28 overflow-x-auto pb-1 scrollbar-thin">
      {items.map((item, idx) => {
        const height = max > 0 ? Math.round((item.count / max) * 100) : 0;
        return (
          <motion.div
            key={item._id}
            className="min-w-[36px] flex flex-col items-center gap-1 shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02, duration: 0.4 }}
          >
            <span className="text-[10px] font-bold text-offwhite tabular-nums">
              {item.count}
            </span>
            <div
              className="w-full bg-white/5 rounded-t-md overflow-hidden flex items-end"
              style={{ height: "72px" }}
            >
              <motion.div
                className={`w-full ${barColor} rounded-t-md opacity-80 hover:opacity-100`}
                initial={{ height: "0%" }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: idx * 0.02, ease: "easeOut" }}
              />
            </div>
            <span className="text-[10px] text-slate-body truncate w-full text-center">
              {item._id}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-white/5 rounded-lg p-1.5">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <h3 className="text-sm font-medium text-slate-body">{title}</h3>
    </div>
  );
}

/* ─── File size formatter ─── */
function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/* ─── Status config ─── */
function getStatusCfg(t: (key: string) => string) {
  return [
    {
      key: "Pending",
      label: t("status_pending"),
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      bar: "bg-amber-400",
      icon: Clock,
    },
    {
      key: "Approved",
      label: t("status_approved"),
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bar: "bg-emerald-400",
      icon: ShieldCheck,
    },
    {
      key: "Rejected",
      label: t("status_rejected"),
      color: "bg-crimson/10 text-crimson-light border-crimson/20",
      bar: "bg-crimson-light",
      icon: AlertTriangle,
    },
    {
      key: "InReview",
      label: t("status_in_review"),
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      bar: "bg-blue-400",
      icon: TrendingUp,
    },
  ];
}

function getPriorityCfg(t: (key: string) => string) {
  return [
    {
      key: "High",
      label: t("priority_high"),
      color: "bg-crimson/10 text-crimson-light border-crimson/20",
      bar: "bg-crimson-light",
      icon: AlertTriangle,
    },
    {
      key: "Medium",
      label: t("priority_medium"),
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      bar: "bg-amber-400",
      icon: Clock,
    },
    {
      key: "Low",
      label: t("priority_low"),
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bar: "bg-emerald-400",
      icon: ShieldCheck,
    },
  ];
}

/* ─── Main Dashboard Component ─── */
export function DashboardClient({
  statsBody,
  dashBody,
  totalReports,
  totalDocuments,
  totalBlogPosts,
  recentReports,
  userData,
}: DashboardClientProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const tWC = useTranslations("admin");

  const statusCfg = getStatusCfg(t);
  const priorityCfg = getPriorityCfg(t);

  const statusCounts: Record<string, number> = {};
  statsBody.statusCounts?.forEach((i) => {
    statusCounts[i._id] = i.count;
  });

  const priorityCounts: Record<string, number> = {};
  statsBody.priorityCounts?.forEach((i) => {
    priorityCounts[i._id || "Unknown"] = i.count;
  });

  const totalStatCount = statsBody.total?.[0]?.count ?? totalReports;

  const userLevelLabel: Record<string, string> = {
    Ordinary: t("level_Ordinary"),
    Manager: t("level_Manager"),
    Editor: t("level_Editor"),
    Reporter: t("Reporter"),
    Artist: t("Artist"),
    Diplomat: t("Diplomat"),
    Researcher: t("Researcher"),
  };
  const userByLevelItems = (dashBody.userByLevel || []).map((i) => ({
    ...i,
    _id: userLevelLabel[i._id] || i._id,
  }));
  const userVerificationItems = dashBody.userByVerification || [];
  const blogStatusItems = dashBody.blogPostByStatus || [];
  const heroSlideStatusItems = dashBody.heroSlideByStatus || [];
  const fileByTypeItems = dashBody.fileByType || [];

  const wcStatusLabel: Record<string, string> = {
    "At Large": t("atLarge"),
    Deceased: t("Deceased"),
    Accused: t("Accused"),
    Indicted: t("Indicted"),
    Convicted: t("Convicted"),
    Sanctioned: t("Sanctioned"),
  };
  const warCriminalStatusItems = (dashBody.warCriminalByStatus || []).map(
    (i) => ({ ...i, _id: wcStatusLabel[i._id] || i._id }),
  );

  const wcAffiliationLabel: Record<string, string> = {
    Military: t("Military"),
    Paramilitary: t("Paramilitary"),
    Government: t("Government"),
    "Rebel Group": t("rebelGroup"),
    "Private Military Company": t("privateMilitaryCompany"),
    Political: t("Political"),
    Other: t("Other"),
  };
  const warCriminalAffiliationItems = (
    dashBody.warCriminalByAffiliation || []
  ).map((i) => ({ ...i, _id: wcAffiliationLabel[i._id] || i._id }));

  const verifiedCount =
    userVerificationItems.find((v) => v._id === true)?.count ?? 0;
  const unverifiedCount = userVerificationItems
    .filter((v) => v._id === false || v._id === null)
    .reduce((sum, v) => sum + v.count, 0);
  const totalUserVerification = verifiedCount + unverifiedCount;
  const publishedCount =
    blogStatusItems.find((v) => v._id === true)?.count ?? 0;
  const draftCount =
    blogStatusItems.find((v) => v._id === false)?.count ?? 0;
  const totalBlogStatus = publishedCount + draftCount;
  const activeSlideCount =
    heroSlideStatusItems.find((v) => v._id === true)?.count ?? 0;
  const inactiveSlideCount =
    heroSlideStatusItems.find((v) => v._id === false)?.count ?? 0;
  const totalSlideStatus = activeSlideCount + inactiveSlideCount;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const today = new Date();
  const persianDate = today.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const levelBadgeColor =
    userData.level === "Ghost"
      ? "bg-crimson/15 text-crimson-light ring-crimson/20"
      : userData.level === "Manager"
        ? "bg-gold/15 text-gold ring-gold/20"
        : "bg-blue-500/10 text-blue-400 ring-blue-500/20";

  return (
    <motion.div
      className="space-y-8 p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* =============== HERO SECTION =============== */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
          <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
          <div className="absolute -bottom-10 -start-10 h-32 w-32 rounded-full bg-gradient-to-tr from-gold/[0.04] to-transparent blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
                {t("welcome") || "Welcome back"}{" "}
                <span className="text-gold">
                  {userData.first_name || ""}
                </span>
              </h1>
              <p className="text-slate-body mt-1 flex items-center gap-2 flex-wrap">
                <Calendar className="h-3.5 w-3.5 inline" />
                {persianDate}
                <span className="text-white/10">·</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${levelBadgeColor}`}
                >
                  <Sparkles className="h-3 w-3 me-1" />
                  {t(`level_${userData.level}` as any) || userData.level}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/reports"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crimson hover:bg-crimson-light text-white text-sm font-medium transition-colors shadow-sm shadow-crimon/20"
              >
                <Plus className="h-4 w-4" />
                {t("reports") || "Reports"}
              </Link>
              <Link
                href="/admin/blog"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-body hover:text-offwhite text-sm font-medium transition-colors border border-white/[0.06]"
              >
                <BookOpen className="h-4 w-4" />
                {t("blog") || "Blog"}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* =============== KEY METRICS =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 grid-cols-2 md:grid-cols-4"
      >
        <StatCard
          title={t("totalReports")}
          value={totalReports}
          icon={FileText}
          href="/admin/reports"
          colorClass="bg-gradient-to-br from-crimson to-crimson-dark shadow-lg shadow-crimson/20"
          trend={dashBody.reportsLastWeek ? `+${dashBody.reportsLastWeek} ${t("reportsLastWeek") || "7d"}` : undefined}
          trendUp={true}
        />
        <StatCard
          title={t("totalUsers")}
          value={dashBody.users ?? 0}
          icon={Users}
          href="/admin/users"
          colorClass="bg-gradient-to-br from-gold to-amber-600 shadow-lg shadow-gold/20"
          trend={verifiedCount ? `${verifiedCount} ${t("verified") || "verified"}` : undefined}
          trendUp={true}
        />
        <StatCard
          title={t("documents")}
          value={totalDocuments}
          icon={CheckCircle}
          href="/admin/documents"
          colorClass="bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-600/20"
          trend={dashBody.reportsLastMonth ? `+${dashBody.reportsLastMonth} ${t("reportsLastMonth") || "30d"}` : undefined}
          trendUp={true}
        />
        <StatCard
          title={t("warCriminals") || "War Criminals"}
          value={dashBody.warCriminals ?? 0}
          icon={Gavel}
          href="/admin/war-criminals"
          colorClass="bg-gradient-to-br from-rose-800 to-rose-900 shadow-lg shadow-rose-800/20"
          trend={dashBody.provinces ? `${dashBody.provinces} ${t("provinces") || "provinces"}` : undefined}
          trendUp={true}
        />
      </motion.div>

      {/* =============== SECONDARY STATS ROW =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 grid-cols-2 md:grid-cols-4"
      >
        <StatCard
          title={t("categories")}
          value={dashBody.categories ?? 0}
          icon={Layers}
          href="/admin/categories"
          colorClass="bg-gradient-to-br from-violet-600 to-violet-700 shadow-lg shadow-violet-600/20"
        />
        <StatCard
          title={t("tags")}
          value={dashBody.tags ?? 0}
          icon={Tag}
          href="/admin/tags"
          colorClass="bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20"
        />
        <StatCard
          title={t("countries") || "Countries"}
          value={dashBody.countries ?? 0}
          icon={Globe}
          href="/admin/countries"
          colorClass="bg-gradient-to-br from-teal-600 to-teal-700 shadow-lg shadow-teal-600/20"
        />
        <StatCard
          title={t("blog")}
          value={totalBlogPosts}
          icon={BookOpen}
          href="/admin/blog"
          colorClass="bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-600/20"
        />
      </motion.div>

      {/* =============== STATUS + PRIORITY CHARTS =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={BarChart3} title={t("reportsByStatus")} />
          <div className="space-y-3">
            {statusCfg.map((s) => (
              <ProgressRow
                key={s.key}
                label={s.label}
                count={statusCounts[s.key] || 0}
                total={totalStatCount}
                colorClass={s.color}
                barColor={s.bar}
                icon={s.icon}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={TrendingUp} title={t("reportsByPriority")} />
          <div className="space-y-3">
            {priorityCfg.map((p) => (
              <ProgressRow
                key={p.key}
                label={p.label}
                count={priorityCounts[p.key] || 0}
                total={totalStatCount}
                colorClass={p.color}
                barColor={p.bar}
                icon={p.icon}
              />
            ))}
            {(priorityCounts["Unknown"] ?? 0) > 0 && (
              <ProgressRow
                key="Unknown"
                label={tCommon("unknown")}
                count={priorityCounts["Unknown"]}
                total={totalStatCount}
                colorClass="bg-slate-500/10 text-slate-400"
                barColor="bg-slate-400"
                icon={AlertTriangle}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* =============== CATEGORY + LANGUAGE CHARTS =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Layers} title={t("reportsByCategory")} />
          {(statsBody.categoryCounts?.length ?? 0) > 0 ? (
            <MiniBarChart
              items={statsBody.categoryCounts!}
              total={totalStatCount}
              barColor="bg-violet-400"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader icon={Languages} title={t("reportsByLanguage")} />
          {(statsBody.languageCounts?.length ?? 0) > 0 ? (
            <MiniBarChart
              items={statsBody.languageCounts!}
              total={totalStatCount}
              barColor="bg-gold"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>
      </motion.div>

      {/* =============== TIMELINES =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Calendar}
            title={t("monthlyCreated") || "Monthly Created Reports"}
          />
          {(statsBody.monthlyCounts?.length ?? 0) > 0 ? (
            <TimelineBarChart
              items={statsBody.monthlyCounts!}
              barColor="bg-crimson-light"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Calendar}
            title={t("crimeMonthly") || "Crime Occurrence by Month"}
          />
          {(statsBody.crimeOccurredMonthlyCounts?.length ?? 0) > 0 ? (
            <TimelineBarChart
              items={statsBody.crimeOccurredMonthlyCounts!}
              barColor="bg-gold"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>
      </motion.div>

      {/* =============== GEOGRAPHIC =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Flag}
            title={t("hostileCountries") || "Hostile Countries"}
          />
          {(statsBody.hostileCountryCounts?.length ?? 0) > 0 ? (
            <MiniBarChart
              items={statsBody.hostileCountryCounts!}
              total={totalStatCount}
              barColor="bg-crimson-light"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Flag}
            title={t("attackedCountries") || "Attacked Countries"}
          />
          {(statsBody.attackedCountryCounts?.length ?? 0) > 0 ? (
            <MiniBarChart
              items={statsBody.attackedCountryCounts!}
              total={totalStatCount}
              barColor="bg-amber-400"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={MapPin}
            title={t("topLocations") || "Top Locations"}
          />
          {(statsBody.geographicCounts?.length ?? 0) > 0 ? (
            <div className="space-y-2.5">
              {statsBody.geographicCounts!.slice(0, 5).map((g, idx) => (
                <motion.div
                  key={`${g._id.lng}-${g._id.lat}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    <span className="text-xs text-offwhite">
                      {g._id.lat.toFixed(2)}, {g._id.lng.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-offwhite tabular-nums">
                    {g.count}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>
      </motion.div>

      {/* =============== USERS + BLOG + HERO SLIDES =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Users}
            title={t("usersByLevel") || "Users by Level"}
          />
          {userByLevelItems.length > 0 ? (
            <MiniBarChart
              items={userByLevelItems}
              total={dashBody.users ?? 0}
              barColor="bg-gold"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={UserCheck}
            title={t("verifiedUsers") || "Verified Users"}
          />
          {totalUserVerification > 0 ? (
            <div className="space-y-3">
              <ProgressRow
                label={t("verified")}
                count={verifiedCount}
                total={totalUserVerification}
                colorClass="bg-emerald-500/10 text-emerald-400"
                barColor="bg-emerald-400"
                icon={UserCheck}
              />
              <ProgressRow
                label={t("unverified")}
                count={unverifiedCount}
                total={totalUserVerification}
                colorClass="bg-slate-500/10 text-slate-400"
                barColor="bg-slate-400"
                icon={UserX}
              />
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={BookOpen}
            title={t("blogByStatus") || "Blog Posts by Status"}
          />
          {totalBlogStatus > 0 ? (
            <div className="space-y-3">
              <ProgressRow
                label={t("published")}
                count={publishedCount}
                total={totalBlogStatus}
                colorClass="bg-emerald-500/10 text-emerald-400"
                barColor="bg-emerald-400"
                icon={BookOpen}
              />
              <ProgressRow
                label={t("draft")}
                count={draftCount}
                total={totalBlogStatus}
                colorClass="bg-amber-500/10 text-amber-400"
                barColor="bg-amber-400"
                icon={FileText}
              />
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>
      </motion.div>

      {/* =============== HERO SLIDES + FILES BY TYPE =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Image}
            title={t("heroSlidesByStatus") || "Hero Slides by Status"}
          />
          {totalSlideStatus > 0 ? (
            <div className="space-y-3">
              <ProgressRow
                label={t("active")}
                count={activeSlideCount}
                total={totalSlideStatus}
                colorClass="bg-emerald-500/10 text-emerald-400"
                barColor="bg-emerald-400"
                icon={Image}
              />
              <ProgressRow
                label={t("inactive")}
                count={inactiveSlideCount}
                total={totalSlideStatus}
                colorClass="bg-slate-500/10 text-slate-400"
                barColor="bg-slate-400"
                icon={Image}
              />
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={HardDrive}
            title={t("filesByType") || "Files by Type"}
          />
          {fileByTypeItems.length > 0 ? (
            <div className="space-y-2.5">
              {fileByTypeItems.map((item, idx) => {
                const maxCount = Math.max(
                  ...fileByTypeItems.map((i) => i.count),
                  1,
                );
                const barWidth = Math.round((item.count / maxCount) * 100);
                const IconType =
                  item._id === "image"
                    ? Image
                    : item._id === "video"
                      ? Video
                      : ScrollText;
                const barColor =
                  item._id === "image"
                    ? "bg-violet-400"
                    : item._id === "video"
                      ? "bg-crimson-light"
                      : "bg-gold";
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="rounded-lg p-1.5 bg-white/5">
                      <IconType className="h-3.5 w-3.5 text-slate-body" />
                    </div>
                    <span className="text-xs font-medium text-offwhite w-14 truncate shrink-0 capitalize">
                      {item._id}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${barColor} transition-all duration-700`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{
                          duration: 0.8,
                          delay: idx * 0.05,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-offwhite w-24 text-end shrink-0 tabular-nums">
                      {item.count} · {formatBytes(item.totalSize)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>
      </motion.div>

      {/* =============== WAR CRIMINALS =============== */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Gavel}
            title={t("warCriminalStatus") || "War Criminals by Status"}
          />
          {warCriminalStatusItems.length > 0 ? (
            <MiniBarChart
              items={warCriminalStatusItems}
              total={0}
              barColor="bg-crimson-light"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>

        <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
          <SectionHeader
            icon={Gavel}
            title={
              t("warCriminalAffiliation") || "War Criminals by Affiliation"
            }
          />
          {warCriminalAffiliationItems.length > 0 ? (
            <MiniBarChart
              items={warCriminalAffiliationItems}
              total={0}
              barColor="bg-gold"
            />
          ) : (
            <div className="flex h-20 items-center justify-center text-xs text-slate-body/60">
              {t("noData")}
            </div>
          )}
        </div>
      </motion.div>

      {/* =============== RECENT REPORTS =============== */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl glass-light p-5 border border-white/[0.06]"
      >
        <SectionHeader icon={Activity} title={t("recentReports")} />
        {recentReports.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-body/60">
            {t("noRecentReports")}
          </div>
        ) : (
          <div className="space-y-2">
            {recentReports.map((report, idx) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.03] transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-crimson shrink-0" />
                    <p className="text-sm font-medium text-offwhite truncate">
                      {report.title || tCommon("noDescription")}
                    </p>
                  </div>
                  <p className="text-xs text-slate-body mt-0.5 ms-4">
                    {report.category?.name || ""}
                    {report.category?.name && report.createdAt ? " · " : ""}
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString("fa-IR")
                      : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ms-3 ${
                    report.status === "Approved"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : report.status === "Pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : report.status === "Rejected"
                          ? "bg-crimson/10 text-crimson-light border border-crimson/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {report.status || tCommon("unknown")}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* =============== QUICK ACTIONS =============== */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl glass-light p-6 border border-white/[0.06]"
      >
        <SectionHeader
          icon={Sparkles}
          title={t("quickActions") || "Quick Actions"}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: t("reports") || "Reports",
              href: "/admin/reports",
              icon: FileText,
              desc: "Manage reports",
            },
            {
              label: t("users") || "Users",
              href: "/admin/users",
              icon: Users,
              desc: "Manage users",
            },
            {
              label: t("blog") || "Blog",
              href: "/admin/blog",
              icon: BookOpen,
              desc: "Manage posts",
            },
            {
              label: t("documents") || "Documents",
              href: "/admin/documents",
              icon: CheckCircle,
              desc: "Manage docs",
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.04] px-4 py-3.5 text-sm font-medium text-offwhite hover:bg-white/[0.04] hover:border-white/10 hover:translate-y-[-1px] transition-all"
            >
              <div className="rounded-lg bg-crimson/10 p-2 group-hover:bg-crimson/20 transition-colors">
                <action.icon className="h-4 w-4 text-crimson-light" />
              </div>
              <div className="flex flex-col">
                <span>{action.label}</span>
                <span className="text-[10px] text-slate-body/60">
                  {action.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* =============== FOOTER SPACER =============== */}
      <div className="h-4" />
    </motion.div>
  );
}
