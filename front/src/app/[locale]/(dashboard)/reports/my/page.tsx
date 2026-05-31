"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ReportCard } from "@/components/war-crimes/report-card";
import { MyReportsHeader } from "@/components/reports/my-reports-header";
import { MyReportsFilters } from "@/components/reports/my-reports-filters";
import type { FilterState } from "@/components/reports/my-reports-filters";
import { MyReportsStats } from "@/components/reports/my-reports-stats";
import { gets as getReports } from "@/app/actions/report/gets";
import { remove as deleteReport } from "@/app/actions/report/remove";
import { ChevronLeft, ChevronRight, Trash2, ExternalLink, Edit3, SearchX, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeepPartial, reportSchema } from "@/types/declarations";

const PAGE_SIZE = 6;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function MyReportsPage() {
  const t = useTranslations("myReports");
  const locale = useLocale();
  const { toast } = useToast();

  const [allReports, setAllReports] = useState<DeepPartial<reportSchema>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reportId: string;
    reportTitle: string;
  }>({ open: false, reportId: "", reportTitle: "" });
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    priority: "all",
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getReports(
          { page: 1, limit: 200 },
          {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            priority: 1,
            location: 1,
            address: 1,
            crime_occurred_at: 1,
            createdAt: 1,
            category: { _id: 1, name: 1, color: 1 },
            tags: { _id: 1, name: 1, color: 1 },
            hostileCountries: { _id: 1, name: 1 },
            attackedCountries: { _id: 1, name: 1 },
            attackedProvinces: { _id: 1, name: 1 },
            attackedCities: { _id: 1, name: 1 },
            documents: {
              _id: 1,
              title: 1,
              documentFiles: { _id: 1, name: 1, mimeType: 1, type: 1 },
            },
          },
        );

        if (cancelled) return;

        if (!result.success) {
          throw new Error(result.body?.message || "Failed to fetch reports");
        }

        const body = result.body as { list?: DeepPartial<reportSchema>[] };
        const fetched = Array.isArray(body) ? body : (body.list || []);
        setAllReports(fetched);
        setPage(1);
      } catch (err: unknown) {
        if (!cancelled) {
          setError((err as Error).message || "An unexpected error occurred");
        }
      }
      if (!cancelled) setLoading(false);
    };

    fetchReports();
    return () => { cancelled = true; };
  }, [locale, retryCount]);

  const handleDelete = async () => {
    if (!deleteDialog.reportId) return;
    setDeleting(true);
    try {
      const result = await deleteReport({ _id: deleteDialog.reportId }, { _id: 1 });
      if (result.success) {
        toast({ title: t("deleteSuccess"), variant: "success" });
        setAllReports((prev) => prev.filter((r) => r._id !== deleteDialog.reportId));
        setDeleteDialog({ open: false, reportId: "", reportTitle: "" });
      } else {
        throw new Error(result.body?.message || t("deleteError"));
      }
    } catch (err: unknown) {
      toast({
        title: t("deleteError"),
        description: (err as Error).message,
        variant: "destructive",
      });
    }
    setDeleting(false);
  };

  const filteredReports = useMemo(() => {
    return allReports.filter((r) => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (
          !(r.title || "").toLowerCase().includes(q) &&
          !(r.description || "").toLowerCase().includes(q)
        ) return false;
      }
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (filters.priority !== "all" && r.priority !== filters.priority) return false;
      return true;
    });
  }, [allReports, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const paginatedReports = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.priority]);

  const isFiltered = filters.search.trim() || filters.status !== "all" || filters.priority !== "all";

  if (error) {
    return (
      <PageContainer showHeader={false}>
        <div className="max-w-lg mx-auto mt-12">
          <ErrorState
            title={t("errorTitle")}
            description={error}
            onRetry={() => setRetryCount((c) => c + 1)}
            retryText={t("retry")}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer showHeader={false}>
      <div className="space-y-6">
        {/* Hero Header */}
        <MyReportsHeader reports={allReports} loading={loading} />

        {/* Filters */}
        <MyReportsFilters filters={filters} onFilterChange={setFilters} />

        {/* Main Content */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Reports List */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.02] overflow-hidden"
                  >
                    <div className="h-48 bg-white/[0.03]" />
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2">
                        <div className="h-5 w-16 rounded-full bg-white/[0.05]" />
                        <div className="h-5 w-14 rounded-full bg-white/[0.05]" />
                      </div>
                      <div className="h-5 w-3/4 rounded bg-white/[0.05]" />
                      <div className="h-3 w-full rounded bg-white/[0.04]" />
                      <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-3 w-24 rounded bg-white/[0.04]" />
                        <div className="h-3 w-16 rounded bg-white/[0.04]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={isFiltered ? SearchX : FileText}
                  title={isFiltered ? t("noResults") : t("emptyTitle")}
                  description={isFiltered ? t("noResultsDescription") : t("emptyDescription")}
                  className="border-white/[0.06] bg-white/[0.02] min-h-[300px]"
                  action={
                    isFiltered ? undefined : (
                      <Button asChild variant="crimson">
                        <Link href="/reports/new">{t("createFirst")}</Link>
                      </Button>
                    )
                  }
                />
              </div>
            ) : (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  {paginatedReports.map((report) => (
                    <motion.div
                      key={report._id}
                      variants={cardVariants}
                      className="group relative"
                    >
                      <ReportCard report={report} locale={locale} />

                      {/* Quick Actions Overlay */}
                      <div className="absolute end-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <Link
                          href={`/reports/${report._id}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-slate-body backdrop-blur-sm hover:text-offwhite hover:border-white/20 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/reports/${report._id}/edit`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-slate-body backdrop-blur-sm hover:text-gold hover:border-gold/30 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              reportId: report._id || "",
                              reportTitle: report.title || "",
                            })
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-slate-body backdrop-blur-sm hover:text-crimson-light hover:border-crimson/30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
                  >
                    <p className="text-sm text-slate-body/60">
                      {t("showing", {
                        count: paginatedReports.length,
                        total: filteredReports.length,
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                      </Button>

                      {generatePageNumbers(page, totalPages).map((p, i) =>
                        p === "..." ? (
                          <span key={`dots-${i}`} className="px-1 text-xs text-slate-body/40">
                            ...
                          </span>
                        ) : (
                          <Button
                            key={p}
                            variant={p === page ? "crimson" : "glass"}
                            size="sm"
                            onClick={() => setPage(p as number)}
                            className={cn(
                              "h-9 w-9 p-0 text-xs font-medium",
                              p === page && "shadow-sm",
                            )}
                          >
                            {p}
                          </Button>
                        ),
                      )}

                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          {!loading && (
            <div className="w-full shrink-0 lg:w-72 xl:w-80">
              <div className="lg:sticky lg:top-24">
                <MyReportsStats reports={allReports} loading={loading} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="border-white/[0.08] bg-background/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-offwhite">{t("deleteConfirm")}</DialogTitle>
            <DialogDescription className="text-slate-body/70">
              {t("deleteWarning")}
              {deleteDialog.reportTitle && (
                <span className="mt-2 block text-sm font-medium text-offwhite">
                  &ldquo;{deleteDialog.reportTitle}&rdquo;
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="glass"
              onClick={() => setDeleteDialog({ open: false, reportId: "", reportTitle: "" })}
              disabled={deleting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2 bg-crimson hover:bg-crimson-light text-white"
            >
              {deleting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {t("deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  {t("delete")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
