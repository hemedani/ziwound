import { getTranslations } from "next-intl/server";
import { gets as getReports } from "@/app/actions/report/gets";
import { gets as getCategories } from "@/app/actions/category/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ReportsTable } from "./reports-table";
import { ReqType } from "@/types/declarations";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "all";
  const priority = resolvedSearchParams.priority || "all";
  const category = resolvedSearchParams.category || "all";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["report"]["gets"]["set"] = { page, limit: 10 };
  if (search) setQuery.search = search;
  if (status !== "all") setQuery.status = status as ReqType["main"]["report"]["gets"]["set"]["status"];
  if (priority !== "all")
    setQuery.priority = priority as ReqType["main"]["report"]["gets"]["set"]["priority"];
  if (category !== "all") setQuery.categoryIds = [category];
  setQuery.sortBy = sortBy as ReqType["main"]["report"]["gets"]["set"]["sortBy"];
  setQuery.sortOrder = sortOrder as ReqType["main"]["report"]["gets"]["set"]["sortOrder"];

  // Fetch categories for filter
  const categoriesResponse = await getCategories({ page: 1, limit: 100 }, { _id: 1, name: 1 });
  let categories: { _id: string; name: string }[] = [];
  if (categoriesResponse?.success) {
    categories = Array.isArray(categoriesResponse.body)
      ? categoriesResponse.body
      : categoriesResponse.body?.list || [];
  }

  // Fetch reports
  const response = await getReports(setQuery, {
    _id: 1,
    title: 1,
    status: 1,
    priority: 1,
    createdAt: 1,
    category: { _id: 1, name: 1 },
  });

  let reports: Array<{
    _id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
    category?: { _id: string; name: string };
  }> = [];
  let error: string | null = null;
  if (response?.success) {
    reports = Array.isArray(response.body) ? response.body : response.body?.list || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch reports";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("reportsManagement")}</h1>
          <p className="text-muted-foreground">{t("reportsManagementDescription")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("searchPlaceholder") || "Search..."}
              defaultValue={search}
              className="ps-8"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="status" defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses") || "All Statuses"}</SelectItem>
                <SelectItem value="Pending">{t("status_pending")}</SelectItem>
                <SelectItem value="Approved">{t("status_approved")}</SelectItem>
                <SelectItem value="Rejected">{t("status_rejected")}</SelectItem>
                <SelectItem value="InReview">{t("status_in_review")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="priority" defaultValue={priority}>
              <SelectTrigger>
                <SelectValue placeholder={t("priority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allPriorities") || "All Priorities"}</SelectItem>
                <SelectItem value="Low">{t("priority_low")}</SelectItem>
                <SelectItem value="Medium">{t("priority_medium")}</SelectItem>
                <SelectItem value="High">{t("priority_high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select name="category" defaultValue={category}>
              <SelectTrigger>
                <SelectValue placeholder={t("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories") || "All Categories"}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
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
                <SelectItem value="status">{t("status")}</SelectItem>
                <SelectItem value="priority">{t("priority")}</SelectItem>
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

      <ReportsTable reports={reports} error={error} />

      <div className="flex items-center justify-end space-x-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/reports?page=${page - 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}${priority !== "all" ? `&priority=${priority}` : ""}${category !== "all" ? `&category=${category}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("previous") || "Previous"}
          </Button>
        )}
        {reports.length >= 10 ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/admin/reports?page=${page + 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}${priority !== "all" ? `&priority=${priority}` : ""}${category !== "all" ? `&category=${category}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
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
