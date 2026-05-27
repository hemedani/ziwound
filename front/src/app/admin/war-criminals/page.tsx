import { gets } from "@/app/actions/warCriminal/gets";
import { count } from "@/app/actions/warCriminal/count";
import { AdminWarCriminalsClient } from "./_components/admin-war-criminals-client";
import { ReqType, warCriminalSchema } from "@/types/declarations";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchParams {
  page?: string;
  search?: string;
  status?: string;
  affiliation?: string;
  isEntity?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminWarCriminalsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status && resolvedSearchParams.status !== "all" ? resolvedSearchParams.status : "";
  const affiliation = resolvedSearchParams.affiliation && resolvedSearchParams.affiliation !== "all" ? resolvedSearchParams.affiliation : "";
  const isEntity = resolvedSearchParams.isEntity;
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["warCriminal"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: sortBy as "fullName" | "status" | "affiliation" | "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (search) setQuery.search = search;
  if (status) setQuery.status = status as "Accused" | "Indicted" | "Convicted" | "At Large" | "Deceased" | "Sanctioned";
  if (affiliation) setQuery.affiliation = affiliation as "Military" | "Paramilitary" | "Government" | "Rebel Group" | "Private Military Company" | "Political" | "Other";
  if (isEntity === "true") setQuery.isEntity = true;
  else if (isEntity === "false") setQuery.isEntity = false;

  const response = await gets(setQuery, {
    _id: 1,
    fullName: 1,
    aliases: 1,
    affiliation: 1,
    status: 1,
    isEntity: 1,
    createdAt: 1,
    photo: { _id: 1, name: 1 },
  });

  const totalRes = await count({}, { qty: "1" as const });

  let warCriminals: warCriminalSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    warCriminals = response.body || [];
  } else {
    error = response?.body?.message || "Failed to fetch war criminals";
  }

  const getCount = (res: { success?: boolean; body?: unknown }) =>
    res?.success && typeof res.body === "object" && res.body !== null
      ? ((res.body as Record<string, unknown>)?.qty as number) ?? 0
      : 0;

  const totalCount = getCount(totalRes);
  const individualsCount = warCriminals.filter((wc: warCriminalSchema) => !wc.isEntity).length;
  const entitiesCount = warCriminals.filter((wc: warCriminalSchema) => wc.isEntity).length;

  const queryString = `${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${affiliation ? `&affiliation=${affiliation}` : ""}${isEntity !== undefined ? `&isEntity=${isEntity}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  const prevPageUrl = page > 1 ? `/admin/war-criminals?page=${page - 1}${queryString}` : "";
  const nextPageUrl = warCriminals.length >= 20 ? `/admin/war-criminals?page=${page + 1}${queryString}` : "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Filter form */}
      <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("searchWarCriminals") || "Search war criminals..."}
            defaultValue={search}
            className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>

        <Select name="status" defaultValue={status || "all"}>
          <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-offwhite">
            <SelectValue placeholder={t("allStatuses") || "All Statuses"} />
          </SelectTrigger>
          <SelectContent className="glass-strong border-white/10">
            <SelectItem value="all">{t("allStatuses") || "All Statuses"}</SelectItem>
            <SelectItem value="Accused">{t("Accused") || "Accused"}</SelectItem>
            <SelectItem value="Indicted">{t("Indicted") || "Indicted"}</SelectItem>
            <SelectItem value="Convicted">{t("Convicted") || "Convicted"}</SelectItem>
            <SelectItem value="At Large">{t("atLarge") || "At Large"}</SelectItem>
            <SelectItem value="Deceased">{t("Deceased") || "Deceased"}</SelectItem>
            <SelectItem value="Sanctioned">{t("Sanctioned") || "Sanctioned"}</SelectItem>
          </SelectContent>
        </Select>

        <Select name="affiliation" defaultValue={affiliation || "all"}>
          <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-offwhite">
            <SelectValue placeholder={t("allAffiliations") || "All Affiliations"} />
          </SelectTrigger>
          <SelectContent className="glass-strong border-white/10">
            <SelectItem value="all">{t("allAffiliations") || "All Affiliations"}</SelectItem>
            <SelectItem value="Military">{t("Military") || "Military"}</SelectItem>
            <SelectItem value="Paramilitary">{t("Paramilitary") || "Paramilitary"}</SelectItem>
            <SelectItem value="Government">{t("Government") || "Government"}</SelectItem>
            <SelectItem value="Rebel Group">{t("rebelGroup") || "Rebel Group"}</SelectItem>
            <SelectItem value="Private Military Company">{t("privateMilitaryCompany") || "Private Military Company"}</SelectItem>
            <SelectItem value="Political">{t("Political") || "Political"}</SelectItem>
            <SelectItem value="Other">{t("Other") || "Other"}</SelectItem>
          </SelectContent>
        </Select>

        <Select name="isEntity" defaultValue={isEntity ?? "all"}>
          <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-offwhite">
            <SelectValue placeholder={t("allTypes") || "All Types"} />
          </SelectTrigger>
          <SelectContent className="glass-strong border-white/10">
            <SelectItem value="all">{t("allTypes") || "All Types"}</SelectItem>
            <SelectItem value="false">{t("individuals") || "Individuals"}</SelectItem>
            <SelectItem value="true">{t("organizations") || "Organizations"}</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
          {t("search") || "Search"}
        </Button>
      </form>

      {/* Client wrapper for stats, grid/table, pagination */}
      <AdminWarCriminalsClient
        warCriminals={warCriminals}
        totalCount={totalCount}
        individualsCount={individualsCount}
        entitiesCount={entitiesCount}
        error={error}
        search={search}
        status={status}
        affiliation={affiliation}
        isEntity={isEntity ?? "all"}
        prevPageUrl={prevPageUrl}
        nextPageUrl={nextPageUrl}
      />
    </div>
  );
}
