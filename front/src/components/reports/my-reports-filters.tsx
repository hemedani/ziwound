"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface FilterState {
  search: string;
  status: string;
  priority: string;
}

interface MyReportsFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const STATUS_OPTIONS = ["all", "Pending", "InReview", "Approved", "Rejected"] as const;
const PRIORITY_OPTIONS = ["all", "High", "Medium", "Low"] as const;

export function MyReportsFilters({ filters, onFilterChange }: MyReportsFiltersProps) {
  const t = useTranslations("myReports");

  const activeFilters: { key: keyof FilterState; label: string; value: string }[] = [];
  if (filters.search.trim()) {
    activeFilters.push({ key: "search", label: `"${filters.search}"`, value: filters.search });
  }
  if (filters.status !== "all") {
    activeFilters.push({ key: "status", label: t(`status.${filters.status}`), value: filters.status });
  }
  if (filters.priority !== "all") {
    activeFilters.push({ key: "priority", label: t(`priority.${filters.priority}`), value: filters.priority });
  }

  const clearFilter = (key: keyof FilterState) => {
    onFilterChange({ ...filters, [key]: key === "search" ? "" : "all" });
  };

  const clearAll = () => {
    onFilterChange({ search: "", status: "all", priority: "all" });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-body/50" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder={t("searchPlaceholder")}
            className="h-10 w-full rounded-xl border-white/10 bg-white/[0.03] ps-9 text-sm text-offwhite placeholder:text-slate-body/40 focus:border-crimson/40 focus:ring-crimson/20"
          />
          {filters.search && (
            <button
              onClick={() => clearFilter("search")}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-body/50 hover:text-offwhite transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="h-10 appearance-none rounded-xl border border-white/10 bg-white/[0.03] px-3 pe-8 text-sm text-offwhite focus:border-crimson/40 focus:ring-crimson/20 outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-background text-offwhite">
                  {opt === "all" ? t("allStatus") : t(`status.${opt}`)}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute end-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-body/50" />
          </div>

          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
              className="h-10 appearance-none rounded-xl border border-white/10 bg-white/[0.03] px-3 pe-8 text-sm text-offwhite focus:border-crimson/40 focus:ring-crimson/20 outline-none cursor-pointer"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-background text-offwhite">
                  {opt === "all" ? t("allPriority") : t(`priority.${opt}`)}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute end-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-body/50" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 overflow-hidden"
          >
            {activeFilters.map((f) => (
              <motion.button
                key={f.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => clearFilter(f.key)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-body hover:border-crimson/30 hover:text-offwhite transition-colors"
              >
                {f.label}
                <X className="h-3 w-3" />
              </motion.button>
            ))}
            <button
              onClick={clearAll}
              className="text-xs text-crimson-light hover:text-crimson transition-colors"
            >
              {t("clearFilters")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { FilterState };
