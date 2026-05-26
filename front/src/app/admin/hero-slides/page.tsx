import { gets } from "@/app/actions/heroSlide/gets";
import { count } from "@/app/actions/heroSlide/count";
import { AdminHeroSlidesClient } from "./admin-hero-slides-client";
import { ReqType, heroSlideSchema } from "@/types/declarations";
import { getTranslations } from "next-intl/server";

interface SearchParams {
  page?: string;
  search?: string;
  status?: string;
  selected_language?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const metadata = {
  title: "Hero Slides — ZiWound Admin",
  description: "Manage homepage hero slider slides",
};

export default async function AdminHeroSlidesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const status = resolvedSearchParams.status || "all";
  const selected_language = resolvedSearchParams.selected_language || "all";
  const sortBy = resolvedSearchParams.sortBy || "order";
  const sortOrder = resolvedSearchParams.sortOrder || "asc";

  const setQuery: ReqType["main"]["heroSlide"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: sortBy as "order" | "createdAt" | "updatedAt",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (status === "active") setQuery.isActive = "true";
  if (status === "inactive") setQuery.isActive = "false";
  if (selected_language !== "all") {
    setQuery.selected_language =
      selected_language as ReqType["main"]["heroSlide"]["gets"]["set"]["selected_language"];
  }

  const slideProjection = {
    _id: 1,
    title: 1,
    subtitle: 1,
    gradient: 1,
    ctaText: 1,
    ctaLink: 1,
    secondaryCtaText: 1,
    secondaryCtaLink: 1,
    order: 1,
    isActive: 1,
    createdAt: 1,
    selected_language: 1,
    image: { _id: 1, name: 1, mimeType: 1, type: 1 },
  } as const;

  const [slidesResponse, totalCountRes, activeCountRes, inactiveCountRes] =
    await Promise.all([
      gets(setQuery, slideProjection),
      count({}, { _id: 1 }),
      count({ isActive: "true" }, { _id: 1 }),
      count({ isActive: "false" }, { _id: 1 }),
    ]);

  const extractList = (res: any) =>
    res?.success
      ? Array.isArray(res.body)
        ? res.body
        : res.body?.list || []
      : [];

  const getCount = (res: any) =>
    res?.success && typeof res.body === "object"
      ? (Array.isArray(res.body) ? res.body.length : res.body?.qty ?? 0)
      : 0;

  const slides: heroSlideSchema[] = extractList(slidesResponse);
  const totalCount = getCount(totalCountRes);
  const activeCount = getCount(activeCountRes);
  const inactiveCount = getCount(inactiveCountRes);

  const error =
    !slidesResponse?.success
      ? slidesResponse?.body?.message || "Failed to fetch hero slides"
      : null;

  return (
    <AdminHeroSlidesClient
      slides={slides}
      totalCount={totalCount || slides.length}
      activeCount={activeCount}
      inactiveCount={inactiveCount}
      error={error}
      currentParams={{
        page,
        search,
        status,
        selected_language,
        sortBy,
        sortOrder,
      }}
    />
  );
}
