"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, Image, Video, FileArchive } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatItem) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-xl glass-light p-4 border border-white/[0.06] transition-all duration-300 hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${color} shadow-lg shrink-0`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-body">{label}</p>
          <p className="text-xl font-bold tracking-tight text-offwhite tabular-nums">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface DocumentQuickStatsProps {
  totalCount: number;
  typeCounts: { images: number; videos: number; documents: number };
}

export function DocumentQuickStats({ totalCount, typeCounts }: DocumentQuickStatsProps) {
  const t = useTranslations("admin");
  const items: StatItem[] = [
    { label: t("totalDocuments") || "Total Documents", value: totalCount, icon: FileText, color: "bg-gradient-to-br from-crimson to-crimson-light" },
    { label: t("images") || "Images", value: typeCounts.images, icon: Image, color: "bg-gradient-to-br from-emerald-500 to-emerald-400" },
    { label: t("videos") || "Videos", value: typeCounts.videos, icon: Video, color: "bg-gradient-to-br from-blue-500 to-blue-400" },
    { label: t("files") || "Files", value: typeCounts.documents, icon: FileArchive, color: "bg-gradient-to-br from-amber-500 to-amber-400" },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {items.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
