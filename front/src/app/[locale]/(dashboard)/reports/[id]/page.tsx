"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  MapPin,
  Tag,
  Paperclip,
  ArrowLeft,
  Download,
  Loader2,
  User,
  Clock,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ImageIcon,
  Film,
  FileIcon,
  Languages,
  Hash,
  MapPinned,
  Fingerprint,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { get as getReport } from "@/app/actions/report/get";
import dynamic from "next/dynamic";
import { documentSchema, reportSchema } from "@/types/declarations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { cn } from "@/lib/utils";

const ReadonlyMap = dynamic(
  () => import("@/components/map/readonly-map").then((mod) => mod.ReadonlyMap),
  {
    ssr: false,
    loading: () => <div className="h-[350px] w-full animate-pulse rounded-xl bg-white/5" />,
  },
);

interface Report extends Omit<reportSchema, "documents" | "reporter"> {
  documents?: documentSchema[];
  reporter?: {
    _id?: string;
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    address?: string;
    level: "Ghost" | "Manager" | "Editor" | "Ordinary";
    email: string;
    is_verified: boolean;
    avatar?: {
      _id?: string;
      name: string;
      mimeType: string;
      type: "image" | "video" | "docs";
    };
    province?: {
      _id?: string;
      name: string;
      english_name: string;
    };
    city?: {
      _id?: string;
      name: string;
      english_name: string;
    };
  };
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fa: "فارسی",
  ar: "العربية",
  zh: "中文",
  pt: "Português",
  es: "Español",
  nl: "Nederlands",
  tr: "Türkçe",
  ru: "Русский",
  hi: "हिन्दी",
  fr: "Français",
  ja: "日本語",
  de: "Deutsch",
  id: "Bahasa Indonesia",
  ko: "한국어",
  it: "Italiano",
  uk: "Українська",
  pl: "Polski",
  sv: "Svenska",
  ro: "Română",
  vi: "Tiếng Việt",
  ta: "தமிழ்",
  te: "తెలుగు",
  mr: "मराठी",
  pa: "ਪੰਜਾਬੀ",
};

