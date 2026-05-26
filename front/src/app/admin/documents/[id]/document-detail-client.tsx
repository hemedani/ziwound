"use client";

import { useState, useTransition } from "react";
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
  FileText,
  FileImage,
  Film,
  Download,
  Globe,
  Calendar,
  Clock,
  Fingerprint,
  Hash,
  Languages,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { remove as removeDocument } from "@/app/actions/document/remove";

/* ─── Types ─── */
interface DocFile {
  _id?: string;
  name: string;
  mimeType: string;
  type: "image" | "video" | "docs";
}

interface LinkedReport {
  _id?: string;
  title: string;
  status?: string;
  priority?: string;
  selected_language?: string;
}

interface DocumentData {
  _id?: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt?: string;
  updatedAt?: string;
  documentFiles?: DocFile[];
  report?: LinkedReport[];
}

/* ─── Helpers ─── */
function formatDate(date: Date | string | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date: Date | string | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const languageNames: Record<string, string> = {
  fa: "Persian",
  en: "English",
  ar: "Arabic",
  zh: "Chinese",
  pt: "Portuguese",
  es: "Spanish",
  nl: "Dutch",
  tr: "Turkish",
  ru: "Russian",
};

/* ─── Sub-components ─── */
function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      {count !== undefined && (
        <Badge
          variant="outline"
          className="bg-white/5 text-slate-body border-white/10 text-[10px]"
        >
          {count}
        </Badge>
      )}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl glass-light border border-white/[0.06] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]">
        <Icon className="h-3.5 w-3.5 text-slate-body/60" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-slate-body/50">
          {label}
        </p>
        <div className="text-sm text-offwhite mt-0.5">{value}</div>
      </div>
    </div>
  );
}

