import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/regionalManagerRequest/gets";
import { count } from "@/app/actions/regionalManagerRequest/count";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RegionalRequestsClient } from "./_components/regional-requests-client";
import { ReqType, regionalManagerRequestSchema } from "@/types/declarations";

interface SearchParams {
  page?: string;
  search?: string;
  status?: string;
  areaType?: string;
  userId?: string;
}

export default async function AdminRegionalRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "";
  const areaType = resolvedSearchParams.areaType || "";
  const userId = resolvedSearchParams.userId || "";

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
    }
    const s = sp.toString();
    return s ? `?${s}` : "";
  };

  const tabs = [
    { value: "", label: t("allStatuses") },
    { value: "Pending", label: t("status_Pending") },
    { value: "Approved", label: t("activeManagers") },
    { value: "Rejected", label: t("status_Rejected") },
  ];

  const activeFilters = { search, areaType, userId };
  const tabHref = (tabStatus: string) =>
    `/admin/regional-requests${buildQueryString({ ...activeFilters, status: tabStatus || undefined })}`;

  const setQuery: ReqType["main"]["regionalManagerRequest"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  };
  if (search) setQuery.search = search;
  if (status) setQuery.status = status as "Pending" | "Approved" | "Rejected";
  if (areaType) setQuery.areaType = areaType as "Country" | "Province" | "City";
  if (userId) setQuery.userIds = [userId];

  const response = await gets(setQuery, {
    _id: 1,
    status: 1,
    areaType: 1,
    justification: 1,
    reviewNote: 1,
    decidedAt: 1,
    createdAt: 1,
    user: { _id: 1, first_name: 1, last_name: 1, email: 1, level: 1 },
    country: { _id: 1, name: 1 },
    province: { _id: 1, name: 1 },
    city: { _id: 1, name: 1 },
    reviewedBy: { _id: 1, first_name: 1, last_name: 1 },
  });

  const totalRes = await count(
    { ...(status ? { status: status as "Pending" | "Approved" | "Rejected" } : {}), ...(search ? { search } : {}) },
    { qty: 1 as const },
  );

  let requests: regionalManagerRequestSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    const body = response.body as
      | regionalManagerRequestSchema[]
      | { list?: regionalManagerRequestSchema[] }
      | null;
    requests = Array.isArray(body) ? body : (body?.list || []);
  } else {
    error = response?.body?.message || "Failed to fetch requests";
  }

  const listQuery = { ...activeFilters, status: status || undefined };
  const prevPageUrl = page > 1 ? `/admin/regional-requests${buildQueryString({ ...listQuery, page: String(page - 1) })}` : "";
  const nextPageUrl = requests.length >= 20 ? `/admin/regional-requests${buildQueryString({ ...listQuery, page: String(page + 1) })}` : "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-offwhite">{t("regionalRequests")}</h1>
        <p className="text-sm text-slate-body">{t("regionalRequestsDescription")}</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 w-fit max-w-full">
        {tabs.map((tab) => (
          <Link
            key={tab.value || "all"}
            href={tabHref(tab.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
              status === tab.value
                ? "bg-crimson text-white"
                : "text-slate-body hover:text-offwhite hover:bg-white/5",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Filter form */}
      <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        {status && <input type="hidden" name="status" value={status} />}
        {userId && <input type="hidden" name="userId" value={userId} />}
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("search") || "Search..."}
            defaultValue={search}
            className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>
        <select
          name="areaType"
          defaultValue={areaType}
          className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-offwhite"
        >
          <option value="">{t("allTypes")}</option>
          <option value="Country">{t("areaType_Country")}</option>
          <option value="Province">{t("areaType_Province")}</option>
          <option value="City">{t("areaType_City")}</option>
        </select>
        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
          {t("search") || "Search"}
        </Button>
        {(search || areaType || userId) && (
          <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
            <Link href={tabHref(status)}>
              {t("clear") || "Clear"}
            </Link>
          </Button>
        )}
      </form>

      {userId && (
        <div className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/[0.06] px-3 py-2 text-sm text-offwhite w-fit">
          {t("filterByUser")}
          <Link
            href={tabHref(status)}
            className="inline-flex items-center gap-1 text-slate-body hover:text-offwhite"
            aria-label={t("clear") || "Clear"}
          >
            <X className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <RegionalRequestsClient requests={requests} error={error} activeStatus={status} />

      <div className="flex items-center justify-between">
        {prevPageUrl && (
          <Button variant="glass" size="sm" asChild>
            <Link href={prevPageUrl}>{t("previous")}</Link>
          </Button>
        )}
        <span className="text-sm text-slate-body/60">
          {(totalRes?.success && (totalRes.body as { qty?: number })?.qty) || 0}
        </span>
        {nextPageUrl && (
          <Button variant="glass" size="sm" asChild>
            <Link href={nextPageUrl}>{t("next")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
