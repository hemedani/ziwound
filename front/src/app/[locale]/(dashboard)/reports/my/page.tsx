"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gets as getReports } from "@/app/actions/report/gets";
import { FileText, Plus, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { reportSchema } from "@/types/declarations";

type Report = Omit<reportSchema, "createdAt"> & {
  _id: string;
  createdAt: string;
};

export default function MyReportsPage() {
  const t = useTranslations("report");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getReports(
          { page, limit: 10 },
          {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            priority: 1,
            createdAt: 1,
          },
        );
        if (result.success && result.body) {
          const fetchedReports = Array.isArray(result.body) ? result.body : result.body.list || [];
          setReports(fetchedReports);
          setTotalPages(result.body.totalPages || 1);
        } else {
          setError(result.error || result.body?.message || "Failed to fetch reports");
        }
      } catch (err: unknown) {
        setError((err as Error).message || "An unexpected error occurred");
      }
      setLoading(false);
    };

    fetchReports();
  }, [page, statusFilter]);

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

  const filteredReports =
    statusFilter === "all" ? reports : reports.filter((r) => r.status === statusFilter);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto border-destructive/50 mt-12 text-center">
          <CardHeader>
            <CardTitle className="text-destructive">{t("common.error") || "Error"}</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setPage(1);
                setStatusFilter("all");
                setError(null);
              }}
            >
              {t("common.retry") || "Try Again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="mb-2 flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("myReports")}</h1>
          <p className="text-muted-foreground">{t("myReportsDescription")}</p>
        </div>
        <Button asChild>
          <Link href="/reports/new" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("newReport")}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">{t("filterByStatus")}:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="Pending">{t("statusPending")}</SelectItem>
                <SelectItem value="InReview">{t("statusInReview")}</SelectItem>
                <SelectItem value="Approved">{t("statusApproved")}</SelectItem>
                <SelectItem value="Rejected">{t("statusRejected")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <CardTitle>{t("noReports")}</CardTitle>
            <CardDescription>{t("noReportsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button asChild>
              <Link href="/reports/new">{t("createFirstReport")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {report.status && (
                        <Badge variant={getStatusColor(report.status)}>
                          {t(`status${report.status}`)}
                        </Badge>
                      )}
                      {report.priority && (
                        <Badge variant={getPriorityColor(report.priority)}>
                          {t(`priority${report.priority}`)}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {report.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(report.createdAt), "MMM dd, yyyy")}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/reports/${report._id}`}>{t("viewDetails")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                {t("previous")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("pageOf", { current: page, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
