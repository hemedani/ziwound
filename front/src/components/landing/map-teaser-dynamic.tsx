"use client";

import dynamic from "next/dynamic";

export const MapTeaser = dynamic(
  () => import("./MapTeaser").then((mod) => mod.MapTeaser),
  { ssr: false }
);
