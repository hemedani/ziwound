"use client";

import Link from "next/link";
import { ArrowLeft, Download, Printer, Share2, FileText, Globe, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FileInfo {
  _id?: string;
  name: string;
  mimeType?: string;
  type?: "image" | "video" | "docs";
}

interface DocumentDetailHeroProps {
  locale: string;
  title: string;
  description?: string;
  selectedLanguage?: string;
  createdAt?: string;
  documentFiles?: FileInfo[];
  translations: {
    backToDocuments: string;
    documentArchive: string;
    downloadAll: string;
    print: string;
    share: string;
    files: string;
    file: string;
  };
  languageNames: Record<string, string>;
}

function formatDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function getDominantFileType(files?: FileInfo[]): string {
  if (!files || files.length === 0) return "document";
  const images = files.filter((f) => f.mimeType?.startsWith("image/")).length;
  const videos = files.filter((f) => f.mimeType?.startsWith("video/")).length;
  if (images > videos && images > 0) return "image";
  if (videos > 0) return "video";
  return "document";
}

export function DocumentDetailHero({
  locale,
  title,
  description,
  selectedLanguage,
  createdAt,
  documentFiles,
  translations,
  languageNames,
}: DocumentDetailHeroProps) {
  const fileCount = documentFiles?.length || 0;
  const dominantType = getDominantFileType(documentFiles);

  const typeColors: Record<string, string> = {
    image: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    video: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    document: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.10)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative px-4 md:px-8 pt-32 pb-12">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-slate-body/70 hover:text-offwhite hover:bg-white/5 -ms-2 transition-colors"
        >
          <Link href={`/${locale}/documents`}>
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {translations.backToDocuments}
          </Link>
        </Button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-crimson to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {translations.documentArchive}
          </span>
          <FileText className="h-3.5 w-3.5 text-gold/60" />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-offwhite mb-4 leading-[1.1] tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-lg md:text-xl text-slate-body max-w-3xl leading-relaxed mb-6">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-8">
          {selectedLanguage && (
            <Badge className="px-3 py-1.5 text-sm bg-white/5 text-slate-body border-white/10">
              <Globe className="h-3.5 w-3.5 me-1.5" />
              {languageNames[selectedLanguage] || selectedLanguage}
            </Badge>
          )}
          {createdAt && (
            <Badge className="px-3 py-1.5 text-sm bg-white/5 text-slate-body border-white/10">
              <Calendar className="h-3.5 w-3.5 me-1.5" />
              {formatDate(createdAt, locale)}
            </Badge>
          )}
          {fileCount > 0 && (
            <Badge className={`px-3 py-1.5 text-sm ${typeColors[dominantType]}`}>
              <FileText className="h-3.5 w-3.5 me-1.5" />
              {fileCount} {fileCount === 1 ? translations.file : translations.files}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            className="bg-crimson hover:bg-crimson-light text-white"
            onClick={() => {
              const links = documentFiles?.map((f) =>
                `/api/image-proxy?path=uploads/${f.type === "image" ? "images" : f.type === "video" ? "videos" : "docs"}/${encodeURIComponent(f.name)}`
              );
              links?.forEach((url) => {
                const a = document.createElement("a");
                a.href = url;
                a.download = "";
                a.click();
              });
            }}
          >
            <Download className="h-4 w-4 me-2" />
            {translations.downloadAll}
          </Button>
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-offwhite hover:bg-white/[0.08] hover:text-offwhite"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 me-2" />
            {translations.print}
          </Button>
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-offwhite hover:bg-white/[0.08] hover:text-offwhite"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Share2 className="h-4 w-4 me-2" />
            {translations.share}
          </Button>
        </div>
      </div>
    </div>
  );
}
