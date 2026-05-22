import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { gets as getDocuments } from "@/app/actions/document/gets";
import { count as countDocuments } from "@/app/actions/document/count";
import { DocumentHero } from "@/components/documents/document-hero";
import { DocumentStatsBar } from "@/components/documents/document-stats-bar";
import { DocumentFilters } from "@/components/documents/document-filters";
import { DocumentCard } from "@/components/documents/document-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, ChevronRight, LayoutGrid, List, FileText } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { ReqType } from "@/types/declarations";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    selected_language?: string;
    documentType?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
  }>;
  params: Promise<{ locale: string }>;
}

interface DocumentFile {
  _id: string;
  name: string;
  mimeType?: string;
  type?: "image" | "video" | "docs";
}

interface LinkedReport {
  _id: string;
  title: string;
}

interface DocumentItem {
  _id: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt: string;
  documentFiles?: DocumentFile[];
  report?: LinkedReport[];
}

type DocumentTypeFilter = "image" | "video" | "docs" | "all";

export default async function PublicDocumentsPage({
  searchParams,
  params,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const t = await getTranslations({ locale, namespace: "documents" });

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const selected_language = resolvedSearchParams.selected_language || "";
  const documentType = (resolvedSearchParams.documentType || "all") as DocumentTypeFilter;
  const dateFrom = resolvedSearchParams.dateFrom || "";
  const dateTo = resolvedSearchParams.dateTo || "";
  const view = resolvedSearchParams.view || "grid";

  const limit = 12;

  const filter: Record<string, unknown> = {};
  if (search) filter.search = search;
  if (selected_language) filter.selected_language = selected_language;

  const setQuery: ReqType["main"]["document"]["gets"]["set"] = {
    page,
    limit,
    ...(Object.keys(filter).length > 0 ? { filter } : {}),
  };

  const response = await getDocuments(setQuery, {
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
    report: {
      _id: 1,
      title: 1,
    },
  });

  const countResponse = await countDocuments({});

  let documents: DocumentItem[] = [];
  let totalPages = 1;
  let totalCount = 0;
  let error: string | null = null;

  if (response?.success) {
    const responseData = response.body as
      | { list: DocumentItem[]; totalPages?: number; totalCount?: number }
      | DocumentItem[];
    documents = Array.isArray(responseData) ? responseData : responseData?.list || [];
    totalCount =
      !Array.isArray(responseData) && responseData?.totalCount
        ? responseData.totalCount
        : documents.length;
  } else {
    error =
      response?.body && typeof response.body === "object" && "message" in response.body
        ? (response.body as { message: string }).message
        : t("errorOccurred");
  }

  if (countResponse?.success && countResponse.body) {
    const countBody = countResponse.body as Record<string, unknown>;
    const countVal = Object.values(countBody).find((v): v is number => typeof v === "number");
    if (countVal !== undefined) totalCount = countVal;
  }

  if (documentType !== "all") {
    documents = documents.filter((doc) =>
      doc.documentFiles?.some((f) => f.type === documentType)
    );
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    documents = documents.filter((doc) => new Date(doc.createdAt) >= fromDate);
  }
  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999);
    documents = documents.filter((doc) => new Date(doc.createdAt) <= toDate);
  }

  totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const totalFiles = documents.reduce(
    (sum, doc) => sum + (doc.documentFiles?.length || 0),
    0
  );
  const languagesCovered = new Set(
    documents.map((doc) => doc.selected_language).filter(Boolean)
  ).size;
  const reportsLinked = documents.reduce(
    (sum, doc) => sum + (doc.report?.length || 0),
    0
  );

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (selected_language) queryParams.set("selected_language", selected_language);
  if (documentType !== "all") queryParams.set("documentType", documentType);
  if (dateFrom) queryParams.set("dateFrom", dateFrom);
  if (dateTo) queryParams.set("dateTo", dateTo);
  if (view) queryParams.set("view", view);

  const getPageUrl = (p: number) => {
    const qp = new URLSearchParams(queryParams);
    qp.set("page", String(p));
    return `/documents?${qp.toString()}`;
  };

  const getViewUrl = (v: string) => {
    const qp = new URLSearchParams(queryParams);
    qp.set("view", v);
    qp.set("page", "1");
    return `/documents?${qp.toString()}`;
  };

  const translations = {
    overline: t("overline"),
    title: t("pageTitle"),
    description: t("pageDescription"),
    documentsLabel: t("documentsLabel"),
    filesLabel: t("filesLabel"),
    languagesLabel: t("languagesLabel"),
    totalDocuments: t("totalDocuments"),
    totalFiles: t("totalFiles"),
    languagesCovered: t("languagesCovered"),
    reportsLinked: t("reportsLinked"),
  };

  return (
    <div className="min-h-screen bg-background">
      <DocumentHero
        totalDocuments={totalCount}
        totalFiles={totalFiles}
        languagesCovered={languagesCovered}
        translations={translations}
      />

      <DocumentStatsBar
        totalDocuments={totalCount}
        totalFiles={totalFiles}
        languagesCovered={languagesCovered}
        reportsLinked={reportsLinked}
        translations={translations}
      />

      <div className="container px-4 md:px-8 py-10">
        <div className="mb-8">
          <DocumentFilters
            locale={locale}
            initialSearch={search}
            initialLanguage={selected_language || "all"}
            initialDocumentType={documentType}
            initialDateFrom={dateFrom}
            initialDateTo={dateTo}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-body/60">
            {totalCount > 0
              ? `${Math.min((page - 1) * limit + 1, totalCount)}–${Math.min(page * limit, totalCount)} ${t("of")} ${totalCount} ${t("documentsLabel").toLowerCase()}`
              : t("noDocuments")}
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
            <Link
              href={getViewUrl("grid")}
              className={`p-2 rounded-lg transition-colors ${
                view === "grid"
                  ? "bg-crimson/15 text-crimson-light"
                  : "text-slate-body/40 hover:text-offwhite hover:bg-white/5"
              }`}
              aria-label={t("gridView")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Link>
            <Link
              href={getViewUrl("list")}
              className={`p-2 rounded-lg transition-colors ${
                view === "list"
                  ? "bg-crimson/15 text-crimson-light"
                  : "text-slate-body/40 hover:text-offwhite hover:bg-white/5"
              }`}
              aria-label={t("listView")}
            >
              <List className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {error ? (
          <ErrorState
            title={t("error")}
            description={error}
            className="py-16"
          />
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t("noDocuments")}
            description={t("tryAdjustingSearch")}
            className="py-20"
          />
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc, i) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                locale={locale}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <ListDocumentRow key={doc._id} document={doc} locale={locale} index={i} />
            ))}
          </div>
        )}

        {!error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-10 pb-6">
            <Link
              href={getPageUrl(page - 1)}
              className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-sm text-offwhite hover:bg-white/10 transition-all ${
                page <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("previous")}
            </Link>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - page) <= 1) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <span key={p} className="flex items-center">
                      {showEllipsis && (
                        <span className="text-xs text-slate-body/40 px-1">...</span>
                      )}
                      {p === page ? (
                        <span className="h-9 w-9 flex items-center justify-center rounded-xl bg-crimson/20 text-crimson-light text-sm font-semibold border border-crimson/30">
                          {p}
                        </span>
                      ) : (
                        <Link
                          href={getPageUrl(p)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl text-sm text-slate-body/60 hover:text-offwhite hover:bg-white/5 transition-colors"
                        >
                          {p}
                        </Link>
                      )}
                    </span>
                  );
                })}
            </div>

            <Link
              href={getPageUrl(page + 1)}
              className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-sm text-offwhite hover:bg-white/10 transition-all ${
                page >= totalPages ? "pointer-events-none opacity-40" : ""
              }`}
              aria-disabled={page >= totalPages}
              tabIndex={page >= totalPages ? -1 : undefined}
            >
              {t("next")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ListDocumentRow({
  document: doc,
  locale,
  index,
}: {
  document: DocumentItem;
  locale: string;
  index: number;
}) {
  const firstImage = doc.documentFiles?.find(
    (f) => f.mimeType?.startsWith("image/") && f.name
  );

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${index * 40}ms`,
        animationFillMode: "both",
      }}
    >
      <Link
        href={`/${locale}/reports/${doc.report?.[0]?._id || ""}`}
        className="group flex items-center gap-4 p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300"
      >
        <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          {firstImage ? (
            <Image
              src={getImageUploadUrl(firstImage.name, firstImage.type || "image")}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <FileText className="h-5 w-5 text-slate-body/30" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-offwhite truncate group-hover:text-gold transition-colors">
            {doc.title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-body/50">
            {doc.selected_language && <span>{doc.selected_language.toUpperCase()}</span>}
            <span>{new Date(doc.createdAt).toLocaleDateString(locale)}</span>
            {doc.documentFiles && (
              <span>
                {doc.documentFiles.length} {doc.documentFiles.length === 1 ? "file" : "files"}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-slate-body/20 group-hover:text-crimson-light transition-colors shrink-0" />
      </Link>
    </div>
  );
}
