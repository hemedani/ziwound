"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit3,
  Check,
  X,
  Trash2,
  MoreHorizontal,
  MapPin,
  FileText,
  Calendar,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LocationItem {
  _id: string;
  name: string;
}

interface ReportItem {
  _id: string;
  title: string;
  status?: string;
  priority?: string;
  description?: string;
  selected_language?: string;
  hostileCountries?: LocationItem[];
  attackedCountries?: LocationItem[];
  attackedProvinces?: LocationItem[];
  attackedCities?: LocationItem[];
  crime_occurred_at?: string;
  createdAt?: string;
  category?: { _id: string; name: string };
  tags?: { _id: string; name: string }[];
  documents?: { _id: string; title: string }[];
}

interface ReportCardProps {
  report: ReportItem;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  index?: number;
}

const statusConfig: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-crimson/10 text-crimson-light border-crimson/20",
  InReview: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const priorityConfig: Record<string, string> = {
  High: "bg-crimson/10 text-crimson-light border-crimson/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function ReportCard({ report, onDelete, onApprove, onReject, index = 0 }: ReportCardProps) {
  const t = useTranslations("admin");

  const locations = [
    ...(report.attackedProvinces || []).slice(0, 2),
    ...(report.attackedCities || []).slice(0, 1),
  ];

  const statusClasses = statusConfig[report.status || ""] || "bg-white/5 text-slate-body border-white/10";
  const priorityClasses = priorityConfig[report.priority || ""] || "bg-white/5 text-slate-body border-white/10";
  const statusKey = (report.status || "").toLowerCase();
  const priorityKey = (report.priority || "").toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group relative rounded-2xl glass-strong border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Header gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-crimson/[0.03] to-transparent pointer-events-none" />

      <div className="relative p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link
            href={`/admin/reports/${report._id}`}
            className="font-semibold text-offwhite text-sm hover:text-crimson-light transition-colors line-clamp-2 flex-1 min-w-0"
          >
            {report.title || "—"}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0 text-slate-body hover:text-offwhite hover:bg-white/5 shrink-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong border-white/10 min-w-[150px]">
              <DropdownMenuLabel className="text-slate-body text-xs">{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                <Link href={`/admin/reports/${report._id}`} className="flex items-center">
                  <Eye className="me-2 h-4 w-4 text-gold" />
                  {t("viewDetails")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                <Link href={`/admin/reports/${report._id}/edit`} className="flex items-center">
                  <Edit3 className="me-2 h-4 w-4 text-blue-400" />
                  {t("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={() => onApprove(report._id)} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                <Check className="me-2 h-4 w-4 text-emerald-400" />
                {t("approve")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReject(report._id)} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                <X className="me-2 h-4 w-4 text-crimson-light" />
                {t("reject")}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={() => onDelete(report._id)} className="text-crimson-light focus:bg-white/10 focus:text-crimson-light cursor-pointer">
                <Trash2 className="me-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {report.status && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${statusClasses}`}>
              {t(`status_${statusKey}`)}
            </span>
          )}
          {report.priority && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${priorityClasses}`}>
              {t(`priority_${priorityKey}`)}
            </span>
          )}
        </div>

        {/* Category + Language */}
        {(report.category || report.selected_language) && (
          <div className="flex items-center gap-3 text-xs text-slate-body/70 mb-2">
            {report.category && (
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {report.category.name}
              </span>
            )}
            {report.selected_language && (
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {report.selected_language.toUpperCase()}
              </span>
            )}
          </div>
        )}

        {/* Location chips */}
        {locations.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {locations.map((loc) => (
              <span
                key={loc._id}
                className="inline-flex items-center gap-0.5 rounded-md bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-slate-body border border-white/[0.04]"
              >
                <MapPin className="h-2.5 w-2.5" />
                {loc.name}
              </span>
            ))}
            {(report.attackedProvinces || []).length +
              (report.attackedCities || []).length >
              locations.length && (
              <span className="text-[10px] text-slate-body/50">
                +{(report.attackedProvinces || []).length +
                  (report.attackedCities || []).length -
                  locations.length}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        {report.createdAt && (
          <div className="flex items-center gap-1 text-[11px] text-slate-body/60">
            <Calendar className="h-3 w-3" />
            {new Date(report.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
