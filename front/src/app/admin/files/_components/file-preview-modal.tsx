"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fileSchema } from "@/types/declarations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { formatFileSize } from "./file-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { update } from "@/app/actions/file/update";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  X,
  Download,
  Link2,
  Trash2,
  Save,
  FileIcon,
  Calendar,
  User,
  HardDrive,
  FileType,
} from "lucide-react";

interface FilePreviewModalProps {
  file: fileSchema | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function FilePreviewModal({ file, open, onClose, onDelete }: FilePreviewModalProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const [altText, setAltText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (file) {
      setAltText(file.alt_text || "");
    }
  }, [file]);

  if (!file) return null;

  const isImage = file.mimeType?.startsWith("image/");
  const isVideo = file.mimeType?.startsWith("video/");
  const previewUrl = getImageUploadUrl(file.name, file.type);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(previewUrl);
    toast({ title: t("copied") || "Copied" });
  };

  const handleSaveAltText = async () => {
    setIsSaving(true);
    try {
      const res = await update(
        { _id: file._id!, alt_text: altText || "" },
        { _id: 1, alt_text: 1 },
      );
      if (res?.success) {
        toast({ title: t("success"), description: t("altTextUpdated") || "Alt text updated" });
      } else {
        throw new Error(res?.body?.message || "Failed");
      }
    } catch {
      toast({ variant: "destructive", title: t("error"), description: t("failedToUpdate") || "Failed to update" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm(t("deleteFileConfirm") || "Delete this file?")) {
      onDelete(file._id!);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-strong border-white/10 text-offwhite">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-offwhite text-lg font-semibold truncate pe-8">
                  {file.name}
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-body hover:text-offwhite absolute end-4 top-4">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="text-slate-body text-sm">
                {file.mimeType}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Preview */}
              <div className="lg:col-span-3 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden flex items-center justify-center min-h-[200px] max-h-[400px]">
                {isImage ? (
                  <Image
                    src={previewUrl}
                    alt={file.alt_text || file.name}
                    width={600}
                    height={400}
                    unoptimized
                    className="object-contain w-full h-full"
                  />
                ) : isVideo ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full max-h-[400px]"
                  >
                    <source src={previewUrl} type={file.mimeType} />
                  </video>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <FileIcon className="h-16 w-16 text-slate-body/30" />
                    <p className="text-sm text-slate-body">{t("noPreview") || "No preview available"}</p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl glass-light border border-white/[0.06] p-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
                    {t("details") || "Details"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileType className="h-3.5 w-3.5 text-slate-body shrink-0" />
                      <span className="text-slate-body text-xs w-20">{t("type")}</span>
                      <span className="text-offwhite text-xs truncate">{file.mimeType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="h-3.5 w-3.5 text-slate-body shrink-0" />
                      <span className="text-slate-body text-xs w-20">{t("size")}</span>
                      <span className="text-offwhite text-xs">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3.5 w-3.5 text-slate-body shrink-0" />
                      <span className="text-slate-body text-xs w-20">{t("uploadedBy")}</span>
                      <span className="text-offwhite text-xs truncate">
                        {file.uploader?.first_name} {file.uploader?.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-slate-body shrink-0" />
                      <span className="text-slate-body text-xs w-20">{t("date")}</span>
                      <span className="text-offwhite text-xs">
                        {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alt text edit */}
                <div className="rounded-xl glass-light border border-white/[0.06] p-4 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
                    {t("altText") || "Alt Text"}
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder={t("altTextPlaceholder") || "Enter alt text..."}
                      className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson text-xs h-8"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveAltText}
                      disabled={isSaving}
                      className="bg-crimson hover:bg-crimson-light text-white h-8"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 justify-start">
                    <a href={previewUrl} download={file.name} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4 me-2" />
                      {t("download") || "Download"}
                    </a>
                  </Button>
                  <Button variant="outline" onClick={handleCopyUrl} className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 justify-start">
                    <Link2 className="h-4 w-4 me-2" />
                    {t("copyUrl") || "Copy URL"}
                  </Button>
                  <Button variant="outline" onClick={handleDelete} className="border-white/10 bg-white/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start">
                    <Trash2 className="h-4 w-4 me-2" />
                    {t("delete") || "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
