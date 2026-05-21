"use client";

import { Search } from "lucide-react";

interface ReporterSearchProps {
  placeholder: string;
  defaultValue?: string;
}

export function ReporterSearch({ placeholder, defaultValue }: ReporterSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body/40" />
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] ps-10 pe-4 py-2.5 text-sm text-offwhite placeholder:text-slate-body/40 focus:outline-none focus:border-crimson/40 focus:ring-1 focus:ring-crimson/20 transition-all"
        onChange={(e) => {
          const url = new URL(window.location.href);
          if (e.target.value) {
            url.searchParams.set("search", e.target.value);
          } else {
            url.searchParams.delete("search");
          }
          url.searchParams.set("page", "1");
          window.location.href = url.toString();
        }}
      />
    </div>
  );
}
