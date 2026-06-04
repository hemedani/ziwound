import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { get } from "@/app/actions/document/get";
import { gets as getDocuments } from "@/app/actions/document/gets";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { DocumentFilesGallery } from "@/components/documents/document-files-gallery";
import { DocumentMetadata } from "@/components/documents/document-metadata";
import { LinkedReportCard } from "@/components/documents/linked-report-card";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Download, Archive } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", fa: "فارسی", ar: "العربية", zh: "中文",
  pt: "Português", es: "Español", nl: "Nederlands", tr: "Türkçe",
  ru: "Русский",
};

interface DocumentFile {
  _id?: string;
  name: string;
  mimeType?: string;
  type?: "image" | "video" | "docs";
  alt_text?: string;
  size?: number;
}

interface ReportBrief {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  selected_language?: string;
  crime_occurred_at?: string;
  createdAt?: string;
  address?: string;
  location?: { type: string; coordinates: number[] };
  reporter?: { _id?: string; first_name?: string; last_name?: string };
  category?: { _id?: string; name?: string; color?: string };
  tags?: { _id?: string; name?: string }[];
  attackedCountries?: { _id?: string; name?: string; english_name?: string }[];
  attackedProvinces?: { _id?: string; name?: string; english_name?: string }[];
  attackedCities?: { _id?: string; name?: string; english_name?: string }[];
}

