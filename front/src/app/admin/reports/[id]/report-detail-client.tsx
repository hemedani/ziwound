"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Edit3,
  Trash2,
  Check,
  X,
  Eye,
  Loader2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  Globe,
  Calendar,
  Hash,
  Fingerprint,
  Languages,
  FileText,
  Paperclip,
  User,
  Shield,
  Tag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Download,
  Film,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { update as updateReport } from "@/app/actions/report/update";
import { remove as removeReport } from "@/app/actions/report/remove";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

type ReportStatus = "Pending" | "Approved" | "Rejected" | "InReview";
type ReportPriority = "High" | "Medium" | "Low";

interface WarCriminalItem {
  _id?: string;
  fullName: string;
  status?: string;
  aliases?: string[];
  nationality?: string[];
  affiliation?: string;
  rankOrPosition?: string;
  knownFor?: Record<string, string>;
  description?: Record<string, string>;
  isEntity?: boolean;
  photo?: { _id?: string; name: string; mimeType?: string; type: string };
}

interface DocFile {
  _id?: string;
  name: string;
  type: string;
  mimeType?: string;
  alt_text?: string;
}

interface DocumentItem {
  _id?: string;
  title: string;
  description?: string;
  selected_language?: string;
  documentFiles?: DocFile[];
}

interface LocationItem {
  _id: string;
  name: string;
}

interface ReporterItem {
  _id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  level: string;
  is_verified: boolean;
  avatar?: { _id?: string; name: string; type: string };
  province?: { _id?: string; name?: string };
  city?: { _id?: string; name?: string };
}

interface ReportData {
  _id?: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  selected_language?: string;
  crime_occurred_at?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  address?: string;
  location?: { type?: string; coordinates?: number[] };
  category?: { _id?: string; name?: string; color?: string; icon?: string };
  tags?: { _id?: string; name?: string; color?: string; icon?: string }[];
  reporter?: ReporterItem;
  documents?: DocumentItem[];
  hostileCountries?: LocationItem[];
  attackedCountries?: LocationItem[];
  attackedProvinces?: LocationItem[];
  attackedCities?: LocationItem[];
  warCriminals?: WarCriminalItem[];
}

interface Props {
  report: Record<string, unknown>;
  reportId: string;
}

/* ─── Helpers ─── */

const statusConfig: Record<string, { classes: string; icon: typeof Clock }> = {
  Pending: { classes: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
  Approved: { classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  Rejected: { classes: "bg-crimson/10 text-crimson-light border-crimson/20", icon: XCircle },
  InReview: { classes: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Eye },
};

const priorityConfig: Record<string, { classes: string; icon: typeof AlertTriangle }> = {
  High: { classes: "bg-crimson/10 text-crimson-light border-crimson/20", icon: AlertTriangle },
  Medium: { classes: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: AlertTriangle },
  Low: { classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: AlertTriangle },
};

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    Pending: "status_pending", Approved: "status_approved",
    Rejected: "status_rejected", InReview: "status_in_review",
  };
  return map[status] || "status_pending";
}

function priorityLabel(priority: string): string {
  const map: Record<string, string> = {
    High: "priority_high", Medium: "priority_medium", Low: "priority_low",
  };
  return map[priority] || "priority_medium";
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return ""; }
}

function formatDateTime(date: Date | string | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return ""; }
}

function extractImageFiles(documents: DocumentItem[] | undefined): { src: string; alt: string }[] {
  if (!documents) return [];
  const images: { src: string; alt: string }[] = [];
  for (const doc of documents) {
    if (!doc.documentFiles) continue;
    for (const file of doc.documentFiles) {
      if (file.mimeType?.startsWith("image/") && file.name) {
        images.push({
          src: getImageUploadUrl(file.name, "image"),
          alt: file.alt_text || doc.title || "Image",
        });
      }
    }
  }
  return images;
}

