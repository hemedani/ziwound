"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Calendar,
  Globe,
  ImageIcon,
  Link2,
  Download,
} from "lucide-react";
import {
  GlassCard,
  GlassCardMedia,
  GlassCardBadge,
  GlassCardContent,
  GlassCardDescription,
  GlassCardTags,
  GlassCardFooter,
  GlassCardMeta,
  GlassCardCta,
} from "@/components/ui/glass-card";
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
}

interface DocumentCardItem {
  _id: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt: string;
  documentFiles?: DocumentFile[];
  report?: LinkedReport[];
}

interface DocumentCardProps {
  document: DocumentCardItem;
  locale: string;
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

export function DocumentCard({ document: doc, locale }: DocumentCardProps) {
  const t = useTranslations("documents");
  const tc = useTranslations("common");
  const previewImage = getFirstPreviewImage(doc.documentFiles);
  const fileCount = doc.documentFiles?.length || 0;
  const isFirstFileImage = doc.documentFiles?.[0]?.mimeType?.startsWith("image/");
  const hasMultipleTypes =
    doc.documentFiles &&
    new Set(doc.documentFiles.map((f) => f.type)).size > 1;

  const href = `/${locale}/documents/${doc._id}`;

  // Build tags for linked reports
  const reportArray = Array.isArray(doc.report) ? doc.report : doc.report ? [doc.report] : [];
  const reportTags = reportArray.slice(0, 2).map((r) => ({
    _id: r._id,
    name: r.title.length > 25 ? r.title.substring(0, 25) + "..." : r.title,
    icon: <Link2 className="h-2.5 w-2.5" />,
  }));

  return (
    <GlassCard href={href}>
      <GlassCardMedia
        imageUrl={previewImage}
        alt={doc.title}
        fallback="icon"
        icon={
          isFirstFileImage ? (
            <ImageIcon className="h-6 w-6" />
          ) : doc.documentFiles?.[0]?.mimeType?.startsWith("video/") ? (
            <FileVideo className="h-6 w-6" />
          ) : (
            <FileText className="h-6 w-6" />
          )
        }
        height="md"
      >
        {/* File count badge */}
        {fileCount > 0 && (
          <div className="absolute start-3 top-3">
            <GlassCardBadge variant="custom">
              <span className="flex items-center gap-1.5">
                {isFirstFileImage ? (
                  <ImageIcon className="h-3 w-3" />
                ) : (
                  <FileText className="h-3 w-3" />
                )}
                {fileCount > 1
                  ? t("filesCount", { count: fileCount })
                  : t("imageLabel")}
              </span>
            </GlassCardBadge>
          </div>
        )}

        {/* Language badge */}
        {doc.selected_language && (
          <div className="absolute end-3 top-3">
            <GlassCardBadge variant="custom">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                {languageNames[doc.selected_language] || doc.selected_language}
              </span>
            </GlassCardBadge>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-bold text-offwhite leading-tight line-clamp-2 group-hover:text-gold transition-colors duration-300">
            {doc.title}
          </h3>
        </div>
      </GlassCardMedia>

      <GlassCardContent className="p-5">
        {/* Description */}
        {doc.description && (
          <GlassCardDescription text={doc.description} lines={2} className="mb-3" />
        )}

        {/* Linked reports tags */}
        {reportTags.length > 0 && (
          <GlassCardTags tags={reportTags} max={2} />
        )}

        {/* Files list with download buttons */}
        {doc.documentFiles && doc.documentFiles.length > 0 && (
          <div className="space-y-1.5 mt-4">
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
                      e.preventDefault();
                      e.stopPropagation();
                      const a = document.createElement("a");
                      a.href = getImageUploadUrl(
                        file.name,
                        file.type || "docs"
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

      </GlassCardContent>

      {/* Footer */}
      <GlassCardFooter className="px-5">
        <div className="flex items-center gap-3 text-xs text-slate-body/50">
          <GlassCardMeta icon={<Calendar className="h-3 w-3" />}>
            {formatDate(doc.createdAt, locale)}
          </GlassCardMeta>
          {fileCount > 0 && (
            <GlassCardMeta icon={<FileText className="h-3 w-3" />}>
              {t(fileCount === 1 ? "file" : "filesCount", { count: fileCount })}
            </GlassCardMeta>
          )}
          {doc.documentFiles && doc.documentFiles.length > 1 && hasMultipleTypes && (
            <span className="text-[10px] text-slate-body/30">
              ({(() => {
                const sizeMap: Record<string, string> = {
                  image: "Image",
                  video: "Video",
                  docs: "Document",
                };
                const types = new Set(doc.documentFiles.map((f) => sizeMap[f.type || "docs"]));
                return [...types].join(", ");
              })()})
            </span>
          )}
        </div>
        <GlassCardCta text={t("viewDetails") || "View Details"} />
      </GlassCardFooter>
    </GlassCard>
  );
}
