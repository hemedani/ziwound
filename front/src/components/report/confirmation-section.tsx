"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, FileIcon, ImageIcon, Film } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import type { confirmationSchema } from "@/types/declarations";
import { AddConfirmationDialog } from "@/app/[locale]/(dashboard)/reports/[id]/add-confirmation-dialog";

interface ConfirmationSectionProps {
  confirmations: confirmationSchema[];
  reportId: string;
  onAdded: () => void;
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return <FileIcon className="h-4 w-4 text-slate-body/50" />;
  if (mimeType.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-emerald-400/70" />;
  if (mimeType.startsWith("video/")) return <Film className="h-4 w-4 text-blue-400/70" />;
  return <FileIcon className="h-4 w-4 text-slate-body/50" />;
}

export function ConfirmationSection({
  confirmations,
  reportId,
  onAdded,
}: ConfirmationSectionProps) {
  const t = useTranslations("report");
  const tCommon = useTranslations("common");
  const tConf = useTranslations("confirmation");

  return (
    <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-white/5 rounded-lg p-1.5">
            <MessageSquare className="h-4 w-4 text-gold" />
          </div>
          <h2 className="text-lg font-semibold text-offwhite">
            {tCommon("confirmations") || "Confirmations"}
          </h2>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20 text-xs">
            {confirmations.length}
          </Badge>
        </div>
        <AddConfirmationDialog reportId={reportId} onAdded={onAdded} />
      </div>

      {confirmations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-body/20 mb-4" />
          <p className="text-slate-body/50 text-sm">
            {tCommon("noConfirmations") || "No confirmations yet. Be the first to add one."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {confirmations.map((conf) => {
            const author = conf.author as { first_name?: string; last_name?: string; level?: string } | undefined;
            return (
              <div
                key={conf._id}
                className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-5 hover:border-white/[0.08] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-offwhite text-sm">{conf.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-white/5 text-slate-body/70 border-white/10">
                        {tConf(`types.${conf.type}`) || conf.type}
                      </span>
                      {conf.badge && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-gold/10 text-gold border-gold/20">
                          {conf.badge}
                        </span>
                      )}
                      {conf.isVerified && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {t("verified") || "Verified"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-body/40 whitespace-nowrap">
                    {conf.createdAt ? new Date(conf.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>

                {/* Author */}
                {author && (
                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-body/50">
                    <User className="h-3 w-3" />
                    <span>
                      {author.first_name} {author.last_name}
                    </span>
                    {author.level && (
                      <span className="text-slate-body/30">· {author.level}</span>
                    )}
                  </div>
                )}

                {/* Content */}
                {conf.content && (
                  <div
                    className="prose prose-invert prose-sm max-w-none text-slate-body/70 mt-3 pt-3 border-t border-white/[0.04]"
                    dangerouslySetInnerHTML={{ __html: conf.content }}
                  />
                )}

                {/* Supporting files */}
                {conf.supportingFiles && conf.supportingFiles.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.04]">
                    <p className="text-[10px] uppercase tracking-wider text-slate-body/40 mb-2">
                      {t("attachments") || "Attachments"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {conf.supportingFiles.map((file: { _id?: string; name: string; mimeType?: string; type: string }) => (
                        <Button
                          key={file._id}
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-white/10 bg-white/5 text-slate-body/70 hover:bg-white/10 hover:text-offwhite gap-1.5 h-7 text-xs"
                        >
                          <a
                            href={file._id ? getImageUploadUrl(file.name, file.type as "image" | "video" | "docs") : "#"}
                            download={file.name}
                          >
                            {getFileIcon(file.mimeType)}
                            <span className="truncate max-w-[100px]">{file.name}</span>
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
