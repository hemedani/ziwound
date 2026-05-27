"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReportBrief {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  selected_language?: string;
  crime_occurred_at?: string;
  createdAt?: string;
  address?: string;
  category?: {
    _id?: string;
    name?: string;
    color?: string;
  };
  reporter?: {
    _id?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface LinkedReportCardProps {
  report: ReportBrief;
  locale: string;
  translations: {
    linkedReport: string;
    viewFullReport: string;
    crimeOccurredAt: string;
    submittedAt: string;
    status: string;
    reporter: string;
  };
}

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  Pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  Rejected: { bg: "bg-crimson/10", text: "text-crimson-light", border: "border-crimson/20" },
  InReview: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
};

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function LinkedReportCard({
  report,
  locale,
  translations,
}: LinkedReportCardProps) {
  const status = report.status || "Pending";
  const statusCfg = statusConfig[status] || statusConfig.Pending;

  return (
    <div className="rounded-2xl glass-light p-5 md:p-6 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-white/5 rounded-lg p-1.5">
          <FileText className="h-4 w-4 text-crimson" />
        </div>
        <h3 className="text-sm font-semibold text-offwhite">{translations.linkedReport}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-base font-bold text-offwhite leading-snug line-clamp-2">
            {report.title || "Untitled Report"}
          </h4>
          <Badge className={`${statusCfg.bg} ${statusCfg.text} ${statusCfg.border} shrink-0 text-[10px] px-2 py-0.5`}>
            {translations.status}: {status}
          </Badge>
        </div>

        {report.description && (
          <div
            className="text-sm text-slate-body/70 line-clamp-3 leading-relaxed prose prose-invert prose-sm max-w-none prose-p:m-0 prose-p:inline prose-headings:inline prose-headings:text-sm prose-strong:text-slate-body/70 prose-a:text-crimson-light"
            dangerouslySetInnerHTML={{ __html: report.description }}
          />
        )}

        {report.category && (
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-body text-xs"
            style={report.category.color ? { borderColor: `${report.category.color}40` } : undefined}
          >
            {report.category.name}
          </Badge>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-body/50 pt-1">
          {report.crime_occurred_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {translations.crimeOccurredAt}: {formatDate(report.crime_occurred_at)}
            </span>
          )}
          {report.address && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {report.address}
            </span>
          )}
          {report.reporter && (
            <span className="flex items-center gap-1">
              {translations.reporter}: {report.reporter.first_name} {report.reporter.last_name}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-white/[0.04]">
          <Button
            asChild
            variant="ghost"
            className="w-full bg-crimson/10 hover:bg-crimson/20 text-crimson-light hover:text-crimson-light border border-crimson/20 transition-all"
          >
            <Link href={`/${locale}/reports/${report._id}`}>
              {translations.viewFullReport}
              <ArrowUpRight className="h-4 w-4 ms-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
