"use client";

import { getImageUploadUrl } from "@/utils/imageUrl";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { fileSchema } from "@/types/declarations";
import { format } from "date-fns";
import {
  FileIcon,
  FileImageIcon,
  FileVideoIcon,
  FileTextIcon,
  Trash2,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface FilesTableProps {
  files: fileSchema[];
  error: string | null;
}

export function FilesTable({ files, error }: FilesTableProps) {
  const t = useTranslations("admin");

  if (error) {
    return (
      <div className="rounded-md border border-white/[0.06] p-8 text-center text-crimson-light">
        <p>{error}</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="rounded-md border border-white/[0.06] p-8 text-center text-slate-body">
        <p>{t("noFilesFound") || "No files found"}</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileIcon className="w-4 h-4 text-gray-500" />;
    if (mimeType.startsWith("image/")) return <FileImageIcon className="w-4 h-4 text-blue-500" />;
    if (mimeType.startsWith("video/")) return <FileVideoIcon className="w-4 h-4 text-purple-500" />;
    if (mimeType.includes("pdf") || mimeType.includes("document"))
      return <FileTextIcon className="w-4 h-4 text-red-500" />;
    return <FileIcon className="w-4 h-4 text-gray-500" />;
  };

  const getFileTypeBadge = (mimeType?: string) => {
    const baseClass = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border";
    if (!mimeType)
      return (
        <span className={`${baseClass} bg-white/5 text-slate-body border-white/10`}>
          {t("document") || "Document"}
        </span>
      );
    if (mimeType.startsWith("image/"))
      return (
        <span className={`${baseClass} bg-white/5 text-slate-body border-white/10`}>
          {t("image") || "Image"}
        </span>
      );
    if (mimeType.startsWith("video/"))
      return (
        <span className={`${baseClass} bg-white/5 text-slate-body border-white/10`}>
          {t("video") || "Video"}
        </span>
      );
    return (
      <span className={`${baseClass} bg-white/5 text-slate-body border-white/10`}>
        {t("document") || "Document"}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead className="text-slate-body">{t("filename") || "Filename"}</TableHead>
            <TableHead className="text-slate-body">{t("type") || "Type"}</TableHead>
            <TableHead className="text-slate-body">{t("size") || "Size"}</TableHead>
            <TableHead className="text-slate-body">{t("uploadedBy") || "Uploaded By"}</TableHead>
            <TableHead className="text-slate-body">{t("date") || "Date"}</TableHead>
            <TableHead className="text-end text-slate-body">{t("actions") || "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file._id} className="border-white/[0.06] hover:bg-white/[0.02]">
              <TableCell className="font-medium text-offwhite">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.mimeType)}
                  <span className="truncate max-w-[200px]" title={file.name}>
                    {file.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getFileTypeBadge(file.mimeType)}</TableCell>
              <TableCell className="text-slate-body whitespace-nowrap">
                {formatFileSize(file.size)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-offwhite">
                    {file.uploader?.first_name} {file.uploader?.last_name}
                  </span>
                  <span className="text-xs text-slate-body">{file.uploader?.email}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-slate-body">
                {file.createdAt ? format(new Date(file.createdAt), "yyyy/MM/dd") : "-"}
              </TableCell>
              <TableCell className="text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong border-white/10">
                    <DropdownMenuLabel className="text-slate-body">{t("actions") || "Actions"}</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          `${getImageUploadUrl(file.name, file.type)}`,
                          "_blank",
                        )
                      }
                      className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                    >
                      <Eye className="me-2 h-4 w-4" />
                      {t("view") || "View"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-crimson-light focus:bg-white/10 focus:text-offwhite cursor-pointer"
                      onClick={() => alert("Delete functionality not implemented yet")}
                    >
                      <Trash2 className="me-2 h-4 w-4" />
                      {t("delete") || "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
