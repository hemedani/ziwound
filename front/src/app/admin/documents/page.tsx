import { getTranslations } from "next-intl/server";
import { gets as getDocuments } from "@/app/actions/document/gets";
import { gets as getReports } from "@/app/actions/report/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Edit } from "lucide-react";
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
    selected_language?: string;
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
  const selected_language = resolvedSearchParams.selected_language || "all";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["document"]["gets"]["set"] = { page, limit: 10 };
  if (search) setQuery.search = search;
  if (type !== "all") setQuery.documentTypes = [type as "image" | "video" | "docs"];
  if (report !== "all") setQuery.reportId = report;
  if (selected_language !== "all")
    setQuery.selected_language = selected_language as ReqType["main"]["document"]["gets"]["set"]["selected_language"];
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
    selected_language: 1,
    report: { _id: 1, title: 1 },
    createdAt: 1,
  });

  let documents: Array<{
    _id: string;
    title: string;
    type: string;
    selected_language?: string;
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
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel") || "Admin Panel"}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("documentsManagement") || "Documents Management"}
          </h1>
          <p className="text-slate-body mt-1">
            {t("documentsManagementDescription") || "Manage and view uploaded documents"}
          </p>
        </div>
        <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
          <Link href="/admin/documents/new">{t("addDocument") || "Add Document"}</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center rounded-2xl glass-light p-5 border border-white/[0.06]">
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-s-2 top-2.5 h-4 w-4 text-slate-body" />
            <Input
              name="search"
              placeholder={t("searchPlaceholder") || "Search documents..."}
              defaultValue={search}
              className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="type" defaultValue={type}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("type") || "Type"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="all">{t("allTypes") || "All Types"}</SelectItem>
                <SelectItem value="image">{t("documentTypeImage")}</SelectItem>
                <SelectItem value="video">{t("documentTypeVideo")}</SelectItem>
                <SelectItem value="docs">{t("documentTypeDocument")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="selected_language" defaultValue={selected_language}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("language") || "Language"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
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
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("report") || "Report"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
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
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("sortBy") || "Sort By"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="createdAt">{t("date")}</SelectItem>
                <SelectItem value="title">{t("title")}</SelectItem>
                <SelectItem value="type">{t("type")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("sortOrder") || "Order"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="desc">{t("descending") || "Descending"}</SelectItem>
                <SelectItem value="asc">{t("ascending") || "Ascending"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
            {t("applyFilters") || "Filter"}
          </Button>
        </form>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-crimson-light">{error}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-slate-body">{t("title")}</TableHead>
                <TableHead className="text-slate-body">{t("type")}</TableHead>
                <TableHead className="text-slate-body">{t("language") || "Language"}</TableHead>
                <TableHead className="text-slate-body">{t("report") || "Report"}</TableHead>
                <TableHead className="text-slate-body">{t("date")}</TableHead>
                <TableHead className="text-right text-slate-body">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell colSpan={6} className="text-center py-8 text-slate-body">
                    {t("noDocuments") || "No documents found"}
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                    <TableCell className="font-medium text-offwhite">{doc.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-white/5 text-slate-body border-white/10">
                        {doc.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {doc.selected_language ? (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-white/5 text-slate-body border-white/10">
                          {languages.find((l) => l.code === doc.selected_language)?.name || doc.selected_language}
                        </span>
                      ) : (
                        <span className="text-slate-body">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.report && doc.report.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {doc.report.slice(0, 2).map((report) => (
                            <span key={report._id} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-white/5 text-slate-body border-white/10">
                              {report.title}
                            </span>
                          ))}
                          {doc.report.length > 2 && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-white/5 text-slate-body border-white/10">
                              +{doc.report.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-body">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-body">{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong border-white/10">
                          <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                            <Link href={`/admin/documents/${doc._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("viewDetails") || "View"}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
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

      <div className="flex items-center justify-end gap-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/documents?page=${page - 1}${search ? `&search=${search}` : ""}${type !== "all" ? `&type=${type}` : ""}${report !== "all" ? `&report=${report}` : ""}${selected_language !== "all" ? `&selected_language=${selected_language}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {documents.length >= 10 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/documents?page=${page + 1}${search ? `&search=${search}` : ""}${type !== "all" ? `&type=${type}` : ""}${report !== "all" ? `&report=${report}` : ""}${selected_language !== "all" ? `&selected_language=${selected_language}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("next") || "Next"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("next") || "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
