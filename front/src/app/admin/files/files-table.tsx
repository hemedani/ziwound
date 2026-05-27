"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { fileSchema } from "@/types/declarations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { FileTypeIcon } from "./_components/file-type-icon";
import { formatFileSize } from "./_components/file-utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye, Download, Link2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilesTableProps {
  files: fileSchema[];
  onDelete: (id: string) => void;
  onPreview: (file: fileSchema) => void;
}

const badgeConfig: Record<string, { cls: string; key: string }> = {
  image: { cls: "bg-blue-500/10 text-blue-400 border-blue-500/20", key: "image" },
  video: { cls: "bg-purple-500/10 text-purple-400 border-purple-500/20", key: "video" },
  pdf:   { cls: "bg-red-500/10 text-red-400 border-red-500/20", key: "pdf" },
  doc:   { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", key: "document" },
  file:  { cls: "bg-white/5 text-slate-body border-white/10", key: "file" },
};

function getBadge(mimeType?: string) {
  if (!mimeType) return badgeConfig.file;
  if (mimeType.startsWith("image/")) return badgeConfig.image;
  if (mimeType.startsWith("video/")) return badgeConfig.video;
  if (mimeType.includes("pdf")) return badgeConfig.pdf;
  if (mimeType.includes("document") || mimeType.includes("sheet") || mimeType.includes("presentation"))
    return badgeConfig.doc;
  return badgeConfig.file;
}

export function FilesTable({ files, onDelete, onPreview }: FilesTableProps) {
  const t = useTranslations("admin");

  if (files.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center text-slate-body">
        {t("noFilesFound") || "No files found"}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/[0.06] hover:bg-transparent">
          <TableHead className="text-slate-body w-10" />
          <TableHead className="text-slate-body">{t("filename") || "Filename"}</TableHead>
          <TableHead className="text-slate-body hidden md:table-cell">{t("type") || "Type"}</TableHead>
          <TableHead className="text-slate-body">{t("size") || "Size"}</TableHead>
          <TableHead className="text-slate-body hidden lg:table-cell">{t("uploadedBy") || "Uploaded By"}</TableHead>
          <TableHead className="text-slate-body hidden md:table-cell">{t("date") || "Date"}</TableHead>
          <TableHead className="text-end pe-4 text-slate-body">{t("actions") || "Actions"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => {
          const badge = getBadge(file.mimeType);
          const previewUrl = getImageUploadUrl(file.name, file.type);
          const isImage = file.mimeType?.startsWith("image/");

          const handleCopyUrl = () => {
            navigator.clipboard.writeText(previewUrl);
          };

          return (
            <TableRow key={file._id} className="border-white/[0.06] hover:bg-white/[0.02]">
              <TableCell>
                <button onClick={() => onPreview(file)} className="block">
                  {isImage ? (
                    <Image
                      src={previewUrl}
                      alt={file.name}
                      width={40}
                      height={40}
                      unoptimized
                      className="rounded object-cover h-10 w-10"
                    />
                  ) : (
                    <FileTypeIcon mimeType={file.mimeType} size="sm" />
                  )}
                </button>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onPreview(file)}
                  className="font-medium text-offwhite truncate max-w-[200px] block text-start hover:text-crimson-light transition-colors"
                  title={file.name}
                >
                  {file.name}
                </button>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${badge.cls}`}>
                  {t(badge.key) || badge.key}
                </span>
              </TableCell>
              <TableCell className="text-slate-body whitespace-nowrap text-sm">
                {formatFileSize(file.size)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-slate-body text-sm">
                {file.uploader ? `${file.uploader.first_name} ${file.uploader.last_name}` : "-"}
              </TableCell>
              <TableCell className="hidden md:table-cell text-slate-body text-sm whitespace-nowrap">
                {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className="text-end pe-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong border-white/10">
                    <DropdownMenuLabel className="text-slate-body">{t("actions") || "Actions"}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onPreview(file)} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                      <Eye className="me-2 h-4 w-4" />
                      {t("preview") || "Preview"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                      <a href={previewUrl} download={file.name} target="_blank" rel="noreferrer">
                        <Download className="me-2 h-4 w-4" />
                        {t("download") || "Download"}
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyUrl} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                      <Link2 className="me-2 h-4 w-4" />
                      {t("copyUrl") || "Copy URL"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => onDelete(file._id!)} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                      <Trash2 className="me-2 h-4 w-4" />
                      {t("delete") || "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
