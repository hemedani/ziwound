"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeepPartial, categorySchema, tagSchema, ReqType } from "@/types/declarations";

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
  initialCountry?: string;
  initialCity?: string;
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
  initialCountry = "",
  initialCity = "",
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
  const [country, setCountry] = useState(initialCountry || "");
  const [city, setCity] = useState(initialCity || "");
  const [language, setLanguage] = useState(initialLanguage || "all");
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

  const handleStatusChange = (value: string) => {
    setStatus(value);
    updateParams({ status: value === "all" ? undefined : value });
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    updateParams({ priority: value === "all" ? undefined : value });
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    updateParams({ categoryId: value || undefined });
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

  const handleCountryChange = (value: string) => {
    setCountry(value);
    updateParams({ country: value || undefined });
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    updateParams({ city: value || undefined });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    updateParams({ language: value === "all" ? undefined : value });
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
    setCountry("");
    setCity("");
    setLanguage("all");
    setCrimeOccurredFrom("");
    setCrimeOccurredTo("");
    router.push(pathname);
  };

  const hasActiveFilters =
    search ||
    status !== "all" ||
    priority !== "all" ||
    categoryId ||
    selectedTags.length > 0 ||
    dateFrom ||
    dateTo ||
    country ||
    city ||
    language !== "all" ||
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
            <Select value={status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("status.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("status.all")}</SelectItem>
                <SelectItem value="Approved">{t("status.approved")}</SelectItem>
                <SelectItem value="Pending">{t("status.pending")}</SelectItem>
                <SelectItem value="Rejected">{t("status.rejected")}</SelectItem>
                <SelectItem value="InReview">{t("status.inReview")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("filters.priority")}</Label>
            <Select value={priority || "all"} onValueChange={handlePriorityChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("priority.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("priority.all")}</SelectItem>
                <SelectItem value="High">{t("priority.high")}</SelectItem>
                <SelectItem value="Medium">{t("priority.medium")}</SelectItem>
                <SelectItem value="Low">{t("priority.low")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{tFilter("category")}</Label>
            <Select
              value={categoryId || "none"}
              onValueChange={(v) => handleCategoryChange(v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={tFilter("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{tFilter("selectCategory")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id || ""}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label>{tFilter("country") || "Country"}</Label>
            <Input
              type="text"
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              placeholder={tFilter("selectCountry") || "Enter country"}
            />
          </div>

          <div className="space-y-2">
            <Label>{tFilter("city") || "City"}</Label>
            <Input
              type="text"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder={tFilter("selectCity") || "Enter city"}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("filters.language") || "Language"}</Label>
            <Select value={language || "all"} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder={tCommon("all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tCommon("all")}</SelectItem>
                <SelectItem value="fa">فارسی</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="nl">Nederlands</SelectItem>
              </SelectContent>
            </Select>
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
