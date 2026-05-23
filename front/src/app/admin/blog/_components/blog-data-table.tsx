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
  ImageUp,
  CheckCircle,
  FileEdit,
  Calendar,
  Star,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { BlogPostItem } from "./blog-post-card";

interface BlogDataTableProps {
  posts: BlogPostItem[];
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelect: (id: string) => void;
}

const languageNames: Record<string, string> = {
  en: "English", fa: "Persian", ar: "Arabic", zh: "Chinese",
  pt: "Portuguese", es: "Spanish", nl: "Dutch", tr: "Turkish", ru: "Russian",
};

export function BlogDataTable({
  posts,
  onDelete,
  selectedIds,
  onSelect,
}: BlogDataTableProps) {
  const t = useTranslations("admin");
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={selectedIds.length === posts.length && posts.length > 0}
                onChange={() => {
                  if (selectedIds.length === posts.length) {
                    posts.forEach((p) => p._id && onSelect(p._id));
                  } else {
                    posts.forEach((p) => !selectedIds.includes(p._id!) && onSelect(p._id!));
                  }
                }}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-crimson focus:ring-crimson"
              />
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider">
              {t("title")}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              {t("language") || "Language"}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              {t("status") || "Status"}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
              {t("author") || "Author"}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
              {t("tags") || "Tags"}
            </TableHead>
            <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
              <Calendar className="h-3 w-3 inline me-1" />
              {t("date")}
            </TableHead>
            <TableHead className="text-right text-slate-body text-xs font-semibold uppercase tracking-wider">
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
              <TableCell colSpan={8} className="text-center py-12 text-slate-body">
                {t("noPosts") || "No blog posts found"}
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => {
              const authorName = post.author
                ? [post.author.first_name, post.author.last_name].filter(Boolean).join(" ") || "Admin"
                : "Admin";
              const langCode = post.selected_language || "";
              const langLabel = languageNames[langCode] || langCode.toUpperCase();

              return (
                <TableRow
                  key={post._id}
                  className={`border-white/[0.06] hover:bg-white/[0.02] transition-colors ${
                    selectedIds.includes(post._id!) ? "bg-crimson/[0.03]" : ""
                  }`}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post._id!)}
                      onChange={() => post._id && onSelect(post._id)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-crimson focus:ring-crimson"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post._id}/edit`}
                        className="font-medium text-offwhite hover:text-crimson-light transition-colors text-sm"
                      >
                        {post.title}
                      </Link>
                      {post.isFeatured && (
                        <Star className="h-3 w-3 text-amber-400 shrink-0" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {langLabel ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-white/5 text-slate-body border-white/10">
                        <Globe className="h-3 w-3 me-1" />
                        {langLabel}
                      </span>
                    ) : (
                      <span className="text-slate-body/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                        post.isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {post.isPublished ? (
                        <CheckCircle className="h-3 w-3 me-1" />
                      ) : (
                        <FileEdit className="h-3 w-3 me-1" />
                      )}
                      {post.isPublished ? (t("published") || "Published") : (t("draft") || "Draft")}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-slate-body">
                    {authorName}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {post.tags && post.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag._id}
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-white/5 text-slate-body border-white/10"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-white/5 text-slate-body border-white/10">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-body/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-slate-body">
                    {post.publishedAt || post.createdAt
                      ? new Date(post.publishedAt || post.createdAt || "").toLocaleDateString()
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
                          <Link href={`/admin/blog/${post._id}/edit`}>
                            <Edit className="me-2 h-4 w-4" />
                            {t("edit")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Link href={`/admin/blog/${post._id}/update-relations`}>
                            <ImageUp className="me-2 h-4 w-4" />
                            {t("updateRelations") || "Update Relations"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="me-2 h-4 w-4" />
                            {t("viewDetails") || "View"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          onClick={() => onDelete(post._id!)}
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
