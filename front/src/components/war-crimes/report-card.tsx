"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Calendar, MapPin, Shield, AlertTriangle, Tag, Layers } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import {
  GlassCard,
  GlassCardMedia,
  GlassCardBadge,
  GlassCardContent,
  GlassCardDescription,
  GlassCardTags,
  GlassCardFooter,
  GlassCardMeta,
  GlassCardCta,
} from "@/components/ui/glass-card";
import type { DeepPartial, reportSchema } from "@/types/declarations";
import dynamic from "next/dynamic";

// Lazy-load mini map for performance
const ReportLocationMiniMap = dynamic(
  () => import("@/components/map/report-location-mini-map").then((mod) => mod.ReportLocationMiniMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-background flex items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-crimson/30 border-t-crimson animate-spin" />
      </div>
    ),
  },
);

interface ReportCardProps {
  report: DeepPartial<reportSchema>;
  locale: string;
}

const statusConfig: Record<string, { dot: string; labelKey: string }> = {
  Approved: { dot: "bg-emerald-400", labelKey: "status.approved" },
  Pending:  { dot: "bg-amber-400",  labelKey: "status.pending" },
  Rejected: { dot: "bg-crimson-light", labelKey: "status.rejected" },
  InReview: { dot: "bg-blue-400",   labelKey: "status.inReview" },
};

const priorityConfig: Record<string, { dot: string; labelKey: string }> = {
  High:   { dot: "bg-crimson-light", labelKey: "priority.high" },
  Medium: { dot: "bg-amber-400",  labelKey: "priority.medium" },
  Low:    { dot: "bg-emerald-400", labelKey: "priority.low" },
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
  const attackedCities = (report as { attackedCities?: Array<{ _id?: string; name?: string }> }).attackedCities || [];

  const href = `/${locale}/reports/${report._id}`;

  // Build location tags — max 2 total with icons
  const locationTags: Array<{ _id?: string; name?: string; color?: string; icon?: React.ReactNode }> = [];
  if (hostileCountries.length > 0) {
    locationTags.push({
      _id: hostileCountries[0]._id,
      name: hostileCountries[0].name,
      color: "#f87171",
      icon: <Shield className="h-2.5 w-2.5" />,
    });
  } else if (attackedCountries.length > 0) {
    locationTags.push({
      _id: attackedCountries[0]._id,
      name: attackedCountries[0].name,
      color: "#fbbf24",
      icon: <AlertTriangle className="h-2.5 w-2.5" />,
    });
  }
  if (attackedCities.length > 0) {
    locationTags.push({
      _id: attackedCities[0]._id,
      name: attackedCities[0].name,
      icon: <MapPin className="h-2.5 w-2.5" />,
    });
  }

  // Report tags — max 1 with icon
  const reportTagItems = (report.tags || []).slice(0, 1).map((tag) => ({
    _id: tag._id,
    name: tag.name,
    icon: <Tag className="h-2.5 w-2.5" />,
  }));

  const allTags = [...locationTags, ...reportTagItems];

  return (
    <GlassCard href={href}>
      {/* Media Area */}
      <GlassCardMedia
        imageUrl={imageUrl}
        alt={report.title || ""}
        fallback="grid"
        height="md"
      >
        {/* Mini-map when no image but has location */}
        {!imageUrl && report.location?.coordinates && report.location.coordinates.length >= 2 && (
          <div className="absolute inset-0">
            <ReportLocationMiniMap
              latitude={report.location.coordinates[1] as number}
              longitude={report.location.coordinates[0] as number}
              variant="card"
              height="h-full"
              className="rounded-none border-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute start-3 top-3">
          <GlassCardBadge variant="custom">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
              {t(statusCfg.labelKey)}
            </span>
          </GlassCardBadge>
        </div>

        {/* Priority Badge */}
        <div className="absolute end-3 top-3">
          <GlassCardBadge variant="custom">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${priorityCfg.dot}`} />
              {t(priorityCfg.labelKey)}
            </span>
          </GlassCardBadge>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-bold text-offwhite leading-tight line-clamp-2 group-hover:text-gold transition-colors duration-300">
            {report.title}
          </h3>
        </div>
      </GlassCardMedia>

      {/* Content */}
      <GlassCardContent className="p-5">
        {/* Description */}
        {report.description && (
          <GlassCardDescription html={report.description} lines={2} className="mb-3" />
        )}

        {/* Category */}
        {report.category && (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-white/[0.08] backdrop-blur-md border border-white/[0.18] text-slate-body"
              style={{
                borderColor: report.category.color ? `${report.category.color}40` : undefined,
              }}
            >
              <Layers className="h-2.5 w-2.5 opacity-70" />
              {report.category.name}
            </span>
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <GlassCardTags tags={allTags} max={3} />
        )}

      </GlassCardContent>

      {/* Footer */}
      <GlassCardFooter className="px-5">
        <div className="flex items-center gap-3 text-xs text-slate-body/50">
          {report.crime_occurred_at && (
            <GlassCardMeta icon={<Calendar className="h-3 w-3" />}>
              <time dateTime={String(report.crime_occurred_at)}>
                {formatDate(String(report.crime_occurred_at), locale)}
              </time>
            </GlassCardMeta>
          )}
          {report.address && (
            <GlassCardMeta icon={<MapPin className="h-3 w-3" />}>
              <span className="truncate max-w-[100px]">{report.address}</span>
            </GlassCardMeta>
          )}
        </div>
        <GlassCardCta text={t("view") || "View"} />
      </GlassCardFooter>
    </GlassCard>
  );
}
