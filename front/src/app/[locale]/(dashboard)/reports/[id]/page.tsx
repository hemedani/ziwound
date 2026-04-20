"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, MapPin, Tag, Paperclip, ArrowLeft, Download } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { get as getReport } from "@/app/actions/report/get";
import dynamic from "next/dynamic";
import { documentSchema, reportSchema } from "@/types/declarations";
import { getLesanBaseUrl } from "@/lib/api";

const ReadonlyMap = dynamic(
  () => import("@/components/map/readonly-map").then((mod) => mod.ReadonlyMap),
  {
    ssr: false,
    loading: () => <div className="h-[350px] w-full animate-pulse rounded-xl bg-muted" />,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Approved":
        return "default";
      case "Rejected":
        return "destructive";
      case "InReview":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };

  const isImage = (type: string) => type.startsWith("image/");

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t("reportNotFound")}</CardTitle>
            <CardDescription>{t("reportNotFoundDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button asChild>
              <Link href="/reports/my">{t("backToReports")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/reports/my" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("backToReports")}
        </Link>
      </Button>

      {/* Report Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {report.status && (
              <Badge variant={getStatusColor(report.status)} className="text-sm">
                {t(`status${report.status}`)}
              </Badge>
            )}
            {report.priority && (
              <Badge variant={getPriorityColor(report.priority)} className="text-sm">
                {t(`priority${report.priority}`)}
              </Badge>
            )}
          </div>
          <CardTitle className="text-3xl">{report.title}</CardTitle>
          <CardDescription className="flex items-center gap-4">
            {report.createdAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(report.createdAt), "MMM dd, yyyy")}
              </span>
            )}
            {report.category && (
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {report.category.name}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("description")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
        </CardContent>
      </Card>

      {/* Location */}
      {(report.address || report.location?.coordinates) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t("location")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.address && <p className="text-muted-foreground">{report.address}</p>}
            {report.location?.coordinates && (
              <div className="mt-4">
                <ReadonlyMap
                  latitude={report.location.coordinates[1]}
                  longitude={report.location.coordinates[0]}
                  className="h-[350px] w-full rounded-xl overflow-hidden border-2 shadow-sm relative z-0"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {report.tags && report.tags.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {t("tags")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {report.tags.map((tag, index) => (
                <Badge key={tag._id || index} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      {report.documents && report.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              {t("attachments")} (
              {report.documents.reduce((acc, doc) => acc + (doc.documentFiles?.length || 0), 0)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {report.documents.flatMap((doc) =>
                (doc.documentFiles || []).map((file, index) => (
                  <div
                    key={`${doc._id}-${file._id || index}`}
                    className="flex items-center gap-3 rounded-lg border p-4"
                  >
                    {isImage(file.mimeType || "") ? (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={
                            file._id
                              ? `${getLesanBaseUrl()}/file/download?id=${file._id}`
                              : "https://placehold.co/400x400.png"
                          }
                          alt={file.name || doc.title || "Attachment"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name || doc.title}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={file._id ? `${getLesanBaseUrl()}/file/download?id=${file._id}` : "#"}
                        download={file.name}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )),
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
