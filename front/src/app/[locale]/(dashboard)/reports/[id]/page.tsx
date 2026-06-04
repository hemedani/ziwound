"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { FileText, MapPin, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { confirmationSchema, documentSchema, reportSchema } from "@/types/declarations";
import { getImageUploadUrl } from "@/utils/imageUrl";

import { ImageLightbox } from "@/components/report/image-lightbox";
import { MediaGallery } from "@/components/report/media-gallery";
import { LocationHierarchyCard } from "@/components/report/location-hierarchy-card";
import { WarCriminalCard } from "@/components/report/war-criminal-card";
import { ReportMetadataSidebar } from "@/components/report/report-metadata-sidebar";
import { DocumentsSection } from "@/components/report/documents-section";
import { ConfirmationSection } from "@/components/report/confirmation-section";

import { get as getReport } from "@/app/actions/report/get";
import { gets as getConfirmations } from "@/app/actions/confirmation/gets";

const ReadonlyMap = dynamic(
  () => import("@/components/map/readonly-map").then((mod) => mod.ReadonlyMap),
  {
    ssr: false,
    loading: () => <div className="h-[350px] w-full animate-pulse rounded-xl bg-white/5" />,
  },
);

// Extended report type with nested relations
interface Report extends Omit<reportSchema, "documents" | "reporter"> {
  documents?: documentSchema[];
  reporter?: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    address?: string;
    level: "Ghost" | "Manager" | "Editor" | "Reporter" | "Artist" | "Diplomat" | "Researcher" | "Ordinary";
    email: string;
    is_verified: boolean;
    avatar?: { _id?: string; name: string; mimeType: string; type: "image" | "video" | "docs" };
    province?: { _id?: string; name: string; english_name: string };
    city?: { _id?: string; name: string; english_name: string };
  };
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", fa: "فارسی", ar: "العربية", zh: "中文",
  pt: "Português", es: "Español", nl: "Nederlands", tr: "Türkçe",
  ru: "Русский", hi: "हिन्दी", fr: "Français", ja: "日本語",
  de: "Deutsch", id: "Bahasa Indonesia", ko: "한국어", it: "Italiano",
  uk: "Українська", pl: "Polski", sv: "Svenska", ro: "Română",
  vi: "Tiếng Việt", ta: "தமிழ்", te: "తెలుగు", mr: "मराठी", pa: "ਪੰਜਾਬੀ",
};

