"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function WarCriminalsFilters() {
  const t = useTranslations("admin");
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "all";
  const initialAffiliation = searchParams.get("affiliation") || "all";
  const initialIsEntity = searchParams.get("isEntity") || "all";

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [affiliation, setAffiliation] = useState(initialAffiliation);
  const [isEntity, setIsEntity] = useState(initialIsEntity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    if (affiliation !== "all") params.set("affiliation", affiliation);
    if (isEntity !== "all") params.set("isEntity", isEntity);
    params.set("page", "1");
    router.push(`/admin/war-criminals?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 w-full items-start sm:items-center">
      <div className="relative w-full sm:w-64">
        <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchWarCriminals") || "Search war criminals..."}
          className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
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

      <Select value={affiliation} onValueChange={setAffiliation}>
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

      <Select value={isEntity} onValueChange={setIsEntity}>
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
  );
}
