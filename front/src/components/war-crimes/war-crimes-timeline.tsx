"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getImageUploadUrl } from "@/utils/imageUrl";
import type { DeepPartial, reportSchema } from "@/types/declarations";

interface WarCrimesTimelineProps {
  reports: DeepPartial<reportSchema>[];
  locale: string;
}

function getFirstImage(report: DeepPartial<reportSchema>): string | null {
  const docs = (report as { documents?: Array<{ documentFiles?: Array<{ name: string; mimeType: string; type: string }> }> }).documents;
  if (!docs) return null;
  for (const doc of docs) {
    for (const file of doc.documentFiles ?? []) {
      if (file.mimeType?.startsWith("image/") && file.name) {
        return getImageUploadUrl(file.name, (file.type as "image" | "video" | "docs") || "image");
      }
    }
  }
  return null;
}

export function WarCrimesTimeline({ reports, locale }: WarCrimesTimelineProps) {
  const t = useTranslations("warCrimes");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const timelineReports = reports
    .filter((r) => r.crime_occurred_at || r.createdAt)
    .sort((a, b) => {
      const dateA = new Date((a.crime_occurred_at || a.createdAt) as unknown as string).getTime();
      const dateB = new Date((b.crime_occurred_at || b.createdAt) as unknown as string).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (timelineReports.length === 0) {
    return (
      <EmptyState
        title={t("noResults")}
        description={t("noResultsDescription")}
        className="py-16"
      />
    );
  }

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const formatYear = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white/5 rounded-lg p-1.5">
            <Calendar className="h-4 w-4 text-gold" />
          </div>
          <h2 className="text-lg font-semibold text-slate-body">
            {t.has("timeline") ? t("timeline") : "Timeline of Events"}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSort}
          className="gap-2 rounded-xl border-white/10 bg-white/5 text-slate-body hover:bg-white/10 hover:text-offwhite"
        >
          {sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
          {sortOrder === "desc"
            ? t.has("newestFirst") ? t("newestFirst") : "Newest First"
            : t.has("oldestFirst") ? t("oldestFirst") : "Oldest First"}
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 start-[19px] md:start-[27px] w-[2px] bg-gradient-to-b from-crimson/40 via-white/[0.06] to-transparent" />

        {timelineReports.map((report, index) => {
          const date = new Date((report.crime_occurred_at || report.createdAt) as unknown as string);
          const formattedDate = formatDate(String(report.crime_occurred_at || report.createdAt));
          const year = formatYear(String(report.crime_occurred_at || report.createdAt));
          const imageUrl = getFirstImage(report);
          const isLast = index === timelineReports.length - 1;

          return (
            <div
              key={report._id}
              className="relative flex items-start gap-4 md:gap-6 mb-6 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex flex-col items-center shrink-0">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-background border-2 border-white/[0.08] shadow-sm flex items-center justify-center transition-all duration-300 group-hover:border-crimson/40 group-hover:shadow-lg group-hover:shadow-crimson/10">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-crimson rounded-full transition-transform duration-300 group-hover:scale-125" />
                </div>
                {/* Year badge */}
                {year && (
                  <span className="text-[10px] font-bold text-slate-body/40 mt-1">{year}</span>
                )}
              </div>

              {/* Event card */}
              <div className={`flex-1 min-w-0 ${!isLast ? "pb-2" : ""}`}>
                <Link href={`/${locale}/reports/${report._id}`} className="block">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] glass-card overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-crimson/5">
                    <div className="flex flex-col sm:flex-row rtl:sm:flex-row-reverse">
                      {/* Image thumbnail */}
                      {imageUrl && (
                        <div className="relative h-32 sm:h-auto sm:w-40 shrink-0 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={report.title || ""}
                            fill
                            unoptimized
                            sizes="160px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50 sm:bg-gradient-to-l rtl:bg-gradient-to-l" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 p-4">
                        {/* Date + location */}
                        <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-slate-body/50">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-crimson/60" />
                            <time dateTime={date.toISOString()}>{formattedDate}</time>
                          </div>
                          {report.address && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[180px]">{report.address}</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-offwhite leading-tight mb-1.5 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                          {report.title}
                        </h3>

                        {/* Description */}
                        {report.description && (
                          <div
                            className="text-sm text-slate-body/60 line-clamp-2 mb-3 leading-relaxed prose prose-invert prose-sm max-w-none prose-p:m-0 prose-p:inline prose-headings:inline prose-headings:text-sm prose-strong:text-slate-body/60 prose-a:text-crimson-light"
                            dangerouslySetInnerHTML={{ __html: report.description }}
                          />
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          {report.category && (
                            <Badge
                              variant="outline"
                              className="text-xs border-white/10 bg-white/5 text-slate-body"
                              style={{ borderColor: report.category.color ? `${report.category.color}40` : undefined }}
                            >
                              {report.category.name}
                            </Badge>
                          )}
                          {report.priority && (
                            <Badge className={`text-xs ${
                              report.priority === "High" ? "bg-crimson/10 text-crimson-light border-crimson/20" :
                              report.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>
                              {report.priority}
                            </Badge>
                          )}
                          <div className="ms-auto flex items-center gap-1 text-xs text-crimson/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span>View</span>
                            <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
