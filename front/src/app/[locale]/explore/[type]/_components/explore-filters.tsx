"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AsyncSelect } from "@/components/form/async-select";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";

interface ExploreFiltersProps {
  currentUrl: string;
  search: string;
  searchPlaceholder: string;
  countryIds: string[];
  allCountries: Array<{ _id: string; name: string; english_name?: string }>;
  showCountryFilter: boolean;
  showProvinceFilter: boolean;
  provinceIds: string[];
  provinceOptions: Array<{ _id: string; name: string }>;
  hasActiveFilters: boolean;
  filterByCountryLabel: string;
  filterByProvinceLabel: string;
  searchLabel: string;
  clearLabel: string;
  clearFiltersUrl: string;
}

export function ExploreFilters({
  currentUrl,
  search,
  searchPlaceholder,
  countryIds,
  allCountries,
  showCountryFilter,
  showProvinceFilter,
  provinceIds,
  provinceOptions,
  hasActiveFilters,
  filterByCountryLabel,
  filterByProvinceLabel,
  searchLabel,
  clearLabel,
  clearFiltersUrl,
}: ExploreFiltersProps) {
  const router = useRouter();

  const navigate = (overrides: { search?: string; countryIds?: string[]; provinceIds?: string[] }) => {
    const sp = new URLSearchParams();
    const s = overrides.search !== undefined ? overrides.search : search;
    const c = overrides.countryIds !== undefined ? overrides.countryIds : countryIds;
    const p = overrides.provinceIds !== undefined ? overrides.provinceIds : provinceIds;
    const resetProvince = overrides.countryIds !== undefined;
    if (s) sp.set("search", s);
    if (c.length > 0) sp.set("countryIds", c.join(","));
    if (!resetProvince && p.length > 0) sp.set("provinceIds", p.join(","));
    const qs = sp.toString();
    router.replace(qs ? `${currentUrl}?${qs}` : currentUrl);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate({ search: (e.target as HTMLInputElement).value });
    }
  };

  const countryOptions = allCountries.map((c) => ({
    id: c._id,
    label: c.english_name ? `${c.name} (${c.english_name})` : c.name,
  }));

  const provinceSelectOptions = provinceOptions.map((p) => ({
    id: p._id,
    label: p.name,
  }));

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5 mb-8 transition-all duration-300 focus-within:border-crimson/40 focus-within:bg-white/[0.05]">
      <div className="space-y-4">
        {/* Search row */}
        <div className="relative flex items-center">
          <Search className="absolute start-4 h-5 w-5 text-slate-body/50 pointer-events-none" />
          <Input
            name="search"
            defaultValue={search}
            placeholder={searchPlaceholder}
            onKeyDown={handleSearchKeyDown}
            className="flex-1 border border-white/[0.06] bg-white/[0.03] ps-12 pe-4 h-11 text-offwhite placeholder:text-slate-body/40 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm rounded-xl"
          />
          <Button
            type="button"
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('input[name="search"]');
              navigate({ search: input?.value || "" });
            }}
            className="ms-2 h-11 px-5 bg-crimson hover:bg-crimson-light text-white font-medium rounded-xl shrink-0 transition-all duration-300"
          >
            {searchLabel}
          </Button>
        </div>

        {/* Filter dropdowns row */}
        <div className="flex flex-wrap gap-3">
          {/* Country multi-select filter — hidden on countries tab */}
          {showCountryFilter && (
            <div className="min-w-[220px] flex-1 sm:flex-none">
              <AsyncSelect
                isMulti
                isClearable
                options={countryOptions}
                value={countryIds}
                onChange={(value) => navigate({ countryIds: (value as string[]) || [] })}
                placeholder={filterByCountryLabel}
                searchPlaceholder={searchLabel + "..."}
                emptyText={filterByCountryLabel}
                className="bg-white/[0.03] text-offwhite border-white/[0.06]"
              />
            </div>
          )}

          {/* Province multi-select filter — only for cities tab */}
          {showProvinceFilter && (
            <div className="min-w-[220px] flex-1 sm:flex-none">
              <AsyncSelect
                isMulti
                isClearable
                options={provinceSelectOptions}
                value={provinceIds}
                onChange={(value) => navigate({ provinceIds: (value as string[]) || [] })}
                placeholder={filterByProvinceLabel}
                searchPlaceholder={searchLabel + "..."}
                emptyText={filterByProvinceLabel}
                disabled={provinceOptions.length === 0}
                className="bg-white/[0.03] text-offwhite border-white/[0.06]"
              />
            </div>
          )}
        </div>

        {/* Active filter badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-body/50">{searchLabel}:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 border border-crimson/20 px-3 py-1 text-xs text-crimson-light">
                &ldquo;{search}&rdquo;
              </span>
            )}
            {countryIds.map((id) => {
              const found = allCountries.find((c) => c._id === id);
              return found ? (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-xs text-gold">
                  {found.name}
                </span>
              ) : null;
            })}
            {provinceIds.map((id) => {
              const found = provinceOptions.find((p) => p._id === id);
              return found ? (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-xs text-gold">
                  {found.name}
                </span>
              ) : null;
            })}
            <Link
              href={clearFiltersUrl}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-slate-body/60 hover:text-offwhite hover:bg-white/5 transition-colors"
            >
              <X className="h-3 w-3" />
              {clearLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
