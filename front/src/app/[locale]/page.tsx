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
import { count as countReports } from "@/app/actions/report/count";
import { count as countDocuments } from "@/app/actions/document/count";
import { gets as getReports } from "@/app/actions/report/gets";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { getImageUploadUrl } from "@/utils/imageUrl";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: "Ziwound — Documenting War Crimes & Human Rights Violations",
    description: t("hero.slide1.subtitle"),
    openGraph: {
      title: "Ziwound — Documenting War Crimes",
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
  const [reportCountRes, docCountRes, reportsRes, blogRes] = await Promise.all([
    countReports({}, { qty: 1 }).catch(() => ({ success: false, body: { qty: 0 } })),
    countDocuments({}, { qty: "1" }).catch(() => ({ success: false, body: { qty: 0 } })),
    getReports(
      { page: 1, limit: 6 },
      {
        _id: 1,
        title: 1,
        description: 1,
        createdAt: 1,
        location: 1,
        category: { _id: 1, name: 1 },
      }
    ).catch(() => ({ success: false, body: [] })),
    getBlogPosts(
      { page: 1, limit: 6 },
      {
        _id: 1,
        title: 1,
        content: 1,
        createdAt: 1,
        coverImage: { _id: 1, name: 1 },
        slug: 1,
      }
    ).catch(() => ({ success: false, body: [] })),
  ]);

  const reportCount = reportCountRes.success ? (reportCountRes.body?.qty ?? 0) : 0;
  const docCount = docCountRes.success ? (docCountRes.body?.qty ?? 0) : 0;

  // Build featured items from real data
  const rawReports = reportsRes.success ? (reportsRes.body ?? []) : [];
  const rawBlogs = blogRes.success ? (blogRes.body ?? []) : [];

  const reportItems = Array.isArray(rawReports)
    ? rawReports.slice(0, 3).map((r: any) => ({
        id: r._id,
        title: r.title,
        excerpt: r.description
          ? r.description.length > 140
            ? r.description.slice(0, 140) + "..."
            : r.description
          : "",
        image: getImageUploadUrl(r.coverImage?.name || ""),
        date: r.createdAt
          ? new Date(r.createdAt).toISOString().split("T")[0]
          : "",
        location: r.location?.address || undefined,
        category: r.category?.name || "Report",
        href: `/${locale}/reports/${r._id}`,
      }))
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

  const heroSlides: HeroSlide[] = [
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
        countries="47"
        documents={formatCount(docCount)}
        locations="1,120"
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