function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: { src: string; alt: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  const goNext = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const goPrev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 end-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute start-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6 rotate-180" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute end-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index].src}
          alt={images[index].alt}
          width={1200}
          height={800}
          unoptimized
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
        />
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportDetailPage() {
  const t = useTranslations("report");
  const tCommon = useTranslations("common");
  const params = useParams();
  const reportId = params.id as string;
  const locale = params.locale as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const result = await getReport(
          { _id: reportId },
          {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            priority: 1,
            location: 1,
            address: 1,
            hostileCountries: { _id: 1, name: 1, english_name: 1 },
            attackedCountries: { _id: 1, name: 1, english_name: 1 },
            attackedProvinces: { _id: 1, name: 1, english_name: 1 },
            attackedCities: { _id: 1, name: 1, english_name: 1 },
            crime_occurred_at: 1,
            createdAt: 1,
            updatedAt: 1,
            selected_language: 1,
            category: { _id: 1, name: 1, color: 1, icon: 1 },
            tags: { _id: 1, name: 1, color: 1, icon: 1 },
            reporter: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              gender: 1,
              level: 1,
              email: 1,
              is_verified: 1,
              avatar: { _id: 1, name: 1, mimeType: 1, type: 1 },
              province: { _id: 1, name: 1, english_name: 1 },
              city: { _id: 1, name: 1, english_name: 1 },
            },
            documents: {
              _id: 1,
              title: 1,
              description: 1,
              selected_language: 1,
              documentFiles: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 },
            },
          },
        );

        if (result.success && result.body) {
          const fetchedReport = Array.isArray(result.body) ? result.body[0] : result.body;
          setReport(fetchedReport as unknown as Report);
        }
      } catch (error) {
        console.error("Failed to fetch report details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          classes: "bg-gold/10 text-gold border-gold/20",
          icon: Clock,
        };
      case "Approved":
        return {
          classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "Rejected":
        return {
          classes: "bg-crimson/10 text-crimson-light border-crimson/20",
          icon: XCircle,
        };
      case "InReview":
        return {
          classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: Eye,
        };
      default:
        return {
          classes: "bg-white/5 text-slate-body border-white/10",
          icon: FileText,
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "High":
        return {
          classes: "bg-crimson/10 text-crimson-light border-crimson/20",
          icon: AlertTriangle,
        };
      case "Medium":
        return {
          classes: "bg-gold/10 text-gold border-gold/20",
          icon: AlertTriangle,
        };
      case "Low":
        return {
          classes: "bg-white/5 text-slate-body border-white/10",
          icon: AlertTriangle,
        };
      default:
        return {
          classes: "bg-white/5 text-slate-body border-white/10",
          icon: AlertTriangle,
        };
    }
  };

  const isImage = (type: string) => type?.startsWith("image/");
  const isVideo = (type: string) => type?.startsWith("video/");

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileIcon className="h-5 w-5 text-slate-body" />;
    if (isImage(mimeType)) return <ImageIcon className="h-5 w-5 text-emerald-400" />;
    if (isVideo(mimeType)) return <Film className="h-5 w-5 text-blue-400" />;
    return <FileIcon className="h-5 w-5 text-slate-body" />;
  };

  // Collect all images from documents
  const allImages = report?.documents?.flatMap((doc) =>
    (doc.documentFiles || [])
      .filter((f) => isImage(f.mimeType || ""))
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
          <FileText className="mx-auto mb-4 h-12 w-12 text-slate-body/40" />
          <h2 className="text-xl font-bold text-offwhite mb-2">{t("reportNotFound")}</h2>
          <p className="text-slate-body mb-6">{t("reportNotFoundDescription")}</p>
          <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
            <Link href="/reports/my">{t("backToReports")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(report.status || "");
  const priorityConfig = getPriorityConfig(report.priority || "");
  const StatusIcon = statusConfig.icon;
  const PriorityIcon = priorityConfig.icon;

  return (
    <div className="min-h-screen">
      {/* Back button - floating */}
      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <Button
          variant="ghost"
          asChild
          className="text-slate-body hover:text-offwhite hover:bg-white/5 -ms-3"
        >
          <Link href="/reports/my" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("backToReports")}
          </Link>
        </Button>
      </div>

      {/* Hero Header */}
      <div className="relative pt-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.08)_0%,_transparent_70%)]" />
        <div className="container mx-auto max-w-6xl px-4 relative">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {report.status && (
              <Badge
                variant="outline"
                className={cn("text-sm gap-1.5 px-2.5 py-1", statusConfig.classes)}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {t(`status${report.status}`)}
              </Badge>
            )}
            {report.priority && (
              <Badge
                variant="outline"
                className={cn("text-sm gap-1.5 px-2.5 py-1", priorityConfig.classes)}
              >
                <PriorityIcon className="h-3.5 w-3.5" />
                {t(`priority${report.priority}`)}
              </Badge>
            )}
            {report.category && (
              <Link href={`/war-crimes?categoryId=${report.category._id}`}>
                <Badge
                  variant="outline"
                  className="text-sm gap-1.5 px-2.5 py-1 bg-white/5 text-slate-body border-white/10 hover:bg-white/10 hover:text-offwhite cursor-pointer transition-colors"
                >
                  {report.category.icon && <span>{report.category.icon}</span>}
                  {report.category.name}
                </Badge>
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-4 leading-tight max-w-4xl">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-body">
            {report.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold" />
                {format(new Date(report.createdAt), "MMM dd, yyyy")}
              </span>
            )}
            {report.crime_occurred_at && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-crimson" />
                {format(new Date(report.crime_occurred_at), "MMM dd, yyyy")}
              </span>
            )}
            {report.selected_language && (
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-gold" />
                {LANGUAGE_NAMES[report.selected_language] || report.selected_language}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery Hero */}
      {allImages.length > 0 && (
        <div className="container mx-auto max-w-6xl px-4 mb-10">
          {allImages.length === 1 ? (
            <div
              className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/5 cursor-pointer group"
              onClick={() => setLightbox({ open: true, index: 0 })}
            >
              <Image
                src={allImages[0].src}
                alt={allImages[0].alt}
                fill
                unoptimized
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  {allImages.length} {tCommon("images")}
                </div>
              </div>
            </div>
          ) : allImages.length === 2 ? (
            <div className="grid grid-cols-2 gap-3">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 cursor-pointer group"
                  onClick={() => setLightbox({ open: true, index: i })}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 1200px) 50vw, 600px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[500px]">
              {/* Large featured image */}
              <div
                className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer group"
                onClick={() => setLightbox({ open: true, index: 0 })}
              >
                <Image
                  src={allImages[0].src}
                  alt={allImages[0].alt}
                  fill
                  unoptimized
                  sizes="(max-width: 1200px) 50vw, 600px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 start-4">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4" />
                    {allImages.length} {tCommon("images")}
                  </div>
                </div>
              </div>
              {/* Side images */}
              {allImages.slice(1, 4).map((img, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/5 cursor-pointer group",
                    i === 2 && allImages.length > 4 ? "col-span-2" : "col-span-1",
                  )}
                  onClick={() => setLightbox({ open: true, index: i + 1 })}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 1200px) 25vw, 300px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {i === 2 && allImages.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">+{allImages.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-4 pb-20">
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
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-body whitespace-pre-wrap leading-relaxed text-[15px]">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Crime Location Details */}
            {(report.hostileCountries?.length ||
              report.attackedCountries?.length ||
              report.attackedProvinces?.length ||
              report.attackedCities?.length ||
              report.crime_occurred_at) && (
              <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-white/5 rounded-lg p-1.5">
                    <MapPinned className="h-4 w-4 text-crimson" />
                  </div>
                  <h2 className="text-lg font-semibold text-offwhite">{t("crimeLocationDetails")}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {report.crime_occurred_at && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 hover:border-white/10 transition-colors">
                      <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-2">
                        {t("crimeOccurredAt")}
                      </p>
                      <p className="font-medium text-offwhite flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gold" />
                        {format(new Date(report.crime_occurred_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  )}
                  {report.hostileCountries && report.hostileCountries.length > 0 && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-2">
                        {t("hostileCountries")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.hostileCountries.map((c) => (
                          <Link key={c._id} href={`/explore/countries/${c._id}`}>
                            <Badge
                              variant="outline"
                              className="bg-white/5 text-slate-body border-white/10 hover:bg-crimson/10 hover:text-crimson-light hover:border-crimson/20 cursor-pointer transition-colors gap-1"
                            >
                              {c.name}
                              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {report.attackedCountries && report.attackedCountries.length > 0 && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-2">
                        {t("attackedCountries")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.attackedCountries.map((c) => (
                          <Link key={c._id} href={`/explore/countries/${c._id}`}>
                            <Badge
                              variant="outline"
                              className="bg-white/5 text-slate-body border-white/10 hover:bg-crimson/10 hover:text-crimson-light hover:border-crimson/20 cursor-pointer transition-colors gap-1"
                            >
                              {c.name}
                              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {report.attackedProvinces && report.attackedProvinces.length > 0 && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-2">
                        {t("attackedProvinces")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.attackedProvinces.map((p) => (
                          <Link key={p._id} href={`/explore/provinces/${p._id}`}>
                            <Badge
                              variant="outline"
                              className="bg-white/5 text-slate-body border-white/10 hover:bg-crimson/10 hover:text-crimson-light hover:border-crimson/20 cursor-pointer transition-colors gap-1"
                            >
                              {p.name}
                              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {report.attackedCities && report.attackedCities.length > 0 && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-2">
                        {t("attackedCities")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.attackedCities.map((c) => (
                          <Link key={c._id} href={`/explore/cities/${c._id}`}>
                            <Badge
                              variant="outline"
                              className="bg-white/5 text-slate-body border-white/10 hover:bg-crimson/10 hover:text-crimson-light hover:border-crimson/20 cursor-pointer transition-colors gap-1"
                            >
                              {c.name}
                              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
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

            {/* Tags */}
            {report.tags && report.tags.length > 0 && (
              <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-5">
                  <div className="bg-white/5 rounded-lg p-1.5">
                    <Tag className="h-4 w-4 text-gold" />
                  </div>
                  <h2 className="text-lg font-semibold text-offwhite">{t("tags")}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag, index) => (
                    <Link key={tag._id || index} href={`/war-crimes?tagIds=${tag._id}`}>
                      <Badge
                        variant="outline"
                        className="bg-white/5 text-slate-body border-white/10 hover:bg-white/10 hover:text-offwhite cursor-pointer transition-colors gap-1.5 px-3 py-1.5"
                      >
                        {tag.icon && <span>{tag.icon}</span>}
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: tag.color || "#cbd5e1" }}
                        />
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Documents & Files */}
            {report.documents && report.documents.length > 0 && (
              <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-white/5 rounded-lg p-1.5">
                    <Paperclip className="h-4 w-4 text-gold" />
                  </div>
                  <h2 className="text-lg font-semibold text-offwhite">
                    {t("documents")} (
                    {report.documents.reduce(
                      (acc, doc) => acc + (doc.documentFiles?.length || 0),
                      0,
                    )}
                    )
                  </h2>
                </div>
                <div className="space-y-5">
                  {report.documents.map((doc, docIndex) => (
                    <div
                      key={doc._id || docIndex}
                      className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden hover:border-white/[0.08] transition-colors"
                    >
                      {/* Document header */}
                      <div className="p-4 border-b border-white/[0.04]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-offwhite flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gold" />
                              {doc.title || t("document")}
                            </h3>
                            {doc.description && (
                              <p className="text-sm text-slate-body mt-1">{doc.description}</p>
                            )}
                          </div>
                          {doc.selected_language && (
                            <Badge
                              variant="outline"
                              className="bg-white/5 text-slate-body border-white/10 shrink-0"
                            >
                              {LANGUAGE_NAMES[doc.selected_language] || doc.selected_language}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Files grid */}
                      {doc.documentFiles && doc.documentFiles.length > 0 && (
                        <div className="p-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            {doc.documentFiles.map((file, fileIndex) => (
                              <div
                                key={`${doc._id}-${file._id || fileIndex}`}
                                className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 transition-all hover:bg-white/[0.04] group"
                              >
                                {isImage(file.mimeType || "") && file._id ? (
                                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-white/5">
                                    <Image
                                      src={getImageUploadUrl(file.name, file.type)}
                                      alt={file.alt_text || file.name || doc.title || "Attachment"}
                                      fill
                                      unoptimized
                                      sizes="56px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                                    {getFileIcon(file.mimeType)}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-offwhite">
                                    {file.name || doc.title}
                                  </p>
                                  <p className="text-xs text-slate-body/60 capitalize">
                                    {file.type || tCommon("unknown")}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  className="text-slate-body hover:text-offwhite hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                  aria-label={tCommon("download")}
                                >
                                  <a
                                    href={
                                      file._id ? getImageUploadUrl(file.name, file.type) : "#"
                                    }
                                    download={file.name}
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Info */}
            {report.reporter && (
              <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-gold" />
                  <h3 className="font-semibold text-offwhite">{t("reporter")}</h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                    {report.reporter.avatar ? (
                      <Image
                        src={getImageUploadUrl(
                          report.reporter.avatar.name,
                          report.reporter.avatar.type,
                        )}
                        alt={`${report.reporter.first_name} ${report.reporter.last_name}`}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-slate-body" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-offwhite">
                      {report.reporter.first_name} {report.reporter.last_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-body">
                      <span className="capitalize">{report.reporter.level}</span>
                      {report.reporter.is_verified && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-400">
                          <Shield className="h-3 w-3" />
                          {t("verified")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {report.reporter.email && (
                  <div className="text-sm text-slate-body break-all">
                    {report.reporter.email}
                  </div>
                )}
                {(report.reporter.province || report.reporter.city) && (
                  <div className="text-sm text-slate-body mt-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    {[report.reporter.city?.name, report.reporter.province?.name]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Report Metadata */}
            <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="h-5 w-5 text-gold" />
                <h3 className="font-semibold text-offwhite">{t("reportDetails")}</h3>
              </div>
              <div className="space-y-4">
                {report._id && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
                      {t("reportId")}
                    </p>
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3.5 w-3.5 text-slate-body/50" />
                      <p className="text-sm font-mono text-offwhite break-all">{report._id}</p>
                    </div>
                  </div>
                )}
                {report.createdAt && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
                      {t("submittedAt")}
                    </p>
                    <p className="text-sm text-offwhite flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-gold" />
                      {format(new Date(report.createdAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                )}
                {report.updatedAt && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
                      {t("lastUpdated")}
                    </p>
                    <p className="text-sm text-offwhite flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-gold" />
                      {format(new Date(report.updatedAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                )}
                {report.selected_language && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
                      {t("reportLanguage")}
                    </p>
                    <p className="text-sm text-offwhite flex items-center gap-2">
                      <Languages className="h-3.5 w-3.5 text-gold" />
                      {LANGUAGE_NAMES[report.selected_language] || report.selected_language}
                    </p>
                  </div>
                )}
                {report.category && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
                      {t("category")}
                    </p>
                    <Link href={`/war-crimes?categoryId=${report.category._id}`}>
                      <p className="text-sm text-offwhite flex items-center gap-2 hover:text-gold transition-colors cursor-pointer">
                        <FileText className="h-3.5 w-3.5 text-gold" />
                        {report.category.name}
                        <ExternalLink className="h-3 w-3 text-slate-body/40" />
                      </p>
                    </Link>
                  </div>
                )}
                {report.priority && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
                      {t("priority")}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("text-xs gap-1", priorityConfig.classes)}
                    >
                      <PriorityIcon className="h-3 w-3" />
                      {t(`priority${report.priority}`)}
                    </Badge>
                  </div>
                )}
                {report.status && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-body/60 mb-1">
                      {t("status")}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("text-xs gap-1", statusConfig.classes)}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {t(`status${report.status}`)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Coordinates */}
            {report.location?.coordinates && (
              <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-crimson" />
                  <h3 className="font-semibold text-offwhite">{t("coordinates")}</h3>
                </div>
                <div className="space-y-2 text-sm font-mono text-slate-body">
                  <p className="flex items-center gap-2">
                    <span className="text-xs uppercase text-slate-body/50 w-16">Lat</span>
                    <span className="text-offwhite">{report.location.coordinates[1]}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-xs uppercase text-slate-body/50 w-16">Lng</span>
                    <span className="text-offwhite">{report.location.coordinates[0]}</span>
                  </p>
                </div>
              </div>
            )}
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
  );
}
