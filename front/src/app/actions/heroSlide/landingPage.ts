"use server";
import { AppApi } from "@/lib/api";
import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";
import type { ReqType } from "@/types/declarations";

type LandingLocale = ReqType["main"]["heroSlide"]["landingPage"]["set"]["locale"];

/**
 * The shape of the cached landing payload.
 *
 * Lesan's generated declarations describe an act's *input* (`set`/`get`), not its
 * output, so the response is typed here. Only the fields the page reads are
 * declared.
 */
export interface LandingHeroSlide {
  _id: string;
  title?: string;
  subtitle?: string;
  gradient?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  isActive?: boolean;
  selected_language?: string;
  image?: { _id?: string; name?: string } | null;
}

export interface LandingReportFile {
  _id?: string;
  name?: string;
  mimeType?: string;
  type?: string;
  alt_text?: string;
}

export interface LandingReport {
  _id: string;
  title?: string;
  description?: string;
  createdAt?: string;
  crime_occurred_at?: string;
  location?: { coordinates?: number[] } | null;
  address?: string;
  category?: { _id?: string; name?: string } | null;
  documents?: { _id?: string; title?: string; documentFiles?: LandingReportFile[] }[];
}

export interface LandingBlogPost {
  _id: string;
  title?: string;
  content?: string;
  createdAt?: string;
  coverImage?: { _id?: string; name?: string } | null;
  slug?: string;
}

export interface LandingCountry {
  _id: string;
  name?: string;
  english_name?: string;
  photo?: { _id?: string; name?: string } | null;
  provinces?: { _id?: string; name?: string }[];
  cities?: { _id?: string; name?: string }[];
}

export interface LandingPagePayload {
  locale: string;
  /** When the cached entry was built — useful for spotting stale data. */
  generatedAt: string;
  dashboard: Record<string, number>;
  heroSlides: LandingHeroSlide[];
  reports: LandingReport[];
  blogPosts: LandingBlogPost[];
  countries: LandingCountry[];
}

const isLandingLocale = (value: string): value is LandingLocale =>
  (routing.locales as readonly string[]).includes(value);

/**
 * One cached request for everything the landing page renders, instead of six
 * parallel ones. Returns `null` on any failure so the page can fall back to its
 * built-in defaults rather than erroring.
 */
export const landingPage = async (
  locale: string,
): Promise<LandingPagePayload | null> => {
  try {
    const resolved = isLandingLocale(locale) ? locale : routing.defaultLocale;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const result = await AppApi(undefined, token).send({
      service: "main",
      model: "heroSlide",
      act: "landingPage",
      details: { set: { locale: resolved }, get: {} },
    });

    if (!result?.success || !result.body) return null;
    return result.body as LandingPagePayload;
  } catch {
    return null;
  }
};
