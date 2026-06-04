import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

interface Report {
  _id?: string;
  title: string;
  description?: string;
  status: string;
}

interface ReportListCardProps {
  reports: Report[];
  locale: string;
  title: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Rejected: "bg-crimson/10 text-crimson-light border-crimson/20",
};

const defaultStyle = "bg-blue-500/10 text-blue-400 border-blue-500/20";

export function ReportListCard({ reports, locale, title, className }: ReportListCardProps) {
  if (reports.length === 0) return null;

  return (
    <div className={`rounded-2xl glass-light border border-white/[0.06] overflow-hidden ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
        <div className="bg-white/5 rounded-lg p-2">
          <FileText className="h-4 w-4 text-gold" />
        </div>
        <h2 className="text-lg font-semibold text-offwhite">{title}</h2>
        <span className="text-xs text-slate-body/40 ms-auto">{reports.length}</span>
      </div>

      {/* Report list */}
      <div className="divide-y divide-white/[0.04]">
        {reports.map((report) => (
          <Link
            key={report._id}
            href={`/${locale}/reports/${report._id}`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors group"
          >
            {/* Icon */}
            <div className="shrink-0 rounded-lg bg-white/[0.03] p-2 border border-white/[0.04]">
              <FileText className="h-3.5 w-3.5 text-slate-body/40 group-hover:text-crimson-light transition-colors" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-offwhite truncate group-hover:text-gold transition-colors">
                {report.title}
              </p>
              {report.description && (
                <div
                  className="text-xs text-slate-body/40 mt-0.5 line-clamp-1 prose prose-invert prose-xs max-w-none prose-p:m-0 prose-p:inline prose-headings:inline prose-headings:text-xs prose-strong:text-slate-body/40 prose-a:text-crimson-light"
                  dangerouslySetInnerHTML={{ __html: report.description }}
                />
              )}
            </div>

            {/* Status + Arrow */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium border whitespace-nowrap ${
                  statusStyles[report.status] || defaultStyle
                }`}
              >
                {report.status}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-body/20 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
