"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MediaGalleryProps {
  images: { src: string; alt: string }[];
  onImageClick: (index: number) => void;
}

export function MediaGallery({ images, onImageClick }: MediaGalleryProps) {
  const t = useTranslations("common");

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div
        className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/[0.06] cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          unoptimized
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="glass-strong text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" />
            {images.length} {t("images") || "images"}
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.06] cursor-pointer group"
            onClick={() => onImageClick(i)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              unoptimized
              sizes="(max-width: 1200px) 50vw, 600px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    );
  }

  // 3+ images: masonry-style grid
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[480px]">
      {/* Featured large image */}
      <div
        className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl border border-white/[0.06] cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          unoptimized
          sizes="(max-width: 1200px) 50vw, 600px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-4 start-4">
          <div className="glass-strong text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4" />
            {images.length} {t("images") || "images"}
          </div>
        </div>
      </div>

      {/* Side images */}
      {images.slice(1, 5).map((img, i) => {
        const isLast = i === 3 && images.length > 5;
        return (
          <div
            key={i + 1}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-white/[0.06] cursor-pointer group",
              isLast ? "col-span-2" : "col-span-1",
            )}
            onClick={() => onImageClick(i + 1)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              unoptimized
              sizes="(max-width: 1200px) 25vw, 300px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {isLast && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-medium text-lg">+{images.length - 5}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
