"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { gets } from "@/app/actions/file/gets";
import { fileSchema } from "@/types/declarations";
import { Check, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  value?: string;
  onChange: (imageId: string) => void;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const t = useTranslations("admin");
  const [images, setImages] = useState<fileSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(value || "");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gets(
        {
          page,
          limit,
          type: "image",
          ...(search ? { search } : {}),
        },
        { _id: 1, name: 1, mimeType: 1 }
      );

      if (res?.success) {
        const body = res.body;
        const imageList: fileSchema[] = Array.isArray(body) ? body : body?.list || [];
        setImages(imageList);
        setHasMore(imageList.length === limit);
      }
    } catch (_error) {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    setSelectedId(value || "");
  }, [value]);

  const handleSelect = (imageId: string) => {
    setSelectedId(imageId);
    onChange(imageId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body/50" />
        <Input
          type="text"
          placeholder={t("searchImages") || "Search images..."}
          value={search}
          onChange={handleSearch}
          className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 text-slate-body">
          <p>{t("noImagesFound") || "No images found"}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
            {images.map((image) => (
              <button
                key={image._id || ""}
                type="button"
                onClick={() => handleSelect(image._id || "")}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  selectedId === image._id
                    ? "border-crimson ring-2 ring-crimson/30"
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <Image
                  src={getImageUploadUrl(image.name, "image")}
                  alt={image.name || "Uploaded image"}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 33vw, 150px"
                  className="object-cover"
                />
                {selectedId === image._id && (
                  <div className="absolute inset-0 bg-crimson/20 flex items-center justify-center">
                    <div className="bg-crimson rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-sm text-slate-body disabled:opacity-30 disabled:cursor-not-allowed hover:text-offwhite"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("previous") || "Previous"}
              </button>
              <span className="text-sm text-slate-body">
                {t("page") || "Page"} {page}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 text-sm text-slate-body hover:text-offwhite"
              >
                {t("next") || "Next"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
