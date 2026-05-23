"use client";

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  FileText,
  Image as ImageIcon,
  Video,
  FileArchive,
  Calendar,
} from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface DocumentFile {
  _id?: string;
  name: string;
  mimeType: string;
  type: "image" | "video" | "docs";
}

interface LinkedReport {
  _id?: string;
  title: string;
}

interface DocumentItem {
  _id?: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt?: string;
  documentFiles?: DocumentFile[];
  report?: LinkedReport[];
}

const typeConfig: Record<string, { icon: React.ElementType; label: string; gradient: string }> = {
  image: { icon: ImageIcon, label: "Image", gradient: "from-emerald-500/20 to-emerald-500/5" },
  video: { icon: Video, label: "Video", gradient: "from-blue-500/20 to-blue-500/5" },
  docs: { icon: FileArchive, label: "Document", gradient: "from-amber-500/20 to-amber-500/5" },
};

const languageNames: Record<string, string> = {
  en: "EN", fa: "FA", ar: "AR", zh: "ZH", pt: "PT",
  es: "ES", nl: "NL", tr: "TR", ru: "RU",
};

function getDocType(doc: DocumentItem): "image" | "video" | "docs" {
  const files = doc.documentFiles || [];
  if (files.length === 0) return "docs";
  return files[0]?.type || "docs";
}

function getThumbnailUrl(doc: DocumentItem): string | null {
  const files = doc.documentFiles || [];
  const firstImage = files.find((f) => f.type === "image");
  if (firstImage) return getImageUploadUrl(firstImage.name, "image");
  return null;
}

export function DocumentAdminCard({
  doc,
  onSelect,
  isSelected,
}: {
  doc: DocumentItem;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}) {
  const type = getDocType(doc);
  const cfg = typeConfig[type] || typeConfig.docs;
  const thumbUrl = getThumbnailUrl(doc);
  const fileCount = (doc.documentFiles || []).length;
  const langCode = doc.selected_language || "";
  const langLabel = languageNames[langCode] || langCode.toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
        isSelected
          ? "border-crimson/50 shadow-[0_0_20px_rgba(159,18,57,0.15)]"
          : "border-white/[0.06] hover:border-crimson/30 hover:shadow-[0_0_25px_rgba(159,18,57,0.1)]"
      }`}
    >
      {onSelect && (
        <div className="absolute top-3 start-3 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => doc._id && onSelect(doc._id)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-crimson focus:ring-crimson"
          />
        </div>
      )}

      <Link href={`/admin/documents/${doc._id}`} className="block">
        <div className="relative h-44 bg-white/[0.02] overflow-hidden">
          {thumbUrl ? (
            <>
              <Image
                src={thumbUrl}
                alt={doc.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl bg-white/[0.03] p-4 backdrop-blur-sm">
                  <cfg.icon className="h-10 w-10 text-white/30" />
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-3 end-3 z-10 flex gap-1.5">
            <span className="rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white border border-white/10">
              {cfg.label}
            </span>
            {langLabel && (
              <span className="rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white border border-white/10">
                {langLabel}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 start-3 z-10 flex items-center gap-1.5">
            <span className="rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-[10px] text-white/70 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {fileCount}
            </span>
          </div>
        </div>

        <div className="p-3.5 space-y-2">
          <h3 className="text-sm font-semibold text-offwhite leading-snug line-clamp-2 group-hover:text-crimson-light transition-colors">
            {doc.title}
          </h3>

          {doc.description && (
            <p className="text-[11px] text-slate-body/70 leading-relaxed line-clamp-2">
              {doc.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-slate-body/50" />
              <span className="text-[10px] text-slate-body/60">
                {doc.createdAt
                  ? new Date(doc.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>

            {doc.report && doc.report.length > 0 && (
              <span className="text-[10px] text-crimson-light/70 truncate max-w-[120px]">
                {doc.report[0].title}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
