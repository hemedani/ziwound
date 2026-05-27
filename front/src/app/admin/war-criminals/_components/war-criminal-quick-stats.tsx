"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Swords, User, Building2, Scale } from "lucide-react";

interface WarCriminalQuickStatsProps {
  totalCount: number;
  individualsCount: number;
  entitiesCount: number;
}

const stats = [
  {
    key: "total" as const,
    icon: Swords,
    labelKey: "totalWarCriminals",
    color: "from-crimson to-crimson-dark",
  },
  {
    key: "individuals" as const,
    icon: User,
    labelKey: "individuals",
    color: "from-blue-500 to-blue-600",
  },
  {
    key: "entities" as const,
    icon: Building2,
    labelKey: "organizations",
    color: "from-amber-500 to-amber-600",
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl glass-light p-4 border border-white/[0.06] group hover:bg-white/[0.04] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 bg-gradient-to-br ${color} shadow-lg shrink-0`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-body/70 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-bold text-offwhite tabular-nums mt-0.5">
            {value}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

export function WarCriminalQuickStats({
  totalCount,
  individualsCount,
  entitiesCount,
}: WarCriminalQuickStatsProps) {
  const t = useTranslations("admin");

  const values: Record<string, number> = {
    total: totalCount,
    individuals: individualsCount,
    entities: entitiesCount,
  };

  return (
    <div className="grid gap-3 grid-cols-3">
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          label={t(stat.labelKey) || stat.labelKey}
          value={values[stat.key]}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
