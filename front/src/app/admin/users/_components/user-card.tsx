"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { userSchema } from "@/types/declarations";
import { Button } from "@/components/ui/button";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { MoreHorizontal, Pencil, Trash2, ImageUp, User, ShieldCheck, MailCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getLevelStyles(level: string) {
  switch (level) {
    case "Ghost": return "bg-crimson/15 text-crimson-light border-crimson/20";
    case "Manager": return "bg-gold/15 text-gold border-gold/20";
    case "Editor": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Reporter": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Artist": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Diplomat": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Researcher": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    default: return "bg-white/5 text-slate-body border-white/10";
  }
}

interface UserCardProps {
  user: userSchema;
  onDelete: (id: string) => void;
  index?: number;
}

export function UserCard({ user, onDelete, index = 0 }: UserCardProps) {
  const t = useTranslations("admin");
  const levelStyles = getLevelStyles(user.level);
  const levelLabelKey = user.level === "Reporter" || user.level === "Artist" || user.level === "Diplomat" || user.level === "Researcher"
    ? user.level
    : `level_${user.level}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative rounded-2xl glass-strong border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-300"
    >
      {/* Avatar */}
      <div className="relative h-36 w-full bg-white/[0.02] overflow-hidden">
        {user.avatar ? (
          <Image
            src={getImageUploadUrl(user.avatar.name, "image")}
            alt={`${user.first_name} ${user.last_name}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <User className="h-12 w-12 text-slate-body/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute bottom-3 start-3 end-3">
          <h3 className="font-bold text-offwhite text-lg leading-tight truncate">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-xs text-slate-body/80 truncate">{user.email}</p>
        </div>
      </div>

      <div className="p-4">
        {/* Level Badge + Verifications */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${levelStyles}`}>
            {t(levelLabelKey) || user.level}
          </span>
          {user.is_verified && (
            <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              <MailCheck className="h-3 w-3" />
              {t("verified") || "Verified"}
            </span>
          )}
          {user.verified && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <ShieldCheck className="h-3 w-3" />
              {t("roleVerified") || "Role Verified"}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-white/[0.06]">
          <Button variant="ghost" size="sm" asChild className="text-slate-body hover:text-offwhite hover:bg-white/5 h-8 px-2">
            <Link href={`/admin/users/${user._id}/edit`}>
              <Pencil className="h-3.5 w-3.5 me-1" />
              {t("edit")}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-slate-body hover:text-offwhite hover:bg-white/5 h-8 px-2">
            <Link href={`/admin/users/${user._id}/update-relations`}>
              <ImageUp className="h-3.5 w-3.5 me-1" />
              {t("photo") || "Photo"}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user._id!)}
            className="text-slate-body hover:text-red-400 hover:bg-red-500/10 h-8 px-2 ms-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
