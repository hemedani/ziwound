import { getTranslations } from "next-intl/server";
import { gets as getDocuments } from "@/app/actions/document/gets";
import { gets as getReports } from "@/app/actions/report/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReqType } from "@/types/declarations";
import { DeleteDocumentMenuItem } from "./_components/delete-document-button";

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

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
    report?: string;
    language?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const type = resolvedSearchParams.type || "all";
  const report = resolvedSearchParams.report || "all";
  const language = resolvedSearchParams.language || "all";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["document"]["gets"]["set"] = { page, limit: 10 };
  if (search) setQuery.search = search;
  if (type !== "all") setQuery.documentTypes = [type as "image" | "video" | "docs"];
  if (report !== "all") setQuery.reportId = report;
  if (language !== "all") setQuery.language = language as any;
  setQuery.sortBy = sortBy as ReqType["main"]["document"]["gets"]["set"]["sortBy"];
  setQuery.sortOrder = sortOrder as ReqType["main"]["document"]["gets"]["set"]["sortOrder"];

  // Fetch reports for filter
  const reportsResponse = await getReports({ page: 1, limit: 100 }, { _id: 1, title: 1 });
  let reports: { _id: string; title: string }[] = [];
  if (reportsResponse?.success) {
    reports = Array.isArray(reportsResponse.body)
      ? reportsResponse.body
      : reportsResponse.body?.list || [];
  }

  // Fetch documents
  const response = await getDocuments(setQuery, {
    _id: 1,
    title: 1,
    language: 1,
    report: { _id: 1, title: 1 },
    createdAt: 1,
  });

  let documents: Array<{
    _id: string;
    title: string;
    type: string;
    language?: string;
    report?: Array<{ _id: string; title: string }>;
    createdAt: string;
  }> = [];
  let error: string | null = null;
  if (response?.success) {
    documents = Array.isArray(response.body) ? response.body : response.body?.list || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch documents";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("documentsManagement") || "Documents Management"}
          </h1>
          <p className="text-muted-foreground">
            {t("documentsManagementDescription") || "Manage and view uploaded documents"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/documents/new">{t("addDocument") || "Add Document"}</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-s-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("searchPlaceholder") || "Search documents..."}
              defaultValue={search}
              className="ps-8"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="type" defaultValue={type}>
              <SelectTrigger>
                <SelectValue placeholder={t("type") || "Type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes") || "All Types"}</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="docs">Document</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="w-full sm:w-48">
            <Select name="report" defaultValue={report}>
              <SelectTrigger>
                <SelectValue placeholder={t("report") || "Report"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allReports") || "All Reports"}</SelectItem>
                {reports.map((rep) => (
                  <SelectItem key={rep._id} value={rep._id}>
                    {rep.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortBy") || "Sort By"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{t("date")}</SelectItem>
                <SelectItem value="title">{t("title")}</SelectItem>
                <SelectItem value="type">{t("type")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger>
                <SelectValue placeholder={t("sortOrder") || "Order"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t("descending") || "Descending"}</SelectItem>
                <SelectItem value="asc">{t("ascending") || "Ascending"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="secondary">
            {t("applyFilters") || "Filter"}
          </Button>
        </form>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("title")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("language") || "Language"}</TableHead>
                <TableHead>{t("report") || "Report"}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t("noDocuments") || "No documents found"}
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {doc.language ? (
                        <Badge variant="outline">
                          {languages.find((l) => l.code === doc.language)?.name || doc.language}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.report && doc.report.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {doc.report.slice(0, 2).map((report) => (
                            <Badge key={report._id} variant="outline" className="text-xs">
                              {report.title}
                            </Badge>
                          ))}
                          {doc.report.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.report.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/documents/${doc._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("viewDetails") || "View"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/documents/${doc._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("edit")}
                            </Link>
                          </DropdownMenuItem>
                          <DeleteDocumentMenuItem id={doc._id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/documents?page=${page - 1}${search ? `&search=${search}` : ""}${type !== "all" ? `&type=${type}` : ""}${report !== "all" ? `&report=${report}` : ""}${language !== "all" ? `&language=${language}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("previous") || "Previous"}
          </Button>
        )}
        {documents.length >= 10 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/documents?page=${page + 1}${search ? `&search=${search}` : ""}${type !== "all" ? `&type=${type}` : ""}${report !== "all" ? `&report=${report}` : ""}${language !== "all" ? `&language=${language}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("next") || "Next"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("next") || "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
