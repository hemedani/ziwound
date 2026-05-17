import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/landing/hero-slider-dynamic";
import { MapTeaser } from "@/components/landing/map-teaser-dynamic";
import { ImpactStats } from "@/components/landing/ImpactStats";
import { FeaturedReports } from "@/components/landing/FeaturedReports";
import { TrustMission } from "@/components/landing/TrustMission";
import { SubmitCTA } from "@/components/landing/SubmitCTA";
import { Timeline } from "@/components/landing/Timeline";
import type { HeroSlide } from "@/components/landing/HeroSlider";
import { gets as getReports } from "@/app/actions/report/gets";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { gets as getHeroSlides } from "@/app/actions/heroSlide/gets";
import { statistics as reportStatistics } from "@/app/actions/report/statistics";
import { dashboardStatistic } from "@/app/actions/user/dashboardStatistic";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { ReqType } from "@/types/declarations";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: "ZiWound — Documenting War Crimes & Human Rights Violations",
    description: t("hero.slide1.subtitle"),
    openGraph: {
      title: "ZiWound — Documenting War Crimes",
      description: t("hero.slide1.subtitle"),
      type: "website",
    },
  };
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  // Fetch stats and featured content in parallel
  const [dashRes, reportsRes, blogRes, heroSlidesRes, statsRes] = await Promise.all([
    dashboardStatistic(
      {},
      { reports: 1, documents: 1, countries: 1, cities: 1, provinces: 1 }
    ).catch(() => ({ success: false, body: {} })),
    getReports(
      { page: 1, limit: 6, status: "Approved", selected_language: (locale as ReqType["main"]["report"]["gets"]["set"]["selected_language"]) },
      {
        _id: 1,
        title: 1,
        description: 1,
        createdAt: 1,
        location: 1,
        address: 1,
        category: { _id: 1, name: 1 },
        documents: {
          _id: 1,
          title: 1,
          documentFiles: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
        },
      }
    ).catch(() => ({ success: false, body: [] })),
    getBlogPosts(
      { page: 1, limit: 6, selected_language: (locale as ReqType["main"]["blogPost"]["gets"]["set"]["selected_language"]) },
      {
        _id: 1,
        title: 1,
        content: 1,
        createdAt: 1,
        coverImage: { _id: 1, name: 1 },
        slug: 1,
      }
    ).catch(() => ({ success: false, body: [] })),
    getHeroSlides(
      { page: 1, limit: 10, sortBy: "order", sortOrder: "asc", selected_language: (locale as ReqType["main"]["heroSlide"]["gets"]["set"]["selected_language"]) },
      {
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
      }
    ).catch(() => ({ success: false, body: [] })),
    reportStatistics({}, {}).catch(() => ({ success: false, body: {} })),
  ]);

  const dashBody = dashRes.success && typeof dashRes.body === "object" ? (dashRes.body as Record<string, number>) : {};
  const reportCount = dashBody.reports ?? 0;
  const docCount = dashBody.documents ?? 0;
  const countryCount = dashBody.countries ?? 0;

  // Extract real statistics for map hotspots
  const statsBody = statsRes.success && typeof statsRes.body === "object" ? statsRes.body : {};
  const geographicCounts = Array.isArray(statsBody.geographicCounts) ? statsBody.geographicCounts : [];
  const locationCount = geographicCounts.length;

  // Build featured items from real data
  const rawReports = reportsRes.success ? (reportsRes.body ?? []) : [];
  const rawBlogs = blogRes.success ? (blogRes.body ?? []) : [];

  const reportItems = Array.isArray(rawReports)
    ? rawReports.slice(0, 3).map((r: any) => {
      // Find first image, first video, or location for the card media
      const docs = r.documents || [];
      const allFiles = docs.flatMap((d: any) => d.documentFiles || []);
      const firstImage = allFiles.find((f: any) =>
        f.mimeType?.startsWith("image/"),
      );
      const firstVideo = allFiles.find((f: any) =>
        f.mimeType?.startsWith("video/"),
      );
      const hasLocation = r.location?.coordinates?.length === 2;

      let mediaType: "image" | "video" | "map" | "none" = "none";
      let mediaSrc = "";
      if (firstImage) {
        mediaType = "image";
        mediaSrc = getImageUploadUrl(firstImage.name, firstImage.type);
      } else if (firstVideo) {
        mediaType = "video";
        mediaSrc = getImageUploadUrl(firstVideo.name, firstVideo.type);
      } else if (hasLocation) {
        mediaType = "map";
      }

      return {
        id: r._id,
        title: r.title,
        excerpt: r.description
          ? r.description.length > 140
            ? r.description.slice(0, 140) + "..."
            : r.description
          : "",
        image: mediaType === "image" ? mediaSrc : "",
        mediaType,
        mediaSrc,
        lat: hasLocation ? r.location.coordinates[1] : undefined,
        lng: hasLocation ? r.location.coordinates[0] : undefined,
        date: r.createdAt
          ? new Date(r.createdAt).toISOString().split("T")[0]
          : "",
        location: r.address || undefined,
        category: r.category?.name || "Report",
        href: `/${locale}/reports/${r._id}`,
      };
    })
    : [];

  const blogItems = Array.isArray(rawBlogs)
    ? rawBlogs.slice(0, 3).map((b: any) => ({
      id: b._id,
      title: b.title,
      excerpt: b.content
        ? b.content.replace(/<[^>]+>/g, "").slice(0, 140) + "..."
        : "",
      image: getImageUploadUrl(b.coverImage?.name || ""),
      date: b.createdAt
        ? new Date(b.createdAt).toISOString().split("T")[0]
        : "",
      location: undefined,
      category: "Story",
      href: `/${locale}/blog/${b.slug || b._id}`,
    }))
    : [];

  // Combine and take top 3
  const featuredItems = [...reportItems, ...blogItems].slice(0, 3);

  // Build hero slides from backend or fallback to static translations
  const rawHeroSlides = heroSlidesRes.success ? (heroSlidesRes.body ?? []) : [];
  const backendSlides = Array.isArray(rawHeroSlides)
    ? rawHeroSlides
      .filter((s: any) => s.isActive)
      // Filter by locale: show slides matching the locale or without a language set
      .filter((s: any) => {
        const slideLang = s.selected_language as string | undefined;
        return !slideLang || slideLang === locale;
      })
      .map((s: any) => ({
        id: s._id,
        title: s.title,
        subtitle: s.subtitle,
        gradient: s.gradient,
        ctaText: s.ctaText,
        ctaLink: s.ctaLink,
        secondaryCtaText: s.secondaryCtaText || undefined,
        secondaryCtaLink: s.secondaryCtaLink || undefined,
        image: s.image?.name ? getImageUploadUrl(s.image.name) : undefined,
      }))
    : [];

  const heroSlides: HeroSlide[] =
    backendSlides.length > 0
      ? backendSlides
      : [
        {
          id: "1",
          gradient:
            "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
          title: t("hero.slide1.title"),
          subtitle: t("hero.slide1.subtitle"),
          ctaText: t("hero.slide1.cta"),
          ctaLink: `/${locale}/reports/new`,
          secondaryCtaText: t("hero.slide1.secondaryCta"),
          secondaryCtaLink: `/${locale}/war-crimes`,
        },
        {
          id: "2",
          gradient:
            "radial-gradient(ellipse 100% 80% at 20% 40%, rgba(139,0,0,0.2) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 80% 80%, rgba(212,175,55,0.08) 0%, transparent 50%), linear-gradient(135deg, #0a0a0a, #110808)",
          title: t("hero.slide2.title"),
          subtitle: t("hero.slide2.subtitle"),
          ctaText: t("hero.slide2.cta"),
          ctaLink: `/${locale}/about`,
          secondaryCtaText: t("hero.slide2.secondaryCta"),
          secondaryCtaLink: `/${locale}/war-crimes`,
        },
        {
          id: "3",
          gradient:
            "radial-gradient(ellipse 120% 100% at 50% 100%, rgba(153,27,27,0.2) 0%, #0a0a0a 55%), linear-gradient(to top, #0f0505, #0a0a0a)",
          title: t("hero.slide3.title"),
          subtitle: t("hero.slide3.subtitle"),
          ctaText: t("hero.slide3.cta"),
          ctaLink: `/${locale}/reports/new`,
          secondaryCtaText: t("hero.slide3.secondaryCta"),
          secondaryCtaLink: `/${locale}/blog`,
        },
      ];

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return `${n}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Fullscreen Hero Slider */}
      <div className="-mt-16">
        <HeroSlider
          slides={heroSlides}
          brandLabel={t("hero.brandLabel")}
          scrollIndicator={t("hero.scrollIndicator")}
          autoPlayInterval={7000}
        />
      </div>

      {/* Impact Stats Bar */}
      <ImpactStats
        reports={formatCount(reportCount)}
        countries={formatCount(countryCount)}
        documents={formatCount(docCount)}
        locations={formatCount(locationCount)}
        reportsLabel={t("impactStats.reports")}
        countriesLabel={t("impactStats.countries")}
        documentsLabel={t("impactStats.documents")}
        locationsLabel={t("impactStats.locations")}
      />

      {/* Featured Reports / Stories */}
      <FeaturedReports
        overline={t("featured.overline")}
        title={t("featured.title")}
        subtitle={t("featured.subtitle")}
        readMore={t("featured.readMore")}
        items={featuredItems}
      />

      {/* Map Teaser */}
      <MapTeaser
        locale={locale}
        overline={t("mapTeaser.overline")}
        title={t("mapTeaser.title")}
        description={t("mapTeaser.description")}
        activeZonesLabel={t("mapTeaser.activeZones")}
        verifiedReportsLabel={t("mapTeaser.verifiedReports")}
        ctaText={t("mapTeaser.cta")}
        hotspots={geographicCounts.slice(0, 12).map((g: any) => ({
          lat: g._id.lat,
          lng: g._id.lng,
          count: g.count,
        }))}
      />

      {/* Timeline */}
      <Timeline
        overline={t("timeline.overline")}
        title={t("timeline.title")}
        subtitle={t("timeline.subtitle")}
        viewDetails={t("timeline.viewDetails")}
        events={featuredItems.slice(0, 4).map((item) => ({
          id: item.id,
          date: item.date,
          title: item.title,
          description: item.excerpt,
          location: item.location,
          href: item.href,
        }))}
      />

      {/* Trust & Mission */}
      <TrustMission
        overline={t("mission.overline")}
        title={t("mission.title")}
        p1={t("mission.p1")}
        p2={t("mission.p2")}
        tagline={t("mission.tagline")}
        pillar1Title={t("trustMission.pillar1Title")}
        pillar1Desc={t("trustMission.pillar1Desc")}
        pillar2Title={t("trustMission.pillar2Title")}
        pillar2Desc={t("trustMission.pillar2Desc")}
        pillar3Title={t("trustMission.pillar3Title")}
        pillar3Desc={t("trustMission.pillar3Desc")}
        pillar4Title={t("trustMission.pillar4Title")}
        pillar4Desc={t("trustMission.pillar4Desc")}
      />

      {/* Submit Report CTA */}
      <SubmitCTA
        title={t("submitCTA.title")}
        subtitle={t("submitCTA.subtitle")}
        primaryCta={t("submitCTA.primary")}
        secondaryCta={t("submitCTA.secondary")}
        note={t("submitCTA.note")}
      />
    </div>
  );
}
