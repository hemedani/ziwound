"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeepPartial, categorySchema, tagSchema, ReqType } from "@/types/declarations";
import { AsyncSelect, AsyncSelectOption, AsyncSelectLoadResult, AsyncSelectValue } from "@/components/form/async-select";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";

interface WarCrimesFiltersProps {
  locale: string;
  categories: DeepPartial<categorySchema>[];
  tags: DeepPartial<tagSchema>[];
  initialSearch?: string;
  initialStatus?: ReqType["main"]["report"]["gets"]["set"]["status"];
  initialPriority?: ReqType["main"]["report"]["gets"]["set"]["priority"];
  initialCategoryId?: string;
  initialTagIds?: string[];
  initialDateFrom?: string;
  initialDateTo?: string;
  initialHostileCountryIds?: string;
  initialAttackedCountryIds?: string;
  initialAttackedProvinceIds?: string;
  initialAttackedCityIds?: string;
  initialLanguage?: string;
  initialCrimeOccurredFrom?: string;
  initialCrimeOccurredTo?: string;
}

export function WarCrimesFilters({
  locale,
  categories,
  tags,
  initialSearch = "",
  initialStatus,
  initialPriority,
  initialCategoryId,
  initialTagIds = [],
  initialDateFrom,
  initialDateTo,
  initialHostileCountryIds = "",
  initialAttackedCountryIds = "",
  initialAttackedProvinceIds = "",
  initialAttackedCityIds = "",
  initialLanguage = "",
  initialCrimeOccurredFrom,
  initialCrimeOccurredTo,
}: WarCrimesFiltersProps) {
  const t = useTranslations("warCrimes");
  const tFilter = useTranslations("warCrimes.filters");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<string>(initialStatus || "all");
  const [priority, setPriority] = useState<string>(initialPriority || "all");
  const [categoryId, setCategoryId] = useState(initialCategoryId || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTagIds);
  const [dateFrom, setDateFrom] = useState(initialDateFrom || "");
  const [dateTo, setDateTo] = useState(initialDateTo || "");
  const [hostileCountryIds, setHostileCountryIds] = useState(initialHostileCountryIds || "");
  const [attackedCountryIds, setAttackedCountryIds] = useState(initialAttackedCountryIds || "");
  const [attackedProvinceIds, setAttackedProvinceIds] = useState(initialAttackedProvinceIds || "");
  const [attackedCityIds, setAttackedCityIds] = useState(initialAttackedCityIds || "");
  const [selected_language, setSelectedLanguage] = useState(initialLanguage || "all");
  const [crimeOccurredFrom, setCrimeOccurredFrom] = useState(initialCrimeOccurredFrom || "");
  const [crimeOccurredTo, setCrimeOccurredTo] = useState(initialCrimeOccurredTo || "");
  const [showFilters, setShowFilters] = useState(false);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search });
  };

  const handleStatusChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "all";
    setStatus(newValue);
    updateParams({ status: newValue === "all" ? undefined : newValue });
  };

  const handlePriorityChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "all";
    setPriority(newValue);
    updateParams({ priority: newValue === "all" ? undefined : newValue });
  };

  const handleCategoryChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "";
    setCategoryId(newValue);
    updateParams({ categoryId: newValue || undefined });
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((t) => t !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
    updateParams({ tagIds: newTags.length > 0 ? newTags.join(",") : undefined });
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    updateParams({ dateFrom: value || undefined });
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    updateParams({ dateTo: value || undefined });
  };

  const handleHostileCountryChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "";
    setHostileCountryIds(newValue);
    updateParams({ hostileCountryIds: newValue || undefined });
  };

  const handleAttackedCountryChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "";
    setAttackedCountryIds(newValue);
    updateParams({ attackedCountryIds: newValue || undefined });
  };

  const handleAttackedProvinceChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "";
    setAttackedProvinceIds(newValue);
    updateParams({ attackedProvinceIds: newValue || undefined });
  };

  const handleAttackedCityChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "";
    setAttackedCityIds(newValue);
    updateParams({ attackedCityIds: newValue || undefined });
  };

  const handleLanguageChange = (value: AsyncSelectValue) => {
    const newValue = typeof value === "string" ? value : "all";
    setSelectedLanguage(newValue);
    updateParams({ selected_language: newValue === "all" ? undefined : newValue });
  };

  const handleCrimeOccurredFromChange = (value: string) => {
    setCrimeOccurredFrom(value);
    updateParams({ crimeOccurredFrom: value || undefined });
  };

  const handleCrimeOccurredToChange = (value: string) => {
    setCrimeOccurredTo(value);
    updateParams({ crimeOccurredTo: value || undefined });
  };

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCategoryId("");
    setSelectedTags([]);
    setDateFrom("");
    setDateTo("");
    setHostileCountryIds("");
    setAttackedCountryIds("");
    setAttackedProvinceIds("");
    setAttackedCityIds("");
    setSelectedLanguage("all");
    setCrimeOccurredFrom("");
    setCrimeOccurredTo("");
    router.push(pathname);
  };

  // Load options functions for AsyncSelect
  const loadCountryOptions = useCallback(async (inputValue: string): Promise<AsyncSelectLoadResult> => {
    const result = await getCountries(
      { search: inputValue, limit: 50 },
      { _id: 1, name: 1 }
    );
    
    if (result.success && result.body && Array.isArray(result.body)) {
      const options: AsyncSelectOption[] = result.body.map((country: { _id: string; name?: string }) => ({
        id: country._id,
        label: country.name || "",
      }));
      return { options, hasMore: false };
    }
    
    return { options: [], hasMore: false };
  }, []);

  const loadProvinceOptions = useCallback(async (inputValue: string): Promise<AsyncSelectLoadResult> => {
    const result = await getProvinces(
      { search: inputValue, limit: 50 },
      { _id: 1, name: 1 }
    );
    
    if (result.success && result.body && Array.isArray(result.body)) {
      const options: AsyncSelectOption[] = result.body.map((province: { _id: string; name?: string }) => ({
        id: province._id,
        label: province.name || "",
      }));
      return { options, hasMore: false };
    }
    
    return { options: [], hasMore: false };
  }, []);

  const loadCityOptions = useCallback(async (inputValue: string): Promise<AsyncSelectLoadResult> => {
    const result = await getCities(
      { search: inputValue, limit: 50 },
      { _id: 1, name: 1 }
    );
    
    if (result.success && result.body && Array.isArray(result.body)) {
      const options: AsyncSelectOption[] = result.body.map((city: { _id: string; name?: string }) => ({
        id: city._id,
        label: city.name || "",
      }));
      return { options, hasMore: false };
    }
    
    return { options: [], hasMore: false };
  }, []);

  // Static options for filters
  const statusOptions: AsyncSelectOption[] = [
    { id: "all", label: t("status.all") },
    { id: "Approved", label: t("status.approved") },
    { id: "Pending", label: t("status.pending") },
    { id: "Rejected", label: t("status.rejected") },
    { id: "InReview", label: t("status.inReview") },
  ];

  const priorityOptions: AsyncSelectOption[] = [
    { id: "all", label: t("priority.all") },
    { id: "High", label: t("priority.high") },
    { id: "Medium", label: t("priority.medium") },
    { id: "Low", label: t("priority.low") },
  ];

  const categoryOptions: AsyncSelectOption[] = [
    { id: "", label: tFilter("selectCategory") },
    ...categories.map((cat) => ({
      id: cat._id || "",
      label: cat.name || "",
    })),
  ];

  const languageOptions: AsyncSelectOption[] = [
    { id: "all", label: tCommon("all") },
    { id: "fa", label: "فارسی" },
    { id: "en", label: "English" },
    { id: "ar", label: "العربية" },
    { id: "zh", label: "中文" },
    { id: "pt", label: "Português" },
    { id: "es", label: "Español" },
    { id: "ru", label: "Русский" },
    { id: "tr", label: "Türkçe" },
    { id: "nl", label: "Nederlands" },
  ];

  const hasActiveFilters =
    search ||
    status !== "all" ||
    priority !== "all" ||
    categoryId ||
    selectedTags.length > 0 ||
    dateFrom ||
    dateTo ||
    hostileCountryIds ||
    attackedCountryIds ||
    attackedProvinceIds ||
    attackedCityIds ||
    selected_language !== "all" ||
    crimeOccurredFrom ||
    crimeOccurredTo;

  return (
    <div className="bg-card border rounded-lg p-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" variant="secondary">
          {tCommon("search")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          {tFilter("title")} {hasActiveFilters && "*"}
        </Button>
      </form>

      <div className={cn("mt-4 pt-4 border-t", !showFilters && "hidden md:block")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>{t("filters.status")}</Label>
            <AsyncSelect
              value={status}
              onChange={handleStatusChange}
              options={statusOptions}
              placeholder={t("status.all")}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("filters.priority")}</Label>
            <AsyncSelect
              value={priority}
              onChange={handlePriorityChange}
              options={priorityOptions}
              placeholder={t("priority.all")}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
            />
          </div>

          <div className="space-y-2">
            <Label>{tFilter("category")}</Label>
            <AsyncSelect
              value={categoryId || ""}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder={tFilter("selectCategory")}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
            />
          </div>

          <div className="space-y-2">
            <Label>{tFilter("dateRange")}</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="flex-1"
                placeholder={tFilter("from")}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                className="flex-1"
                placeholder={tFilter("to")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{tFilter("hostileCountries") || "Hostile Countries"}</Label>
            <AsyncSelect
              value={hostileCountryIds || null}
              onChange={handleHostileCountryChange}
              async
              loadOptions={loadCountryOptions}
              placeholder={tFilter("allHostileCountries") || "All Hostile Countries"}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
              isClearable
            />
          </div>

          <div className="space-y-2">
            <Label>{tFilter("attackedCountries") || "Attacked Countries"}</Label>
            <AsyncSelect
              value={attackedCountryIds || null}
              onChange={handleAttackedCountryChange}
              async
              loadOptions={loadCountryOptions}
              placeholder={tFilter("allAttackedCountries") || "All Attacked Countries"}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
              isClearable
            />
          </div>

          <div className="space-y-2">
            <Label>{tFilter("attackedProvinces") || "Attacked Provinces"}</Label>
            <AsyncSelect
              value={attackedProvinceIds || null}
              onChange={handleAttackedProvinceChange}
              async
              loadOptions={loadProvinceOptions}
              placeholder={tFilter("allAttackedProvinces") || "All Attacked Provinces"}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
              isClearable
            />
          </div>

          <div className="space-y-2">
            <Label>{tFilter("attackedCities") || "Attacked Cities"}</Label>
            <AsyncSelect
              value={attackedCityIds || null}
              onChange={handleAttackedCityChange}
              async
              loadOptions={loadCityOptions}
              placeholder={tFilter("allAttackedCities") || "All Attacked Cities"}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
              isClearable
            />
          </div>

          <div className="space-y-2">
            <Label>{t("filters.language") || "Language"}</Label>
            <AsyncSelect
              value={selected_language}
              onChange={handleLanguageChange}
              options={languageOptions}
              placeholder={tCommon("all")}
              searchPlaceholder={tCommon("search")}
              emptyText={t("noResults")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label>{tFilter("crimeOccurredRange") || "Crime Occurrence Date"}</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={crimeOccurredFrom}
                onChange={(e) => handleCrimeOccurredFromChange(e.target.value)}
                className="flex-1"
                placeholder={tFilter("from")}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="date"
                value={crimeOccurredTo}
                onChange={(e) => handleCrimeOccurredToChange(e.target.value)}
                className="flex-1"
                placeholder={tFilter("to")}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label>{tFilter("tags")}</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag._id}
                type="button"
                variant={selectedTags.includes(tag._id || "") ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagToggle(tag._id || "")}
                className="text-xs"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={handleReset}>
              {tFilter("reset")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
