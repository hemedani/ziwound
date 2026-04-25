"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { DeepPartial, reportSchema } from "@/types/declarations";

interface WarCrimesMapProps {
  reports: DeepPartial<reportSchema>[];
  locale: string;
}

function WarCrimesMapInner({ reports, locale }: WarCrimesMapProps) {
  const t = useTranslations("warCrimes");

  const reportsWithLocation = reports.filter(
    (r) => r.location?.coordinates && r.location.coordinates.length >= 2
  );

  if (reportsWithLocation.length === 0) {
    return (
      <div className="text-center py-20 border rounded-lg bg-muted/20">
        <p className="text-xl text-muted-foreground mb-2">
          {t("noResults")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("noResultsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden border">
      <div className="absolute top-4 start-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
        <p>{reportsWithLocation.length} reports with location data</p>
      </div>
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            {reportsWithLocation.length} {t("totalReports").toLowerCase()} {t("withLocation")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {reportsWithLocation.slice(0, 8).map((report) => (
              <a
                key={report._id}
                href={`/${locale}/reports/${report._id}`}
                className="block p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <h4 className="font-medium text-sm line-clamp-1">{report.title}</h4>
                {report.address && (
                  <p className="text-xs text-muted-foreground truncate">{report.address}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {report.location?.coordinates?.[1]}, {report.location?.coordinates?.[0]}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const WarCrimesMap = dynamic(
  () => Promise.resolve(WarCrimesMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-lg border bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    ),
  }
);