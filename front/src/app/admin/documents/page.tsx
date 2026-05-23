import { gets as getDocuments } from "@/app/actions/document/gets";
import { count as countDocuments } from "@/app/actions/document/count";
import { gets as getReports } from "@/app/actions/report/gets";
import { ReqType } from "@/types/declarations";
import { AdminDocumentsClient } from "./admin-documents-client";

export const metadata = {
  title: "Documents Management — ZiWound Admin",
  description: "Manage and review evidence documents",
};

interface SearchParams {
  page?: string;
  search?: string;
  type?: string;
  report?: string;
  selected_language?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const type = resolvedSearchParams.type || "all";
  const report = resolvedSearchParams.report || "all";
  const selected_language = resolvedSearchParams.selected_language || "all";
  const createdAtFrom = resolvedSearchParams.createdAtFrom || "";
  const createdAtTo = resolvedSearchParams.createdAtTo || "";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["document"]["gets"]["set"] = {
    page,
    limit: 12,
  };
  if (search) setQuery.search = search;
  if (type !== "all")
    setQuery.documentTypes = [type as "image" | "video" | "docs"];
  if (report !== "all") setQuery.reportId = report;
  if (selected_language !== "all")
    setQuery.selected_language =
      selected_language as ReqType["main"]["document"]["gets"]["set"]["selected_language"];
  setQuery.sortBy =
    sortBy as ReqType["main"]["document"]["gets"]["set"]["sortBy"];
  setQuery.sortOrder =
    sortOrder as ReqType["main"]["document"]["gets"]["set"]["sortOrder"];

  const documentsProjection = {
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
  } as const;

  const [documentsResponse, reportsResponse, countResponse] =
    await Promise.all([
      getDocuments(setQuery, documentsProjection),
      getReports({ page: 1, limit: 200 }, { _id: 1, title: 1 }),
      countDocuments({} as any, { qty: 1 } as any),
    ]);

  const extractList = (res: any) =>
    res?.success
      ? Array.isArray(res.body)
        ? res.body
        : res.body?.list || []
      : [];

  const documents = extractList(documentsResponse);
  const reports = extractList(reportsResponse);

  const totalCount =
    countResponse?.success && typeof countResponse.body === "object"
      ? (countResponse.body as { qty?: number }).qty ?? 0
      : 0;

  const getCount = (res: any) =>
    res?.success && typeof res.body === "object"
      ? (res.body as { qty?: number }).qty ?? 0
      : 0;

  const computeFileTypeCounts = (docs: any[]) => {
    let images = 0;
    let videos = 0;
    let documents = 0;
    docs.forEach((doc: any) => {
      const files = doc.documentFiles || [];
      if (files.length === 0) {
        documents++;
        return;
      }
      const firstType = files[0]?.type;
      if (firstType === "image") images++;
      else if (firstType === "video") videos++;
      else documents++;
    });
    return { images, videos, documents };
  };

  const typeCounts = computeFileTypeCounts(documents);

  const error =
    !documentsResponse?.success
      ? documentsResponse?.body?.message || "Failed to fetch documents"
      : null;

  const currentParams = {
    page,
    search,
    type,
    report,
    selected_language,
    createdAtFrom,
    createdAtTo,
    sortBy,
    sortOrder,
  };

  return (
    <AdminDocumentsClient
      documents={documents}
      reports={reports}
      totalCount={totalCount}
      typeCounts={typeCounts}
      error={error}
      currentParams={currentParams}
    />
  );
}
