"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

interface DataDocument {
  _id?: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt?: string;
  documentFiles?: DocumentFile[];
  report?: LinkedReport[];
}

const typeLabels: Record<string, string> = {
  image: "Image",
  video: "Video",
  docs: "Document",
};

const typeClasses: Record<string, string> = {
  image: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  video: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  docs: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const languageNames: Record<string, string> = {
  en: "English", fa: "Persian", ar: "Arabic", zh: "Chinese",
  pt: "Portuguese", es: "Spanish", nl: "Dutch", tr: "Turkish", ru: "Russian",
};

interface DocumentsDataTableProps {
  documents: DataDocument[];
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelect: (id: string) => void;
}

export function DocumentsDataTable({
  documents,
  onDelete,
  selectedIds,
  onSelect,
}: DocumentsDataTableProps) {
  const t = useTranslations("admin");
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={selectedIds.length === documents.length && documents.length > 0}
                onChange={() => {
                  if (selectedIds.length === documents.length) {
                    documents.forEach((d) => d._id && onSelect(d._id));
                  } else {
                    documents.forEach((d) => !selectedIds.includes(d._id!) && onSelect(d._id!));
                  }
                }}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-crimson focus:ring-crimson"
              />
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider">
              {t("title")}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              {t("type")}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
              {t("language") || "Language"}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
              {t("linkedReports") || "Linked Reports"}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
              {t("files") || "Files"}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              <Calendar className="h-3 w-3 inline me-1" />
              {t("date")}
            </TableHead>
            <TableHead className="text-right text-slate-body text-xs font-semibold uppercase tracking-wider">
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
              <TableCell colSpan={8} className="text-center py-12 text-slate-body">
                {t("noDocuments") || "No documents found"}
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => {
              const firstFile = (doc.documentFiles || [])[0];
              const type = firstFile?.type || "docs";
              const fileCount = (doc.documentFiles || []).length;
              const langCode = doc.selected_language || "";
              const langLabel = languageNames[langCode] || langCode.toUpperCase();

              return (
                <TableRow
                  key={doc._id}
                  className={`border-white/[0.06] hover:bg-white/[0.02] transition-colors ${
                    selectedIds.includes(doc._id!) ? "bg-crimson/[0.03]" : ""
                  }`}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(doc._id!)}
                      onChange={() => doc._id && onSelect(doc._id)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-crimson focus:ring-crimson"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/documents/${doc._id}`}
                      className="font-medium text-offwhite hover:text-crimson-light transition-colors text-sm"
                    >
                      {doc.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                        typeClasses[type] || typeClasses.docs
                      }`}
                    >
                      {typeLabels[type] || type}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {langLabel ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-white/5 text-slate-body border-white/10">
                        {langLabel}
                      </span>
                    ) : (
                      <span className="text-slate-body/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {doc.report && doc.report.length > 0 ? (
                      <span className="text-xs text-slate-body truncate max-w-[150px] inline-block">
                        {doc.report[0].title}
                      </span>
                    ) : (
                      <span className="text-slate-body/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-slate-body/60 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {fileCount}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-slate-body">
                    {doc.createdAt
                      ? new Date(doc.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="glass-strong border-white/10"
                      >
                        <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Link href={`/admin/documents/${doc._id}`}>
                            <Eye className="me-2 h-4 w-4" />
                            {t("viewDetails") || "View"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Link href={`/admin/documents/${doc._id}/edit`}>
                            <Edit className="me-2 h-4 w-4" />
                            {t("edit")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          onClick={() => onDelete(doc._id!)}
                          className="text-crimson-light focus:bg-white/10 focus:text-crimson-light cursor-pointer"
                        >
                          <Trash2 className="me-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
