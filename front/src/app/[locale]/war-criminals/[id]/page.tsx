import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/warCriminal/get";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User, Building2, Calendar, MapPin, Briefcase, ArrowLeft,
  FileText, Tag, AlertTriangle, Shield, ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { warCriminalSchema } from "@/types/declarations";
import { ShareButton } from "@/components/war-criminals/share-button";

const statusColors: Record<string, string> = {
  Accused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Indicted: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Convicted: "bg-red-500/20 text-red-400 border-red-500/30",
  "At Large": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Deceased: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Unknown: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Sanctioned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
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

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusTranslation(t: (key: string) => string, status: string): string {
  const keyMap: Record<string, string> = {
    "Accused": "admin.Accused",
    "Indicted": "admin.Indicted",
    "Convicted": "admin.Convicted",
    "At Large": "admin.atLarge",
    "Deceased": "admin.Deceased",
    "Unknown": "admin.Unknown",
    "Sanctioned": "admin.Sanctioned",
  };
  const key = keyMap[status];
  return key ? (t(key) as string) || status : status;
}

function getAffiliationTranslation(t: (key: string) => string, affiliation: string): string {
  const keyMap: Record<string, string> = {
    "Military": "admin.Military",
    "Paramilitary": "admin.Paramilitary",
    "Government": "admin.Government",
    "Rebel Group": "admin.rebelGroup",
    "Private Military Company": "admin.privateMilitaryCompany",
    "Political": "admin.Political",
    "Other": "admin.Other",
  };
  const key = keyMap[affiliation];
  return key ? (t(key) as string) || affiliation : affiliation;
}

function getLocalizedText(field: Record<string, string> | undefined, locale: string): string {
  if (!field) return "";
  return field[locale] || field.en || "";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id } = await params;
  const response = await get({ _id: id }, { fullName: 1, status: 1 });

  if (response?.success && response.body && response.body.length > 0) {
    const wc = response.body[0];
    return {
      title: `${wc.fullName} - War Criminals | ZiWound`,
      description: `Profile of ${wc.fullName}, status: ${wc.status}`,
    };
  }

  return {
    title: "War Criminal Not Found | ZiWound",
  };
}

