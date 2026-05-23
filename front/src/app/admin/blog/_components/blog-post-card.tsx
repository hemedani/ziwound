"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BookOpen, Calendar, User, CheckCircle, FileEdit, Star, Eye, ImageUp } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface BlogPostAuthor {
  _id?: string;
  first_name?: string;
  last_name?: string;
}

interface BlogPostTag {
  _id?: string;
  name: string;
  color?: string;
}

interface BlogPostCoverImage {
  _id?: string;
  name?: string;
  alt_text?: string;
}

export interface BlogPostItem {
  _id?: string;
  title: string;
  slug: string;
  content?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  selected_language?: string;
  author?: BlogPostAuthor;
  tags?: BlogPostTag[];
  coverImage?: BlogPostCoverImage;
}

const languageNames: Record<string, string> = {
  en: "EN", fa: "FA", ar: "AR", zh: "ZH", pt: "PT",
  es: "ES", nl: "NL", tr: "TR", ru: "RU",
};

export function BlogPostCard({
  post,
  onSelect,
  isSelected,
}: {
  post: BlogPostItem;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}) {
  const t = useTranslations("admin");
  const langCode = post.selected_language || "";
  const langLabel = languageNames[langCode] || langCode.toUpperCase();
  const thumbUrl = post.coverImage?.name ? getImageUploadUrl(post.coverImage.name, "image") : null;
  const authorName = post.author
    ? [post.author.first_name, post.author.last_name].filter(Boolean).join(" ") || "Admin"
    : "Admin";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
        isSelected
          ? "border-crimson/50 shadow-[0_0_20px_rgba(159,18,57,0.15)]"
          : "border-white/[0.06] hover:border-crimson/30 hover:shadow-[0_0_25px_rgba(159,18,57,0.1)]"
      }`}
    >
      {onSelect && (
        <div className="absolute top-3 start-3 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => post._id && onSelect(post._id)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-crimson focus:ring-crimson"
          />
        </div>
      )}

      <div className="cursor-pointer">
        <div className="relative h-44 bg-white/[0.02] overflow-hidden">
          {thumbUrl ? (
            <>
              <Image
                src={thumbUrl}
                alt={post.coverImage?.alt_text || post.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-crimson/10 to-transparent">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl bg-white/[0.03] p-4 backdrop-blur-sm">
                  <BookOpen className="h-10 w-10 text-white/30" />
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-3 end-3 z-10 flex gap-1.5">
            {post.isFeatured && (
              <span className="rounded-md bg-amber-500/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white border border-white/10 flex items-center gap-1">
                <Star className="h-3 w-3" />
                {t("featured") || "Featured"}
              </span>
            )}
            {langLabel && (
              <span className="rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white border border-white/10">
                {langLabel}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 start-3 z-10">
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border backdrop-blur-sm ${
                post.isPublished
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}
            >
              {post.isPublished ? (
                <CheckCircle className="h-3 w-3 me-1" />
              ) : (
                <FileEdit className="h-3 w-3 me-1" />
              )}
              {post.isPublished ? (t("published") || "Published") : (t("draft") || "Draft")}
            </span>
          </div>
        </div>

        <div className="p-3.5 space-y-2">
          <Link href={`/admin/blog/${post._id}/edit`}>
            <h3 className="text-sm font-semibold text-offwhite leading-snug line-clamp-2 group-hover:text-crimson-light transition-colors">
              {post.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-slate-body/60">
            <User className="h-3 w-3" />
            <span className="truncate">{authorName}</span>
            <span className="text-slate-body/30">·</span>
            <Calendar className="h-3 w-3" />
            <span>
              {post.publishedAt || post.createdAt
                ? new Date(post.publishedAt || post.createdAt || "").toLocaleDateString()
                : "—"}
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag._id}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-white/5 text-slate-body border-white/10"
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border bg-white/5 text-slate-body border-white/10">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="pt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/admin/blog/${post._id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] text-crimson-light/70 hover:text-crimson-light"
            >
              <Eye className="h-3 w-3" />
              {t("edit") || "Edit"}
            </Link>
            <span className="text-slate-body/30">·</span>
            <Link
              href={`/admin/blog/${post._id}/update-relations`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] text-gold/70 hover:text-gold"
            >
              <ImageUp className="h-3 w-3" />
              {t("updateRelations") || "Relations"}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
