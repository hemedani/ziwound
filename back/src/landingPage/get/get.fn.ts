import type { ActFn } from "lesan";
import {
  LANDING_TTL_SECONDS,
  cacheReadThrough,
  landingCacheKey,
} from "@lib";
import { getsFn as blogPostGets } from "../../blogPost/gets/gets.fn.ts";
import { getsFn as countryGets } from "../../country/gets/gets.fn.ts";
import { getsFn as heroSlideGets } from "../../heroSlide/gets/gets.fn.ts";
import { getsFn as reportGets } from "../../report/gets/gets.fn.ts";
import { dashboardStatisticFn } from "../../user/dashboardStatistic/dashboardStatistic.fn.ts";

type ActBody = Parameters<ActFn>[0];

/**
 * Runs an existing read act's `fn` with a synthesized body.
 *
 * The landing payload is assembled from the same acts the frontend used to call
 * one by one, so the shape of the data cannot drift from the rest of the API.
 * These fns only read `body.details`, so no request context is required.
 */
const runActFn = <T>(fn: ActFn, set: object, get: object): Promise<T> =>
  fn({ details: { set, get } } as unknown as ActBody) as Promise<T>;

/** Counters shown in the "our global impact" strip. */
const DASHBOARD_SELECTION = {
  reports: 1,
  documents: 1,
  countries: 1,
  cities: 1,
  provinces: 1,
  warCriminals: 1,
  users: 1,
} as const;

const HERO_SLIDE_PROJECTION = {
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
  selected_language: 1,
  image: { _id: 1, name: 1 },
} as const;

const REPORT_PROJECTION = {
  _id: 1,
  title: 1,
  description: 1,
  createdAt: 1,
  crime_occurred_at: 1,
  location: 1,
  address: 1,
  category: { _id: 1, name: 1 },
  documents: {
    _id: 1,
    title: 1,
    documentFiles: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
  },
} as const;

const BLOG_POST_PROJECTION = {
  _id: 1,
  title: 1,
  content: 1,
  createdAt: 1,
  coverImage: { _id: 1, name: 1 },
  slug: 1,
} as const;

const COUNTRY_PROJECTION = {
  _id: 1,
  name: 1,
  english_name: 1,
  photo: { _id: 1, name: 1 },
  provinces: { _id: 1, name: 1 },
  cities: { _id: 1, name: 1 },
} as const;

/**
 * Everything the landing page renders, for one locale, in a single cached call.
 *
 * Replaces six parallel requests — the slowest of which was an unfiltered
 * `countDocuments` over 153k cities — with one cached payload. See
 * `utils/cache.ts` for the cache itself and `utils/landingCache.ts` for which
 * mutations invalidate it.
 */
export const landingPageFn: ActFn = async (body) => {
  const locale = body.details.set.locale as string;
  const key = await landingCacheKey(locale);

  return await cacheReadThrough(key, LANDING_TTL_SECONDS, async () => {
    const [dashboard, heroSlides, reports, blogPosts, countries] =
      await Promise.all([
        runActFn<Record<string, number>>(
          dashboardStatisticFn,
          {},
          DASHBOARD_SELECTION,
        ),
        runActFn<unknown[]>(heroSlideGets, {
          page: 1,
          limit: 10,
          sortBy: "order",
          sortOrder: "asc",
          selected_language: locale,
        }, HERO_SLIDE_PROJECTION),
        runActFn<unknown[]>(reportGets, {
          page: 1,
          limit: 4,
          status: "Approved",
          selected_language: locale,
        }, REPORT_PROJECTION),
        runActFn<unknown[]>(blogPostGets, {
          page: 1,
          limit: 4,
          selected_language: locale,
        }, BLOG_POST_PROJECTION),
        runActFn<unknown[]>(countryGets, {
          page: 1,
          limit: 8,
        }, COUNTRY_PROJECTION),
      ]);

    return {
      locale,
      // Generation time of this entry, so the frontend (or a human) can tell how
      // old a cached payload is.
      generatedAt: new Date().toISOString(),
      dashboard,
      heroSlides,
      reports,
      blogPosts,
      countries,
    };
  });
};
