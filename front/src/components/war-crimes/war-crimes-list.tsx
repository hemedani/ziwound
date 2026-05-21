"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ReportCard } from "./report-card";
import type { DeepPartial, reportSchema } from "@/types/declarations";

interface WarCrimesListProps {
  reports: DeepPartial<reportSchema>[];
  locale: string;
  page: number;
  totalPages: number;
  view: string;
}

export function WarCrimesList({
  reports,
  locale,
  page,
  totalPages,
  view,
}: WarCrimesListProps) {
  const t = useTranslations("warCrimes");

  if (reports.length === 0) {
    return (
      <EmptyState
        title={t("noResults")}
        description={t("noResultsDescription")}
        className="py-16"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Report grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report, index) => (
          <div
            key={report._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
          >
            <ReportCard report={report} locale={locale} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            asChild={page > 1}
            className="rounded-xl border-white/10 bg-white/5 text-offwhite hover:bg-white/10 disabled:opacity-40"
          >
            {page > 1 ? (
              <Link href={`/${locale}/war-crimes?page=${page - 1}&view=${view}`}>
                <ArrowLeft className="h-4 w-4 me-1.5" />
                {t("previous")}
              </Link>
            ) : (
              <span>{t("previous")}</span>
            )}
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <span key={p} className="flex items-center">
                    {showEllipsis && <span className="text-xs text-slate-body/40 px-1">...</span>}
                    {p === page ? (
                      <span className="h-9 w-9 flex items-center justify-center rounded-xl bg-crimson/20 text-crimson-light text-sm font-semibold border border-crimson/30">
                        {p}
                      </span>
                    ) : (
                      <Link
                        href={`/${locale}/war-crimes?page=${p}&view=${view}`}
                        className="h-9 w-9 flex items-center justify-center rounded-xl text-sm text-slate-body/60 hover:text-offwhite hover:bg-white/5 transition-colors"
                      >
                        {p}
                      </Link>
                    )}
                  </span>
                );
              })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            asChild={page < totalPages}
            className="rounded-xl border-white/10 bg-white/5 text-offwhite hover:bg-white/10 disabled:opacity-40"
          >
            {page < totalPages ? (
              <Link href={`/${locale}/war-crimes?page=${page + 1}&view=${view}`}>
                {t("next")}
                <ArrowRight className="h-4 w-4 ms-1.5" />
              </Link>
            ) : (
              <span>{t("next")}</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
