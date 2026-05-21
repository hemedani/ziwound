"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";

interface ReportHeroProps {
  report: {
    _id?: string;
    title: string;
    status: string;
    priority?: string;
    category?: { _id?: string; name?: string; color?: string; icon?: string };
    createdAt?: Date | string;
    crime_occurred_at?: Date | string;
    selected_language?: string;
  };
  confirmationsCount: number;
  locale: string;
  translations: {
    backToReports: string;
    statusApproved: string;
    statusPending: string;
    statusRejected: string;
    statusInReview: string;
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
    confirmations: string;
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

function getStatusLabel(status: string, translations: ReportHeroProps["translations"]): string {
  const map: Record<string, string> = {
    Approved: translations.statusApproved,
    Pending: translations.statusPending,
    Rejected: translations.statusRejected,
    InReview: translations.statusInReview,
  };
  return map[status] || status;
}

function getPriorityLabel(priority: string, translations: ReportHeroProps["translations"]): string {
  const map: Record<string, string> = {
    High: translations.priorityHigh,
    Medium: translations.priorityMedium,
    Low: translations.priorityLow,
  };
  return map[priority] || priority;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  try {
    return format(new Date(date), "MMM dd, yyyy");
  } catch {
    return "";
  }
}

export function ReportHero({
  report,
  confirmationsCount,
  translations,
  languageNames,
}: ReportHeroProps) {
  const status = statusConfig[report.status] || statusConfig.Pending;
  const priority = report.priority ? priorityConfig[report.priority] || priorityConfig.Low : null;
  const StatusIcon = status.icon;
  const PriorityIcon = priority?.icon;

  return (
    <>
      {/* Back button */}
      <div className="container mx-auto max-w-7xl px-4 pt-6">
        <Button
          variant="ghost"
          asChild
          className="text-slate-body/70 hover:text-offwhite hover:bg-white/5 -ms-2 transition-colors"
        >
          <Link href="/reports/my" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {translations.backToReports}
          </Link>
        </Button>
      </div>

      {/* Hero Header */}
      <div className="relative pt-8 pb-12 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.10)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

        <div className="container mx-auto max-w-7xl px-4 relative">
          {/* Badges row */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-sm gap-1.5 px-2.5 py-1", status.classes)}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {getStatusLabel(report.status, translations)}
            </Badge>

            {report.priority && priority && PriorityIcon && (
              <Badge
                variant="outline"
                className={cn("text-sm gap-1.5 px-2.5 py-1", priority.classes)}
              >
                <PriorityIcon className="h-3.5 w-3.5" />
                {getPriorityLabel(report.priority, translations)}
              </Badge>
            )}

            {report.category && (
              <Link href={`/war-crimes?categoryId=${report.category._id}`}>
                <Badge
                  variant="outline"
                  className="text-sm gap-1.5 px-2.5 py-1 bg-white/5 text-slate-body border-white/10 hover:bg-white/10 hover:text-offwhite cursor-pointer transition-colors"
                >
                  {report.category.icon && <span>{report.category.icon}</span>}
                  {report.category.name}
                </Badge>
              </Link>
            )}

            <Badge
              variant="outline"
              className="text-sm gap-1.5 px-2.5 py-1 bg-gold/10 text-gold border-gold/20"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {confirmationsCount} {translations.confirmations}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-5 leading-[1.15] tracking-tight max-w-5xl">
            {report.title}
          </h1>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-body/70">
            {report.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold/70" />
                {formatDate(report.createdAt)}
              </span>
            )}
            {report.crime_occurred_at && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-crimson/70" />
                {formatDate(report.crime_occurred_at)}
              </span>
            )}
            {report.selected_language && (
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-gold/70" />
                {languageNames[report.selected_language] || report.selected_language}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
