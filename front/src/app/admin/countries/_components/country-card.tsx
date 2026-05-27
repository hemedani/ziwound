"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { countrySchema } from "@/types/declarations";
import { Button } from "@/components/ui/button";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { MoreHorizontal, Pencil, Trash2, ImageUp, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CountryCardProps {
  country: countrySchema;
  onDelete: (id: string) => void;
  index?: number;
}

export function CountryCard({ country, onDelete, index = 0 }: CountryCardProps) {
  const t = useTranslations("admin");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative rounded-2xl glass-strong border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative h-36 w-full bg-white/[0.02] overflow-hidden">
        {country.photo ? (
          <Image
            src={getImageUploadUrl(country.photo.name, "image")}
            alt={country.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Globe className="h-10 w-10 text-slate-body/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute bottom-3 start-3 end-3">
          <h3 className="font-bold text-offwhite text-lg leading-tight truncate">{country.name}</h3>
          <p className="text-xs text-slate-body/80 truncate">{country.english_name}</p>
        </div>
      </div>

      <div className="p-4">
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-body mb-3">
          {country.provinces && Array.isArray(country.provinces) && (
            <span>{country.provinces.length} provinces</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-white/[0.06]">
          <Button variant="ghost" size="sm" asChild className="text-slate-body hover:text-offwhite hover:bg-white/5 h-8 px-2">
            <Link href={`/admin/countries/${country._id}/edit`}>
              <Pencil className="h-3.5 w-3.5 me-1" />
              {t("edit")}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-slate-body hover:text-offwhite hover:bg-white/5 h-8 px-2">
            <Link href={`/admin/countries/${country._id}/update-relations`}>
              <ImageUp className="h-3.5 w-3.5 me-1" />
              {t("photo") || "Photo"}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(country._id!)}
            className="text-slate-body hover:text-red-400 hover:bg-red-500/10 h-8 px-2 ms-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
