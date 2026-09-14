"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";

export type LocationOption = {
  _id: string;
  name?: string;
  english_name?: string;
};

export type LocationKind = "country" | "province" | "city";

/** Lists small enough to load whole (countries: 250, provinces: max 221/country). */
const LIST_LIMIT = 500;
/** Cities are searched server-side — the world has ~153k of them. */
const CITY_LIMIT = 60;
const CITY_DEBOUNCE_MS = 300;

/** Only the fields the picker renders. `as const` keeps the 0|1 literal types. */
const PROJECTION = { _id: 1, name: 1, english_name: 1 } as const;

export function locationLabel(option: LocationOption): string {
  const name = (option.name || "").trim();
  const english = (option.english_name || "").trim();
  if (name && english && name !== english) return name;
  return name || english || option._id;
}

function normalise(body: unknown): LocationOption[] {
  if (Array.isArray(body)) return body as LocationOption[];
  if (body && typeof body === "object" && Array.isArray((body as { list?: unknown }).list)) {
    return (body as { list: LocationOption[] }).list;
  }
  return [];
}

type Props = {
  kind: LocationKind;
  value?: string;
  onChange: (id: string, option?: LocationOption) => void;
  /** Required for `province` and `city`. */
  countryId?: string;
  /** Required for `city`. */
  provinceId?: string;
  /** Shown before the list is loaded, e.g. when editing an existing record. */
  initialLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Forwarded to the trigger so react-hook-form labels/ids keep working. */
  id?: string;
};

/**
 * Searchable location picker that works with the full world dataset.
 *
 * Countries and provinces are loaded whole and filtered locally; cities are
 * queried on the server with a debounced name search, because there are far too
 * many to load into a dropdown.
 */
export function LocationCombobox({
  kind,
  value,
  onChange,
  countryId,
  provinceId,
  initialLabel,
  placeholder,
  disabled,
  className,
  id,
}: Props) {
  const t = useTranslations("regional");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  /** id -> label, so a picked value keeps its name once the list is unloaded. */
  const [labels, setLabels] = useState<Record<string, string>>({});

  const serverSearch = kind === "city";
  const parentReady = kind === "country" ? true : kind === "province" ? !!countryId : !!provinceId;
  const parentKey =
    kind === "country" ? "all" : kind === "province" ? countryId ?? "" : provinceId ?? "";

  const defaultPlaceholder =
    placeholder ??
    (kind === "country"
      ? t("selectCountry")
      : kind === "province"
        ? t("selectProvince")
        : t("selectCity"));

  // Adjust state during render (the React-recommended alternative to an effect)
  // when the parent changes, so a stale child list can never be shown for a
  // newly picked parent.
  const [prevParentKey, setPrevParentKey] = useState(parentKey);
  if (prevParentKey !== parentKey) {
    setPrevParentKey(parentKey);
    setOptions([]);
    setQuery("");
  }

  const remember = (list: LocationOption[]) =>
    setLabels((prev) => {
      const next = { ...prev };
      for (const option of list) next[option._id] = locationLabel(option);
      return next;
    });

  // ---- countries / provinces: load the whole (small) list ---------------- //
  const loadList = async () => {
    if (serverSearch || !parentReady) return;
    setLoading(true);
    try {
      const res =
        kind === "country"
          ? await getCountries(
              { page: 1, limit: LIST_LIMIT, sortBy: "name", sortOrder: "asc" },
              PROJECTION,
            )
          : await getProvinces(
              {
                page: 1,
                limit: LIST_LIMIT,
                countryIds: [countryId as string],
                sortBy: "name",
                sortOrder: "asc",
              },
              PROJECTION,
            );
      if (res.success) {
        const list = normalise(res.body);
        setOptions(list);
        remember(list);
      }
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- cities: debounced server-side search ----------------------------- //
  useEffect(() => {
    if (!serverSearch || !open || !parentReady) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getCities(
          {
            page: 1,
            limit: CITY_LIMIT,
            provinceIds: [provinceId as string],
            ...(query.trim() ? { name: query.trim() } : {}),
            sortBy: "name",
            sortOrder: "asc",
          },
          PROJECTION,
        );
        if (cancelled) return;
        if (res.success) {
          const list = normalise(res.body);
          setOptions(list);
          setLabels((prev) => {
            const next = { ...prev };
            for (const option of list) next[option._id] = locationLabel(option);
            return next;
          });
        }
      } catch {
        if (!cancelled) setOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, CITY_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [serverSearch, open, parentReady, provinceId, query]);

  const label = value ? labels[value] ?? initialLabel ?? "" : "";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && !serverSearch) void loadList();
  };

  const disabledState = disabled || !parentReady;

  const emptyText = useMemo(
    () => (!parentReady
      ? kind === "province"
        ? t("selectCountryFirst")
        : t("selectProvinceFirst")
      : t("noResults")),
    [parentReady, kind, t],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabledState}
          className={cn(
            "h-10 w-full justify-between bg-white/5 border-white/10 text-offwhite font-normal hover:bg-white/10 hover:text-offwhite",
            !label && "text-slate-body/60",
            className,
          )}
        >
          <span className="truncate">{label || defaultPlaceholder}</span>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] min-w-64 p-0 glass-strong border-white/10"
      >
        <Command shouldFilter={!serverSearch}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={t("searchPlaceholder")}
            className="text-offwhite placeholder:text-slate-body/50"
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-body">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("loading")}
              </div>
            ) : (
              <>
                <CommandEmpty className="py-6 text-center text-sm text-slate-body">
                  {emptyText}
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const selected = option._id === value;
                    const secondary =
                      option.english_name && option.name && option.english_name !== option.name
                        ? option.english_name
                        : undefined;
                    return (
                      <CommandItem
                        key={option._id}
                        value={option._id}
                        keywords={[option.name || "", option.english_name || ""]}
                        onSelect={() => {
                          setLabels((prev) => ({
                            ...prev,
                            [option._id]: locationLabel(option),
                          }));
                          onChange(option._id, option);
                          setOpen(false);
                        }}
                        className="text-offwhite data-[selected=true]:bg-white/10 data-[selected=true]:text-offwhite"
                      >
                        <Check
                          className={cn(
                            "me-2 h-4 w-4 shrink-0",
                            selected ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="truncate">{locationLabel(option)}</span>
                        {secondary && (
                          <span className="ms-2 truncate text-xs text-slate-body/70">
                            {secondary}
                          </span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
