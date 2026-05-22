"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerField } from "@/components/form/date-picker-field";
import { cn } from "@/lib/utils";
import { Filter, X, ChevronDown, ChevronUp, Search } from "lucide-react";

interface DocumentFiltersProps {
  locale: string;
  initialSearch?: string;
  initialLanguage?: string;
  initialDocumentType?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
}

const LANGUAGE_OPTIONS = [
  { id: "all" },
  { id: "fa" },
  { id: "en" },
  { id: "ar" },
  { id: "zh" },
  { id: "pt" },
  { id: "es" },
  { id: "nl" },
  { id: "tr" },
  { id: "ru" },
];

const DOCUMENT_TYPE_OPTIONS = [
  { id: "all" },
  { id: "image" },
  { id: "video" },
  { id: "docs" },
];

const LANG_LABELS: Record<string, string> = {
  fa: "فارسی", en: "English", ar: "العربية", zh: "中文",
  pt: "Português", es: "Español", nl: "Nederlands", tr: "Türkçe", ru: "Русский",
};

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge
      className="gap-1.5 bg-crimson/10 text-crimson-light border-crimson/20 hover:bg-crimson/20 transition-colors cursor-pointer pe-1.5"
      onClick={onRemove}
    >
      {label}
      <X className="h-3 w-3" />
    </Badge>
  );
}

export function DocumentFilters({
  locale,
  initialSearch = "",
  initialLanguage = "all",
  initialDocumentType = "all",
  initialDateFrom = "",
  initialDateTo = "",
}: DocumentFiltersProps) {
  const t = useTranslations("documents");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [language, setLanguage] = useState(initialLanguage);
  const [documentType, setDocumentType] = useState(initialDocumentType);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
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

  const handleReset = () => {
    setSearch("");
    setLanguage("all");
    setDocumentType("all");
    setDateFrom("");
    setDateTo("");
    router.push(pathname);
  };

  const hasActiveFilters =
    search ||
    language !== "all" ||
    documentType !== "all" ||
    dateFrom ||
    dateTo;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      {/* Search + Filter Toggle Row */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body/40 pointer-events-none" />
              <Input
                type="search"
                name="search"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11 rounded-xl ps-10"
              />
            </div>
            <Button
              type="submit"
              className="bg-crimson hover:bg-crimson-light text-white h-11 rounded-xl px-5"
            >
              {tc("search")}
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white h-11 rounded-xl gap-2"
          >
            <Filter className="h-4 w-4" />
            {t("filters")}
            {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-crimson" />}
          </Button>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-body/50">{t("activeFilters")}</span>
            {language !== "all" && (
              <FilterChip
                label={LANG_LABELS[language] || language}
                onRemove={() => {
                  setLanguage("all");
                  updateParams({ selected_language: undefined });
                }}
              />
            )}
            {documentType !== "all" && (
              <FilterChip
                label={t(documentType === "image" ? "images" : documentType === "video" ? "videos" : "documentsType")}
                onRemove={() => {
                  setDocumentType("all");
                  updateParams({ documentType: undefined });
                }}
              />
            )}
            {dateFrom && (
              <FilterChip
                label={`${t("from")}: ${dateFrom}`}
                onRemove={() => {
                  setDateFrom("");
                  updateParams({ dateFrom: undefined });
                }}
              />
            )}
            {dateTo && (
              <FilterChip
                label={`${t("to")}: ${dateTo}`}
                onRemove={() => {
                  setDateTo("");
                  updateParams({ dateTo: undefined });
                }}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-slate-body/60 hover:text-offwhite h-6 px-2"
            >
              {t("clearActive")}
            </Button>
          </div>
        )}
      </div>

      {/* Collapse/expand toggle */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="flex w-full items-center justify-center gap-1.5 py-2 text-xs text-slate-body/50 hover:text-offwhite transition-colors border-t border-white/[0.04]"
      >
        {showFilters ? (
          <>
            <ChevronUp className="h-3.5 w-3.5" />
            {t("hideFilters")}
          </>
        ) : (
          <>
            <ChevronDown className="h-3.5 w-3.5" />
            {t("showAdvancedFilters")}
          </>
        )}
      </button>

      {/* Expandable advanced filters */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          showFilters ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 border-t border-white/[0.04]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{t("languageFilter")}</Label>
              <Select
                value={language}
                onValueChange={(val) => {
                  setLanguage(val);
                  updateParams({ selected_language: val === "all" ? undefined : val });
                }}
              >
                <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-offwhite rounded-xl">
                  <SelectValue placeholder={t("allLanguages")} />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-light border-white/10">
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id} className="text-offwhite focus:bg-white/10 focus:text-offwhite">
                      {opt.id === "all" ? t("allLanguages") : LANG_LABELS[opt.id] || opt.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{t("documentType")}</Label>
              <Select
                value={documentType}
                onValueChange={(val) => {
                  setDocumentType(val);
                  updateParams({ documentType: val === "all" ? undefined : val });
                }}
              >
                <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-offwhite rounded-xl">
                  <SelectValue placeholder={t("allTypes")} />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-light border-white/10">
                  {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id} className="text-offwhite focus:bg-white/10 focus:text-offwhite">
                      {opt.id === "all" ? t("allTypes") : t(opt.id === "image" ? "images" : opt.id === "video" ? "videos" : "documentsType")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-body/60">{t("dateRange")}</Label>
              <div className="flex gap-2 items-center">
                <DatePickerField
                  value={dateFrom}
                  onChange={(val) => {
                    setDateFrom(val);
                    updateParams({ dateFrom: val || undefined });
                  }}
                  locale={locale}
                  placeholder={t("from")}
                  className="flex-1"
                />
                <span className="text-slate-body/40 text-xs">-</span>
                <DatePickerField
                  value={dateTo}
                  onChange={(val) => {
                    setDateTo(val);
                    updateParams({ dateTo: val || undefined });
                  }}
                  locale={locale}
                  placeholder={t("to")}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Reset */}
            <div className="space-y-2 flex flex-col justify-end">
              <Label className="text-xs text-slate-body/60 opacity-0">_</Label>
              <Button
                variant="glass"
                onClick={handleReset}
                className="h-11 rounded-xl w-full"
              >
                {t("clearFilters")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