export default async function WarCriminalDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale });

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

  if (!response?.success || !response.body || response.body.length === 0) {
    notFound();
  }

  const wc: warCriminalSchema = response.body[0];
  const statusLabel = getStatusTranslation(t, wc.status);
  const affiliationLabel = wc.affiliation ? getAffiliationTranslation(t, wc.affiliation) : "";

  const reportCount = wc.reports?.length || 0;
  const highPriorityReports = wc.reports?.filter((r) => r.priority === "High").length || 0;
  const approvedReports = wc.reports?.filter((r) => r.status === "Approved").length || 0;
  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/${locale}/war-criminals/${id}`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(153,27,27,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="text-slate-body hover:text-offwhite mb-8 -ms-2" asChild>
            <Link href={`/${locale}/war-criminals`}>
              <ArrowLeft className="me-2 h-4 w-4" />
              {t("common.back") || "Back"}
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Photo */}
            <div className="shrink-0">
              <div className="relative w-56 h-56 rounded-3xl overflow-hidden bg-white/5 border border-white/[0.08] shadow-2xl shadow-crimson/15">
                {wc.photo ? (
                  <Image
                    src={getImageUploadUrl(wc.photo.name)}
                    alt={wc.fullName}
                    fill
                    unoptimized
                    sizes="224px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-crimson/20 via-background to-gold/10">
                    {wc.isEntity ? (
                      <Building2 className="h-24 w-24 text-offwhite/20" />
                    ) : (
                      <User className="h-24 w-24 text-offwhite/20" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <Badge className={`${statusColors[wc.status] || "bg-slate-500/20 text-slate-400"} border`}>
                  {statusLabel}
                </Badge>
                {wc.affiliation && (
                  <Badge className={`${affiliationColors[wc.affiliation] || "bg-slate-500/20 text-slate-400"}`}>
                    <Briefcase className="me-1.5 h-3 w-3" />
                    {affiliationLabel}
                  </Badge>
                )}
                <Badge variant="outline" className="border-white/10 text-slate-body">
                  {wc.isEntity ? (
                    <><Building2 className="me-1.5 h-3 w-3" />{t("warCriminals.organizations")}</>
                  ) : (
                    <><User className="me-1.5 h-3 w-3" />{t("warCriminals.individuals")}</>
                  )}
                </Badge>
              </div>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl font-bold text-offwhite mb-5 tracking-tight">{wc.fullName}</h1>

              {/* Aliases */}
              {wc.aliases && wc.aliases.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-slate-body/70 uppercase tracking-wider mb-2">{t("warCriminals.aliases") || "Also known as"}</p>
                  <div className="flex flex-wrap gap-2">
                    {wc.aliases.map((alias, i) => (
                      <Badge key={i} variant="outline" className="border-white/[0.08] text-slate-body text-sm">
                        {alias}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-5 text-sm text-slate-body mb-6">
                {wc.nationality && wc.nationality.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/[0.04] p-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold/80" />
                    </div>
                    <span>{wc.nationality.join(", ")}</span>
                  </div>
                )}
                {wc.rankOrPosition && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/[0.04] p-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-gold/80" />
                    </div>
                    <span>{wc.rankOrPosition}</span>
                  </div>
                )}
                {wc.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-white/[0.04] p-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gold/80" />
                    </div>
                    <span>{formatDate(wc.dateOfBirth)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <ShareButton profileUrl={profileUrl} label={t("warCriminals.shareProfile") || "Share Profile"} />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 shrink-0">
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-5 text-center lg:text-start">
                <div className="flex items-center lg:items-start gap-3">
                  <div className="rounded-xl bg-crimson/20 p-2.5 shrink-0">
                    <FileText className="h-5 w-5 text-crimson-light" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-offwhite">{reportCount}</p>
                    <p className="text-xs text-slate-body mt-0.5">{t("warCriminals.linkedReports") || "Reports"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-5 text-center lg:text-start">
                <div className="flex items-center lg:items-start gap-3">
                  <div className="rounded-xl bg-amber-500/20 p-2.5 shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-offwhite">{highPriorityReports}</p>
                    <p className="text-xs text-slate-body mt-0.5">{t("admin.priority_high") || "High Priority"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-5 text-center lg:text-start">
                <div className="flex items-center lg:items-start gap-3">
                  <div className="rounded-xl bg-emerald-500/20 p-2.5 shrink-0">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-offwhite">{approvedReports}</p>
                    <p className="text-xs text-slate-body mt-0.5">{t("admin.status_approved") || "Approved"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {wc.description && getLocalizedText(wc.description as Record<string, string>, locale) && (
              <div className="rounded-2xl glass-light border border-white/[0.06] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-xl bg-crimson/20 p-2">
                    <FileText className="h-5 w-5 text-crimson-light" />
                  </div>
                  <h2 className="text-xl font-semibold text-offwhite">{t("warCriminals.description") || "Description"}</h2>
                </div>
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed text-[15px]">
                  {getLocalizedText(wc.description as Record<string, string>, locale)}
                </p>
              </div>
            )}

            {/* Known For */}
            {wc.knownFor && getLocalizedText(wc.knownFor as Record<string, string>, locale) && (
              <div className="rounded-2xl glass-light border border-white/[0.06] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-xl bg-gold/20 p-2">
                    <AlertTriangle className="h-5 w-5 text-gold" />
                  </div>
                  <h2 className="text-xl font-semibold text-offwhite">{t("warCriminals.knownFor") || "Known For"}</h2>
                </div>
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed text-[15px]">
                  {getLocalizedText(wc.knownFor as Record<string, string>, locale)}
                </p>
              </div>
            )}

            {/* Biography */}
            {wc.biography && getLocalizedText(wc.biography as Record<string, string>, locale) && (
              <div className="rounded-2xl glass-light border border-white/[0.06] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-xl bg-blue-500/20 p-2">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-offwhite">{t("warCriminals.biography") || "Biography"}</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-body whitespace-pre-wrap leading-relaxed text-[15px]">
                    {getLocalizedText(wc.biography as Record<string, string>, locale)}
                  </p>
                </div>
              </div>
            )}

            {/* Conviction Details */}
            {wc.convictionDetails && getLocalizedText(wc.convictionDetails as Record<string, string>, locale) && (
              <div className="rounded-2xl glass-light border border-white/[0.06] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="rounded-xl bg-purple-500/20 p-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-offwhite">{t("warCriminals.convictionDetails") || "Conviction Details"}</h2>
                </div>
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed text-[15px]">
                  {getLocalizedText(wc.convictionDetails as Record<string, string>, locale)}
                </p>
              </div>
            )}

            {/* Linked Reports */}
            {wc.reports && wc.reports.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-crimson/20 p-2">
                    <FileText className="h-5 w-5 text-crimson-light" />
                  </div>
                  <h2 className="text-xl font-semibold text-offwhite">{t("warCriminals.linkedReports") || "Linked Reports"}</h2>
                  <Badge variant="outline" className="border-white/10 text-slate-body">
                    {wc.reports.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {wc.reports.map((report) => (
                    <Link
                      key={report._id}
                      href={`/${locale}/reports/${report._id}`}
                      className="group block rounded-2xl glass-light border border-white/[0.06] p-5 hover:border-crimson/30 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Indicator */}
                        <div className="shrink-0 mt-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            report.status === "Approved" ? "bg-emerald-400" :
                            report.status === "Pending" ? "bg-amber-400" :
                            report.status === "Rejected" ? "bg-red-400" :
                            "bg-blue-400"
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-medium text-offwhite group-hover:text-crimson-light transition-colors truncate">
                              {report.title}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-slate-body/50 group-hover:text-crimson-light transition-colors shrink-0 mt-1" />
                          </div>

                          {/* Description */}
                          {report.description && (
                            <p className="text-sm text-slate-body/80 line-clamp-2 mb-3">
                              {report.description}
                            </p>
                          )}

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-body">
                            <Badge className={`rounded-full text-xs border ${
                              report.status === "Approved" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                              report.status === "Pending" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                              report.status === "Rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                              "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            }`}>
                              {report.status}
                            </Badge>

                            {report.priority && (
                              <Badge className={`rounded-full text-xs border ${priorityColors[report.priority]}`}>
                                {report.priority}
                              </Badge>
                            )}

                            {report.selected_language && (
                              <span className="uppercase tracking-wider">{report.selected_language}</span>
                            )}

                            {report.crime_occurred_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(report.crime_occurred_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="rounded-2xl glass-strong border border-white/[0.06] p-6">
              <h3 className="text-sm font-semibold text-offwhite uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="rounded-lg bg-white/[0.06] p-1.5">
                  <User className="h-4 w-4 text-gold" />
                </div>
                {t("common.details") || "Details"}
              </h3>

              <div className="space-y-4">
                {/* Type */}
                <div>
                  <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.type") || "Type"}</p>
                  <p className="text-sm text-offwhite flex items-center gap-2">
                    {wc.isEntity ? <Building2 className="h-4 w-4 text-gold/70" /> : <User className="h-4 w-4 text-gold/70" />}
                    {wc.isEntity ? t("warCriminals.organizations") || "Organization" : t("warCriminals.individuals") || "Individual"}
                  </p>
                </div>

                <Separator className="bg-white/[0.06]" />

                {/* Status */}
                <div>
                  <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.status")}</p>
                  <Badge className={statusColors[wc.status]}>{statusLabel}</Badge>
                </div>

                {/* Affiliation */}
                {wc.affiliation && (
                  <>
                    <Separator className="bg-white/[0.06]" />
                    <div>
                      <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.affiliation")}</p>
                      <Badge className={affiliationColors[wc.affiliation]}>{affiliationLabel}</Badge>
                    </div>
                  </>
                )}

                {/* Rank/Position */}
                {wc.rankOrPosition && (
                  <>
                    <Separator className="bg-white/[0.06]" />
                    <div>
                      <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.rankOrPosition")}</p>
                      <p className="text-sm text-offwhite">{wc.rankOrPosition}</p>
                    </div>
                  </>
                )}

                {/* Date of Birth */}
                {wc.dateOfBirth && (
                  <>
                    <Separator className="bg-white/[0.06]" />
                    <div>
                      <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.dateOfBirth")}</p>
                      <p className="text-sm text-offwhite">{formatDate(wc.dateOfBirth)}</p>
                    </div>
                  </>
                )}

                {/* Nationality */}
                {wc.nationality && wc.nationality.length > 0 && (
                  <>
                    <Separator className="bg-white/[0.06]" />
                    <div>
                      <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.nationality")}</p>
                      <p className="text-sm text-offwhite">{wc.nationality.join(", ")}</p>
                    </div>
                  </>
                )}

                {/* Created At */}
                <Separator className="bg-white/[0.06]" />
                <div>
                  <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.createdAt")}</p>
                  <p className="text-sm text-offwhite">{wc.createdAt ? formatDate(wc.createdAt) : "-"}</p>
                </div>

                {/* Updated At */}
                {wc.updatedAt && (
                  <>
                    <Separator className="bg-white/[0.06]" />
                    <div>
                      <p className="text-xs text-slate-body/70 mb-1.5">{t("admin.updatedAt") || "Updated At"}</p>
                      <p className="text-sm text-offwhite">{formatDate(wc.updatedAt)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tags */}
            {wc.tags && wc.tags.length > 0 && (
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-6">
                <h3 className="text-sm font-semibold text-offwhite uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-white/[0.06] p-1.5">
                    <Tag className="h-4 w-4 text-blue-400" />
                  </div>
                  {t("tags") || "Tags"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wc.tags.map((tag) => (
                    <Link key={tag._id} href={`/${locale}/war-crimes?tagIds=${tag._id}`}>
                      <Badge
                        style={{ backgroundColor: tag.color || "#3b82f6", color: "#fff" }}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Info */}
            {wc.photo && (
              <div className="rounded-2xl glass-strong border border-white/[0.06] p-6">
                <h3 className="text-sm font-semibold text-offwhite uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-white/[0.06] p-1.5">
                    <FileText className="h-4 w-4 text-gold" />
                  </div>
                  {t("admin.photo") || "Photo"}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-offwhite truncate">{wc.photo.name}</p>
                  {wc.photo.type && wc.photo.size && (
                    <p className="text-xs text-slate-body">
                      {wc.photo.type.toUpperCase()} · {(wc.photo.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