/* ─── File Preview ─── */
function FilePreviewCard({
  file,
  idx,
}: {
  file: DocFile;
  idx: number;
}) {
  const isImage = file.mimeType?.startsWith("image/");

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:bg-white/[0.04] hover:border-white/[0.1]">
      {isImage ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={getImageUploadUrl(file.name, "image")}
            alt={file.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-white/[0.02]">
          {file.mimeType?.startsWith("video/") ? (
            <Film className="h-10 w-10 text-blue-400/50" />
          ) : (
            <FileText className="h-10 w-10 text-slate-body/40" />
          )}
        </div>
      )}
      <div className="p-3">
        <p className="truncate text-xs font-medium text-offwhite">{file.name}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-slate-body/50 capitalize">
            {file.type}
          </span>
          <a
            href={getImageUploadUrl(file.name, file.type)}
            download={file.name}
            className="rounded-md p-1 text-slate-body/50 hover:bg-white/10 hover:text-offwhite transition-all opacity-0 group-hover:opacity-100"
            aria-label="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function DocumentDetailClient({
  doc: rawDoc,
  docId,
}: {
  doc: unknown;
  docId: string;
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const { toast } = useToast();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const doc = rawDoc as DocumentData;
  const files = doc.documentFiles || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await removeDocument({ _id: docId }, { _id: 1 });
    setDeleting(false);
    setDeleteDialogOpen(false);
    if (res?.success) {
      toast({
        title: t("documents") || "Success",
        description: t("documentDeleted") || "Document deleted",
      });
      startTransition(() => router.push("/admin/documents"));
    } else {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: res?.body?.message || "Failed to delete document",
      });
    }
  };

  return (
    <motion.div
      className="space-y-6 p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ─── Breadcrumb ─── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 text-xs text-slate-body/60 mb-4">
          <Link
            href="/admin/documents"
            className="hover:text-gold transition-colors"
          >
            {t("documentsManagement") || "Documents"}
          </Link>
          <span className="text-slate-body/30">/</span>
          <span className="text-offwhite/70 truncate max-w-[300px]">
            {doc.title}
          </span>
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
                href="/admin/documents"
                className="inline-flex items-center gap-1.5 text-xs text-slate-body/60 hover:text-offwhite transition-colors"
              >
                <BackArrow className="h-3.5 w-3.5" />
                {t("backToList") || "Back to list"}
              </Link>
              <div className="flex items-center gap-2">
                {doc.selected_language && (
                  <Badge
                    variant="outline"
                    className="bg-white/5 text-slate-body border-white/10 text-xs"
                  >
                    <Globe className="h-3 w-3 me-1" />
                    {languageNames[doc.selected_language] ||
                      doc.selected_language}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="bg-white/5 text-slate-body border-white/10 text-xs"
                >
                  <FileText className="h-3 w-3 me-1" />
                  {files.length}{" "}
                  {files.length === 1
                    ? t("file") || "file"
                    : t("files") || "files"}
                </Badge>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-offwhite mb-2 leading-tight">
              {doc.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-slate-body/60 mb-5">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="h-3 w-3 text-slate-body/40" />
                <code className="font-mono text-[10px]">{doc._id}</code>
              </span>
              {doc.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-gold/60" />
                  {formatDateTime(doc.createdAt)}
                </span>
              )}
              {doc.updatedAt && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-slate-body/40" />
                  {t("updated") || "Updated"}: {formatDateTime(doc.updatedAt)}
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/admin/documents/${docId}/edit`}>
                <Button
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-offwhite border border-white/10 h-9"
                >
                  <Edit3 className="h-4 w-4 me-1.5" />
                  {t("edit") || "Edit"}
                </Button>
              </Link>
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

      {/* ─── Two Column Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── LEFT COLUMN ─── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Description */}
          {doc.description && (
            <motion.div variants={itemVariants}>
              <GlassCard>
                <SectionHeader
                  icon={FileText}
                  title={t("description") || "Description"}
                />
                <p className="text-sm text-slate-body leading-relaxed whitespace-pre-wrap">
                  {doc.description}
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* Files Gallery */}
          {files.length > 0 && (
            <motion.div variants={itemVariants}>
              <GlassCard>
                <SectionHeader
                  icon={FileImage}
                  title={t("files") || "Files"}
                  count={files.length}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file, idx) => (
                    <FilePreviewCard key={file._id || idx} file={file} idx={idx} />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Details */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <SectionHeader
                icon={Hash}
                title={t("documentDetails") || "Document Details"}
              />
              <div className="space-y-3">
                {doc._id && (
                  <InfoRow
                    icon={Fingerprint}
                    label={t("documentId") || "ID"}
                    value={
                      <code className="font-mono text-[10px] break-all">
                        {doc._id}
                      </code>
                    }
                  />
                )}
                {doc.createdAt && (
                  <InfoRow
                    icon={Calendar}
                    label={t("createdAt") || "Created"}
                    value={formatDateTime(doc.createdAt)}
                  />
                )}
                {doc.updatedAt && (
                  <InfoRow
                    icon={Clock}
                    label={t("updatedAt") || "Updated"}
                    value={formatDateTime(doc.updatedAt)}
                  />
                )}
                {doc.selected_language && (
                  <InfoRow
                    icon={Languages}
                    label={t("documentLanguage") || "Language"}
                    value={
                      languageNames[doc.selected_language] ||
                      doc.selected_language
                    }
                  />
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Linked Reports */}
          {doc.report && doc.report.length > 0 && (
            <motion.div variants={itemVariants}>
              <GlassCard>
                <SectionHeader
                  icon={ExternalLink}
                  title={t("linkedReports") || "Linked Reports"}
                  count={doc.report.length}
                />
                <div className="space-y-3">
                  {doc.report.map((report) => (
                    <Link
                      key={report._id}
                      href={`/admin/reports/${report._id}`}
                      className="block rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-offwhite group-hover:text-crimson-light transition-colors truncate">
                          {report.title}
                        </p>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-body/30 group-hover:text-crimson-light transition-colors shrink-0 mt-0.5" />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {report.status && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 bg-white/5 text-slate-body border-white/10"
                          >
                            {report.status}
                          </Badge>
                        )}
                        {report.priority && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 bg-white/5 text-slate-body border-white/10"
                          >
                            {report.priority}
                          </Badge>
                        )}
                        {report.selected_language && (
                          <span className="text-[10px] text-slate-body/50">
                            {languageNames[report.selected_language] ||
                              report.selected_language}
                          </span>
                        )}
                      </div>
                    </Link>
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
          <Link href={`/admin/documents/${docId}/edit`}>
            <Button className="bg-white/10 hover:bg-white/20 text-offwhite border border-white/10 h-10 px-6">
              <Edit3 className="h-4 w-4 me-2" />
              {t("edit") || "Edit"}
            </Button>
          </Link>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            className="bg-crimson hover:bg-crimson-light text-white h-10 px-6"
          >
            <Trash2 className="h-4 w-4 me-2" />
            {t("delete") || "Delete"}
          </Button>
        </div>
      </motion.div>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm glass-strong border-white/10">
          <DialogHeader>
            <DialogTitle className="text-offwhite flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-crimson-light" />
              {t("delete") || "Delete Document"}
            </DialogTitle>
            <DialogDescription className="text-slate-body">
              {t("deleteConfirm") ||
                "Are you sure you want to delete this document? This action cannot be undone."}
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
              disabled={deleting}
              className="bg-crimson hover:bg-crimson-light text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin me-2" />}
              {t("delete") || "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
