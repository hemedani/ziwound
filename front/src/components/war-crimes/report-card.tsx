"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUploadUrl } from "@/utils/imageUrl";
import type { DeepPartial, reportSchema } from "@/types/declarations";
import dynamic from "next/dynamic";

// Lazy-load mini map for performance — only renders when needed in cards
const ReportLocationMiniMap = dynamic(
  () => import("@/components/map/report-location-mini-map").then((mod) => mod.ReportLocationMiniMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-background flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-crimson/30 border-t-crimson animate-spin" />
      </div>
    ),
  },
);

interface ReportCardProps {
  report: DeepPartial<reportSchema>;
  locale: string;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; labelKey: string }> = {
  Approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", labelKey: "status.approved" },
  Pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", labelKey: "status.pending" },
  Rejected: { bg: "bg-crimson/10", text: "text-crimson-light", border: "border-crimson/20", labelKey: "status.rejected" },
  InReview: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", labelKey: "status.inReview" },
};

const priorityConfig: Record<string, { bg: string; text: string; border: string; dot: string; labelKey: string }> = {
  High: { bg: "bg-crimson/10", text: "text-crimson-light", border: "border-crimson/20", dot: "bg-crimson-light", labelKey: "priority.high" },
  Medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400", labelKey: "priority.medium" },
  Low: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400", labelKey: "priority.low" },
};

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

function formatDate(dateStr: string | undefined, locale: string): string {
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
}

export function ReportCard({ report, locale }: ReportCardProps) {
  const t = useTranslations("warCrimes");
  const imageUrl = getFirstImage(report);
  const status = report.status || "Pending";
  const priority = report.priority || "Low";
  const statusCfg = statusConfig[status] || statusConfig.Pending;
  const priorityCfg = priorityConfig[priority] || priorityConfig.Low;

  const hostileCountries = (report as { hostileCountries?: Array<{ _id?: string; name?: string }> }).hostileCountries || [];
  const attackedCountries = (report as { attackedCountries?: Array<{ _id?: string; name?: string }> }).attackedCountries || [];
  const attackedProvinces = (report as { attackedProvinces?: Array<{ _id?: string; name?: string }> }).attackedProvinces || [];
  const attackedCities = (report as { attackedCities?: Array<{ _id?: string; name?: string }> }).attackedCities || [];

  const href = `/${locale}/reports/${report._id}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-crimson/5"
    >
      {/* Image / Placeholder */}
      <div className="relative h-48 w-full overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={report.title || ""}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </>
        ) : report.location?.coordinates && report.location.coordinates.length >= 2 ? (
          // Embedded mini map with neon marker — replaces generic placeholder
          <div className="absolute inset-0">
            <ReportLocationMiniMap
              latitude={report.location.coordinates[1] as number}
              longitude={report.location.coordinates[0] as number}
              variant="card"
              height="h-full"
              className="rounded-none border-0"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-crimson/[0.04] via-white/[0.01] to-background">
            {/* Subtle grid pattern as fallback when no image or location */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-10 w-10 text-white/[0.06]" />
            </div>
          </div>
        )}

        {/* Status + Priority badges */}
        <div className="absolute start-3 top-3 flex gap-1.5">
          <Badge className={`${statusCfg.bg} ${statusCfg.text} ${statusCfg.border} backdrop-blur-md`}>
            {t(statusCfg.labelKey)}
          </Badge>
        </div>

        {/* Priority dot */}
        <div className="absolute end-3 top-3">
          <Badge className={`${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border} backdrop-blur-md gap-1.5`}>
            <span className={`h-1.5 w-1.5 rounded-full ${priorityCfg.dot}`} />
            {t(priorityCfg.labelKey)}
          </Badge>
        </div>

        {/* Title overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-bold text-offwhite leading-tight line-clamp-2 group-hover:text-gold transition-colors duration-300">
            {report.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Description */}
        {report.description && (
          <div
            className="text-sm text-slate-body/70 line-clamp-2 leading-relaxed mb-3 prose prose-invert prose-sm max-w-none prose-p:m-0 prose-p:inline prose-headings:inline prose-headings:text-sm prose-strong:text-slate-body/70 prose-a:text-crimson-light"
            dangerouslySetInnerHTML={{ __html: report.description }}
          />
        )}

        {/* Category */}
        {report.category && (
          <div className="mb-3">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/5 text-slate-body text-xs"
              style={{ borderColor: report.category.color ? `${report.category.color}40` : undefined }}
            >
              {report.category.name}
            </Badge>
          </div>
        )}

        {/* Location badges */}
        {(hostileCountries.length > 0 || attackedCountries.length > 0 || attackedProvinces.length > 0 || attackedCities.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hostileCountries.slice(0, 2).map((c) => (
              <Badge key={c._id} className="bg-crimson/10 text-crimson-light border-crimson/20 text-xs">
                <MapPin className="h-3 w-3 me-1" />
                {c.name}
              </Badge>
            ))}
            {attackedCountries.slice(0, 2).map((c) => (
              <Badge key={c._id} className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                <MapPin className="h-3 w-3 me-1" />
                {c.name}
              </Badge>
            ))}
            {attackedCities.slice(0, 1).map((c) => (
              <Badge key={c._id} className="bg-white/5 text-slate-body border-white/10 text-xs">
                {c.name}
              </Badge>
            ))}
            {(hostileCountries.length + attackedCountries.length + attackedCities.length) > 5 && (
              <Badge variant="outline" className="text-xs border-white/10 bg-white/5 text-slate-body">
                +{(hostileCountries.length + attackedCountries.length + attackedCities.length) - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Tags */}
        {report.tags && report.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {report.tags.slice(0, 3).map((tag) => (
              <Badge key={tag._id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {report.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-white/10 bg-white/5 text-slate-body">
                +{report.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer: date + CTA */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 text-xs text-slate-body/50">
            {report.crime_occurred_at && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={String(report.crime_occurred_at)}>
                  {formatDate(String(report.crime_occurred_at), locale)}
                </time>
              </div>
            )}
            {report.address && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{report.address}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm font-medium text-crimson opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="text-xs">{t("view")}</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
