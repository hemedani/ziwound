"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { heroSlideSchema } from "@/types/declarations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit3, Trash2, Eye, EyeOff, GripVertical, ImageIcon } from "lucide-react";

export interface HeroSlideItem extends heroSlideSchema {}

const languageNames: Record<string, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
  zh: "中文",
  pt: "Português",
  es: "Español",
  nl: "Nederlands",
  tr: "Türkçe",
  ru: "Русский",
};

interface HeroSlideCardProps {
  slide: HeroSlideItem;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  onDelete?: (id: string) => void;
  onToggleActive?: (slide: HeroSlideItem) => void;
}

export function HeroSlideCard({ slide, onSelect, isSelected, onDelete, onToggleActive }: HeroSlideCardProps) {
  const t = useTranslations("admin");

  const hasImage = !!slide.image?.name;
  const langLabel = slide.selected_language
    ? languageNames[slide.selected_language] || slide.selected_language
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-crimson/5"
    >
      {onSelect && (
        <div className="absolute top-2 start-2 z-20">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(slide._id!)}
            className="border-white/30 data-[state=checked]:bg-crimson data-[state=checked]:border-crimson"
          />
        </div>
      )}

      <Link href={`/admin/hero-slides/${slide._id}/edit`} className="block">
        <div className="relative h-36 md:h-44 overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={getImageUploadUrl(slide.image!.name, "image")}
                alt={slide.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: slide.gradient || "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                  mixBlendMode: "overlay",
                  opacity: 0.5,
                }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: slide.gradient || "linear-gradient(135deg, #0c0c1d, #1a1a2e)" }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute bottom-3 start-3 end-3 z-10">
            <h3 className="text-sm font-semibold text-white drop-shadow-lg truncate">
              {slide.title || "Untitled Slide"}
            </h3>
            {slide.subtitle && (
              <p className="text-[11px] text-white/70 mt-0.5 truncate drop-shadow">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="absolute top-2 end-2 z-10 flex flex-col gap-1.5 items-end">
            <div className="flex gap-1">
              {slide.isActive !== false ? (
                <Badge className="bg-emerald-500/80 text-white border-0 text-[10px] px-1.5 py-0 backdrop-blur-sm">
                  {t("active")}
                </Badge>
              ) : (
                <Badge className="bg-white/20 text-white border-0 text-[10px] px-1.5 py-0 backdrop-blur-sm">
                  {t("inactive")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-body/60">
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {t("order")} {slide.order}
            </span>
            {langLabel && (
              <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px]">
                {langLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 pt-1 border-t border-white/[0.04]">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-7 px-2 text-slate-body hover:text-offwhite hover:bg-white/5 flex-1"
          >
            <Link href={`/admin/hero-slides/${slide._id}/edit`}>
              <Edit3 className="h-3.5 w-3.5 me-1" />
              {t("edit")}
            </Link>
          </Button>

          {onToggleActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleActive(slide)}
              className={`h-7 w-7 p-0 ${
                slide.isActive !== false
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  : "text-slate-body hover:text-offwhite hover:bg-white/5"
              }`}
              title={slide.isActive !== false ? t("deactivate") || "Deactivate" : t("activate") || "Activate"}
            >
              {slide.isActive !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(slide._id!)}
              className="h-7 w-7 p-0 text-slate-body hover:text-crimson-light hover:bg-crimson/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
