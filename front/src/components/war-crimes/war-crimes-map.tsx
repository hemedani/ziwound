"use client";

import dynamic from "next/dynamic";

export const WarCrimesMap = dynamic(
  () => import("./war-crimes-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-lg border bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading Map...</p>
      </div>
    ),
  }
);
