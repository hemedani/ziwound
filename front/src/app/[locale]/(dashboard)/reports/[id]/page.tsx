"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, MapPin, Tag, Paperclip, ArrowLeft, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { get as getReport } from "@/app/actions/report/get";
import dynamic from "next/dynamic";
import { documentSchema, reportSchema } from "@/types/declarations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { cn } from "@/lib/utils";

const ReadonlyMap = dynamic(
  () => import("@/components/map/readonly-map").then((mod) => mod.ReadonlyMap),
  {
    ssr: false,
    loading: () => <div className="h-[350px] w-full animate-pulse rounded-xl bg-white/5" />,
  },
);

interface Report extends Omit<reportSchema, "documents"> {
  documents?: documentSchema[];
}

export default function ReportDetailPage() {
  const t = useTranslations("report");
  const tCommon = useTranslations("common");
  const params = useParams();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const result = await getReport(
          { _id: reportId },
          {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            priority: 1,
            location: 1,
            address: 1,
            hostileCountries: { _id: 1, name: 1 },
            attackedCountries: { _id: 1, name: 1 },
            attackedProvinces: { _id: 1, name: 1 },
            attackedCities: { _id: 1, name: 1 },
            crime_occurred_at: 1,
            createdAt: 1,
            updatedAt: 1,
            category: { _id: 1, name: 1 },
            tags: { _id: 1, name: 1 },
            documents: { _id: 1, title: 1, documentFiles: { _id: 1, name: 1, mimeType: 1, type: 1 } },
          },
        );

        if (result.success && result.body) {
          const fetchedReport = Array.isArray(result.body) ? result.body[0] : result.body;
          setReport(fetchedReport as unknown as Report);
        }
      } catch (error) {
        console.error("Failed to fetch report details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

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

  const isImage = (type: string) => type.startsWith("image/");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-crimson" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-2xl glass-strong p-10 text-center max-w-lg mx-auto">
          <FileText className="mx-auto mb-4 h-12 w-12 text-slate-body/40" />
          <h2 className="text-xl font-bold text-offwhite mb-2">{t("reportNotFound")}</h2>
          <p className="text-slate-body mb-6">{t("reportNotFoundDescription")}</p>
          <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
            <Link href="/reports/my">{t("backToReports")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        asChild
        className="mb-6 text-slate-body hover:text-offwhite hover:bg-white/5"
      >
        <Link href="/reports/my" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("backToReports")}
        </Link>
      </Button>

      {/* Report Header */}
      <div className="rounded-2xl glass-strong p-6 md:p-8 mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {report.status && (
            <Badge variant="outline" className={cn("text-sm", getStatusClasses(report.status))}>
              {t(`status${report.status}`)}
            </Badge>
          )}
          {report.priority && (
            <Badge variant="outline" className={cn("text-sm", getPriorityClasses(report.priority))}>
              {t(`priority${report.priority}`)}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-offwhite">{report.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-body">
          {report.createdAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gold" />
              {format(new Date(report.createdAt), "MMM dd, yyyy")}
            </span>
          )}
          {report.category && (
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-gold" />
              {report.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl glass-light p-6 md:p-8 mb-6">
        <h2 className="text-lg font-semibold text-offwhite mb-4">{t("description")}</h2>
        <p className="text-slate-body whitespace-pre-wrap leading-relaxed">{report.description}</p>
      </div>

      {/* Crime Location & Date */}
      {(report.hostileCountries?.length || report.attackedCountries?.length || report.attackedProvinces?.length || report.attackedCities?.length || report.crime_occurred_at) && (
        <div className="rounded-2xl glass-light p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-offwhite mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-crimson" />
            {t("location")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {report.hostileCountries && report.hostileCountries.length > 0 && (
              <div>
                <p className="text-sm text-slate-body">{t("hostileCountries") || "Hostile Countries"}</p>
                <p className="font-medium text-offwhite mt-1">{report.hostileCountries.map(c => c.name).join(", ")}</p>
              </div>
            )}
            {report.attackedCountries && report.attackedCountries.length > 0 && (
              <div>
                <p className="text-sm text-slate-body">{t("attackedCountries") || "Attacked Countries"}</p>
                <p className="font-medium text-offwhite mt-1">{report.attackedCountries.map(c => c.name).join(", ")}</p>
              </div>
            )}
            {report.attackedProvinces && report.attackedProvinces.length > 0 && (
              <div>
                <p className="text-sm text-slate-body">{t("attackedProvinces") || "Attacked Provinces"}</p>
                <p className="font-medium text-offwhite mt-1">{report.attackedProvinces.map(p => p.name).join(", ")}</p>
              </div>
            )}
            {report.attackedCities && report.attackedCities.length > 0 && (
              <div>
                <p className="text-sm text-slate-body">{t("attackedCities") || "Attacked Cities"}</p>
                <p className="font-medium text-offwhite mt-1">{report.attackedCities.map(c => c.name).join(", ")}</p>
              </div>
            )}
            {report.crime_occurred_at && (
              <div>
                <p className="text-sm text-slate-body">{t("crimeOccurredAt")}</p>
                <p className="font-medium text-offwhite mt-1">
                  {format(new Date(report.crime_occurred_at), "MMM dd, yyyy")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Map */}
      {(report.address || report.location?.coordinates) && (
        <div className="rounded-2xl glass-light p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-offwhite mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-crimson" />
            {t("location")}
          </h2>
          {report.address && <p className="text-slate-body mb-4">{report.address}</p>}
          {report.location?.coordinates && (
            <div className="rounded-xl overflow-hidden border border-white/5">
              <ReadonlyMap
                latitude={report.location.coordinates[1]}
                longitude={report.location.coordinates[0]}
                className="h-[350px] w-full relative z-0"
              />
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {report.tags && report.tags.length > 0 && (
        <div className="rounded-2xl glass-light p-6 md:p-8 mb-6">
          <h2 className="text-lg font-semibold text-offwhite mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-gold" />
            {t("tags")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {report.tags.map((tag, index) => (
              <Badge
                key={tag._id || index}
                variant="outline"
                className="bg-white/5 text-slate-body border-white/10 hover:bg-white/10"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      {report.documents && report.documents.length > 0 && (
        <div className="rounded-2xl glass-light p-6 md:p-8">
          <h2 className="text-lg font-semibold text-offwhite mb-4 flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-gold" />
            {t("documents")} ({report.documents.reduce((acc, doc) => acc + (doc.documentFiles?.length || 0), 0)})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {report.documents.flatMap((doc) =>
              (doc.documentFiles || []).map((file, index) => (
                <div
                  key={`${doc._id}-${file._id || index}`}
                  className="flex items-center gap-3 rounded-xl glass p-4 transition-all hover:bg-white/[0.04]"
                >
                  {isImage(file.mimeType || "") && file._id ? (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={getImageUploadUrl(file.name, file.type)}
                        alt={file.name || doc.title || "Attachment"}
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <FileText className="h-8 w-8 text-slate-body" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-offwhite">{file.name || doc.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-slate-body hover:text-offwhite hover:bg-white/10"
                    aria-label={tCommon("download") || "Download file"}
                  >
                    <a href={file._id ? getImageUploadUrl(file.name, file.type) : "#"} download={file.name}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
