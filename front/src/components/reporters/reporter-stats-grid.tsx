import { FileText, Shield, Clock, Award, MapPin, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCard {
  icon: LucideIcon;
  value: number | string;
  label: string;
  variant?: "default" | "crimson" | "gold" | "emerald";
}

interface ReporterStatsGridProps {
  stats: StatCard[];
}

const variantConfig = {
  default: {
    bg: "bg-white/[0.03]",
    border: "border-white/[0.06]",
    iconBg: "bg-white/5",
    iconColor: "text-slate-body",
  },
  crimson: {
    bg: "bg-crimson/[0.04]",
    border: "border-crimson/[0.10]",
    iconBg: "bg-crimson/10",
    iconColor: "text-crimson-light",
  },
  gold: {
    bg: "bg-gold/[0.04]",
    border: "border-gold/[0.10]",
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
  },
  emerald: {
    bg: "bg-emerald-500/[0.04]",
    border: "border-emerald-500/[0.10]",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
};

export function ReporterStatsGrid({ stats }: ReporterStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const variant = stat.variant || "default";
        const cfg = variantConfig[variant];
        const Icon = stat.icon;

        return (
          <div
            key={i}
            className={`rounded-xl ${cfg.bg} border ${cfg.border} p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className={`${cfg.iconBg} rounded-lg p-2 mb-3`}>
              <Icon className={`h-5 w-5 ${cfg.iconColor}`} />
            </div>
            <span className="text-2xl font-bold text-offwhite mb-1">{stat.value}</span>
            <span className="text-xs text-slate-body/60">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
