"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeepPartial, reportSchema } from "@/types/declarations";

interface MyReportsHeaderProps {
  reports: DeepPartial<reportSchema>[];
  loading: boolean;
}

export function MyReportsHeader({ reports, loading }: MyReportsHeaderProps) {
  const t = useTranslations("myReports");

  const stats = useMemo(() => {
    const total = reports.length;
    const published = reports.filter((r) => r.status === "Approved").length;
    const pending = reports.filter((r) => r.status === "Pending" || r.status === "InReview").length;
    const drafts = reports.filter((r) => r.status === "Rejected").length;
    return { total, published, pending, drafts };
  }, [reports]);

  const statCards = [
    { icon: FileText, label: t("total"), value: stats.total, color: "text-offwhite", bg: "bg-white/5" },
    { icon: CheckCircle2, label: t("published"), value: stats.published, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Clock, label: t("pending"), value: stats.pending, color: "text-gold", bg: "bg-gold/10" },
    { icon: AlertTriangle, label: t("rejected"), value: stats.drafts, color: "text-crimson-light", bg: "bg-crimson/10" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.06)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,175,55,0.03)_0%,_transparent_60%)]" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-offwhite tracking-tight"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-sm md:text-base text-slate-body/80 max-w-xl leading-relaxed"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <Button
              asChild
              variant="crimson"
              size="lg"
              className="gap-2 px-6 shadow-lg shadow-crimson/20 hover:shadow-crimson/30"
            >
              <Link href="/reports/new">
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">{t("newReport")}</span>
                <span className="sm:hidden">{t("new")}</span>
              </Link>
            </Button>
          </motion.div>
        </div>

        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.06, ease: "easeOut" }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-white/[0.04] p-3.5",
                  stat.bg,
                  "backdrop-blur-sm transition-colors hover:border-white/[0.08]",
                )}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-offwhite tabular-nums leading-none">{stat.value}</p>
                  <p className="text-xs text-slate-body/70 mt-0.5 truncate">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
