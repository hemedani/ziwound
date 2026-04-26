"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Calendar, MapPin, ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DeepPartial, reportSchema } from "@/types/declarations";

interface WarCrimesTimelineProps {
  reports: DeepPartial<reportSchema>[];
  locale: string;
}

export function WarCrimesTimeline({ reports, locale }: WarCrimesTimelineProps) {
  const t = useTranslations("warCrimes");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Filter reports that have a creation date and sort them
  const timelineReports = reports
    .filter((r) => r.crime_occurred_at || r.createdAt)
    .sort((a, b) => {
      const dateA = new Date((a.crime_occurred_at || a.createdAt) as unknown as string).getTime();
      const dateB = new Date((b.crime_occurred_at || b.createdAt) as unknown as string).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  if (timelineReports.length === 0) {
    return (
      <div className="text-center py-20 border rounded-lg bg-muted/20">
        <p className="text-xl text-muted-foreground mb-2">{t("noResults")}</p>
        <p className="text-sm text-muted-foreground">{t("noResultsDescription")}</p>
      </div>
    );
  }

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          {t.has("timeline") ? t("timeline") : "Timeline of Events"}
        </h2>
        <Button variant="outline" size="sm" onClick={toggleSort} className="gap-2">
          {sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
          {sortOrder === "desc"
            ? t.has("newestFirst")
              ? t("newestFirst")
              : "Newest First"
            : t.has("oldestFirst")
            ? t("oldestFirst")
            : "Oldest First"}
        </Button>
      </div>

      <div className="relative before:absolute before:inset-0 before:ms-[15px] md:before:ms-[23px] before:-translate-x-px before:h-full before:w-[2px] before:bg-border">
        {timelineReports.map((report, index) => {
          const date = new Date((report.crime_occurred_at || report.createdAt) as unknown as string);
          const formattedDate = date.toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const isLast = index === timelineReports.length - 1;

          return (
            <div key={report._id} className="relative flex items-start gap-4 md:gap-6 mb-8 group">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-muted border-2 border-background shadow-sm shrink-0 transition-colors group-hover:border-primary/20">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full transition-transform group-hover:scale-125" />
              </div>

              {/* Event card */}
              <div className={`flex-1 ${!isLast ? "pb-4" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    <time dateTime={date.toISOString()}>{formattedDate}</time>
                  </div>
                  {report.location?.coordinates && (
                    <>
                      <span className="hidden sm:inline text-muted-foreground/50">•</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {report.address ||
                            `${report.location.coordinates[1].toFixed(4)}, ${report.location.coordinates[0].toFixed(4)}`}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Link href={`/${locale}/reports/${report._id}`} className="block">
                  <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-xl leading-tight line-clamp-2">
                          {report.title}
                        </CardTitle>
                        <div className="flex flex-col gap-1.5 shrink-0 items-end">
                          {report.category && (
                            <Badge variant="secondary" className="whitespace-nowrap">
                              {report.category.name}
                            </Badge>
                          )}
                          {report.priority && (
                            <Badge
                              variant={
                                report.priority === "High"
                                  ? "destructive"
                                  : report.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                              }
                              className="whitespace-nowrap"
                            >
                              {report.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {report.description && (
                      <CardContent className="pt-0 pb-4">
                        <p className="text-muted-foreground line-clamp-3 text-sm">
                          {report.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
