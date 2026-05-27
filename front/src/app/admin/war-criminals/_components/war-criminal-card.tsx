"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { warCriminalSchema } from "@/types/declarations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { MoreHorizontal, Pencil, Trash2, ExternalLink, User, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { remove } from "@/app/actions/warCriminal/remove";
import { useToast } from "@/components/ui/use-toast";

const statusColors: Record<string, string> = {
  Accused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Indicted: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Convicted: "bg-red-500/20 text-red-400 border-red-500/30",
  "At Large": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Deceased: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Unknown: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Sanctioned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const affiliationColors: Record<string, string> = {
  Military: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Paramilitary: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  Government: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "Rebel Group": "bg-red-500/10 text-red-300 border-red-500/20",
  "Private Military Company": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Political: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  Other: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

const statusTranslationKeys: Record<string, string> = {
  Accused: "Accused",
  Indicted: "Indicted",
  Convicted: "Convicted",
  "At Large": "atLarge",
  Deceased: "Deceased",
  Sanctioned: "Sanctioned",
};

const affiliationTranslationKeys: Record<string, string> = {
  Military: "Military",
  Paramilitary: "Paramilitary",
  Government: "Government",
  "Rebel Group": "rebelGroup",
  "Private Military Company": "privateMilitaryCompany",
  Political: "Political",
  Other: "Other",
};

interface WarCriminalCardProps {
  wc: warCriminalSchema;
  onDelete: (id: string) => void;
  index: number;
}

export function WarCriminalCard({ wc, onDelete, index }: WarCriminalCardProps) {
  const t = useTranslations("admin");
  const photoName = (wc.photo as { _id?: string; name?: string } | undefined)?.name;

  const initials = wc.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "WC";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300"
    >
      {/* Photo Section */}
      <Link href={`/admin/war-criminals/${wc._id}`} className="block">
        <div className="relative h-44 w-full overflow-hidden">
          {photoName ? (
            <Image
              src={getImageUploadUrl(photoName, "image")}
              alt={wc.fullName}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-crimson/20 to-crimson/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-offwhite/30">{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between gap-2">
            {wc.isEntity ? (
              <Badge variant="outline" className="border-white/20 bg-black/40 text-offwhite/80 text-[10px] backdrop-blur-sm">
                <Building2 className="h-3 w-3 me-1" />
                {t("organization") || "Organization"}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-white/20 bg-black/40 text-offwhite/80 text-[10px] backdrop-blur-sm">
                <User className="h-3 w-3 me-1" />
                {t("individual") || "Individual"}
              </Badge>
            )}
            {wc.status && (
              <Badge className={`${statusColors[wc.status] || "bg-slate-500/20 text-slate-400"} text-[10px]`}>
                {t(statusTranslationKeys[wc.status] || wc.status) || wc.status}
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link href={`/admin/war-criminals/${wc._id}`} className="block">
          <h3 className="font-semibold text-offwhite group-hover:text-crimson-light transition-colors line-clamp-1">
            {wc.fullName}
          </h3>
        </Link>

        {wc.aliases && wc.aliases.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {wc.aliases.slice(0, 2).map((alias, i) => (
              <Badge key={i} variant="outline" className="text-[10px] border-white/10 text-slate-body">
                {alias}
              </Badge>
            ))}
            {wc.aliases.length > 2 && (
              <Badge variant="outline" className="text-[10px] border-white/10 text-slate-body">
                +{wc.aliases.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {wc.affiliation ? (
            <Badge className={`${affiliationColors[wc.affiliation] || "bg-slate-500/10 text-slate-300"} text-[10px]`}>
              {t(affiliationTranslationKeys[wc.affiliation] || wc.affiliation) || wc.affiliation}
            </Badge>
          ) : (
            <span />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0 text-slate-body hover:text-offwhite hover:bg-white/5">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong border-white/10">
              <DropdownMenuLabel className="text-slate-body text-xs">{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                <Link href={`/admin/war-criminals/${wc._id}`}>
                  <ExternalLink className="me-2 h-3.5 w-3.5" />
                  {t("view") || "View"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                <Link href={`/admin/war-criminals/${wc._id}/edit`}>
                  <Pencil className="me-2 h-3.5 w-3.5" />
                  {t("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                onClick={() => onDelete(wc._id!)}
              >
                <Trash2 className="me-2 h-3.5 w-3.5" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
