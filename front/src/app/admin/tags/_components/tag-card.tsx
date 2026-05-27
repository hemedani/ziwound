"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { tagSchema } from "@/types/declarations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TagCardProps {
  tag: tagSchema;
  onDelete: (id: string) => void;
  index?: number;
}

export function TagCard({ tag, onDelete, index = 0 }: TagCardProps) {
  const t = useTranslations("admin");
  const bgColor = tag.color || "#6b7280";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative rounded-2xl glass-strong border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Color bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: bgColor }} />

      <div className="p-5 space-y-3">
        {/* Icon + Name */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {tag.icon ? (
              <span className="text-2xl leading-none shrink-0">{tag.icon}</span>
            ) : (
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  backgroundColor: `${bgColor}20`,
                  color: bgColor,
                }}
              >
                {(tag.name || "T")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-offwhite truncate">{tag.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: bgColor }}
                />
                <span className="text-xs text-slate-body/60 font-mono">{tag.color || "—"}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong border-white/10">
              <DropdownMenuLabel className="text-slate-body">{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                <Link href={`/admin/tags/${tag._id}/edit`}>
                  <Pencil className="me-2 h-4 w-4" />
                  {t("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                onClick={() => onDelete(tag._id!)}
              >
                <Trash2 className="me-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {tag.description ? (
          <p className="text-sm text-slate-body line-clamp-2 leading-relaxed">{tag.description}</p>
        ) : (
          <p className="text-sm text-slate-body/40 italic">—</p>
        )}
      </div>
    </motion.div>
  );
}
