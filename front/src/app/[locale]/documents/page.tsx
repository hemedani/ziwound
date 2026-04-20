import { getTranslations } from "next-intl/server";
import { gets as getDocuments } from "@/app/actions/document/gets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Download, Eye, Calendar, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ReqType } from "@/types/declarations";
import { getLesanBaseUrl } from "@/lib/api";

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "pa", name: "Punjabi" },
  { code: "de", name: "German" },
  { code: "id", name: "Indonesian" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "tr", name: "Turkish" },
  { code: "ta", name: "Tamil" },
  { code: "vi", name: "Vietnamese" },
  { code: "ko", name: "Korean" },
  { code: "it", name: "Italian" },
  { code: "fa", name: "Persian" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "pl", name: "Polish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ro", name: "Romanian" },
];

export default async function PublicDocumentsPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    language?: string;
  }>;
  params: Promise<{ locale: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const t = await getTranslations("documents");
  const tCommon = await getTranslations("common");

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const language = resolvedSearchParams.language || "all";

  const setQuery: ReqType["main"]["document"]["gets"]["set"] = { page, limit: 12 };
  if (search) setQuery.search = search;
  if (language !== "all")
    setQuery.language = language as ReqType["main"]["document"]["gets"]["set"]["language"];

  const response = await getDocuments(setQuery, {
    _id: 1,
    title: 1,
    description: 1,
    language: 1,
    createdAt: 1,
    documentFiles: {
      _id: 1,
      name: 1,
      mimeType: 1,
    },
    report: {
      _id: 1,
      title: 1,
    },
  });

  let documents: any[] = [];
  let totalPages = 1;
  let totalCount = 0;
  let error: string | null = null;

  if (response?.success) {
    const responseData = response.body as any;
    documents = Array.isArray(responseData) ? responseData : responseData?.list || [];
    totalPages = responseData?.totalPages || 1;
    totalCount = responseData?.totalCount || documents.length;
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch documents";
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col space-y-6 md:space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {t("title") || "Public Documents"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("description") || "Explore and download public documents, evidence, and reports related to documented incidents."}
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm">
          <form method="GET" className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder={t("searchPlaceholder") || "Search by title or description..."}
                defaultValue={search}
                className="ps-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select name="language" defaultValue={language}>
                <SelectTrigger>
                  <SelectValue placeholder={t("language") || "Language"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allLanguages") || "All Languages"}</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              {t("search") || "Search"}
            </Button>
            {(search || language !== "all") && (
              <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/documents">{tCommon("clear") || "Clear"}</Link>
              </Button>
            )}
          </form>
        </div>

        {error ? (
          <div className="text-center py-12 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
            <p>{error}</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-24 bg-card border rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">{t("noDocuments") || "No documents found"}</h3>
            <p className="text-muted-foreground mt-2">
              {t("tryAdjustingSearch") || "Try adjusting your search criteria or clear the filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc._id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                      <Globe className="h-3 w-3" />
                      {languages.find((l) => l.code === doc.language)?.name || doc.language || "Unknown"}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(doc.createdAt).toLocaleDateString(locale)}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 leading-tight">{doc.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2 text-sm">
                    {doc.description || (t("noDescription") || "No description provided.")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end pt-0">
                  {doc.report && doc.report.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        {t("linkedReports") || "Linked Reports"}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {doc.report.slice(0, 2).map((r: any) => (
                          <Badge key={r._id} variant="secondary" className="text-xs font-normal max-w-full truncate">
                            {r.title}
                          </Badge>
                        ))}
                        {doc.report.length > 2 && (
                          <Badge variant="secondary" className="text-xs font-normal">
                            +{doc.report.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mt-auto pt-4 border-t">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      {t("files") || "Files"} ({doc.documentFiles?.length || 0})
                    </p>
                    {doc.documentFiles && doc.documentFiles.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {doc.documentFiles.slice(0, 3).map((file: any) => (
                          <div key={file._id} className="flex items-center justify-between bg-muted/50 rounded-md p-2 text-sm">
                            <span className="truncate mr-2 max-w-[150px] font-medium" title={file.name}>
                              {file.name || "Document"}
                            </span>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" asChild>
                              <a href={`${getLesanBaseUrl()}/file/download?id=${file._id}`} download>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">{tCommon("download")}</span>
                              </a>
                            </Button>
                          </div>
                        ))}
                        {doc.documentFiles.length > 3 && (
                          <div className="text-xs text-center text-muted-foreground mt-1">
                            +{doc.documentFiles.length - 3} {t("moreFiles") || "more files"}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        {t("noFiles") || "No files attached"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!error && documents.length > 0 && (
          <div className="flex items-center justify-center space-x-2 pt-8">
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <Link
                href={`/documents?page=${page - 1}${search ? `&search=${search}` : ""}${
                  language !== "all" ? `&language=${language}` : ""
                }`}
              >
                {tCommon("previous")}
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              {t("pageInfo", { page, totalPages }) || `Page ${page} of ${totalPages || Math.ceil(totalCount / 12) || 1}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={documents.length < 12}
              className={documents.length < 12 ? "pointer-events-none opacity-50" : ""}
            >
              <Link
                href={`/documents?page=${page + 1}${search ? `&search=${search}` : ""}${
                  language !== "all" ? `&language=${language}` : ""
                }`}
              >
                {tCommon("next")}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
