"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Image, Eye, EyeOff, ListOrdered } from "lucide-react";

interface HeroSlideQuickStatsProps {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
}

const stats = [
  {
    key: "total" as const,
    icon: Image,
    color: "from-crimson to-crimson-dark",
    bgGlow: "shadow-crimson/20",
  },
  {
    key: "active" as const,
    icon: Eye,
    color: "from-emerald-500 to-emerald-600",
    bgGlow: "shadow-emerald-500/20",
  },
  {
    key: "inactive" as const,
    icon: EyeOff,
    color: "from-slate-500 to-slate-600",
    bgGlow: "shadow-slate-500/20",
  },
];

export function HeroSlideQuickStats({ totalCount, activeCount, inactiveCount }: HeroSlideQuickStatsProps) {
  const t = useTranslations("admin");

  const values: Record<string, number> = {
    total: totalCount,
    active: activeCount,
    inactive: inactiveCount,
  };

  return (
    <div className="grid gap-3 grid-cols-3">
      {stats.map((stat) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl glass-light p-4 border border-white/[0.06] group hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 bg-gradient-to-br ${stat.color} shadow-lg ${stat.bgGlow}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-body/70 uppercase tracking-wider">
                {t(`slides_${stat.key}`) || t(stat.key)}
              </p>
              <p className="text-xl font-bold text-offwhite tabular-nums mt-0.5">
                {values[stat.key]}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}
