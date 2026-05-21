"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip, FileText, Download, FileIcon, ImageIcon, Film } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import type { documentSchema } from "@/types/declarations";

interface DocumentsSectionProps {
  documents: documentSchema[];
  translations: {
    documents: string;
    document: string;
  };
  languageNames: Record<string, string>;
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return <FileIcon className="h-5 w-5 text-slate-body/50" />;
  if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-emerald-400/70" />;
  if (mimeType.startsWith("video/")) return <Film className="h-5 w-5 text-blue-400/70" />;
  return <FileIcon className="h-5 w-5 text-slate-body/50" />;
}

export function DocumentsSection({
  documents,
  translations,
  languageNames,
}: DocumentsSectionProps) {
  const tCommon = useTranslations("common");

  if (!documents || documents.length === 0) return null;

  const totalFiles = documents.reduce(
    (acc, doc) => acc + (doc.documentFiles?.length || 0),
    0,
  );

  return (
    <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-white/5 rounded-lg p-1.5">
          <Paperclip className="h-4 w-4 text-gold" />
        </div>
        <h2 className="text-lg font-semibold text-offwhite">
          {translations.documents} ({totalFiles})
        </h2>
      </div>

      <div className="space-y-5">
        {documents.map((doc, docIndex) => (
          <div
            key={doc._id || docIndex}
            className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden hover:border-white/[0.08] transition-colors"
          >
            {/* Document header */}
            <div className="p-4 border-b border-white/[0.04]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-offwhite text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gold/70" />
                    {doc.title || translations.document}
                  </h3>
                  {doc.description && (
                    <p className="text-sm text-slate-body/60 mt-1">{doc.description}</p>
                  )}
                </div>
                {doc.selected_language && (
                  <Badge
                    variant="outline"
                    className="bg-white/5 text-slate-body/60 border-white/10 shrink-0 text-xs"
                  >
                    {languageNames[doc.selected_language] || doc.selected_language}
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
                      {file.mimeType?.startsWith("image/") && file._id ? (
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
                        <p className="text-xs text-slate-body/40 capitalize">
                          {file.type || tCommon("unknown")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-slate-body/50 hover:text-offwhite hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        aria-label={tCommon("download")}
                      >
                        <a
                          href={file._id ? getImageUploadUrl(file.name, file.type) : "#"}
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
  );
}
