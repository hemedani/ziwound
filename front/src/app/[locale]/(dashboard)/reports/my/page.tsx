"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gets as getReports } from "@/app/actions/report/gets";
import { FileText, Plus, Calendar, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { reportSchema } from "@/types/declarations";
import { cn } from "@/lib/utils";

type Report = Omit<reportSchema, "createdAt"> & {
  _id: string;
  createdAt: string;
};

export default function MyReportsPage() {
  const t = useTranslations("report");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getReports(
          { page, limit: 10 },
          {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            priority: 1,
            createdAt: 1,
          },
        );
        if (result.success && result.body) {
          const fetchedReports = Array.isArray(result.body) ? result.body : result.body.list || [];
          setReports(fetchedReports);
          setTotalPages(result.body.totalPages || 1);
        } else {
          setError(result.error || result.body?.message || "Failed to fetch reports");
        }
      } catch (err: unknown) {
        setError((err as Error).message || "An unexpected error occurred");
      }
      setLoading(false);
    };

    fetchReports();
  }, [page, statusFilter]);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gold/10 text-gold border-gold/20";
      case "Approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Rejected":
        return "bg-crimson/10 text-crimson-light border-crimson/20";
      case "InReview":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-white/5 text-slate-body border-white/10";
    }
  };

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-crimson/10 text-crimson-light border-crimson/20";
      case "Medium":
        return "bg-gold/10 text-gold border-gold/20";
      case "Low":
        return "bg-white/5 text-slate-body border-white/10";
      default:
        return "bg-white/5 text-slate-body border-white/10";
    }
  };

  const filteredReports =
    statusFilter === "all" ? reports : reports.filter((r) => r.status === statusFilter);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mt-12 rounded-2xl glass-strong border border-crimson/20 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-crimson" />
          <h2 className="text-xl font-bold text-offwhite mb-2">{t("common.error") || "Error"}</h2>
          <p className="text-slate-body mb-6">{error}</p>
          <Button
            onClick={() => {
              setPage(1);
              setStatusFilter("all");
              setError(null);
            }}
            className="bg-crimson hover:bg-crimson-light text-white"
          >
            {t("common.retry") || "Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 bg-white/5" />
            <Skeleton className="h-4 w-64 bg-white/5" />
          </div>
          <Skeleton className="h-10 w-32 bg-white/5" />
        </div>
        <div className="mb-6 rounded-2xl glass-light p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24 bg-white/5" />
            <Skeleton className="h-10 w-[200px] bg-white/5" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass-light p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="mb-2 flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
                    <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
                  </div>
                  <Skeleton className="h-6 w-3/4 bg-white/5" />
                  <Skeleton className="h-4 w-full bg-white/5" />
                </div>
                <Skeleton className="h-4 w-24 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-offwhite">{t("myReports")}</h1>
          <p className="text-slate-body mt-1">{t("myReportsDescription")}</p>
        </div>
        <Button asChild className="bg-crimson hover:bg-crimson-light text-white gap-2">
          <Link href="/reports/new">
            <Plus className="h-4 w-4" />
            {t("newReport")}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl glass-light p-5">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-offwhite">{t("filterByStatus")}:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("allStatuses")}</SelectItem>
              <SelectItem value="Pending" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("statusPending")}</SelectItem>
              <SelectItem value="InReview" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("statusInReview")}</SelectItem>
              <SelectItem value="Approved" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("statusApproved")}</SelectItem>
              <SelectItem value="Rejected" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("statusRejected")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="rounded-2xl glass-light p-12 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-slate-body/40" />
          <h2 className="text-xl font-bold text-offwhite mb-2">{t("noReports")}</h2>
          <p className="text-slate-body mb-6">{t("noReportsDescription")}</p>
          <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
            <Link href="/reports/new">{t("createFirstReport")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="rounded-2xl glass-light p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.04] group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {report.status && (
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-medium", getStatusClasses(report.status))}
                      >
                        {t(`status${report.status}`)}
                      </Badge>
                    )}
                    {report.priority && (
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-medium", getPriorityClasses(report.priority))}
                      >
                        {t(`priority${report.priority}`)}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-offwhite group-hover:text-gold transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-slate-body line-clamp-2 mt-1">
                    {report.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-body shrink-0">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(report.createdAt), "MMM dd, yyyy")}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
                >
                  <Link href={`/reports/${report._id}`}>{t("viewDetails")}</Link>
                </Button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("previous")}
              </Button>
              <span className="text-sm text-slate-body">
                {t("pageOf", { current: page, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
              >
                {t("next")}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
