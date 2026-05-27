import Link from "next/link";
import { FileText, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DeepPartial, reportSchema } from "@/types/declarations";

interface TimelineItem {
  report: DeepPartial<reportSchema>;
  date: string;
  locale: string;
}

interface ReporterActivityTimelineProps {
  items: TimelineItem[];
  emptyMessage: string;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: typeof FileText }> = {
  Approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: CheckCircle2 },
  Pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: Clock },
  Rejected: { bg: "bg-crimson/10", text: "text-crimson-light", border: "border-crimson/20", icon: XCircle },
  InReview: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", icon: Eye },
};

function formatDate(dateStr: string, locale: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ReporterActivityTimeline({ items, emptyMessage }: ReporterActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl glass-light border border-white/[0.06] p-8 text-center">
        <FileText className="h-10 w-10 text-slate-body/20 mx-auto mb-3" />
        <p className="text-slate-body/60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-light border border-white/[0.06] p-6">
      <div className="relative">
        {items.map((item, i) => {
          const status = item.report.status || "Pending";
          const cfg = statusConfig[status] || statusConfig.Pending;
          const StatusIcon = cfg.icon;
          const isLast = i === items.length - 1;

          return (
            <div key={item.report._id || i} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                  <StatusIcon className={`h-3.5 w-3.5 ${cfg.text}`} />
                </div>
                {!isLast && (
                  <div className="w-px h-full bg-white/[0.06] mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/${item.locale}/reports/${item.report._id}`}
                    className="text-sm font-semibold text-offwhite hover:text-gold transition-colors line-clamp-1"
                  >
                    {item.report.title}
                  </Link>
                  <Badge className={`${cfg.bg} ${cfg.text} ${cfg.border} text-[10px] shrink-0`}>
                    {status}
                  </Badge>
                </div>
                {item.report.description && (
                  <div
                    className="text-xs text-slate-body/50 line-clamp-1 mt-1 prose prose-invert prose-xs max-w-none prose-p:m-0 prose-p:inline prose-headings:inline prose-headings:text-xs prose-strong:text-slate-body/50 prose-a:text-crimson-light"
                    dangerouslySetInnerHTML={{ __html: item.report.description }}
                  />
                )}
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-body/40">
                  <time dateTime={item.date}>{formatDate(item.date, item.locale)}</time>
                  {item.report.address && (
                    <span className="truncate max-w-[150px]">{item.report.address}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
