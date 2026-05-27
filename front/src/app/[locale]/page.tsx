import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/landing/hero-slider-dynamic";
import { QuoteBanner } from "@/components/landing/quote-banner";
import { WhyMatters } from "@/components/landing/why-matters";
import { ExploreLocations } from "@/components/landing/explore-locations";
import { FeaturedReports } from "@/components/landing/FeaturedReports";
import { ImpactCounters } from "@/components/landing/impact-counters";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FinalCTA } from "@/components/landing/final-cta";
import type { HeroSlide } from "@/components/landing/HeroSlider";
import { gets as getReports } from "@/app/actions/report/gets";
import { gets as getBlogPosts } from "@/app/actions/blogPost/gets";
import { gets as getHeroSlides } from "@/app/actions/heroSlide/gets";
import { gets as getCountries } from "@/app/actions/country/gets";
import { statistics as reportStatistics } from "@/app/actions/report/statistics";
import { dashboardStatistic } from "@/app/actions/user/dashboardStatistic";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { ReqType } from "@/types/declarations";
import { Globe, Shield, Users, FileText } from "lucide-react";

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

  // Fetch all data in parallel
  const [dashRes, reportsRes, blogRes, heroSlidesRes, statsRes, countriesRes] = await Promise.all([
    dashboardStatistic(
      {},
      {
        reports: 1, documents: 1, countries: 1, cities: 1, provinces: 1,
        warCriminals: 1, users: 1,
      }
    ).catch(() => ({ success: false, body: {} })),
    getReports(
      {
        page: 1, limit: 4, status: "Approved",
        selected_language: (locale as ReqType["main"]["report"]["gets"]["set"]["selected_language"]),
      },
      {
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
      }
    ).catch(() => ({ success: false, body: [] })),
    getBlogPosts(
      {
        page: 1, limit: 4,
        selected_language: (locale as ReqType["main"]["blogPost"]["gets"]["set"]["selected_language"]),
      },
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
      {
        page: 1, limit: 10, sortBy: "order", sortOrder: "asc",
        selected_language: (locale as ReqType["main"]["heroSlide"]["gets"]["set"]["selected_language"]),
      },
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
    getCountries(
      { page: 1, limit: 8 },
      {
        _id: 1,
        name: 1,
        english_name: 1,
        photo: { _id: 1, name: 1 },
        provinces: { _id: 1, name: 1 },
        cities: { _id: 1, name: 1 },
      }
    ).catch(() => ({ success: false, body: [] })),
  ]);

  const dashBody = dashRes.success && typeof dashRes.body === "object" ? (dashRes.body as Record<string, number>) : {};
  const reportCount = dashBody.reports ?? 0;
  const docCount = dashBody.documents ?? 0;
  const countryCount = dashBody.countries ?? 0;
  const warCriminalCount = dashBody.warCriminals ?? 0;
  const userCount = dashBody.users ?? 0;
  const provinceCount = dashBody.provinces ?? 0;
  const cityCount = dashBody.cities ?? 0;

  const statsBody = statsRes.success && typeof statsRes.body === "object" ? statsRes.body : {};
  const geographicCounts = Array.isArray(statsBody.geographicCounts) ? statsBody.geographicCounts : [];
  const locationCount = geographicCounts.length;

  // Featured items
  const rawReports = reportsRes.success ? (reportsRes.body ?? []) : [];
  const rawBlogs = blogRes.success ? (blogRes.body ?? []) : [];

  const reportItems = Array.isArray(rawReports)
    ? rawReports.slice(0, 4).map((r: any) => {
        const docs = r.documents || [];
        const allFiles = docs.flatMap((d: any) => d.documentFiles || []);
        const firstImage = allFiles.find((f: any) => f.mimeType?.startsWith("image/"));
        const firstVideo = allFiles.find((f: any) => f.mimeType?.startsWith("video/"));
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
            ? (() => {
                const plain = r.description.replace(/<[^>]*>/g, "");
                return plain.length > 140 ? plain.slice(0, 140) + "..." : plain;
              })()
            : "",
          image: mediaType === "image" ? mediaSrc : "",
          mediaType,
          mediaSrc,
          lat: hasLocation ? r.location.coordinates[1] : undefined,
          lng: hasLocation ? r.location.coordinates[0] : undefined,
          date: r.crime_occurred_at
            ? new Date(r.crime_occurred_at).toISOString().split("T")[0]
            : r.createdAt
              ? new Date(r.createdAt).toISOString().split("T")[0]
              : "",
          location: r.address || undefined,
          category: r.category?.name || "Report",
          href: `/${locale}/reports/${r._id}`,
        };
      })
    : [];

  const blogItems = Array.isArray(rawBlogs)
    ? rawBlogs.slice(0, 2).map((b: any) => ({
        id: b._id,
        title: b.title,
        excerpt: b.content
          ? b.content.replace(/<[^>]+>/g, "").slice(0, 140) + "..."
          : "",
        image: b.coverImage?.name ? getImageUploadUrl(b.coverImage.name) : "",
        mediaType: "image" as const,
        mediaSrc: b.coverImage?.name ? getImageUploadUrl(b.coverImage.name) : "",
        date: b.createdAt
          ? new Date(b.createdAt).toISOString().split("T")[0]
          : "",
        category: "Story",
        href: `/${locale}/blog/${b.slug || b._id}`,
      }))
    : [];

  const featuredItems = [...reportItems, ...blogItems].slice(0, 4);

  // Build hero slides
  const rawHeroSlides = heroSlidesRes.success ? (heroSlidesRes.body ?? []) : [];
  const backendSlides = Array.isArray(rawHeroSlides)
    ? rawHeroSlides
        .filter((s: any) => s.isActive)
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
            gradient: "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
            title: t("hero.slide1.title"),
            subtitle: t("hero.slide1.subtitle"),
            ctaText: t("hero.slide1.cta"),
            ctaLink: `/${locale}/reports/new`,
            secondaryCtaText: t("hero.slide1.secondaryCta"),
            secondaryCtaLink: `/${locale}/war-crimes`,
          },
          {
            id: "2",
            gradient: "radial-gradient(ellipse 100% 80% at 20% 40%, rgba(139,0,0,0.2) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 80% 80%, rgba(212,175,55,0.08) 0%, transparent 50%), linear-gradient(135deg, #0a0a0a, #110808)",
            title: t("hero.slide2.title"),
            subtitle: t("hero.slide2.subtitle"),
            ctaText: t("hero.slide2.cta"),
            ctaLink: `/${locale}/about`,
            secondaryCtaText: t("hero.slide2.secondaryCta"),
            secondaryCtaLink: `/${locale}/war-crimes`,
          },
          {
            id: "3",
            gradient: "radial-gradient(ellipse 120% 100% at 50% 100%, rgba(153,27,27,0.2) 0%, #0a0a0a 55%), linear-gradient(to top, #0f0505, #0a0a0a)",
            title: t("hero.slide3.title"),
            subtitle: t("hero.slide3.subtitle"),
            ctaText: t("hero.slide3.cta"),
            ctaLink: `/${locale}/reports/new`,
            secondaryCtaText: t("hero.slide3.secondaryCta"),
            secondaryCtaLink: `/${locale}/blog`,
          },
        ];

  // Build explore locations from countries
  const rawCountries = countriesRes.success ? (countriesRes.body ?? []) : [];
  const countryItems = Array.isArray(rawCountries)
    ? rawCountries.slice(0, 8).map((c: any) => ({
        _id: c._id,
        name: c.name,
        english_name: c.english_name,
        photo: c.photo,
        provinces: c.provinces?.length || 0,
        cities: c.cities?.length || 0,
      }))
    : [];

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return `${n}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* ───── 1. Hero ───── */}
      <div className="-mt-16">
        <HeroSlider
          slides={heroSlides}
          brandLabel={t("hero.brandLabel")}
          scrollIndicator={t("hero.scrollIndicator")}
          autoPlayInterval={7000}
        />
      </div>

      {/* Trust indicators bar below hero */}
      <section className="relative py-6 md:py-8 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-body/60 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-gold" />
              {t("hero.trust.locales")}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-gold" />
              {t("hero.trust.reports", { count: formatCount(reportCount) })}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-gold" />
              {t("hero.trust.countries", { count: countryCount })}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-gold" />
              {t("hero.trust.verified")}
            </span>
          </div>
        </div>
      </section>

      {/* ───── 2. Quote Slider ───── */}
      <QuoteBanner
        quotes={t.raw("quote.slides") as Array<{ text: string; attribution?: string }>}
      />

      {/* ───── 3. Why ZiWound Matters ───── */}
      <WhyMatters
        overline={t("whyMatters.overline")}
        title={t("whyMatters.title")}
        subtitle={t("whyMatters.subtitle")}
        cards={[
          { icon: "Shield", title: t("whyMatters.card1.title"), description: t("whyMatters.card1.desc") },
          { icon: "Eye", title: t("whyMatters.card2.title"), description: t("whyMatters.card2.desc") },
          { icon: "Scale", title: t("whyMatters.card3.title"), description: t("whyMatters.card3.desc") },
          { icon: "HeartHandshake", title: t("whyMatters.card4.title"), description: t("whyMatters.card4.desc") },
        ]}
      />

      {/* ───── 4. Explore Locations ───── */}
      <ExploreLocations
        overline={t("locations.overline")}
        title={t("locations.title")}
        subtitle={t("locations.subtitle")}
        viewAll={t("locations.viewAll")}
        viewAllHref={`/${locale}/explore`}
        locations={countryItems}
        locale={locale}
      />

      {/* ───── 5. Featured Reports ───── */}
      <FeaturedReports
        overline={t("featured.overline")}
        title={t("featured.title")}
        subtitle={t("featured.subtitle")}
        readMore={t("featured.readMore")}
        items={featuredItems}
      />

      {/* ───── 6. Impact Statistics ───── */}
      <ImpactCounters
        overline={t("impactStats.overline")}
        title={t("impactStats.title")}
        subtitle={t("impactStats.subtitle")}
        items={[
          { icon: "FileText", end: reportCount, label: t("impactStats.reports") },
          { icon: "Globe", end: countryCount, label: t("impactStats.countries") },
          { icon: "Users", end: userCount, label: t("impactStats.reporters") },
          { icon: "Gavel", end: warCriminalCount, label: t("impactStats.warCriminals") || "War Criminals" },
        ]}
      />

      {/* ───── 7. How It Works ───── */}
      <HowItWorks
        overline={t("howItWorks.overline")}
        title={t("howItWorks.title")}
        subtitle={t("howItWorks.subtitle")}
        steps={[
          { icon: "Upload", title: t("howItWorks.step1.title"), description: t("howItWorks.step1.desc") },
          { icon: "Search", title: t("howItWorks.step2.title"), description: t("howItWorks.step2.desc") },
          { icon: "Scale", title: t("howItWorks.step3.title"), description: t("howItWorks.step3.desc") },
          { icon: "Bell", title: t("howItWorks.step4.title"), description: t("howItWorks.step4.desc") },
        ]}
      />

      {/* ───── 8. Voices / Testimonials (placeholder) ───── */}

      {/* ───── 9. Final CTA ───── */}
      <FinalCTA
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        exploreCta={t("finalCta.exploreCta")}
        reportCta={t("finalCta.reportCta")}
        exploreHref={`/${locale}/war-crimes`}
        reportHref={`/${locale}/reports/new`}
        note={t("finalCta.note")}
      />
    </div>
  );
}
