"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AsyncSelect,
  type AsyncSelectOption,
  type AsyncSelectValue,
} from "@/components/form/async-select";
import {
  searchCountries,
  searchProvinces,
  searchCities,
} from "@/components/form/location-search";

export type PlaceGranularity = "country" | "city";

export interface PlaceValue {
  countryId?: string;
  cityId?: string;
}

interface PlaceSelectorProps {
  value?: PlaceValue;
  onChange: (value: PlaceValue | null) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  initialLabel?: string;
}

export function PlaceSelector({
  value,
  onChange,
  label,
  disabled = false,
  className,
  initialLabel,
}: PlaceSelectorProps) {
  const t = useTranslations("admin");

  const countryId = value?.countryId;
  const cityId = value?.cityId;
  const selectedId = countryId || cityId || null;

  const [granularityOverride, setGranularityOverride] = useState<PlaceGranularity | null>(null);
  const granularity: PlaceGranularity = granularityOverride ?? (cityId ? "city" : "country");

  // Cities number ~153k, so a city search has to be narrowed by its province or
  // it becomes a full collection scan (slow enough to time out on a cold cache).
  // The province below is scoping state only — it is not part of the value.
  const [scopedProvinceId, setScopedProvinceId] = useState<string | null>(null);

  // Shared with the admin pickers. Uses the `name` filter — a partial,
  // case-insensitive match on the native or English name — rather than `search`,
  // a $text query that only matches whole words.
  const loadCountryOptions = useMemo(() => searchCountries, []);
  const loadProvinceOptions = useMemo(() => searchProvinces(), []);
  const loadCityOptions = useMemo(
    () => searchCities(scopedProvinceId ?? undefined),
    [scopedProvinceId],
  );

  const seededOption = useMemo<AsyncSelectOption[]>(() => {
    if (selectedId && initialLabel) return [{ id: selectedId, label: initialLabel }];
    return [];
  }, [selectedId, initialLabel]);

  const handleGranularityChange = (next: PlaceGranularity) => {
    if (next === granularity) return;
    setGranularityOverride(next);
    setScopedProvinceId(null);
    onChange(null);
  };

  const handleProvinceChange = (val: AsyncSelectValue) => {
    const next = typeof val === "string" ? val : null;
    // The city list is scoped by this province, so a city picked under the
    // previous province would be stale — and misleading, since it would then
    // be reported against a province that no longer contains it.
    if (next !== scopedProvinceId && cityId) onChange(null);
    setScopedProvinceId(next);
  };

  const handleSelect = (val: AsyncSelectValue) => {
    if (!val || Array.isArray(val)) {
      onChange(null);
      return;
    }
    onChange(granularity === "country" ? { countryId: val } : { cityId: val });
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-offwhite">{label}</label>
      )}
      <div className="flex items-center gap-3">
        <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5 shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleGranularityChange("country")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              granularity === "country"
                ? "bg-crimson text-white"
                : "text-slate-body hover:text-offwhite",
            )}
          >
            <Globe className="h-3.5 w-3.5" />
            {t("placeCountry")}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleGranularityChange("city")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              granularity === "city"
                ? "bg-crimson text-white"
                : "text-slate-body hover:text-offwhite",
            )}
          >
            <Building2 className="h-3.5 w-3.5" />
            {t("placeCity")}
          </button>
        </div>

        {granularity === "country" ? (
          <AsyncSelect
            async
            value={countryId || null}
            onChange={handleSelect}
            loadOptions={loadCountryOptions}
            options={seededOption}
            disabled={disabled}
            placeholder={t("selectCountry")}
            searchPlaceholder={t("searchCountry")}
            emptyText={t("noCountryFound")}
            className="bg-white/5 border-white/10 text-offwhite hover:bg-white/10"
          />
        ) : (
          <>
            <AsyncSelect
              async
              isClearable
              value={scopedProvinceId}
              onChange={handleProvinceChange}
              loadOptions={loadProvinceOptions}
              disabled={disabled}
              placeholder={t("province")}
              searchPlaceholder={t("searchProvinces")}
              emptyText={t("noProvinces")}
              className="bg-white/5 border-white/10 text-offwhite hover:bg-white/10"
            />
            <AsyncSelect
              async
              value={cityId || null}
              onChange={handleSelect}
              loadOptions={loadCityOptions}
              options={seededOption}
              disabled={disabled || !scopedProvinceId}
              placeholder={scopedProvinceId ? t("selectCity") : t("selectProvinceFirst")}
              searchPlaceholder={t("searchCity")}
              emptyText={t("noCityFound")}
              className="bg-white/5 border-white/10 text-offwhite hover:bg-white/10"
            />
          </>
        )}
      </div>
    </div>
  );
}