const languageNames: Record<string, string> = {
  fa: "فارسی", en: "English", ar: "العربية", zh: "中文",
  pt: "Português", es: "Español", nl: "Nederlands", tr: "Türkçe", ru: "Русский",
};

/* ─── Subcomponents ─── */

function SectionHeader({ icon: Icon, title, count }: { icon: React.ElementType; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-white/5 rounded-lg p-1.5">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <h2 className="text-sm font-semibold text-offwhite">
        {title}{count !== undefined ? <span className="text-slate-body/50 ms-1.5">({count})</span> : null}
      </h2>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1">{label}</p>
      <p className="text-xs text-slate-body/70 flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-gold/60 shrink-0" />
        {value}
      </p>
    </div>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl glass-strong p-5 border border-white/[0.06]", className)}>
      {children}
    </div>
  );
}

/* ─── Status Management Card ─── */
function StatusManagementCard({
  currentStatus,
  onStatusChange,
  isPending,
}: {
  currentStatus?: string;
  onStatusChange: (status: string) => void;
  isPending: boolean;
}) {
  const t = useTranslations("admin");
  const statuses = ["Pending", "Approved", "Rejected", "InReview"];

  return (
    <GlassCard>
      <SectionHeader icon={Eye} title={t("status") || "Status"} />
      <div className="space-y-2">
        {statuses.map((s) => {
          const cfg = statusConfig[s] || statusConfig.Pending;
          const Icon = cfg.icon;
          const isActive = currentStatus === s;
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              disabled={isActive || isPending}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 border",
                isActive
                  ? `${cfg.classes} shadow-sm`
                  : "bg-white/[0.02] border-white/[0.04] text-slate-body hover:bg-white/[0.06] hover:text-offwhite hover:border-white/[0.08]",
              )}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="flex-1 text-start">{t(statusLabel(s))}</span>
              {isActive && <Check className="h-3.5 w-3.5 opacity-70" />}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}

/* ─── Main Component ─── */
export function ReportDetailClient({ report: rawReport, reportId }: Props) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const { toast } = useToast();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [statusChanging, setStatusChanging] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const report = rawReport as unknown as ReportData;

  const images = useMemo(() => extractImageFiles(report.documents), [report.documents]);
  const imageLightboxItems = useMemo(
    () => images.map((img) => ({ src: img.src, alt: img.alt })),
    [images],
  );

  const statusCfg = statusConfig[report.status || ""] || statusConfig.Pending;
  const StatusIcon = statusCfg.icon;
  const priorityCfg = report.priority ? priorityConfig[report.priority] : null;

  /* ─── Actions ─── */

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === report.status) return;
    setStatusChanging(newStatus);
    const res = await updateReport({ _id: reportId, status: newStatus as ReportStatus }, { _id: 1 });
    setStatusChanging(null);
    if (res?.success) {
      toast({ title: t("success") || "Success", description: t("reportUpdated") || "Report updated" });
      startTransition(() => router.refresh());
    } else {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: res?.body?.message || "Failed to update status",
      });
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (newPriority === report.priority) return;
    const res = await updateReport({ _id: reportId, priority: newPriority as ReportPriority }, { _id: 1 });
    if (res?.success) {
      toast({ title: t("success") || "Success", description: t("reportUpdated") || "Report updated" });
      startTransition(() => router.refresh());
    } else {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: res?.body?.message || "Failed to update priority",
      });
    }
  };

  const handleDelete = async () => {
    const res = await removeReport({ _id: reportId }, { _id: 1 });
    setDeleteDialogOpen(false);
    if (res?.success) {
      toast({ title: t("success") || "Success", description: t("reportDeleted") || "Report deleted" });
      startTransition(() => router.push("/admin/reports"));
    } else {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: res?.body?.message || "Failed to delete",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <motion.div
        className="space-y-6 p-6 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ─── Breadcrumb ─── */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 text-xs text-slate-body/60 mb-4">
            <Link href="/admin/reports" className="hover:text-gold transition-colors">
              {t("reportsManagement") || "Reports"}
            </Link>
            <span className="text-slate-body/30">/</span>
            <span className="text-offwhite/70 truncate max-w-[300px]">{report.title}</span>
          </div>
        </motion.div>

        {/* ─── Hero Header ─── */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
            <div className="relative">
              {/* Top row: back + badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Link
                  href="/admin/reports"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-body/60 hover:text-offwhite transition-colors"
                >
                  <BackArrow className="h-3.5 w-3.5" />
                  {t("backToList") || "Back to list"}
                </Link>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs gap-1.5 px-2.5 py-1", statusCfg.classes)}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {t(statusLabel(report.status || "Pending"))}
                  </Badge>
                  {priorityCfg && (
                    <Badge variant="outline" className={cn("text-xs gap-1.5 px-2.5 py-1", priorityCfg.classes)}>
                      <priorityCfg.icon className="h-3.5 w-3.5" />
                      {t(priorityLabel(report.priority || "Medium"))}
                    </Badge>
                  )}
                  {report.selected_language && (
                    <Badge variant="outline" className="bg-white/5 text-slate-body border-white/10 text-xs">
                      <Globe className="h-3 w-3 me-1" />
                      {languageNames[report.selected_language] || report.selected_language}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-offwhite mb-2 leading-tight">
                {report.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-slate-body/60 mb-5">
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="h-3 w-3 text-slate-body/40" />
                  <code className="font-mono text-[10px]">{report._id}</code>
                </span>
                {report.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-gold/60" />
                    {formatDateTime(report.createdAt)}
                  </span>
                )}
                {report.crime_occurred_at && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-crimson/60" />
                    {t("crimeOccurredAt") || "Incident"}: {formatDate(report.crime_occurred_at)}
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/reports/${reportId}/edit`}>
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 text-offwhite border border-white/10 h-9">
                    <Edit3 className="h-4 w-4 me-1.5" />
                    {t("edit") || "Edit"}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
                    >
                      <Eye className="h-4 w-4 me-1.5" />
                      {t("changeStatus") || "Change Status"}
                      <ChevronDown className="h-3 w-3 ms-1.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong border-white/10 min-w-[160px]">
                    <DropdownMenuLabel className="text-slate-body text-xs">
                      {t("status") || "Status"}
                    </DropdownMenuLabel>
                    {["Pending", "Approved", "Rejected", "InReview"].map((s) => {
                      const cfg = statusConfig[s] || statusConfig.Pending;
                      const Icon = cfg.icon;
                      const isActive = report.status === s;
                      return (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          disabled={isActive || statusChanging === s}
                          className={cn(
                            "text-offwhite focus:bg-white/10 cursor-pointer",
                            isActive && "text-gold",
                          )}
                        >
                          {statusChanging === s ? (
                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Icon className={cn("me-2 h-4 w-4", isActive ? "text-gold" : "")} />
                          )}
                            {t(statusLabel(s))}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
                  asChild
                >
                  <Link href={`/admin/reports/${reportId}/edit?tab=relations`}>
                    <Link2 className="h-4 w-4 me-1.5" />
                    {t("updateRelations") || "Relations"}
                  </Link>
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="bg-crimson/20 text-crimson-light hover:bg-crimson/30 border border-crimson/20 h-9"
                >
                  <Trash2 className="h-4 w-4 me-1.5" />
                  {t("delete") || "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Media Gallery ─── */}
        {images.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl glass-light border border-white/[0.06] overflow-hidden">
              <div className="p-4 pb-0">
                <SectionHeader icon={ImageIcon} title={t("mediaGallery") || "Media Gallery"} count={images.length} />
              </div>
              {images.length === 1 ? (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setLightboxIndex(0)}
                    className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer group"
                  >
                    <Image
                      src={images[0].src}
                      alt={images[0].alt}
                      fill
                      unoptimized
                      sizes="(max-width: 1200px) 100vw, 900px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="glass-strong text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5" />
                        {t("viewAll") || "View"}
                      </span>
                    </div>
                  </button>
                </div>
              ) : images.length === 2 ? (
                <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer group"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 1200px) 50vw, 450px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 grid-rows-2 gap-3 px-4 pb-4 h-[400px]">
                  <button
                    onClick={() => setLightboxIndex(0)}
                    className="col-span-2 row-span-2 relative overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer group"
                  >
                    <Image
                      src={images[0].src}
                      alt={images[0].alt}
                      fill
                      unoptimized
                      sizes="(max-width: 1200px) 50vw, 450px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 start-3">
                      <span className="glass-strong text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5" />
                        {images.length} {t("images") || "images"}
                      </span>
                    </div>
                  </button>
                  {images.slice(1, 5).map((img, i) => {
                    const isLast = i === 3 && images.length > 5;
                    return (
                      <button
                        key={i + 1}
                        onClick={() => setLightboxIndex(i + 1)}
                        className={cn(
                          "relative overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer group",
                          isLast && "col-span-2",
                        )}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          unoptimized
                          sizes="(max-width: 1200px) 25vw, 225px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {isLast && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-medium text-lg">+{images.length - 5}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── Two Column Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Description */}
            {report.description && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <SectionHeader icon={FileText} title={t("description") || "Description"} />
                  <div className={cn("text-sm text-slate-body leading-relaxed", !descriptionExpanded && "line-clamp-6")}>
                    <div
                      className="prose prose-invert prose-sm max-w-none prose-p:text-slate-body prose-headings:text-offwhite prose-a:text-crimson-light prose-strong:text-offwhite"
                      dangerouslySetInnerHTML={{ __html: report.description }}
                    />
                  </div>
                  <button
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                    className="mt-2 text-xs text-crimson-light hover:text-crimson transition-colors"
                  >
                    {descriptionExpanded ? (t("showLess") || "Show less") : (t("showMore") || "Show more")}
                  </button>
                </GlassCard>
              </motion.div>
            )}

            {/* Reporter */}
            {report.reporter && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <SectionHeader icon={User} title={t("reporter") || "Reporter"} />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      {report.reporter.avatar ? (
                        <Image
                          src={getImageUploadUrl(report.reporter.avatar.name, report.reporter.avatar.type as "image" | "video" | "docs")}
                          alt={`${report.reporter.first_name} ${report.reporter.last_name}`}
                          width={48}
                          height={48}
                          unoptimized
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-slate-body/50" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-offwhite text-sm">
                        {report.reporter.first_name} {report.reporter.last_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-body/60">
                        <span className="capitalize">{report.reporter.level}</span>
                        {report.reporter.is_verified && (
                          <span className="inline-flex items-center gap-0.5 text-emerald-400">
                            <Shield className="h-3 w-3" />
                            {t("verified") || "Verified"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {report.reporter.email && (
                    <p className="text-xs text-slate-body/60">{report.reporter.email}</p>
                  )}
                  {(report.reporter.province || report.reporter.city) && (
                    <p className="text-xs text-slate-body/50 mt-1.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gold/50" />
                      {[report.reporter.city?.name, report.reporter.province?.name].filter(Boolean).join(", ")}
                    </p>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {/* Category & Tags */}
            {(report.category || (report.tags && report.tags.length > 0)) && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <SectionHeader icon={Tag} title={t("categoryAndTags") || "Category & Tags"} />
                  {report.category && (
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1.5">{t("category") || "Category"}</p>
                      <Link href={`/admin/reports?category=${report.category._id}`}>
                        <Badge
                          variant="outline"
                          className="bg-white/5 text-slate-body border-white/10 hover:bg-crimson/10 hover:text-crimson-light hover:border-crimson/20 cursor-pointer transition-colors gap-1.5"
                        >
                          {report.category.icon && <span>{report.category.icon}</span>}
                          {report.category.name}
                          <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                        </Badge>
                      </Link>
                    </div>
                  )}
                  {report.tags && report.tags.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1.5">{t("tags") || "Tags"}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.tags.map((tag) => (
                          <Link key={tag._id} href={`/admin/reports?tagIds=${tag._id}`}>
                            <Badge
                              variant="outline"
                              className="bg-white/5 text-slate-body border-white/10 hover:bg-white/10 hover:text-offwhite cursor-pointer transition-colors gap-1.5 text-xs"
                            >
                              {tag.icon && <span>{tag.icon}</span>}
                              {tag.color && (
                                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                              )}
                              {tag.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {/* War Criminals */}
            {report.warCriminals && report.warCriminals.length > 0 && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <SectionHeader icon={AlertTriangle} title={t("warCriminals") || "War Criminals"} count={report.warCriminals.length} />
                  <div className="space-y-3">
                    {report.warCriminals.map((wc) => (
                      <Link
                        key={wc._id}
                        href={`/admin/war-criminals/${wc._id}`}
                        className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                      >
                        <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/[0.06]">
                          {wc.photo ? (
                            <Image
                              src={getImageUploadUrl(wc.photo.name, wc.photo.type as "image" | "video" | "docs")}
                              alt={wc.fullName}
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <User className="h-5 w-5 text-slate-body/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-offwhite group-hover:text-crimson-light transition-colors truncate">
                            {wc.fullName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-body/60">
                            {wc.affiliation && <span>{wc.affiliation}</span>}
                            {wc.status && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-white/5 text-slate-body border-white/10">
                                {wc.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-body/30 group-hover:text-crimson-light transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status Management */}
            <motion.div variants={itemVariants}>
              <StatusManagementCard
                currentStatus={report.status}
                onStatusChange={handleStatusChange}
                isPending={statusChanging !== null}
              />
            </motion.div>

            {/* Priority Management */}
            <motion.div variants={itemVariants}>
              <GlassCard>
                <SectionHeader icon={AlertTriangle} title={t("priority") || "Priority"} />
                <Select
                  value={report.priority || "Medium"}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10">
                    {["High", "Medium", "Low"].map((p) => {
                      const cfg = priorityConfig[p] || priorityConfig.Medium;
                      const Icon = cfg.icon;
                      return (
                        <SelectItem key={p} value={p} className="text-offwhite focus:bg-white/10">
                          <span className="flex items-center gap-2">
                            <Icon className={cn("h-3.5 w-3.5", cfg.classes.split(" ")[1])} />
                            {t(priorityLabel(p))}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </GlassCard>
            </motion.div>

            {/* Report Metadata */}
            <motion.div variants={itemVariants}>
              <GlassCard>
                <SectionHeader icon={Hash} title={t("reportDetails") || "Report Details"} />
                <div className="space-y-3">
                  {report._id && (
                    <InfoRow icon={Fingerprint} label={t("reportId") || "ID"} value={
                      <code className="font-mono text-[10px] break-all">{report._id}</code>
                    } />
                  )}
                  {report.createdAt && (
                    <InfoRow icon={Calendar} label={t("submittedAt") || "Submitted"} value={formatDateTime(report.createdAt)} />
                  )}
                  {report.updatedAt && (
                    <InfoRow icon={Clock} label={t("lastUpdated") || "Updated"} value={formatDateTime(report.updatedAt)} />
                  )}
                  {report.selected_language && (
                    <InfoRow icon={Languages} label={t("reportLanguage") || "Language"} value={
                      languageNames[report.selected_language] || report.selected_language
                    } />
                  )}
                  {report.crime_occurred_at && (
                    <InfoRow icon={Clock} label={t("crimeOccurredAt") || "Incident Date"} value={formatDate(report.crime_occurred_at)} />
                  )}
                  {report.address && (
                    <InfoRow icon={MapPin} label={t("address") || "Address"} value={report.address} />
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Location Relations */}
            <motion.div variants={itemVariants}>
              <GlassCard>
                <SectionHeader icon={MapPin} title={t("locations") || "Locations"} />

                {report.hostileCountries && report.hostileCountries.length > 0 && (
                  <LocationSection
                    label={t("hostileCountries") || "Hostile Countries"}
                    items={report.hostileCountries}
                    hrefPrefix="/admin/countries"
                    colorClass="bg-crimson/10 text-crimson-light border-crimson/20"
                  />
                )}

                {report.attackedCountries && report.attackedCountries.length > 0 && (
                  <LocationSection
                    label={t("attackedCountries") || "Attacked Countries"}
                    items={report.attackedCountries}
                    hrefPrefix="/admin/countries"
                    colorClass="bg-amber-500/10 text-amber-400 border-amber-500/20"
                  />
                )}

                {report.attackedProvinces && report.attackedProvinces.length > 0 && (
                  <LocationSection
                    label={t("attackedProvinces") || "Attacked Provinces"}
                    items={report.attackedProvinces}
                    hrefPrefix="/admin/provinces"
                  />
                )}

                {report.attackedCities && report.attackedCities.length > 0 && (
                  <LocationSection
                    label={t("attackedCities") || "Attacked Cities"}
                    items={report.attackedCities}
                    hrefPrefix="/admin/cities"
                  />
                )}

                {(!report.hostileCountries?.length && !report.attackedCountries?.length && !report.attackedProvinces?.length && !report.attackedCities?.length) && (
                  <p className="text-xs text-slate-body/50 text-center py-4">{t("noLocations") || "No locations linked"}</p>
                )}
              </GlassCard>
            </motion.div>

            {/* Coordinates */}
            {report.location?.coordinates && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <SectionHeader icon={Globe} title={t("coordinates") || "Coordinates"} />
                  <div className="space-y-1.5 text-xs font-mono text-slate-body/70">
                    <p className="flex items-center gap-2">
                      <span className="text-[10px] uppercase text-slate-body/40 w-8">Lat</span>
                      <span className="text-offwhite">{report.location.coordinates[1]}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-[10px] uppercase text-slate-body/40 w-8">Lng</span>
                      <span className="text-offwhite">{report.location.coordinates[0]}</span>
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Documents */}
            {report.documents && report.documents.length > 0 && (
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <SectionHeader icon={Paperclip} title={t("documents") || "Documents"} count={report.documents.length} />
                  <div className="space-y-3">
                    {report.documents.map((doc, docIdx) => (
                      <div
                        key={doc._id || docIdx}
                        className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/[0.04]">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-medium text-offwhite truncate">{doc.title || `Document ${docIdx + 1}`}</p>
                            {doc.selected_language && (
                              <Badge variant="outline" className="bg-white/5 text-slate-body/60 border-white/10 text-[10px] shrink-0">
                                {languageNames[doc.selected_language] || doc.selected_language}
                              </Badge>
                            )}
                          </div>
                          {doc.description && (
                            <p className="text-[11px] text-slate-body/50 mt-0.5 line-clamp-1">{doc.description}</p>
                          )}
                        </div>
                        {doc.documentFiles && doc.documentFiles.length > 0 && (
                          <div className="p-3 grid gap-2">
                            {doc.documentFiles.map((file, fileIdx) => (
                              <div
                                key={`${doc._id}-${file._id || fileIdx}`}
                                className="flex items-center gap-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 transition-all hover:bg-white/[0.04] group"
                              >
                                {file.mimeType?.startsWith("image/") && file.name ? (
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/5">
                                    <Image
                                      src={getImageUploadUrl(file.name, "image")}
                                      alt={file.alt_text || file.name || doc.title}
                                      fill
                                      unoptimized
                                      sizes="40px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                                    {file.mimeType?.startsWith("video/")
                                      ? <Film className="h-4 w-4 text-blue-400/70" />
                                      : <FileText className="h-4 w-4 text-slate-body/50" />
                                    }
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-medium text-offwhite">{file.name || doc.title}</p>
                                  <p className="text-[10px] text-slate-body/40 capitalize">{file.type}</p>
                                </div>
                                <a
                                  href={file.name ? getImageUploadUrl(file.name, file.type as "image" | "video" | "docs") : "#"}
                                  download={file.name}
                                  className="text-slate-body/50 hover:text-offwhite hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md"
                                  aria-label="Download"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

          </div>
        </div>

        {/* ─── Bottom Actions Bar ─── */}
        <motion.div variants={itemVariants}>
          <div className="sticky bottom-6 rounded-2xl glass-strong border border-white/[0.06] p-4 flex flex-wrap items-center justify-center gap-3 shadow-2xl shadow-black/40">
            <Button
              onClick={() => handleStatusChange("Approved")}
              disabled={report.status === "Approved" || statusChanging !== null}
              className="bg-emerald-600 hover:bg-emerald-500 text-white h-10 px-6"
            >
              {statusChanging === "Approved" ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <Check className="h-4 w-4 me-2" />
              )}
              {t("approve") || "Approve"}
            </Button>
            <Button
              onClick={() => handleStatusChange("Rejected")}
              disabled={report.status === "Rejected" || statusChanging !== null}
              className="bg-crimson hover:bg-crimson-light text-white h-10 px-6"
            >
              {statusChanging === "Rejected" ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <X className="h-4 w-4 me-2" />
              )}
              {t("reject") || "Reject"}
            </Button>
            <Button
              onClick={() => handleStatusChange("InReview")}
              disabled={report.status === "InReview" || statusChanging !== null}
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-10 px-6"
            >
              {statusChanging === "InReview" ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <Eye className="h-4 w-4 me-2" />
              )}
              {t("review") || "In Review"}
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-slate-body hover:text-offwhite hover:bg-white/10 h-10 px-6"
              asChild
            >
              <Link href={`/admin/reports/${reportId}/edit`}>
                <Edit3 className="h-4 w-4 me-2" />
                {t("edit") || "Edit"}
              </Link>
            </Button>
          </div>
        </motion.div>

      </motion.div>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm glass-strong border-white/10">
          <DialogHeader>
            <DialogTitle className="text-offwhite flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-crimson-light" />
              {t("delete") || "Delete Report"}
            </DialogTitle>
            <DialogDescription className="text-slate-body">
              {t("deleteConfirm") || "Are you sure you want to delete this report? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-white/10 text-offwhite hover:bg-white/5"
            >
              {t("cancel") || "Cancel"}
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-crimson hover:bg-crimson-light text-white"
            >
              {t("delete") || "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Lightbox ─── */}
      {lightboxIndex !== null && imageLightboxItems.length > 0 && (
        <ImageLightbox
          images={imageLightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

/* ─── Location Section Sub-component ─── */
function LocationSection({
  label,
  items,
  hrefPrefix,
  colorClass = "bg-white/5 text-slate-body border-white/10 hover:bg-white/10 hover:text-offwhite",
}: {
  label: string;
  items: LocationItem[];
  hrefPrefix: string;
  colorClass?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] uppercase tracking-wider text-slate-body/50 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Link key={item._id} href={`${hrefPrefix}/${item._id}`}>
            <Badge
              variant="outline"
              className={`${colorClass} cursor-pointer transition-colors gap-1 text-xs`}
            >
              {item.name}
              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Image Lightbox (Simplified inline version) ─── */
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

  const goNext = () => setIndex((i) => (i + 1) % images.length);
  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
      onKeyDown={handleKey}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 end-4 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute start-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute end-4 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
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
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
        />
        {images.length > 1 && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


