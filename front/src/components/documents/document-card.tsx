"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Download,
  Calendar,
  Globe,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface DocumentFile {
  _id: string;
  name: string;
  mimeType?: string;
  type?: "image" | "video" | "docs";
}

interface LinkedReport {
  _id: string;
  title: string;
  slug?: string;
}

interface DocumentCardItem {
  _id: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt: string;
  documentFiles?: DocumentFile[];
  report?: LinkedReport[];
  slug?: string;
}

interface DocumentCardProps {
  document: DocumentCardItem;
  locale: string;
  index?: number;
}

function getFirstPreviewImage(files?: DocumentFile[]): string | null {
  if (!files) return null;
  for (const file of files) {
    if (file.mimeType?.startsWith("image/") && file.name) {
      return getImageUploadUrl(file.name, file.type || "image");
    }
  }
  return null;
}

function getFileIcon(file: DocumentFile) {
  const mime = file.mimeType || "";
  if (mime.startsWith("image/")) return FileImage;
  if (mime.startsWith("video/")) return FileVideo;
  if (mime.startsWith("audio/")) return FileAudio;
  if (mime.includes("pdf")) return FileText;
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar")) return FileArchive;
  return FileText;
}

function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}

function formatDate(dateStr: string, locale: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getTotalFileSize(files?: DocumentFile[]): string {
  if (!files || files.length === 0) return "";
  const sizeMap: Record<string, string> = {
    image: "Image",
    video: "Video",
    docs: "Document",
  };
  const types = new Set(files.map((f) => sizeMap[f.type || "docs"]));
  return [...types].join(", ");
}

export function DocumentCard({ document: doc, locale, index = 0 }: DocumentCardProps) {
  const t = useTranslations("documents");
  const tc = useTranslations("common");
  const previewImage = getFirstPreviewImage(doc.documentFiles);
  const hasMultipleTypes =
    doc.documentFiles &&
    new Set(doc.documentFiles.map((f) => f.type)).size > 1;

  const fileTypeDisplay = doc.documentFiles?.[0]
    ? getFileExtension(doc.documentFiles[0].name)
    : "DOC";

  const isFirstFileImage = doc.documentFiles?.[0]?.mimeType?.startsWith("image/") ||
    doc.documentFiles?.[0]?.type === "image";

  const languageNames: Record<string, string> = {
    fa: "فارسی",
    en: "English",
    ar: "العربية",
    zh: "中文",
    pt: "Português",
    es: "Español",
    nl: "Nederlands",
    tr: "Türkçe",
    ru: "Русский",
  };

  const filesCountText = doc.documentFiles
    ? t(doc.documentFiles.length === 1 ? "file" : "filesCount", {
      count: doc.documentFiles.length,
    })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link
        href={`/${locale}/documents/${doc._id}`}
        className="glass-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-crimson/5 h-full">
        {/* Thumbnail / Preview Area */}
        <div className="relative h-48 w-full overflow-hidden">
          {previewImage ? (
            <>
              <Image
                src={previewImage}
                alt={doc.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-crimson/[0.04] via-white/[0.01] to-background">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    {doc.documentFiles?.[0]?.mimeType?.startsWith("image/") ? (
                      <ImageIcon className="h-6 w-6 text-white/[0.12]" />
                    ) : doc.documentFiles?.[0]?.mimeType?.startsWith("video/") ? (
                      <FileVideo className="h-6 w-6 text-white/[0.12]" />
                    ) : (
                      <FileText className="h-6 w-6 text-white/[0.12]" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-white/[0.08] px-2 py-0.5 rounded-full border border-white/[0.06]">
                    {fileTypeDisplay}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* File type badge */}
          {doc.documentFiles && doc.documentFiles.length > 0 && (
            <div className="absolute top-3 start-3 flex gap-1.5">
              {isFirstFileImage ? (
                <Badge className="bg-crimson/20 text-crimson-light border-crimson/30 backdrop-blur-md text-[10px] px-2 py-0.5">
                  <ImageIcon className="h-3 w-3 me-1" />
                  {doc.documentFiles.length > 1
                    ? t("filesCount", { count: doc.documentFiles.length })
                    : t("imageLabel")}
                </Badge>
              ) : (
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25 backdrop-blur-md text-[10px] px-2 py-0.5">
                  {doc.documentFiles.length > 1
                    ? t("filesCount", { count: doc.documentFiles.length })
                    : fileTypeDisplay}
                </Badge>
              )}
            </div>
          )}

          {/* Language badge */}
          {doc.selected_language && (
            <div className="absolute top-3 end-3">
              <Badge className="bg-white/10 text-slate-body border-white/[0.08] backdrop-blur-md text-[10px] px-2 py-0.5">
                <Globe className="h-3 w-3 me-1" />
                {languageNames[doc.selected_language] || doc.selected_language}
              </Badge>
            </div>
          )}

          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-lg font-bold text-offwhite leading-tight line-clamp-2 group-hover:text-gold transition-colors duration-300">
              {doc.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Description */}
          {doc.description && (
            <p className="text-sm text-slate-body/70 line-clamp-2 leading-relaxed mb-3">
              {doc.description}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-body/50 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(doc.createdAt, locale)}
            </span>
            {doc.documentFiles && doc.documentFiles.length > 0 && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {filesCountText}
              </span>
            )}
            {doc.documentFiles && doc.documentFiles.length > 1 && hasMultipleTypes && (
              <span className="text-[10px] text-slate-body/30">
                ({getTotalFileSize(doc.documentFiles)})
              </span>
            )}
          </div>

          {/* Linked reports */}
          {doc.report && doc.report.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {doc.report.slice(0, 2).map((r) => (
                  <Link key={r._id} href={`/${locale}/reports/${r._id}`}>
                    <Badge className="bg-white/5 text-xs text-slate-body border-white/10 hover:bg-white/10 hover:text-offwhite transition-colors cursor-pointer">
                      <Link2Icon className="h-3 w-3 me-1" />
                      {r.title.length > 30
                        ? r.title.substring(0, 30) + "..."
                        : r.title}
                    </Badge>
                  </Link>
                ))}
                {doc.report.length > 2 && (
                  <Badge className="bg-white/5 text-xs text-slate-body/50 border-white/10">
                    +{doc.report.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Files list + Download */}
          <div className="mt-auto">
            {doc.documentFiles && doc.documentFiles.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {doc.documentFiles.slice(0, 2).map((file) => {
                  const FileIcon = getFileIcon(file);
                  return (
                    <div
                      key={file._id}
                      className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2 group/file hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileIcon className="h-4 w-4 shrink-0 text-slate-body/40" />
                        <span className="text-xs text-slate-body/60 truncate">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const a = document.createElement("a");
                          a.href = getImageUploadUrl(
                            file.name,
                            file.type || ("docs" as "image" | "video" | "docs")
                          );
                          a.download = file.name;
                          a.click();
                        }}
                        className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md text-slate-body/30 hover:text-crimson-light hover:bg-crimson/10 transition-colors"
                        aria-label={tc("download")}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
                {doc.documentFiles.length > 2 && (
                  <p className="text-[11px] text-center text-slate-body/30">
                    {t("moreFiles", { count: doc.documentFiles.length - 2 })}
                  </p>
                )}
              </div>
            )}

            {/* View details CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-1 text-sm font-medium text-crimson opacity-0 transition-all duration-300 group-hover:opacity-100">
                <span className="text-xs">{t("viewDetails") || "View Details"}</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Link2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
