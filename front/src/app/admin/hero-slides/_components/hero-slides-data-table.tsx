"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { heroSlideSchema } from "@/types/declarations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit3, Trash2, MoreHorizontal, Eye, EyeOff, ImageIcon } from "lucide-react";

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

interface HeroSlidesDataTableProps {
  slides: HeroSlideItem[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (slide: HeroSlideItem) => void;
}

export function HeroSlidesDataTable({
  slides,
  selectedIds,
  onSelect,
  onDelete,
  onToggleActive,
}: HeroSlidesDataTableProps) {
  const t = useTranslations("admin");

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead className="w-10">
              <span className="sr-only">{t("select")}</span>
            </TableHead>
            <TableHead className="text-slate-body w-16">{t("order")}</TableHead>
            <TableHead className="text-slate-body w-24">{t("preview") || "Preview"}</TableHead>
            <TableHead className="text-slate-body">{t("title")}</TableHead>
            <TableHead className="text-slate-body hidden md:table-cell">{t("subtitle")}</TableHead>
            <TableHead className="text-slate-body">{t("language")}</TableHead>
            <TableHead className="text-slate-body">{t("status")}</TableHead>
            <TableHead className="text-end pe-4 text-slate-body w-16">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.length === 0 ? (
            <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
              <TableCell colSpan={8} className="h-24 text-center text-slate-body">
                {t("noSlides") || "No hero slides found"}
              </TableCell>
            </TableRow>
          ) : (
            slides.map((slide) => {
              const langLabel = slide.selected_language
                ? languageNames[slide.selected_language] || slide.selected_language
                : null;
              const hasImage = !!slide.image?.name;

              return (
                <TableRow
                  key={slide._id}
                  className="border-white/[0.06] hover:bg-white/[0.02]"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(slide._id!)}
                      onCheckedChange={() => onSelect(slide._id!)}
                      className="border-white/20 data-[state=checked]:bg-crimson data-[state=checked]:border-crimson"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-offwhite text-sm tabular-nums">
                    {slide.order}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/hero-slides/${slide._id}/edit`}
                      className="block relative h-10 w-16 rounded-md overflow-hidden"
                    >
                      {hasImage ? (
                        <Image
                          src={getImageUploadUrl(slide.image!.name, "image")}
                          alt={slide.title}
                          fill
                          unoptimized
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ background: slide.gradient || "#0a0a0a" }}
                        />
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium text-offwhite max-w-[200px] truncate">
                    {slide.title}
                  </TableCell>
                  <TableCell className="text-slate-body max-w-[200px] truncate hidden md:table-cell">
                    {slide.subtitle || "-"}
                  </TableCell>
                  <TableCell>
                    {langLabel ? (
                      <Badge
                        variant="outline"
                        className="bg-white/5 text-slate-body border-white/10 text-[10px]"
                      >
                        {langLabel}
                      </Badge>
                    ) : (
                      <span className="text-slate-body/50 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {slide.isActive !== false ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px]">
                        {t("active")}
                      </Badge>
                    ) : (
                      <Badge className="bg-white/5 text-slate-body border-white/10 text-[10px]">
                        {t("inactive")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-end pe-4">
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
                        <DropdownMenuLabel className="text-slate-body text-xs">
                          {slide.title}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Link href={`/admin/hero-slides/${slide._id}/edit`}>
                            <Edit3 className="me-2 h-4 w-4" />
                            {t("edit")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggleActive(slide)}
                          className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                        >
                          {slide.isActive !== false ? (
                            <>
                              <EyeOff className="me-2 h-4 w-4" />
                              {t("deactivate") || "Deactivate"}
                            </>
                          ) : (
                            <>
                              <Eye className="me-2 h-4 w-4" />
                              {t("activate") || "Activate"}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          onClick={() => onDelete(slide._id!)}
                          className="text-crimson-light focus:bg-crimson/10 focus:text-crimson-light cursor-pointer"
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
