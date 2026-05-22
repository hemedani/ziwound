"use client";

import { useMemo, createElement } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FileText, Calendar, MapPin, Lightbulb, Activity } from "lucide-react";
import type { DeepPartial, reportSchema } from "@/types/declarations";

interface MyReportsStatsProps {
  reports: DeepPartial<reportSchema>[];
  loading: boolean;
}

function countThisMonth(reports: DeepPartial<reportSchema>[]): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return reports.filter((r) => {
    if (!r.createdAt) return false;
    const d = new Date(String(r.createdAt));
    return d >= start;
  }).length;
}

function mostActiveLocation(reports: DeepPartial<reportSchema>[]): string | null {
  const counts: Record<string, number> = {};
  for (const r of reports) {
    const countries = (r as { attackedCountries?: Array<{ _id?: string; name?: string }> }).attackedCountries || [];
    for (const c of countries) {
      if (c.name) counts[c.name] = (counts[c.name] || 0) + 1;
    }
    const cities = (r as { attackedCities?: Array<{ _id?: string; name?: string }> }).attackedCities || [];
    for (const c of cities) {
      if (c.name) counts[c.name] = (counts[c.name] || 0) + 1;
    }
  }
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export function MyReportsStats({ reports, loading }: MyReportsStatsProps) {
  const t = useTranslations("myReports");

  const stats = useMemo(() => {
    const thisMonth = countThisMonth(reports);
    const topLocation = mostActiveLocation(reports);
    const cities = new Set(
      reports.flatMap(
        (r) => ((r as { attackedCities?: Array<{ name?: string }> }).attackedCities || []).map((c) => c.name),
      ).filter(Boolean),
    );
    const countries = new Set(
      reports.flatMap(
        (r) =>
          [
            ...((r as { hostileCountries?: Array<{ name?: string }> }).hostileCountries || []),
            ...((r as { attackedCountries?: Array<{ name?: string }> }).attackedCountries || []),
          ].map((c) => c.name),
      ).filter(Boolean),
    );
    return { thisMonth, topLocation, locationCount: cities.size + countries.size };
  }, [reports]);

  if (loading) return null;

  const sidebarItems = [
    { icon: FileText, label: t("total"), value: reports.length, color: "text-offwhite", bg: "bg-white/5" },
    { icon: Calendar, label: t("thisMonth"), value: stats.thisMonth, color: "text-gold", bg: "bg-gold/10" },
    { icon: MapPin, label: t("locationsTracked"), value: stats.locationCount, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  const tips = [t("tip1"), t("tip2"), t("tip3")];
  const tipIcons = [Lightbulb, Activity, MapPin];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-body/50">
          {t("quickStats")}
        </h3>
        <div className="space-y-2">
          {sidebarItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 transition-colors hover:border-white/[0.08] hover:bg-white/[0.03]"
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", item.bg)}>
                <item.icon className={cn("h-4 w-4", item.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-offwhite tabular-nums leading-none">{item.value}</p>
                <p className="text-xs text-slate-body/70 mt-0.5 truncate">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {stats.topLocation && (
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-body/50 mb-3">
            {t("topLocation")}
          </h3>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-crimson shrink-0" />
            <span className="text-sm font-medium text-offwhite">{stats.topLocation}</span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-body/50 mb-3">
          {t("tips")}
        </h3>
        <ul className="space-y-2.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              {createElement(tipIcons[i] || Lightbulb, {
                className: "h-3.5 w-3.5 text-gold mt-0.5 shrink-0",
              })}
              <span className="text-xs text-slate-body/70 leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
