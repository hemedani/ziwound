"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fileSchema } from "@/types/declarations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { FileTypeIcon } from "./file-type-icon";
import { formatFileSize, getFileTypeKey } from "./file-utils";
import { Button } from "@/components/ui/button";
import { Eye, Download, Link2, Trash2 } from "lucide-react";

interface FileCardProps {
  file: fileSchema;
  onPreview: (file: fileSchema) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export function FileCard({ file, onPreview, onDelete, index = 0 }: FileCardProps) {
  const t = useTranslations("admin");
  const isImage = file.mimeType?.startsWith("image/");
  const isVideo = file.mimeType?.startsWith("video/");
  const previewUrl = getImageUploadUrl(file.name, file.type);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(previewUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group relative rounded-2xl glass-strong border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div
        className="relative h-40 w-full bg-white/[0.02] overflow-hidden cursor-pointer"
        onClick={() => onPreview(file)}
      >
        {isImage ? (
          <Image
            src={previewUrl}
            alt={file.alt_text || file.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : isVideo ? (
          <>
            <Image
              src={previewUrl}
              alt={file.alt_text || file.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="h-12 w-12 rounded-full bg-crimson/80 flex items-center justify-center">
                <svg className="h-6 w-6 text-white ms-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <FileTypeIcon mimeType={file.mimeType} size="lg" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-sm font-medium text-offwhite truncate" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-body">
          <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-medium text-slate-body border border-white/[0.06]">
            {t(getFileTypeKey(file.mimeType)) || getFileTypeKey(file.mimeType)}
          </span>
          <span>{formatFileSize(file.size)}</span>
        </div>
        {file.uploader && (
          <p className="text-xs text-slate-body/60 truncate">
            {file.uploader.first_name} {file.uploader.last_name}
          </p>
        )}
        {file.createdAt && (
          <p className="text-xs text-slate-body/50">
            {new Date(file.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 px-3 pb-3 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPreview(file)}
          className="h-7 px-2 text-xs text-slate-body hover:text-offwhite hover:bg-white/5"
        >
          <Eye className="h-3 w-3 me-1" />
          {t("preview") || "Preview"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-7 px-2 text-xs text-slate-body hover:text-offwhite hover:bg-white/5"
        >
          <a href={previewUrl} download={file.name} target="_blank" rel="noreferrer">
            <Download className="h-3 w-3 me-1" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyUrl}
          className="h-7 px-2 text-xs text-slate-body hover:text-offwhite hover:bg-white/5"
        >
          <Link2 className="h-3 w-3 me-1" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(file._id!)}
          className="h-7 px-2 text-xs text-slate-body hover:text-red-400 hover:bg-red-500/10 ms-auto"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}