interface DocumentDetail {
  _id?: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt?: string;
  updatedAt?: string;
  documentFiles?: DocumentFile[];
  report?: ReportBrief[];
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function getTotalFileSize(files?: DocumentFile[]): string {
  if (!files || files.length === 0) return "";
  const total = files.reduce((sum, f) => sum + (f.size || 0), 0);
  return formatFileSize(total);
}

function getUploaderName(report?: ReportBrief[]): string | undefined {
  if (!report || report.length === 0) return undefined;
  const first = report[0];
  if (first?.reporter) {
    return `${first.reporter.first_name || ""} ${first.reporter.last_name || ""}`.trim() || undefined;
  }
  return undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const result = await get(
    { _id: id },
    { _id: 1, title: 1, description: 1 },
  );

  let title = "Document - ZiWound";
  let description = "Archival evidence document on ZiWound";

  if (result.success && result.body) {
    const data = Array.isArray(result.body) ? result.body[0] : result.body;
    if (data?.title) title = `${data.title} - ZiWound`;
    if (data?.description) description = data.description;
  }

  return { title, description };
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  const t = await getTranslations({ locale, namespace: "documentDetail" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const result = await get(
    { _id: id },
    {
      _id: 1,
      title: 1,
      description: 1,
      selected_language: 1,
      createdAt: 1,
      updatedAt: 1,
      documentFiles: {
        _id: 1,
        name: 1,
        mimeType: 1,
        type: 1,
        alt_text: 1,
      },
      report: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        priority: 1,
        selected_language: 1,
        crime_occurred_at: 1,
        location: 1,
        address: 1,
        reporter: {
          _id: 1,
          first_name: 1,
          last_name: 1,
        },
        category: {
          _id: 1,
          name: 1,
          color: 1,
        },
        tags: {
          _id: 1,
          name: 1,
        },
        attackedCountries: {
          _id: 1,
          name: 1,
          english_name: 1,
        },
        attackedProvinces: {
          _id: 1,
          name: 1,
          english_name: 1,
        },
        attackedCities: {
          _id: 1,
          name: 1,
          english_name: 1,
        },
      },
    },
  );

  if (!result.success || !result.body) {
    notFound();
  }

  const doc = (Array.isArray(result.body) ? result.body[0] : result.body) as DocumentDetail | null;

  if (!doc) {
    notFound();
  }

  // Fetch related documents from the same report
  const linkedReportId = doc.report?.[0]?._id;
  let relatedDocuments: DocumentDetail[] = [];
  if (linkedReportId) {
    const relatedResult = await getDocuments(
      {
        page: 1,
        limit: 4,
        reportId: linkedReportId,
      },
      {
        _id: 1,
        title: 1,
        description: 1,
        selected_language: 1,
        createdAt: 1,
        documentFiles: {
          _id: 1,
          name: 1,
          mimeType: 1,
          type: 1,
        },
      },
    );
    if (relatedResult.success && relatedResult.body) {
      const data = Array.isArray(relatedResult.body)
        ? relatedResult.body
        : (relatedResult.body as { list?: DocumentDetail[] }).list || [];
      relatedDocuments = (data as DocumentDetail[]).filter((r) => r._id !== doc._id);
    }
  }

  const fileCount = doc.documentFiles?.length || 0;
  const totalSize = getTotalFileSize(doc.documentFiles);
  const uploaderName = getUploaderName(doc.report);
  const linkedReport = doc.report?.[0];

  // Collect locations from the report
  const attackedCountries = linkedReport?.attackedCountries || [];
  const attackedProvinces = linkedReport?.attackedProvinces || [];
  const attackedCities = linkedReport?.attackedCities || [];
  const reportTags = linkedReport?.tags || [];

  const heroTranslations = {
    backToDocuments: t("backToDocuments"),
    documentArchive: t("documentArchive"),
    downloadAll: t("downloadAll"),
    print: t("print"),
    share: t("share"),
    files: t("files"),
    file: t("file"),
  };

  const metadataTranslations = {
    documentDetails: t("documentDetails"),
    documentId: t("documentId"),
    language: t("language"),
    createdAt: t("createdAt"),
    lastUpdated: t("lastUpdated"),
    files: t("files"),
    totalSize: t("totalSize"),
    uploader: t("uploader"),
  };

  const reportTranslations = {
    linkedReport: t("linkedReport"),
    viewFullReport: t("viewFullReport"),
    crimeOccurredAt: t("crimeOccurredAt"),
    submittedAt: t("submittedAt"),
    status: t("status"),
    reporter: t("reporter"),
  };

  return (
    <PageContainer showHeader={false} className="bg-background" contentClassName="">
      <PageHero
        backLink={{ href: `/${locale}/documents`, label: t("backToDocuments") }}
        icon={<Archive className="h-5 w-5 text-crimson-light" />}
        overline={t("documentArchive")}
        title={doc.title}
      />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Files Gallery */}
            {doc.documentFiles && doc.documentFiles.length > 0 && (
              <DocumentFilesGallery files={doc.documentFiles} />
            )}

            {/* Full Description */}
            {doc.description && (
              <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-5">
                  <div className="bg-white/5 rounded-lg p-1.5">
                    <svg
                      className="h-4 w-4 text-gold"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-offwhite">{t("description")}</h2>
                </div>
                <div
                  className="prose prose-invert max-w-none prose-p:text-slate-body/80 prose-headings:text-offwhite prose-a:text-crimson-light prose-strong:text-offwhite prose-code:text-gold prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 leading-relaxed text-[15px]"
                  dangerouslySetInnerHTML={{ __html: doc.description }}
                />
              </div>
            )}

            {/* Linked Report */}
            {linkedReport && (
              <LinkedReportCard
                report={linkedReport}
                locale={locale}
                translations={reportTranslations}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Document Metadata */}
              <DocumentMetadata
                selectedLanguage={doc.selected_language}
                createdAt={doc.createdAt}
                updatedAt={doc.updatedAt}
                documentId={doc._id}
                fileCount={fileCount}
                totalSize={totalSize}
                uploaderName={uploaderName}
                translations={metadataTranslations}
                languageNames={LANGUAGE_NAMES}
              />

              {/* Download Summary */}
              {doc.documentFiles && doc.documentFiles.length > 0 && (
                <div className="rounded-2xl glass-strong p-5 border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <Download className="h-4 w-4 text-gold" />
                    </div>
                    <h3 className="text-sm font-semibold text-offwhite">{t("availableFiles")}</h3>
                    <Badge variant="outline" className="border-white/10 text-slate-body/60 text-xs ms-auto">
                      {fileCount}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {doc.documentFiles.map((file, i) => (
                      <a
                        key={file._id || i}
                        href={getImageUploadUrl(file.name, file.type || "docs")}
                        download={file.name}
                        className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2.5 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                      >
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <FileTypeIcon mimeType={file.mimeType} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-offwhite truncate">{file.name}</p>
                          {file.size && (
                            <p className="text-[10px] text-slate-body/50">{formatFileSize(file.size)}</p>
                          )}
                        </div>
                        <Download className="h-3.5 w-3.5 shrink-0 text-slate-body/30 group-hover:text-crimson-light transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Locations */}
              {(attackedCountries.length > 0 || attackedProvinces.length > 0 || attackedCities.length > 0) && (
                <div className="rounded-2xl glass-strong p-5 border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <Globe className="h-4 w-4 text-gold" />
                    </div>
                    <h3 className="text-sm font-semibold text-offwhite">{t("linkedLocations")}</h3>
                  </div>

                  <div className="space-y-3">
                    {attackedCountries.map((loc) => (
                      <Link
                        key={loc._id}
                        href={`/${locale}/explore/countries/${loc._id}`}
                        className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                      >
                        <div className="h-7 w-7 shrink-0 rounded-md bg-crimson/10 flex items-center justify-center">
                          <Globe className="h-3.5 w-3.5 text-crimson-light" />
                        </div>
                        <span className="text-xs text-offwhite group-hover:text-gold transition-colors truncate">
                          {loc.name}
                        </span>
                      </Link>
                    ))}
                    {attackedProvinces.map((loc) => (
                      <Link
                        key={loc._id}
                        href={`/${locale}/explore/provinces/${loc._id}`}
                        className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                      >
                        <div className="h-7 w-7 shrink-0 rounded-md bg-amber-500/10 flex items-center justify-center">
                          <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-xs text-offwhite group-hover:text-gold transition-colors truncate">
                          {loc.name}
                        </span>
                      </Link>
                    ))}
                    {attackedCities.map((loc) => (
                      <Link
                        key={loc._id}
                        href={`/${locale}/explore/cities/${loc._id}`}
                        className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                      >
                        <div className="h-7 w-7 shrink-0 rounded-md bg-white/5 flex items-center justify-center">
                          <svg className="h-3.5 w-3.5 text-slate-body/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="text-xs text-offwhite group-hover:text-gold transition-colors truncate">
                          {loc.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {reportTags.length > 0 && (
                <div className="rounded-2xl glass-strong p-5 border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-offwhite">{tCommon("tags")}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {reportTags.map((tag) => (
                      <Link key={tag._id} href={`/${locale}/war-crimes?tagIds=${tag._id}`}>
                        <Badge
                          variant="secondary"
                          className="text-[10px] hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Documents */}
              {relatedDocuments.length > 0 && (
                <div className="rounded-2xl glass-strong p-5 border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-offwhite">{t("relatedDocuments")}</h3>
                    <Badge variant="outline" className="border-white/10 text-slate-body/60 text-xs ms-auto">
                      {relatedDocuments.length}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {relatedDocuments.slice(0, 3).map((relDoc) => {
                      const previewFile = relDoc.documentFiles?.find(
                        (f) => f.mimeType?.startsWith("image/") && f.name,
                      );
                      return (
                        <Link
                          key={relDoc._id}
                          href={`/${locale}/documents/${relDoc._id}`}
                          className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2.5 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                        >
                          <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden bg-white/[0.04] flex items-center justify-center border border-white/[0.04]">
                            {previewFile ? (
                              <Image
                                src={getImageUploadUrl(previewFile.name, "image")}
                                alt=""
                                width={36}
                                height={36}
                                unoptimized
                                className="h-9 w-9 object-cover"
                              />
                            ) : (
                              <svg className="h-4 w-4 text-slate-body/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-offwhite truncate group-hover:text-gold transition-colors">
                              {relDoc.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {relDoc.selected_language && (
                                <span className="text-[10px] text-slate-body/50 uppercase">
                                  {LANGUAGE_NAMES[relDoc.selected_language] || relDoc.selected_language}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-body/50">
                                {relDoc.documentFiles?.length || 0} files
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {relatedDocuments.length > 3 && (
                    <div className="mt-3 text-center">
                      <Button
                        variant="ghost"
                        asChild
                        className="text-xs text-slate-body/50 hover:text-offwhite"
                      >
                        <Link href={`/${locale}/documents?reportId=${linkedReportId}`}>
                          +{relatedDocuments.length - 3} more
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function FileTypeIcon({ mimeType }: { mimeType?: string }) {
  if (!mimeType) {
    return <svg className="h-4 w-4 text-slate-body/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
  }
  if (mimeType.startsWith("image/")) {
    return (
      <svg className="h-4 w-4 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (mimeType.startsWith("video/")) {
    return (
      <svg className="h-4 w-4 text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 text-slate-body/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
