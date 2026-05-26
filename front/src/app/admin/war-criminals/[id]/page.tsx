import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/warCriminal/get";
import { remove } from "@/app/actions/warCriminal/remove";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import {
  ArrowLeft, User, Building2, Calendar, MapPin, Briefcase, Shield,
  AlertTriangle, Clock, FileText, Tag, Trash2, Edit, ExternalLink,
  Users, CalendarDays, Globe,
} from "lucide-react";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { warCriminalSchema } from "@/types/declarations";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { DeleteWarCriminalButton } from "./delete-button";
import { CopyLinkButton } from "./copy-link-button";

const statusColors: Record<string, string> = {
  Accused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Indicted: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Convicted: "bg-red-500/20 text-red-400 border-red-500/30",
  "At Large": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Deceased: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Unknown: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Sanctioned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusIcons: Record<string, React.ElementType> = {
  Accused: AlertTriangle,
  Indicted: Shield,
  Convicted: Shield,
  "At Large": Users,
  Deceased: CalendarDays,
  Unknown: Globe,
  Sanctioned: AlertTriangle,
};

const affiliationColors: Record<string, string> = {
  Military: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Paramilitary: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Government: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Rebel Group": "bg-red-500/20 text-red-400 border-red-500/30",
  "Private Military Company": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Political: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Other: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-500/20 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function getLocalizedText(field: Record<string, string> | undefined, locale: string): string {
  if (!field) return "";
  return field[locale] || field.en || "";
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAffiliationTranslation(t: (key: string) => string, affiliation: string): string {
  const keyMap: Record<string, string> = {
    "Military": "Military",
    "Paramilitary": "Paramilitary",
    "Government": "Government",
    "Rebel Group": "rebelGroup",
    "Private Military Company": "privateMilitaryCompany",
    "Political": "Political",
    "Other": "Other",
  };
  const key = keyMap[affiliation];
  return key ? t(key) : affiliation;
}

export default async function AdminWarCriminalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin");
  const tc = await getTranslations("common");
  const { id } = await params;

  const response = await get(
    { _id: id },
    {
      _id: 1,
      fullName: 1,
      aliases: 1,
      dateOfBirth: 1,
      nationality: 1,
      affiliation: 1,
      rankOrPosition: 1,
      knownFor: 1,
      biography: 1,
      description: 1,
      status: 1,
      convictionDetails: 1,
      isEntity: 1,
      createdAt: 1,
      updatedAt: 1,
      photo: { _id: 1, name: 1, mimeType: 1, size: 1, type: 1 },
      tags: { _id: 1, name: 1, color: 1, icon: 1 },
      reports: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        priority: 1,
        selected_language: 1,
        crime_occurred_at: 1,
      },
    },
  );

  if (!response?.success || !response.body) {
    notFound();
  }

  const wc: warCriminalSchema = response.body[0];
  const StatusIcon = statusIcons[wc.status] || Globe;
  const statusLabel = t(wc.status);
  const affiliationLabel = wc.affiliation ? getAffiliationTranslation(t, wc.affiliation) : "";

  const reportCount = wc.reports?.length || 0;
  const highPriorityReports = wc.reports?.filter((r) => r.priority === "High").length || 0;
  const approvedReports = wc.reports?.filter((r) => r.status === "Approved").length || 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10" asChild>
            <Link href="/admin/war-criminals">
              <ArrowLeft className="me-2 h-4 w-4" />
              {tc("back")}
            </Link>
          </Button>
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-px w-8 bg-crimson" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                {t("adminPanel")}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-offwhite">{wc.fullName}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <DeleteWarCriminalButton id={wc._id!} confirmMessage={t("deleteWarCriminalConfirm") || "Are you sure you want to delete this war criminal?"} />
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10" asChild>
            <Link href={`/admin/war-criminals/${wc._id}/edit`}>
              <Edit className="me-2 h-4 w-4" />
              {t("edit")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(153,27,27,0.06)_0%,_transparent_60%)]" />
        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Photo */}
            <div className="shrink-0">
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-white/5 border border-white/[0.06] shadow-2xl shadow-crimson/10">
                {wc.photo ? (
                  <Image
                    src={getImageUploadUrl(wc.photo.name)}
                    alt={wc.fullName}
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-crimson/20 to-gold/10">
                    {wc.isEntity ? (
                      <Building2 className="h-16 w-16 text-offwhite/30" />
                    ) : (
                      <User className="h-16 w-16 text-offwhite/30" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={`${statusColors[wc.status]} border`}>
                  <StatusIcon className="me-1.5 h-3 w-3" />
                  {statusLabel}
                </Badge>
                {wc.affiliation && (
                  <Badge className={`${affiliationColors[wc.affiliation]} border`}>
                    <Briefcase className="me-1.5 h-3 w-3" />
                    {affiliationLabel}
                  </Badge>
                )}
                <Badge variant="outline" className="border-white/10 text-slate-body">
                  {wc.isEntity ? (
                    <><Building2 className="me-1.5 h-3 w-3" />{t("organizations")}</>
                  ) : (
                    <><User className="me-1.5 h-3 w-3" />{t("individuals")}</>
                  )}
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-offwhite mb-2">{wc.fullName}</h2>

              {wc.aliases && wc.aliases.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-body mb-1.5">{t("aliases")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {wc.aliases.map((alias, i) => (
                      <Badge key={i} variant="outline" className="border-white/10 text-slate-body text-xs">
                        {alias}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-slate-body">
                {wc.rankOrPosition && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/5 p-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-gold" />
                    </div>
                    <span>{wc.rankOrPosition}</span>
                  </div>
                )}
                {wc.nationality && wc.nationality.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/5 p-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                    </div>
                    <span>{wc.nationality.join(", ")}</span>
                  </div>
                )}
                {wc.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/5 p-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gold" />
                    </div>
                    <span>{formatDate(wc.dateOfBirth)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 shrink-0">
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 text-center lg:text-start">
                <div className="flex items-center lg:items-start gap-3">
                  <div className="rounded-lg bg-crimson/20 p-2 shrink-0">
                    <FileText className="h-4 w-4 text-crimson-light" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-offwhite">{reportCount}</p>
                    <p className="text-xs text-slate-body">{t("linkedReports") || "Reports"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 text-center lg:text-start">
                <div className="flex items-center lg:items-start gap-3">
                  <div className="rounded-lg bg-amber-500/20 p-2 shrink-0">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-offwhite">{highPriorityReports}</p>
                    <p className="text-xs text-slate-body">{t("priority_high") || "High Priority"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 text-center lg:text-start">
                <div className="flex items-center lg:items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/20 p-2 shrink-0">
                    <Shield className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-offwhite">{approvedReports}</p>
                    <p className="text-xs text-slate-body">{t("status_approved") || "Approved"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {wc.description && getLocalizedText(wc.description as Record<string, string>, "en") && (
            <Card className="glass-light border-white/[0.06]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-offwhite">
                  <div className="rounded-lg bg-crimson/20 p-1.5">
                    <FileText className="h-4 w-4 text-crimson-light" />
                  </div>
                  {t("description")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed">
                  {getLocalizedText(wc.description as Record<string, string>, "en")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Known For */}
          {wc.knownFor && getLocalizedText(wc.knownFor as Record<string, string>, "en") && (
            <Card className="glass-light border-white/[0.06]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-offwhite">
                  <div className="rounded-lg bg-gold/20 p-1.5">
                    <AlertTriangle className="h-4 w-4 text-gold" />
                  </div>
                  {t("knownFor") || "Known For"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed">
                  {getLocalizedText(wc.knownFor as Record<string, string>, "en")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Biography */}
          {wc.biography && getLocalizedText(wc.biography as Record<string, string>, "en") && (
            <Card className="glass-light border-white/[0.06]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-offwhite">
                  <div className="rounded-lg bg-blue-500/20 p-1.5">
                    <User className="h-4 w-4 text-blue-400" />
                  </div>
                  {t("biography") || "Biography"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed">
                  {getLocalizedText(wc.biography as Record<string, string>, "en")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Conviction Details */}
          {wc.convictionDetails && getLocalizedText(wc.convictionDetails as Record<string, string>, "en") && (
            <Card className="glass-light border-white/[0.06]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-offwhite">
                  <div className="rounded-lg bg-purple-500/20 p-1.5">
                    <Shield className="h-4 w-4 text-purple-400" />
                  </div>
                  {t("convictionDetails") || "Conviction Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed">
                  {getLocalizedText(wc.convictionDetails as Record<string, string>, "en")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Linked Reports Table */}
          {wc.reports && wc.reports.length > 0 && (
            <Card className="glass-light border-white/[0.06]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-offwhite">
                  <div className="rounded-lg bg-crimson/20 p-1.5">
                    <FileText className="h-4 w-4 text-crimson-light" />
                  </div>
                  {t("linkedReports") || "Linked Reports"}
                  <Badge variant="outline" className="ms-auto border-white/10 text-slate-body">
                    {wc.reports.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-white/[0.04] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.06] hover:bg-transparent">
                        <TableHead className="text-slate-body">Title</TableHead>
                        <TableHead className="text-slate-body">Status</TableHead>
                        <TableHead className="text-slate-body">Priority</TableHead>
                        <TableHead className="text-slate-body">Language</TableHead>
                        <TableHead className="text-slate-body">Crime Date</TableHead>
                        <TableHead className="text-slate-body w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wc.reports.map((report) => (
                        <TableRow key={report._id} className="border-white/[0.04] hover:bg-white/[0.02]">
                          <TableCell className="font-medium text-offwhite max-w-[200px]">
                            <div className="truncate" title={report.title}>{report.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`rounded-full text-xs ${report.status === "Approved" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                                report.status === "Pending" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                  report.status === "Rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                    "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              } border`}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {report.priority ? (
                              <Badge className={`rounded-full text-xs ${priorityColors[report.priority]} border`}>
                                {report.priority}
                              </Badge>
                            ) : (
                              <span className="text-slate-body text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-slate-body uppercase">{report.selected_language}</span>
                          </TableCell>
                          <TableCell className="text-slate-body text-xs">
                            {report.crime_occurred_at ? formatDate(report.crime_occurred_at) : "-"}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                              <Link href={`/admin/reports/${report._id}`}>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-body" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card className="glass-light border-white/[0.06]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-offwhite">
                <div className="rounded-lg bg-white/5 p-1.5">
                  <FileText className="h-4 w-4 text-gold" />
                </div>
                {t("details") || "Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white/5 p-2 shrink-0">
                  {wc.isEntity ? (
                    <Building2 className="h-4 w-4 text-gold" />
                  ) : (
                    <User className="h-4 w-4 text-gold" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-body mb-1">{t("type") || "Type"}</p>
                  <p className="text-sm font-medium text-offwhite">
                    {wc.isEntity ? t("organizations") || "Organization" : t("individuals") || "Individual"}
                  </p>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Status */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white/5 p-2 shrink-0">
                  <StatusIcon className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-body mb-1">{t("status")}</p>
                  <Badge className={statusColors[wc.status]}>{statusLabel}</Badge>
                </div>
              </div>

              {/* Affiliation */}
              {wc.affiliation && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/5 p-2 shrink-0">
                      <Briefcase className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-body mb-1">{t("affiliation")}</p>
                      <Badge className={affiliationColors[wc.affiliation]}>{affiliationLabel}</Badge>
                    </div>
                  </div>
                </>
              )}

              {/* Rank/Position */}
              {wc.rankOrPosition && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/5 p-2 shrink-0">
                      <Shield className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-body mb-1">{t("rankOrPosition")}</p>
                      <p className="text-sm font-medium text-offwhite">{wc.rankOrPosition}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Date of Birth */}
              {wc.dateOfBirth && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/5 p-2 shrink-0">
                      <Calendar className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-body mb-1">{t("dateOfBirth")}</p>
                      <p className="text-sm font-medium text-offwhite">{formatDate(wc.dateOfBirth)}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Nationality */}
              {wc.nationality && wc.nationality.length > 0 && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/5 p-2 shrink-0">
                      <MapPin className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-body mb-1">{t("nationality")}</p>
                      <p className="text-sm font-medium text-offwhite">{wc.nationality.join(", ")}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Aliases */}
              {wc.aliases && wc.aliases.length > 0 && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/5 p-2 shrink-0">
                      <Users className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-body mb-1">{t("aliases")}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {wc.aliases.map((alias, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-white/10 text-slate-body">
                            {alias}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Photo Info */}
              {wc.photo && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/5 p-2 shrink-0">
                      <FileText className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-body mb-1">Photo</p>
                      <p className="text-sm font-medium text-offwhite truncate">{wc.photo.name}</p>
                      <p className="text-xs text-slate-body mt-0.5">
                        {wc.photo.type} · {(wc.photo.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Separator className="bg-white/10" />

              {/* Timestamps */}
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white/5 p-2 shrink-0">
                  <CalendarDays className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-body mb-1">{t("createdAt")}</p>
                  <p className="text-sm text-offwhite">{wc.createdAt ? formatDateTime(wc.createdAt) : "-"}</p>
                </div>
              </div>

              {wc.updatedAt && (
                <>
                  <Separator className="bg-white/10" />
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/5 p-2 shrink-0">
                      <Clock className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-body mb-1">{t("updatedAt") || "Updated At"}</p>
                      <p className="text-sm text-offwhite">{formatDateTime(wc.updatedAt)}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tags Card */}
          {wc.tags && wc.tags.length > 0 && (
            <Card className="glass-light border-white/[0.06]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-offwhite">
                  <div className="rounded-lg bg-blue-500/20 p-1.5">
                    <Tag className="h-4 w-4 text-blue-400" />
                  </div>
                  {t("tags")}
                  <Badge variant="outline" className="ms-auto border-white/10 text-slate-body">
                    {wc.tags.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {wc.tags.map((tag) => (
                    <Badge
                      key={tag._id}
                      style={{ backgroundColor: tag.color || "#3b82f6", color: "#fff" }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="glass-light border-white/[0.06]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-offwhite">
                <div className="rounded-lg bg-crimson/20 p-1.5">
                  <Shield className="h-4 w-4 text-crimson-light" />
                </div>
                {t("quickActions") || "Quick Actions"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-white/10 bg-white/5 text-offwhite hover:bg-white/10" asChild>
                <Link href={`/admin/war-criminals/${wc._id}/edit`}>
                  <Edit className="me-2 h-4 w-4" />
                  {t("edit")}
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-white/10 bg-white/5 text-offwhite hover:bg-white/10" asChild>
                <Link href="/admin/war-criminals">
                  <FileText className="me-2 h-4 w-4" />
                  {t("warCriminals") || "View All"}
                </Link>
              </Button>
              <CopyLinkButton
                url={`${process.env.NEXT_PUBLIC_APP_URL || ""}/admin/war-criminals/${wc._id}`}
                label={tc("copyLink") || "Copy Link"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
