"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import type { AsyncSelectLoadResult } from "@/components/form/async-select";

export type ChipItem = { _id: string; name: string };

interface MultiSelectChipsProps {
  label: string;
  /**
   * Known items. Always used to render the selected chips, and used as the
   * local search pool when `loadOptions` is not provided.
   */
  items: ChipItem[];
  /**
   * When provided, typing searches the backend instead of filtering locally.
   * Needed for provinces (5,308) and cities (152,970), which can no longer be
   * preloaded into the page. Must be a stable reference.
   */
  loadOptions?: (inputValue: string) => Promise<AsyncSelectLoadResult>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
  /**
   * Disables the search box only. Selected chips stay removable, so a value
   * scoped to a parent that is no longer selected can still be cleared.
   */
  disabled?: boolean;
  /** Shown instead of `placeholder` while `disabled`. */
  disabledPlaceholder?: string;
}

/**
 * Multi-select with removable chips and a search box.
 *
 * With `loadOptions` the search runs server-side; without it the pool is
 * filtered in the browser (fine for small lists like tags or countries).
 */
export function MultiSelectChips({
  label,
  items,
  loadOptions,
  selectedIds,
  onChange,
  placeholder,
  disabled = false,
  disabledPlaceholder,
}: MultiSelectChipsProps) {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [results, setResults] = useState<ChipItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loadOptions || disabled) return;
    const query = debouncedSearch.trim();
    // Nothing to fetch on an empty query. We deliberately leave `results`
    // untouched: the dropdown is hidden anyway (`showResults` requires a
    // non-empty search), and keeping the last page means a chip added from
    // search keeps its label after the box is cleared.
    if (!query) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const res = await loadOptions(query);
        if (cancelled) return;
        setResults(res.options.map((o) => ({ _id: o.id, name: o.label })));
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [loadOptions, debouncedSearch, disabled]);

  // Every name we know about, so a chip keeps its label after the search clears.
  const known = useMemo(() => {
    const map = new Map<string, ChipItem>();
    for (const item of items) map.set(item._id, item);
    for (const item of results) if (!map.has(item._id)) map.set(item._id, item);
    return map;
  }, [items, results]);

  const selected = useMemo(
    () => selectedIds.map((id) => known.get(id) ?? { _id: id, name: id }),
    [selectedIds, known],
  );

  const available = useMemo(() => {
    if (loadOptions) {
      return results.filter((item) => !selectedIds.includes(item._id));
    }
    const query = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        !selectedIds.includes(item._id) &&
        (!query || item.name.toLowerCase().includes(query)),
    );
  }, [loadOptions, results, items, search, selectedIds]);

  const showResults = !disabled && !!search.trim() && (available.length > 0 || loading);

  return (
    <div>
      <label className="block text-xs font-medium text-slate-body mb-1.5">{label}</label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((item) => (
            <span
              key={item._id}
              className="inline-flex items-center gap-1 rounded-full bg-crimson/10 px-2.5 py-1 text-xs font-medium text-crimson-light border border-crimson/20"
            >
              {item.name}
              <button
                type="button"
                onClick={() => onChange(selectedIds.filter((id) => id !== item._id))}
                className="hover:bg-crimson/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-body/40" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={disabled ? (disabledPlaceholder ?? placeholder) : placeholder}
          disabled={disabled}
          className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 h-9 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
        />
        {loading && (
          <Loader2 className="absolute end-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-slate-body/60" />
        )}
      </div>

      {showResults && (
        <div className="mt-1.5 max-h-36 overflow-y-auto rounded-lg border border-white/[0.06] bg-[#0a0a0a]/95 p-1 space-y-0.5">
          {available.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => {
                onChange([...selectedIds, item._id]);
                setSearch("");
              }}
              className="w-full text-start px-2.5 py-1.5 text-xs text-offwhite hover:bg-white/5 rounded-md transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      {!search.trim() && selected.length === 0 && (
        <p className="text-xs text-slate-body/40 py-2">{t("noneSelected") || "None selected"}</p>
      )}
    </div>
  );
}
