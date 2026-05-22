"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FileText,
  FileAudio,
  FileArchive,
  Download,
  ImageIcon,
  Film,
  Eye,
  FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { ImageLightbox } from "@/components/report/image-lightbox";

interface DocumentFile {
  _id?: string;
  name: string;
  mimeType?: string;
  type?: "image" | "video" | "docs";
  alt_text?: string;
  size?: number;
}

interface DocumentFilesGalleryProps {
  files: DocumentFile[];
}

function getFileIcon(mimeType?: string) {
  if (!mimeType) return <FileIcon className="h-5 w-5" />;
  if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
  if (mimeType.startsWith("video/")) return <Film className="h-5 w-5" />;
  if (mimeType.startsWith("audio/")) return <FileAudio className="h-5 w-5" />;
  if (mimeType.includes("pdf")) return <FileText className="h-5 w-5" />;
  if (mimeType.includes("zip") || mimeType.includes("rar")) return <FileArchive className="h-5 w-5" />;
  return <FileText className="h-5 w-5" />;
}

function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function DocumentFilesGallery({ files }: DocumentFilesGalleryProps) {
  const t = useTranslations("documentDetail");
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  const imageFiles = useMemo(
    () => files.filter((f) => f.mimeType?.startsWith("image/")),
    [files],
  );
  const videoFiles = useMemo(
    () => files.filter((f) => f.mimeType?.startsWith("video/")),
    [files],
  );
  const docFiles = useMemo(
    () => files.filter((f) => !f.mimeType?.startsWith("image/") && !f.mimeType?.startsWith("video/")),
    [files],
  );

  const lightboxImages = useMemo(
    () =>
      imageFiles.map((f) => ({
        src: getImageUploadUrl(f.name, "image"),
        alt: f.alt_text || f.name,
      })),
    [imageFiles],
  );

  if (files.length === 0) {
    return (
      <div className="rounded-2xl glass-light p-8 text-center border border-white/[0.06]">
        <FileText className="mx-auto mb-3 h-10 w-10 text-slate-body/30" />
        <p className="text-slate-body/60">{t("noFiles")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl glass-light p-4 md:p-6 border border-white/[0.06]">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/5 rounded-lg p-1.5">
                <ImageIcon className="h-4 w-4 text-gold" />
              </div>
              <h2 className="text-lg font-semibold text-offwhite">{t("evidenceFiles")}</h2>
              <Badge variant="outline" className="border-white/10 text-slate-body/60 text-xs ms-2">
                {files.length}
              </Badge>
            </div>
            <TabsList className="bg-white/5 border-white/10">
              <TabsTrigger
                value="all"
                className="text-xs data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
              >
                {t("allFiles")} ({files.length})
              </TabsTrigger>
              {imageFiles.length > 0 && (
                <TabsTrigger
                  value="images"
                  className="text-xs data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
                >
                  {t("images")} ({imageFiles.length})
                </TabsTrigger>
              )}
              {videoFiles.length > 0 && (
                <TabsTrigger
                  value="videos"
                  className="text-xs data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
                >
                  {t("videos")} ({videoFiles.length})
                </TabsTrigger>
              )}
              {docFiles.length > 0 && (
                <TabsTrigger
                  value="documents"
                  className="text-xs data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
                >
                  {t("documents")} ({docFiles.length})
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            {renderFilesGrid(files, imageFiles, lightboxImages, setLightbox, docFiles)}
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            {imageFiles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {imageFiles.map((file, i) => {
                  const globalIndex = files.indexOf(file);
                  return (
                    <div
                      key={file._id || i}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer bg-white/[0.02]"
                      onClick={() => setLightbox({ open: true, index: globalIndex })}
                    >
                      <Image
                        src={getImageUploadUrl(file.name, "image")}
                        alt={file.alt_text || file.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white">
                          <Eye className="h-3 w-3" />
                          {t("preview")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-body/50 text-sm text-center py-8">{t("noImages")}</p>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {videoFiles.map((file, i) => (
                <div
                  key={file._id || i}
                  className="group relative aspect-video overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <video
                    src={getImageUploadUrl(file.name, "video")}
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                  >
                    <source src={getImageUploadUrl(file.name, "video")} />
                  </video>
                  <a
                    href={getImageUploadUrl(file.name, "video")}
                    download={file.name}
                    className="absolute bottom-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 border-0"
                    >
                      <Download className="h-3.5 w-3.5 me-1" />
                      {t("downloadFile")}
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docFiles.map((file, i) => (
                <div
                  key={file._id || i}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group"
                >
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <div className={cn(
                      getFileIconProps(file.mimeType)
                    )}>
                      {getFileIcon(file.mimeType)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-offwhite truncate">{file.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-body/50">{getFileExtension(file.name)}</span>
                      {file.size && (
                        <span className="text-xs text-slate-body/50">{formatFileSize(file.size)}</span>
                      )}
                    </div>
                  </div>
                  <a
                    href={getImageUploadUrl(file.name, "docs")}
                    download={file.name}
                    className="shrink-0"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-body/50 hover:text-offwhite hover:bg-white/10"
                      aria-label={t("downloadFile")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {lightbox.open && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
        />
      )}
    </>
  );
}

function getFileIconProps(mimeType?: string) {
  if (!mimeType) return "text-slate-body/50";
  if (mimeType.startsWith("image/")) return "text-emerald-400/70";
  if (mimeType.startsWith("video/")) return "text-blue-400/70";
  if (mimeType.includes("pdf")) return "text-crimson-light/70";
  return "text-slate-body/50";
}

function renderFilesGrid(
  files: DocumentFile[],
  imageFiles: DocumentFile[],
  lightboxImages: { src: string; alt: string }[],
  setLightbox: (state: { open: boolean; index: number }) => void,
  docFiles: DocumentFile[],
) {
  if (files.length === 0) return null;

  if (imageFiles.length > 0) {
    const firstImage = imageFiles[0];
    const firstIndex = files.indexOf(firstImage);
    const remainingImages = imageFiles.slice(1, 4);
    const otherCount = files.length - 1 - remainingImages.length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div
          className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer group bg-white/[0.02]"
          onClick={() => setLightbox({ open: true, index: firstIndex })}
        >
          <Image
            src={getImageUploadUrl(firstImage.name, "image")}
            alt={firstImage.alt_text || firstImage.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 start-3">
            <Badge className="bg-crimson/20 text-crimson-light border-crimson/30 backdrop-blur-md text-xs">
              <ImageIcon className="h-3 w-3 me-1" />
              {imageFiles.length} {imageFiles.length === 1 ? "image" : "images"}
            </Badge>
          </div>
          <div className="absolute bottom-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs text-white flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </div>
          </div>
        </div>

        {remainingImages.map((file, i) => {
          const globalIndex = files.indexOf(file);
          return (
            <div
              key={file._id || `img-${i}`}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.06] cursor-pointer group bg-white/[0.02]"
              onClick={() => setLightbox({ open: true, index: globalIndex })}
            >
              <Image
                src={getImageUploadUrl(file.name, "image")}
                alt={file.alt_text || file.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {i === 2 && otherCount > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">+{otherCount}</span>
                </div>
              )}
            </div>
          );
        })}

        {imageFiles.length === 1 && docFiles.length > 0 && (
          <div className="md:col-span-2 flex items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-6">
            <div className="text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-body/30 mb-2" />
              <p className="text-sm text-slate-body/50">
                {docFiles.length} {docFiles.length === 1 ? "document" : "documents"} attached
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {files.map((file, i) => (
        <div
          key={file._id || i}
          className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group"
        >
          <div className="h-14 w-14 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            {getFileIcon(file.mimeType)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-offwhite truncate">{file.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-body/50">{getFileExtension(file.name)}</span>
              {file.size && (
                <span className="text-xs text-slate-body/50">{formatFileSize(file.size)}</span>
              )}
            </div>
          </div>
          <a
            href={getImageUploadUrl(file.name, file.type || "docs")}
            download={file.name}
            className="shrink-0"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-body/50 hover:text-offwhite hover:bg-white/10"
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      ))}
    </div>
  );
}
