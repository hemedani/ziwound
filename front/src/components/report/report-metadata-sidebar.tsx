"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  User,
  Hash,
  MapPin,
  Calendar,
  Clock,
  Languages,
  FileText,
  Fingerprint,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface ReportMetadataSidebarProps {
  report: {
    _id?: string;
    status: string;
    priority?: string;
    category?: { _id?: string; name?: string; color?: string; icon?: string };
    tags?: Array<{ _id?: string; name?: string; color?: string; icon?: string }>;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    selected_language?: string;
    location?: { coordinates?: number[] };
    reporter?: {
      _id?: string;
      first_name: string;
      last_name: string;
      level: string;
      email?: string;
      is_verified: boolean;
      avatar?: { name: string; type: string };
      province?: { name?: string };
      city?: { name?: string };
    };
  };
  translations: {
    reporter: string;
    verified: string;
    reportDetails: string;
    reportId: string;
    submittedAt: string;
    lastUpdated: string;
    reportLanguage: string;
    category: string;
    priority: string;
    status: string;
    coordinates: string;
    tags: string;
    statusApproved: string;
    statusPending: string;
    statusRejected: string;
    statusInReview: string;
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
  };
  languageNames: Record<string, string>;
}

const statusConfig: Record<string, { classes: string; icon: typeof FileText }> = {
  Pending: { classes: "bg-gold/10 text-gold border-gold/20", icon: Clock },
  Approved: { classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  Rejected: { classes: "bg-crimson/10 text-crimson-light border-crimson/20", icon: XCircle },
  InReview: { classes: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Eye },
};

const priorityConfig: Record<string, { classes: string; icon: typeof AlertTriangle }> = {
  High: { classes: "bg-crimson/10 text-crimson-light border-crimson/20", icon: AlertTriangle },
  Medium: { classes: "bg-gold/10 text-gold border-gold/20", icon: AlertTriangle },
  Low: { classes: "bg-white/5 text-slate-body border-white/10", icon: AlertTriangle },
};

function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  try {
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  } catch {
    return "";
  }
}

function getStatusLabel(status: string, t: ReportMetadataSidebarProps["translations"]): string {
  const map: Record<string, string> = {
    Approved: t.statusApproved,
    Pending: t.statusPending,
    Rejected: t.statusRejected,
    InReview: t.statusInReview,
  };
  return map[status] || status;
}

function getPriorityLabel(priority: string, t: ReportMetadataSidebarProps["translations"]): string {
  const map: Record<string, string> = {
    High: t.priorityHigh,
    Medium: t.priorityMedium,
    Low: t.priorityLow,
  };
  return map[priority] || priority;
}

export function ReportMetadataSidebar({
  report,
  translations: t,
  languageNames,
}: ReportMetadataSidebarProps) {
  const status = statusConfig[report.status] || statusConfig.Pending;
  const priority = report.priority ? priorityConfig[report.priority] || priorityConfig.Low : null;
  const StatusIcon = status.icon;
  const PriorityIcon = priority?.icon;

  return (
    <div className="space-y-5">
      {/* Reporter Info */}
      {report.reporter && (
        <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-gold" />
            <h3 className="font-semibold text-offwhite text-sm">{t.reporter}</h3>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
              {report.reporter.avatar ? (
                <Image
                  src={getImageUploadUrl(report.reporter.avatar.name, report.reporter.avatar.type as "image" | "video" | "docs")}
                  alt={`${report.reporter.first_name} ${report.reporter.last_name}`}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-body/50" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-offwhite text-sm truncate">
                {report.reporter.first_name} {report.reporter.last_name}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-body/60">
                <span className="capitalize">{report.reporter.level}</span>
                {report.reporter.is_verified && (
                  <span className="inline-flex items-center gap-0.5 text-emerald-400">
                    <Shield className="h-3 w-3" />
                    {t.verified}
                  </span>
                )}
              </div>
            </div>
          </div>
          {report.reporter.email && (
            <p className="text-xs text-slate-body/60 break-all">{report.reporter.email}</p>
          )}
          {(report.reporter.province || report.reporter.city) && (
            <div className="text-xs text-slate-body/60 mt-2 flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-gold/60" />
              {[report.reporter.city?.name, report.reporter.province?.name]
                .filter(Boolean)
                .join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Report Metadata */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-4 w-4 text-gold" />
          <h3 className="font-semibold text-offwhite text-sm">{t.reportDetails}</h3>
        </div>
        <div className="space-y-4">
          {report._id && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">
                {t.reportId}
              </p>
              <div className="flex items-center gap-2">
                <Fingerprint className="h-3 w-3 text-slate-body/40 shrink-0" />
                <p className="text-xs font-mono text-slate-body/70 break-all">{report._id}</p>
              </div>
            </div>
          )}

          {report.createdAt && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">
                {t.submittedAt}
              </p>
              <p className="text-xs text-slate-body/70 flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-gold/60 shrink-0" />
                {formatDate(report.createdAt)}
              </p>
            </div>
          )}

          {report.updatedAt && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">
                {t.lastUpdated}
              </p>
              <p className="text-xs text-slate-body/70 flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-gold/60 shrink-0" />
                {formatDate(report.updatedAt)}
              </p>
            </div>
          )}

          {report.selected_language && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">
                {t.reportLanguage}
              </p>
              <p className="text-xs text-slate-body/70 flex items-center gap-1.5">
                <Languages className="h-3 w-3 text-gold/60 shrink-0" />
                {languageNames[report.selected_language] || report.selected_language}
              </p>
            </div>
          )}

          {report.category && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">
                {t.category}
              </p>
              <Link href={`/war-crimes?categoryId=${report.category._id}`}>
                <p className="text-xs text-slate-body/70 flex items-center gap-1.5 hover:text-gold transition-colors cursor-pointer">
                  <FileText className="h-3 w-3 text-gold/60 shrink-0" />
                  {report.category.name}
                  <ExternalLink className="h-2.5 w-2.5 text-slate-body/30" />
                </p>
              </Link>
            </div>
          )}

          {report.priority && priority && PriorityIcon && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">
                {t.priority}
              </p>
              <Badge
                variant="outline"
                className={cn("text-xs gap-1", priority.classes)}
              >
                <PriorityIcon className="h-3 w-3" />
                {getPriorityLabel(report.priority, t)}
              </Badge>
            </div>
          )}

          {report.status && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">
                {t.status}
              </p>
              <Badge
                variant="outline"
                className={cn("text-xs gap-1", status.classes)}
              >
                <StatusIcon className="h-3 w-3" />
                {getStatusLabel(report.status, t)}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {report.tags && report.tags.length > 0 && (
        <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold text-xs">●</span>
            <h3 className="font-semibold text-offwhite text-sm">{t.tags}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.tags.map((tag) => (
              <Link key={tag._id} href={`/war-crimes?tagIds=${tag._id}`}>
                <Badge
                  variant="outline"
                  className="bg-white/5 text-slate-body border-white/10 hover:bg-white/10 hover:text-offwhite cursor-pointer transition-colors gap-1.5 text-xs"
                >
                  {tag.icon && <span>{tag.icon}</span>}
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: tag.color || "#cbd5e1" }}
                  />
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Coordinates */}
      {report.location?.coordinates && (
        <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-crimson" />
            <h3 className="font-semibold text-offwhite text-sm">{t.coordinates}</h3>
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-body/70">
            <p className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-slate-body/40 w-8">Lat</span>
              <span className="text-offwhite">{report.location.coordinates[1]}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-slate-body/40 w-8">Lng</span>
              <span className="text-offwhite">{report.location.coordinates[0]}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
