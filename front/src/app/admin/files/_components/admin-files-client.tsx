"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { fileSchema } from "@/types/declarations";
import { FileCard } from "./file-card";
import { FilePreviewModal } from "./file-preview-modal";
import { StorageUsageBar } from "./storage-usage-bar";
import { FilesTable } from "../files-table";
import { remove } from "@/app/actions/file/remove";
import { formatFileSize } from "./file-utils";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LayoutGrid, Table2, ArrowLeft, ArrowRight, HardDrive, FileIcon, ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

interface AdminFilesClientProps {
  files: fileSchema[];
  totalCount: number;
  error?: string | null;
  fileTypeStats?: { type: string; count: number; totalSize: number }[];
  search: string;
  prevPageUrl: string;
  nextPageUrl: string;
}

export function AdminFilesClient({
  files,
  totalCount,
  error,
  fileTypeStats,
  search,
  prevPageUrl,
  nextPageUrl,
}: AdminFilesClientProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const { toast } = useToast();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<fileSchema | null>(null);

  const totalSize = fileTypeStats?.reduce((sum, s) => sum + s.totalSize, 0) || 0;

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm(t("deleteFileConfirm") || "Are you sure you want to delete this file?")) return;
    setIsDeleting(id);
    try {
      const res = await remove(id);
      if (res?.success) {
        toast({ title: t("success"), description: t("fileDeleted") || "File deleted" });
        router.refresh();
      } else {
        throw new Error(res?.body?.message || "Failed");
      }
    } catch {
      toast({ variant: "destructive", title: t("error"), description: t("failedToDeleteFile") || "Failed to delete" });
    } finally {
      setIsDeleting(null);
    }
  }, [t, toast, router]);

  if (error) {
    return <ErrorState title={t("error") || "Error"} description={error} onRetry={() => router.refresh()} />;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="text-slate-body hover:text-offwhite transition-colors">
                <BackArrow className="h-4 w-4" />
              </Link>
              <div className="h-px w-8 bg-crimson" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                {t("adminPanel")}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
              {t("filesManagement") || "Files Management"}
            </h1>
            <p className="text-slate-body mt-1 text-sm">
              {t("filesManagementDescription") || "View and manage uploaded files"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl glass-strong p-4 border border-white/[0.06] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-crimson/10 flex items-center justify-center shrink-0">
            <HardDrive className="h-5 w-5 text-crimson" />
          </div>
          <div>
            <p className="text-2xl font-bold text-offwhite">{totalCount}</p>
            <p className="text-xs text-slate-body">{t("totalFiles") || "Total Files"}</p>
          </div>
        </div>
        <div className="rounded-xl glass-strong p-4 border border-white/[0.06] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <ImageIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-offwhite">{fileTypeStats?.find(s => s.type === "image")?.count || 0}</p>
            <p className="text-xs text-slate-body">{t("images") || "Images"}</p>
          </div>
        </div>
        <div className="rounded-xl glass-strong p-4 border border-white/[0.06] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
            <VideoIcon className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-offwhite">{fileTypeStats?.find(s => s.type === "video")?.count || 0}</p>
            <p className="text-xs text-slate-body">{t("videos") || "Videos"}</p>
          </div>
        </div>
        <div className="rounded-xl glass-strong p-4 border border-white/[0.06] flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <FileIcon className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-offwhite">{fileTypeStats?.find(s => s.type === "docs")?.count || 0}</p>
            <p className="text-xs text-slate-body">{t("documents") || "Documents"}</p>
          </div>
        </div>
      </div>

      {/* Storage bar */}
      {totalSize > 0 && (
        <StorageUsageBar
          totalBytes={totalSize}
          breakdown={(fileTypeStats || []).map(s => ({ type: s.type, bytes: s.totalSize }))}
        />
      )}

      {/* View Toggle + Result Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-body">
          {files.length > 0 ? (
            <>
              <span className="text-offwhite font-medium">{files.length}</span>
              {" "}{t("itemsShown") || "items shown"}
              {totalCount > files.length && (
                <span className="text-slate-body/60">
                  {" "}({t("total")}: {totalCount})
                </span>
              )}
            </>
          ) : (
            t("noResults") || "No results"
          )}
        </p>
        <div className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 p-0.5">
          <Button
            variant="ghost" size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-crimson text-white hover:bg-crimson-light" : "text-slate-body hover:text-offwhite hover:bg-white/5"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => setViewMode("table")}
            className={`h-8 w-8 p-0 ${viewMode === "table" ? "bg-crimson text-white hover:bg-crimson-light" : "text-slate-body hover:text-offwhite hover:bg-white/5"}`}
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {files.length === 0 ? (
        <div className="rounded-2xl glass-light border border-white/[0.06] p-12">
          <EmptyState
            title={t("noFilesFound") || "No files found"}
            description={t("noFilesDescription") || "Try adjusting your search or filters."}
          />
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file, i) => (
            <FileCard
              key={file._id}
              file={file}
              onPreview={setPreviewFile}
              onDelete={handleDelete}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl glass-light border border-white/[0.06] overflow-hidden">
          <FilesTable
            files={files}
            onDelete={handleDelete}
            onPreview={setPreviewFile}
          />
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 py-2">
        {prevPageUrl ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link href={prevPageUrl}>{t("previous") || "Previous"}</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {nextPageUrl ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link href={nextPageUrl}>{t("next") || "Next"}</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("next") || "Next"}
          </Button>
        )}
      </div>

      {/* Preview modal */}
      <FilePreviewModal
        file={previewFile}
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onDelete={handleDelete}
      />
    </motion.div>
  );
}
