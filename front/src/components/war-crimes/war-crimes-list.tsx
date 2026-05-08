"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Eye, ArrowRight, ArrowLeft } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import type { DeepPartial, reportSchema } from "@/types/declarations";

const ReadonlyMap = dynamic(
  () => import("@/components/map/readonly-map").then((m) => ({ default: m.ReadonlyMap })),
  { ssr: false },
);

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
      <div className="text-center py-20 border rounded-lg bg-muted/20">
        <p className="text-xl text-muted-foreground mb-2">{t("noResults")}</p>
        <p className="text-sm text-muted-foreground">{t("noResultsDescription")}</p>
      </div>
    );
  }

  const getFirstImage = (report: DeepPartial<reportSchema>): string | null => {
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
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "destructive" as const;
      case "Medium":
        return "default" as const;
      case "Low":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const getCategoryColor = (color?: string) => {
    if (!color) return "outline" as const;
    return "outline" as const;
  };

  console.log("[WarCrimesList] reports count:", reports.length);
  if (reports[0]) {
    console.log("[WarCrimesList] first report documents:", JSON.parse(JSON.stringify(reports[0]?.documents)));
    console.log("[WarCrimesList] first report keys:", Object.keys(reports[0]));
    console.log("[WarCrimesList] first image:", getFirstImage(reports[0]));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card
            key={report._id}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            {report.location && (() => {
              const imageUrl = getFirstImage(report);
              const coords = report.location?.coordinates;

              if (imageUrl) {
                return (
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={report.title || ""}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                );
              }

              if (coords && coords.length >= 2) {
                return (
                  <div className="h-32 relative overflow-hidden">
                    <ReadonlyMap
                      latitude={coords[1] as number}
                      longitude={coords[0] as number}
                      zoom={10}
                      className="h-full w-full"
                      hideControls
                    />
                  </div>
                );
              }

              return (
                <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground/50" />
                </div>
              );
            })()}

            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {report.category && (
                  <Badge
                    style={{ backgroundColor: report.category.color || "#888" }}
                    variant={getCategoryColor(report.category.color)}
                    className="text-xs text-white"
                  >
                    {report.category.name}
                  </Badge>
                )}
                {report.priority && (
                  <Badge variant={getPriorityColor(report.priority)} className="text-xs">
                    {report.priority}
                  </Badge>
                )}
              </div>
              <CardTitle className="line-clamp-2 text-lg">
                <Link
                  href={`/${locale}/reports/${report._id}`}
                  className="hover:text-primary transition-colors"
                >
                  {report.title}
                </Link>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {report.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {report.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag._id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {report.tags && report.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{report.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString(locale)
                      : ""}
                  </span>
                </div>
                {report.address && (
                  <div className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{report.address}</span>
                  </div>
                )}
              </div>

              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <Link href={`/${locale}/reports/${report._id}`} className="gap-2">
                  <Eye className="h-4 w-4" />
                  {t("view")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        <Button variant="outline" disabled={page <= 1} asChild={page > 1}>
          {page > 1 ? (
            <Link href={`/${locale}/war-crimes?page=${page - 1}&view=${view}`}>
              <ArrowLeft className="h-4 w-4 me-2" />
              {t("previous")}
            </Link>
          ) : (
            <span>{t("previous")}</span>
          )}
        </Button>
        <span className="text-sm font-medium">
          {t("pageInfo", { page, totalPages })}
        </span>
        <Button variant="outline" disabled={page >= totalPages} asChild={page < totalPages}>
          {page < totalPages ? (
            <Link href={`/${locale}/war-crimes?page=${page + 1}&view=${view}`}>
              {t("next")}
              <ArrowRight className="h-4 w-4 ms-2" />
            </Link>
          ) : (
            <span>{t("next")}</span>
          )}
        </Button>
      </div>
    </div>
  );
}