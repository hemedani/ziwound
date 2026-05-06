"use client";

import dynamic from "next/dynamic";

export const HeroSlider = dynamic(
  () => import("./HeroSlider").then((mod) => mod.HeroSlider),
  { ssr: false }
);
