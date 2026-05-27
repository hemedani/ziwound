import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/warCriminal/gets";
import { ReqType, warCriminalSchema } from "@/types/declarations";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { User, Building2, Search, Scale, ShieldAlert, Users, Gavel, ArrowUpRight, Fingerprint } from "lucide-react";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";

const statusColors: Record<string, string> = {
  Accused: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  Indicted: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  Convicted: "bg-crimson/25 text-red-400 border-crimson/35",
  "At Large": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Deceased: "bg-gray-500/15 text-gray-400 border-gray-500/25",
  Unknown: "bg-slate-500/15 text-slate-400 border-slate-500/25",
  Sanctioned: "bg-purple-500/15 text-purple-400 border-purple-500/25",
};

const statusDotColors: Record<string, string> = {
  Accused: "bg-yellow-400",
  Indicted: "bg-orange-400",
  Convicted: "bg-red-400",
  "At Large": "bg-blue-400",
  Deceased: "bg-gray-400",
  Unknown: "bg-slate-400",
  Sanctioned: "bg-purple-400",
};

const affiliationColors: Record<string, string> = {
  Military: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Paramilitary: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  Government: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Rebel Group": "bg-crimson/15 text-red-400 border-crimson/25",
  "Private Military Company": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Political: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  Other: "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

const affiliationDotColors: Record<string, string> = {
  Military: "bg-blue-400",
  Paramilitary: "bg-indigo-400",
  Government: "bg-emerald-400",
  "Rebel Group": "bg-red-400",
  "Private Military Company": "bg-amber-400",
  Political: "bg-violet-400",
  Other: "bg-slate-400",
};

function getLocalizedText(field: Record<string, string> | undefined, locale: string): string {
  if (!field) return "";
  return field[locale] || field.en || "";
}

function getStatusText(status: string, t: Awaited<ReturnType<typeof getTranslations>>): string {
  const keyMap: Record<string, string> = {
    Accused: "admin.Accused",
    Indicted: "admin.Indicted",
    Convicted: "admin.Convicted",
    "At Large": "admin.atLarge",
    Deceased: "admin.Deceased",
    Unknown: "admin.Unknown",
    Sanctioned: "admin.Sanctioned",
  };
  const key = keyMap[status];
  return key ? (t(key) as string) || status : status;
}

function getAffiliationText(affiliation: string, t: Awaited<ReturnType<typeof getTranslations>>): string {
  const keyMap: Record<string, string> = {
    Military: "admin.Military",
    Paramilitary: "admin.Paramilitary",
    Government: "admin.Government",
    "Rebel Group": "admin.rebelGroup",
    "Private Military Company": "admin.privateMilitaryCompany",
    Political: "admin.Political",
    Other: "admin.Other",
  };
  const key = keyMap[affiliation];
  return key ? (t(key) as string) || affiliation : affiliation;
}

export default async function WarCriminalsPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    affiliation?: string;
    isEntity?: string;
    tagIds?: string;
    nationality?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
  params: Promise<{ locale: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations({ locale });

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status && resolvedSearchParams.status !== "all" ? resolvedSearchParams.status : "";
  const affiliation = resolvedSearchParams.affiliation && resolvedSearchParams.affiliation !== "all" ? resolvedSearchParams.affiliation : "";
  const isEntity = resolvedSearchParams.isEntity;
  const tagIds = resolvedSearchParams.tagIds?.split(",").filter(Boolean);
  const nationality = resolvedSearchParams.nationality || "";
  const sortBy = resolvedSearchParams.sortBy || "createdAt";
  const sortOrder = resolvedSearchParams.sortOrder || "desc";

  const setQuery: ReqType["main"]["warCriminal"]["gets"]["set"] = {
    page,
    limit: 12,
    sortBy: sortBy as "fullName" | "status" | "affiliation" | "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (search) setQuery.search = search;
  if (status) setQuery.status = status as "Accused" | "Indicted" | "Convicted" | "At Large" | "Deceased" | "Sanctioned";
  if (affiliation) setQuery.affiliation = affiliation as "Military" | "Paramilitary" | "Government" | "Rebel Group" | "Private Military Company" | "Political" | "Other";
  if (isEntity === "true") setQuery.isEntity = true;
  else if (isEntity === "false") setQuery.isEntity = false;
  if (tagIds && tagIds.length > 0) setQuery.tagIds = tagIds;
  if (nationality) setQuery.nationality = nationality;

  const response = await gets(setQuery, {
    _id: 1,
    fullName: 1,
    aliases: 1,
    affiliation: 1,
    status: 1,
    isEntity: 1,
    knownFor: 1,
    photo: { _id: 1, name: 1, mimeType: 1 },
    tags: { _id: 1, name: 1, color: 1 },
  });

  let warCriminals: warCriminalSchema[] = [];
  if (response?.success) {
    warCriminals = response.body || [];
  }

  const hasActiveFilters = search || status || affiliation || isEntity !== undefined;

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(153,27,27,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-crimson/10 border border-crimson/20 shadow-lg shadow-crimson/10">
              <Scale className="h-6 w-6 text-crimson" />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold">
              {t("admin.warCriminals") || "War Criminals"}
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-offwhite mb-5 max-w-3xl">
            {t("warCriminals.criminalsTitle") || "Perpetrator Database"}
          </h1>
          <p className="text-lg sm:text-xl text-slate-body max-w-2xl leading-relaxed">
            {t("warCriminals.criminalsDescription") || "Browse documented individuals and organizations responsible for war crimes and human rights violations."}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            <div className="glass-strong rounded-xl p-4 border border-white/[0.08] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-crimson/10">
                    <Users className="h-4 w-4 text-crimson" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-slate-body/60">{t("warCriminals.individuals") || "Individuals"}</span>
                </div>
                <p className="text-2xl font-bold text-offwhite">—</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 border border-white/[0.08] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-gold/10">
                    <Building2 className="h-4 w-4 text-gold" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-slate-body/60">{t("warCriminals.organizations") || "Organizations"}</span>
                </div>
                <p className="text-2xl font-bold text-offwhite">—</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 border border-white/[0.08] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-red-500/10">
                    <Gavel className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-slate-body/60">{t("admin.Convicted") || "Convicted"}</span>
                </div>
                <p className="text-2xl font-bold text-offwhite">—</p>
              </div>
            </div>
            <div className="glass-strong rounded-xl p-4 border border-white/[0.08] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <ShieldAlert className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-slate-body/60">{t("admin.atLarge") || "At Large"}</span>
                </div>
                <p className="text-2xl font-bold text-offwhite">—</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters Bar */}
        <form method="GET" className="mb-10">
          <div className="glass-strong rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-xl shadow-black/20">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body/50" />
                <Input
                  name="search"
                  placeholder={t("warCriminals.searchCriminalsPlaceholder") || "Search by name, alias, or affiliation..."}
                  defaultValue={search}
                  className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 focus-visible:ring-crimson/50 h-10"
                />
              </div>

              <Select name="status" defaultValue={status || "all"}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10 text-offwhite h-10">
                  <SelectValue placeholder={t("admin.allStatuses") || "All Statuses"} />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  <SelectItem value="all">{t("admin.allStatuses") || "All Statuses"}</SelectItem>
                  <SelectItem value="Accused">{t("admin.Accused") || "Accused"}</SelectItem>
                  <SelectItem value="Indicted">{t("admin.Indicted") || "Indicted"}</SelectItem>
                  <SelectItem value="Convicted">{t("admin.Convicted") || "Convicted"}</SelectItem>
                  <SelectItem value="At Large">{t("admin.atLarge") || "At Large"}</SelectItem>
                  <SelectItem value="Deceased">{t("admin.Deceased") || "Deceased"}</SelectItem>
                  <SelectItem value="Sanctioned">{t("admin.Sanctioned") || "Sanctioned"}</SelectItem>
                </SelectContent>
              </Select>

              <Select name="affiliation" defaultValue={affiliation || "all"}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border-white/10 text-offwhite h-10">
                  <SelectValue placeholder={t("admin.allAffiliations") || "All Affiliations"} />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  <SelectItem value="all">{t("admin.allAffiliations") || "All Affiliations"}</SelectItem>
                  <SelectItem value="Military">{t("admin.Military") || "Military"}</SelectItem>
                  <SelectItem value="Paramilitary">{t("admin.Paramilitary") || "Paramilitary"}</SelectItem>
                  <SelectItem value="Government">{t("admin.Government") || "Government"}</SelectItem>
                  <SelectItem value="Rebel Group">{t("admin.rebelGroup") || "Rebel Group"}</SelectItem>
                  <SelectItem value="Private Military Company">{t("admin.privateMilitaryCompany") || "Private Military Company"}</SelectItem>
                  <SelectItem value="Political">{t("admin.Political") || "Political"}</SelectItem>
                  <SelectItem value="Other">{t("admin.Other") || "Other"}</SelectItem>
                </SelectContent>
              </Select>

              <Select name="isEntity" defaultValue={isEntity ?? "all"}>
                <SelectTrigger className="w-full sm:w-[160px] bg-white/5 border-white/10 text-offwhite h-10">
                  <SelectValue placeholder={t("warCriminals.allTypes") || "All Types"} />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10">
                  <SelectItem value="all">{t("warCriminals.allTypes") || "All Types"}</SelectItem>
                  <SelectItem value="false">{t("warCriminals.individuals") || "Individuals"}</SelectItem>
                  <SelectItem value="true">{t("warCriminals.organizations") || "Organizations"}</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" className="bg-crimson hover:bg-crimson/90 text-white h-10 px-6 shrink-0 shadow-lg shadow-crimson/20">
                <Search className="h-4 w-4 sm:me-2" />
                <span className="hidden sm:inline">{t("common.search") || "Search"}</span>
              </Button>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <Link
                  href={`/${locale}/war-criminals`}
                  className="text-xs text-slate-body/60 hover:text-offwhite transition-colors"
                >
                  {t("warCrimes.filters.reset") || "Clear all filters"} ×
                </Link>
              </div>
            )}
          </div>
        </form>

        {/* Results Header */}
        {warCriminals.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-body/70">
              {warCriminals.length} {warCriminals.length === 1 ? (t("warCriminals.result") || "result") : (t("warCriminals.results") || "results")}
            </p>
          </div>
        )}

        {/* Results */}
        {warCriminals.length === 0 ? (
          <EmptyState
            icon={Scale}
            title={t("warCriminals.noCriminalsResults") || "No results found"}
            description={t("warCriminals.noCriminalsDescription") || "Try adjusting your search or filters."}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {warCriminals.map((wc) => (
                <Link
                  key={wc._id}
                  href={`/${locale}/war-criminals/${wc._id}`}
                  className="group relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] overflow-hidden hover:border-crimson/30 transition-all duration-500 block hover:shadow-2xl hover:shadow-crimson/10 hover:-translate-y-1"
                >
                  {/* Subtle top gradient accent */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Photo Area */}
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent overflow-hidden">
                    {wc.photo ? (
                      <>
                        <Image
                          src={getImageUploadUrl(wc.photo.name)}
                          alt={wc.fullName}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-crimson/5 rounded-full blur-xl" />
                          <div className="relative p-5 rounded-full bg-white/5 border border-white/10">
                            {wc.isEntity ? (
                              <Building2 className="h-10 w-10 text-slate-body/25" />
                            ) : (
                              <Fingerprint className="h-10 w-10 text-slate-body/25" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 end-3">
                      <Badge
                        variant="outline"
                        className={`${statusColors[wc.status] || "bg-slate-500/15 text-slate-400 border-slate-500/25"} backdrop-blur-md text-[11px] font-medium`}
                      >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusDotColors[wc.status] || "bg-slate-400"} me-1.5`} />
                        {getStatusText(wc.status, t)}
                      </Badge>
                    </div>

                    {/* Entity Badge */}
                    {wc.isEntity && (
                      <div className="absolute top-3 start-3">
                        <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20 backdrop-blur-md text-[11px] font-medium">
                          <Building2 className="h-3 w-3 me-1" />
                          {t("warCriminals.organization") || "Org"}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    {/* Name */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-offwhite group-hover:text-crimson-light transition-colors duration-300 line-clamp-2 leading-tight text-lg">
                        {wc.fullName}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-slate-body/30 group-hover:text-crimson transition-colors duration-300 shrink-0 mt-1" />
                    </div>

                    {/* Affiliation */}
                    {wc.affiliation && (
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${affiliationDotColors[wc.affiliation] || "bg-slate-400"}`} />
                        <span className="text-xs text-slate-body/70">
                          {getAffiliationText(wc.affiliation, t)}
                        </span>
                      </div>
                    )}

                    {/* Known For */}
                    {wc.knownFor && getLocalizedText(wc.knownFor as Record<string, string>, locale) && (
                      <div
                        className="text-sm text-slate-body/70 line-clamp-2 leading-relaxed prose prose-invert prose-sm max-w-none prose-p:m-0 prose-p:inline prose-headings:inline prose-headings:text-sm prose-strong:text-slate-body/70 prose-a:text-crimson-light"
                        dangerouslySetInnerHTML={{ __html: getLocalizedText(wc.knownFor as Record<string, string>, locale) }}
                      />
                    )}

                    {/* Tags */}
                    {wc.tags && wc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {wc.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag._id}
                            variant="outline"
                            className="text-[11px] border-white/10 text-slate-body/60 bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {wc.tags.length > 3 && (
                          <Badge variant="outline" className="text-[11px] border-white/10 text-slate-body/60 bg-white/5">
                            +{wc.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom border accent */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-12">
              {page > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link
                    href={`/${locale}/war-criminals?page=${page - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${affiliation ? `&affiliation=${affiliation}` : ""}${isEntity !== undefined ? `&isEntity=${isEntity}` : ""}${nationality ? `&nationality=${nationality}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}${sortOrder ? `&sortOrder=${sortOrder}` : ""}`}
                  >
                    {t("common.previous") || "Previous"}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30 cursor-not-allowed">
                  {t("common.previous") || "Previous"}
                </Button>
              )}
              <span className="text-sm text-slate-body/60 px-2">
                {t("warCrimes.pageInfo", { page, totalPages: "..." }) || `Page ${page}`}
              </span>
              {warCriminals.length >= 12 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link
                    href={`/${locale}/war-criminals?page=${page + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${affiliation ? `&affiliation=${affiliation}` : ""}${isEntity !== undefined ? `&isEntity=${isEntity}` : ""}${nationality ? `&nationality=${nationality}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}${sortOrder ? `&sortOrder=${sortOrder}` : ""}`}
                  >
                    {t("common.next") || "Next"}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30 cursor-not-allowed">
                  {t("common.next") || "Next"}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
