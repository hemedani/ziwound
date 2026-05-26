"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { motion } from "framer-motion";

interface LiveSlidePreviewProps {
  title: string;
  subtitle: string;
  gradient: string;
  imageName?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  isActive: boolean;
}

export function LiveSlidePreview({
  title,
  subtitle,
  gradient,
  imageName,
  ctaText,
  ctaLink,
  secondaryCtaText,
  isActive,
}: LiveSlidePreviewProps) {
  const t = useTranslations("admin");

  const hasGradient = gradient?.trim().length > 0;
  const hasImage = !!imageName;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-2 w-2 rounded-full bg-gold" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
          {t("livePreview") || "Live Preview"}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] h-52 md:h-64 group">
        {hasImage && (
          <Image
            src={getImageUploadUrl(imageName, "image")}
            alt={title || "Slide background"}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-10000 group-hover:scale-105"
          />
        )}

        {hasGradient && !hasImage && (
          <div
            className="absolute inset-0"
            style={{ background: gradient }}
          />
        )}

        {hasImage && (
          <div
            className="absolute inset-0"
            style={{
              background: gradient || "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
              mixBlendMode: "overlay",
              opacity: 0.6,
            }}
          />
        )}

        {!hasImage && !hasGradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm text-white/80 max-w-md drop-shadow-md line-clamp-2"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-3 mt-4"
          >
            {ctaText && (
              <span className="inline-flex items-center rounded-lg bg-crimson px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-crimson/30">
                {ctaText}
              </span>
            )}
            {secondaryCtaText && (
              <span className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                {secondaryCtaText}
              </span>
            )}
          </motion.div>
        </div>

        {!isActive && (
          <div className="absolute top-2 end-2 rounded-full bg-amber-500/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {t("inactive") || "Inactive"}
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-body/50 text-center">
        {t("previewHint") || "This is a preview of how the slide will appear on the landing page"}
      </p>
    </div>
  );
}
