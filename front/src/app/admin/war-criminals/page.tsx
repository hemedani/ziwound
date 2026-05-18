import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/warCriminal/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { WarCriminalsTable } from "./war-criminals-table";
import { ReqType, warCriminalSchema } from "@/types/declarations";
import { AddWarCriminalDialog } from "./add-war-criminal-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function AdminWarCriminalsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    affiliation?: string;
    isEntity?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
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
  });

  let warCriminals: warCriminalSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    warCriminals = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch war criminals";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("warCriminalsManagement") || "War Criminals Management"}
          </h1>
          <p className="text-slate-body mt-1">
            {t("warCriminalsManagementDescription") || "Manage war criminals and their information"}
          </p>
        </div>
        <AddWarCriminalDialog />
      </div>

      <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
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
      </div>

      <WarCriminalsTable warCriminals={warCriminals} error={error} />

      <div className="flex items-center justify-end gap-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link
              href={`/admin/war-criminals?page=${page - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${affiliation ? `&affiliation=${affiliation}` : ""}${isEntity !== undefined ? `&isEntity=${isEntity}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {warCriminals.length >= 20 ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link
              href={`/admin/war-criminals?page=${page + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${affiliation ? `&affiliation=${affiliation}` : ""}${isEntity !== undefined ? `&isEntity=${isEntity}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
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
