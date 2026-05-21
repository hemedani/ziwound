"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DatePickerField } from "@/components/form/date-picker-field";
import type { DeepPartial, categorySchema, tagSchema, ReqType } from "@/types/declarations";
import { AsyncSelect, AsyncSelectOption, AsyncSelectLoadResult, AsyncSelectValue } from "@/components/form/async-select";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

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

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <Badge
      className="gap-1.5 bg-crimson/10 text-crimson-light border-crimson/20 hover:bg-crimson/20 transition-colors cursor-pointer pr-1.5"
      onClick={onRemove}
    >
      {label}
      <X className="h-3 w-3" />
    </Badge>
  );
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

  const loadCountryOptions = useCallback(async (inputValue: string): Promise<AsyncSelectLoadResult> => {
    const result = await getCountries(
      { search: inputValue, page: 1, limit: 50 },
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
      { search: inputValue, page: 1, limit: 50 },
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
      { search: inputValue, page: 1, limit: 50 },
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

  const categoryLabel = categories.find((c) => c._id === categoryId)?.name;
  const statusLabel = statusOptions.find((s) => s.id === status)?.label;
  const priorityLabel = priorityOptions.find((p) => p.id === priority)?.label;
  const languageLabel = languageOptions.find((l) => l.id === selected_language)?.label;

  return (
    <div className="rounded-2xl glass-light border border-white/[0.06]">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11 rounded-xl"
          />
        </div>
        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white h-11 rounded-xl px-6">
          {tCommon("search")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white h-11 rounded-xl gap-2"
        >
          <Filter className="h-4 w-4" />
          {tFilter("title")}
          {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-crimson" />}
        </Button>
      </form>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-body/50">{tFilter("reset")}:</span>
          {status !== "all" && <FilterChip label={statusLabel || status} onRemove={() => { setStatus("all"); updateParams({ status: undefined }); }} />}
          {priority !== "all" && <FilterChip label={priorityLabel || priority} onRemove={() => { setPriority("all"); updateParams({ priority: undefined }); }} />}
          {categoryId && <FilterChip label={categoryLabel || categoryId} onRemove={() => { setCategoryId(""); updateParams({ categoryId: undefined }); }} />}
          {selected_language !== "all" && <FilterChip label={languageLabel || selected_language} onRemove={() => { setSelectedLanguage("all"); updateParams({ selected_language: undefined }); }} />}
          {dateFrom && <FilterChip label={`${tFilter("from")}: ${dateFrom}`} onRemove={() => { setDateFrom(""); updateParams({ dateFrom: undefined }); }} />}
          {dateTo && <FilterChip label={`${tFilter("to")}: ${dateTo}`} onRemove={() => { setDateTo(""); updateParams({ dateTo: undefined }); }} />}
          {crimeOccurredFrom && <FilterChip label={`${tFilter("crimeOccurredRange")}: ${crimeOccurredFrom}`} onRemove={() => { setCrimeOccurredFrom(""); updateParams({ crimeOccurredFrom: undefined }); }} />}
          {crimeOccurredTo && <FilterChip label={`${tFilter("crimeOccurredRange")}: ${crimeOccurredTo}`} onRemove={() => { setCrimeOccurredTo(""); updateParams({ crimeOccurredTo: undefined }); }} />}
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t._id === tagId);
            return tag ? (
              <FilterChip
                key={tagId}
                label={tag.name || tagId}
                onRemove={() => handleTagToggle(tagId)}
              />
            ) : null;
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-slate-body/60 hover:text-offwhite h-6 px-2"
          >
            {tCommon("all")}
          </Button>
        </div>
      )}

      {/* Expandable filters */}
      <div className={cn(
        "border-t border-white/[0.04] overflow-hidden transition-all duration-300",
        showFilters ? "max-h-[2000px]" : "max-h-0 sm:max-h-[2000px]"
      )}>
        <div className="p-4">
          {/* Toggle button for desktop */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-body/50 hover:text-offwhite mb-4 transition-colors"
          >
            {showFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {showFilters ? "Hide filters" : "Show advanced filters"}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{t("filters.status")}</Label>
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
              <Label className="text-xs text-slate-body/60">{t("filters.priority")}</Label>
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
              <Label className="text-xs text-slate-body/60">{tFilter("category")}</Label>
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
              <Label className="text-xs text-slate-body/60">{tFilter("dateRange")}</Label>
              <div className="flex gap-2 items-center">
                <DatePickerField
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  locale={locale}
                  placeholder={tFilter("from")}
                  className="flex-1"
                />
                <span className="text-muted-foreground">-</span>
                <DatePickerField
                  value={dateTo}
                  onChange={handleDateToChange}
                  locale={locale}
                  placeholder={tFilter("to")}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{tFilter("hostileCountries")}</Label>
              <AsyncSelect
                value={hostileCountryIds || null}
                onChange={handleHostileCountryChange}
                async
                loadOptions={loadCountryOptions}
                placeholder={tFilter("allHostileCountries")}
                searchPlaceholder={tCommon("search")}
                emptyText={t("noResults")}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{tFilter("attackedCountries")}</Label>
              <AsyncSelect
                value={attackedCountryIds || null}
                onChange={handleAttackedCountryChange}
                async
                loadOptions={loadCountryOptions}
                placeholder={tFilter("allAttackedCountries")}
                searchPlaceholder={tCommon("search")}
                emptyText={t("noResults")}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{tFilter("attackedProvinces")}</Label>
              <AsyncSelect
                value={attackedProvinceIds || null}
                onChange={handleAttackedProvinceChange}
                async
                loadOptions={loadProvinceOptions}
                placeholder={tFilter("allAttackedProvinces")}
                searchPlaceholder={tCommon("search")}
                emptyText={t("noResults")}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{tFilter("attackedCities")}</Label>
              <AsyncSelect
                value={attackedCityIds || null}
                onChange={handleAttackedCityChange}
                async
                loadOptions={loadCityOptions}
                placeholder={tFilter("allAttackedCities")}
                searchPlaceholder={tCommon("search")}
                emptyText={t("noResults")}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{t("filters.language")}</Label>
              <AsyncSelect
                value={selected_language}
                onChange={handleLanguageChange}
                options={languageOptions}
                placeholder={tCommon("all")}
                searchPlaceholder={tCommon("search")}
                emptyText={t("noResults")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{tFilter("crimeOccurredRange")}</Label>
              <div className="flex gap-2 items-center">
                <DatePickerField
                  value={crimeOccurredFrom}
                  onChange={handleCrimeOccurredFromChange}
                  locale={locale}
                  placeholder={tFilter("from")}
                  className="flex-1"
                />
                <span className="text-muted-foreground">-</span>
                <DatePickerField
                  value={crimeOccurredTo}
                  onChange={handleCrimeOccurredToChange}
                  locale={locale}
                  placeholder={tFilter("to")}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4 space-y-2">
              <Label className="text-xs text-slate-body/60">{tFilter("tags")}</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag._id}
                    type="button"
                    variant={selectedTags.includes(tag._id || "") ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagToggle(tag._id || "")}
                    className={cn(
                      "text-xs rounded-lg transition-all",
                      selectedTags.includes(tag._id || "")
                        ? "bg-crimson/20 text-crimson-light border-crimson/30 hover:bg-crimson/30"
                        : "border-white/10 bg-white/5 text-slate-body hover:bg-white/10 hover:text-offwhite"
                    )}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
