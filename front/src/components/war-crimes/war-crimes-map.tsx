"use client";

import dynamic from "next/dynamic";

export const WarCrimesMap = dynamic(
  () => import("./war-crimes-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse flex items-center justify-center">
        <p className="text-slate-body/60">Loading Map...</p>
      </div>
    ),
  }
);