export default function ReportDetailPage() {
  const t = useTranslations("report");
  const tCommon = useTranslations("common");
  const params = useParams();
  const reportId = params.id as string;
  const locale = params.locale as string;

  const [report, setReport] = useState<Report | null>(null);
  const [confirmations, setConfirmations] = useState<confirmationSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  const refreshConfirmations = useCallback(async () => {
    const confResult = await getConfirmations(
      { page: 1, limit: 50, reportId },
      {
        _id: 1, title: 1, content: 1, type: 1, badge: 1, isVerified: 1,
        selected_language: 1, createdAt: 1,
        author: { _id: 1, first_name: 1, last_name: 1, level: 1, verificationBadge: 1 },
        supportingFiles: { _id: 1, name: 1, mimeType: 1, type: 1 },
      },
    );
    if (confResult.success && confResult.body) {
      const confs = Array.isArray(confResult.body) ? confResult.body : confResult.body?.list || [];
      setConfirmations(confs);
    }
  }, [reportId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getReport(
          { _id: reportId },
          {
            _id: 1, title: 1, description: 1, status: 1, priority: 1,
            location: 1, address: 1, crime_occurred_at: 1,
            createdAt: 1, updatedAt: 1, selected_language: 1,
            hostileCountries: { _id: 1, name: 1, english_name: 1 },
            attackedCountries: { _id: 1, name: 1, english_name: 1 },
            attackedProvinces: { _id: 1, name: 1, english_name: 1 },
            attackedCities: { _id: 1, name: 1, english_name: 1 },
            warCriminals: {
              _id: 1, fullName: 1, status: 1, aliases: 1, nationality: 1,
              affiliation: 1, rankOrPosition: 1, knownFor: 1, description: 1,
              isEntity: 1, photo: { _id: 1, name: 1, mimeType: 1, type: 1 },
            },
            category: { _id: 1, name: 1, color: 1, icon: 1 },
            tags: { _id: 1, name: 1, color: 1, icon: 1 },
            reporter: {
              _id: 1, first_name: 1, last_name: 1, gender: 1, level: 1,
              email: 1, is_verified: 1,
              avatar: { _id: 1, name: 1, mimeType: 1, type: 1 },
              province: { _id: 1, name: 1, english_name: 1 },
              city: { _id: 1, name: 1, english_name: 1 },
            },
            documents: {
              _id: 1, title: 1, description: 1, selected_language: 1,
              documentFiles: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
            },
          },
        );

        if (result.success && result.body) {
          const fetchedReport = Array.isArray(result.body) ? result.body[0] : result.body;
          setReport(fetchedReport as unknown as Report);
        }
        await refreshConfirmations();
      } catch (error) {
        console.error("Failed to fetch report details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId, refreshConfirmations]);

  // Collect all images from documents
  const allImages = report?.documents?.flatMap((doc) =>
    (doc.documentFiles || [])
      .filter((f) => f.mimeType?.startsWith("image/"))
      .map((f) => ({
        src: getImageUploadUrl(f.name, f.type),
        alt: f.alt_text || f.name || doc.title || "",
      })),
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-crimson" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-2xl glass-strong p-10 text-center max-w-lg mx-auto">
          <FileText className="mx-auto mb-4 h-12 w-12 text-slate-body/30" />
          <h2 className="text-xl font-bold text-offwhite mb-2">{t("reportNotFound")}</h2>
          <p className="text-slate-body/60 mb-6">{t("reportNotFoundDescription")}</p>
          <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
            <Link href="/war-crimes">{t("backToWarCrimes")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const locationTranslations = {
    crimeOccurredAt: t("crimeOccurredAt"),
    hostileCountries: t("hostileCountries"),
    attackedCountries: t("attackedCountries"),
    attackedProvinces: t("attackedProvinces"),
    attackedCities: t("attackedCities"),
  };

  const warCriminalTranslations = {
    warCriminals: t("warCriminals"),
    warCriminalsOrganizations: t("warCriminalsOrganizations"),
    warCriminalsAliases: t("warCriminalsAliases"),
    warCriminalsKnownFor: t("warCriminalsKnownFor"),
    description: t("description"),
    warCriminalsStatusAccused: t("warCriminalsStatusAccused"),
    warCriminalsStatusIndicted: t("warCriminalsStatusIndicted"),
    warCriminalsStatusConvicted: t("warCriminalsStatusConvicted"),
    warCriminalsStatusAtLarge: t("warCriminalsStatusAtLarge"),
    warCriminalsStatusDeceased: t("warCriminalsStatusDeceased"),
    warCriminalsStatusUnknown: t("warCriminalsStatusUnknown"),
    warCriminalsStatusSanctioned: t("warCriminalsStatusSanctioned"),
    warCriminalsAffiliationMilitary: t("warCriminalsAffiliationMilitary"),
    warCriminalsAffiliationParamilitary: t("warCriminalsAffiliationParamilitary"),
    warCriminalsAffiliationGovernment: t("warCriminalsAffiliationGovernment"),
    warCriminalsAffiliationRebelGroup: t("warCriminalsAffiliationRebelGroup"),
    warCriminalsAffiliationPrivateMilitaryCompany: t("warCriminalsAffiliationPrivateMilitaryCompany"),
    warCriminalsAffiliationPolitical: t("warCriminalsAffiliationPolitical"),
    warCriminalsAffiliationOther: t("warCriminalsAffiliationOther"),
  };

  const sidebarTranslations = {
    reporter: t("reporter"),
    verified: t("verified"),
    reportDetails: t("reportDetails"),
    reportId: t("reportId"),
    submittedAt: t("submittedAt"),
    lastUpdated: t("lastUpdated"),
    reportLanguage: t("reportLanguage"),
    category: t("category"),
    priority: t("priority"),
    status: t("status"),
    coordinates: t("coordinates"),
    tags: t("tags"),
    statusApproved: t("statusApproved"),
    statusPending: t("statusPending"),
    statusRejected: t("statusRejected"),
    statusInReview: t("statusInReview"),
    priorityHigh: t("priorityHigh"),
    priorityMedium: t("priorityMedium"),
    priorityLow: t("priorityLow"),
  };

  const documentTranslations = {
    documents: t("documents"),
    document: t("document"),
  };

  return (
    <PageContainer showHeader={false} contentClassName="">
      <PageHero
        icon={<FileText className="h-5 w-5 text-crimson" />}
        title={report?.title || t("reportNotFound")}
        description={t("reportDetails")}
        backLink={{ href: "/war-crimes", label: t("backToWarCrimes") }}
      />
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Media Gallery */}
        {allImages.length > 0 && (
          <div className="max-w-7xl mx-auto mb-10">
            <MediaGallery
              images={allImages}
              onImageClick={(index) => setLightbox({ open: true, index })}
            />
          </div>
        )}

        {/* Main Content + Sidebar */}
        <div className="max-w-7xl mx-auto pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-5">
                  <div className="bg-white/5 rounded-lg p-1.5">
                    <FileText className="h-4 w-4 text-gold" />
                  </div>
                  <h2 className="text-lg font-semibold text-offwhite">{t("description")}</h2>
                </div>
                <div
                  className="prose prose-invert max-w-none prose-p:text-slate-body/80 prose-headings:text-offwhite prose-a:text-crimson-light prose-strong:text-offwhite prose-code:text-gold prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 leading-relaxed text-[15px]"
                  dangerouslySetInnerHTML={{ __html: report.description }}
                />
              </div>

              {/* Location Hierarchy */}
              <LocationHierarchyCard
                crimeOccurredAt={report.crime_occurred_at}
                hostileCountries={report.hostileCountries}
                attackedCountries={report.attackedCountries}
                attackedProvinces={report.attackedProvinces}
                attackedCities={report.attackedCities}
                translations={locationTranslations}
                locale={locale}
              />

              {/* Location Map */}
              {(report.address || report.location?.coordinates) && (
                <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="bg-white/5 rounded-lg p-1.5">
                      <MapPin className="h-4 w-4 text-crimson" />
                    </div>
                    <h2 className="text-lg font-semibold text-offwhite">{t("location")}</h2>
                  </div>
                  {report.address && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-4">
                      <p className="text-xs uppercase tracking-wider text-slate-body/50 mb-1">
                        {t("address")}
                      </p>
                      <p className="font-medium text-offwhite">{report.address}</p>
                    </div>
                  )}
                  {report.location?.coordinates && (
                    <div className="rounded-xl overflow-hidden border border-white/5">
                      <ReadonlyMap
                        latitude={report.location.coordinates[1]}
                        longitude={report.location.coordinates[0]}
                        className="h-[350px] w-full relative z-0"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* War Criminals */}
              {report.warCriminals && report.warCriminals.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="rounded-xl bg-crimson/20 p-2">
                      <FileText className="h-5 w-5 text-crimson-light" />
                    </div>
                    <h2 className="text-xl font-semibold text-offwhite">{t("warCriminals")}</h2>
                    <Badge variant="outline" className="border-white/10 text-slate-body/60 text-xs">
                      {report.warCriminals.length}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {report.warCriminals.map((wc) => (
                      <WarCriminalCard
                        key={wc._id}
                        warCriminal={wc as unknown as typeof wc & { photo?: { name: string; type: string } }}
                        locale={locale}
                        translations={warCriminalTranslations}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Documents & Files */}
              {report.documents && report.documents.length > 0 && (
                <DocumentsSection
                  documents={report.documents}
                  translations={documentTranslations}
                  languageNames={LANGUAGE_NAMES}
                />
              )}

              {/* Confirmations */}
              <ConfirmationSection
                confirmations={confirmations}
                reportId={reportId}
                onAdded={refreshConfirmations}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <ReportMetadataSidebar
                  report={report}
                  translations={sidebarTranslations}
                  languageNames={LANGUAGE_NAMES}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightbox.open && allImages.length > 0 && (
          <ImageLightbox
            images={allImages}
            initialIndex={lightbox.index}
            onClose={() => setLightbox({ open: false, index: 0 })}
          />
        )}
      </div>
    </PageContainer>
  );
}
