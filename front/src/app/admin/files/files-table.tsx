"use client";

import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  Download,
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
      <div className="rounded-md border p-8 text-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImageIcon className="w-4 h-4 text-blue-500" />;
    if (mimeType.startsWith("video/")) return <FileVideoIcon className="w-4 h-4 text-purple-500" />;
    if (mimeType.includes("pdf") || mimeType.includes("document"))
      return <FileTextIcon className="w-4 h-4 text-red-500" />;
    return <FileIcon className="w-4 h-4 text-gray-500" />;
  };

  const getFileTypeBadge = (mimeType: string) => {
    if (mimeType.startsWith("image/"))
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        >
          {t("image") || "Image"}
        </Badge>
      );
    if (mimeType.startsWith("video/"))
      return (
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        >
          {t("video") || "Video"}
        </Badge>
      );
    return (
      <Badge
        variant="secondary"
        className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      >
        {t("document") || "Document"}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("filename") || "Filename"}</TableHead>
            <TableHead>{t("type") || "Type"}</TableHead>
            <TableHead>{t("size") || "Size"}</TableHead>
            <TableHead>{t("uploadedBy") || "Uploaded By"}</TableHead>
            <TableHead>{t("date") || "Date"}</TableHead>
            <TableHead className="text-end">{t("actions") || "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file._id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.mimeType)}
                  <span className="truncate max-w-[200px]" title={file.name}>
                    {file.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getFileTypeBadge(file.mimeType)}</TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {formatFileSize(file.size)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>
                    {file.uploader?.first_name} {file.uploader?.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">{file.uploader?.email}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {file.createdAt ? format(new Date(file.createdAt), "yyyy/MM/dd") : "-"}
              </TableCell>
              <TableCell className="text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("actions") || "Actions"}</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => window.open(`/api/files/${file._id}`, "_blank")}
                      className="cursor-pointer"
                    >
                      <Eye className="me-2 h-4 w-4" />
                      {t("view") || "View"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
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
