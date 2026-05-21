"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { User, MapPin, FileText, Shield, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUploadUrl } from "@/utils/imageUrl";
import type { DeepPartial, userSchema } from "@/types/declarations";

interface ReporterCardProps {
  reporter: DeepPartial<userSchema> & {
    reportCount?: number;
    verifiedCount?: number;
    countries?: Array<{ _id?: string; name?: string; english_name?: string }>;
  };
  locale: string;
}

const levelConfig: Record<string, { bg: string; text: string; border: string }> = {
  Reporter: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  Editor: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  Researcher: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  Diplomat: { bg: "bg-gold/10", text: "text-gold", border: "border-gold/20" },
  Artist: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  Ghost: { bg: "bg-crimson/10", text: "text-crimson-light", border: "border-crimson/20" },
  Manager: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  Ordinary: { bg: "bg-white/5", text: "text-slate-body", border: "border-white/10" },
};

function getInitials(firstName?: string, lastName?: string): string {
  const f = (firstName || "").charAt(0).toUpperCase();
  const l = (lastName || "").charAt(0).toUpperCase();
  return f + l || "?";
}

export function ReporterCard({ reporter, locale }: ReporterCardProps) {
  const t = useTranslations("reporters");
  const adminT = useTranslations("admin");
  const firstName = reporter.first_name || "";
  const lastName = reporter.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const level = reporter.level || "Ordinary";
  const levelCfg = levelConfig[level] || levelConfig.Ordinary;
  const reportCount = reporter.reportCount || 0;
  const verifiedCount = reporter.verifiedCount || 0;
  const countries = reporter.countries || [];
  const bio = reporter.bio as Record<string, string> | undefined;
  const bioText = bio?.[locale] || bio?.en || "";
  const strippedBio = bioText.replace(/<[^>]*>/g, "").trim();

  const avatarUrl = reporter.avatar?.name
    ? getImageUploadUrl(reporter.avatar.name, reporter.avatar.type as "image" | "video" | "docs")
    : null;

  const href = `/${locale}/reporters/${reporter._id}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-crimson/5"
    >
      {/* Avatar + Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              fill
              unoptimized
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-body/50">
              {getInitials(firstName, lastName)}
            </div>
          )}
          {reporter.verified && (
            <div className="absolute -bottom-0.5 -end-0.5 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
              <Shield className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-offwhite leading-tight group-hover:text-gold transition-colors duration-300 truncate">
            {fullName}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge className={`${levelCfg.bg} ${levelCfg.text} ${levelCfg.border} text-xs`}>
              {adminT(`level_${level}`) || level}
            </Badge>
            {reporter.is_verified && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/80">
                <Shield className="h-2.5 w-2.5" />
                {t("emailVerified")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {strippedBio && (
        <p className="text-sm text-slate-body/60 line-clamp-2 leading-relaxed mb-4">
          {strippedBio}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex flex-col items-center rounded-lg bg-white/[0.03] border border-white/[0.04] py-2 px-1">
          <FileText className="h-3.5 w-3.5 text-crimson mb-1" />
          <span className="text-sm font-bold text-offwhite">{reportCount}</span>
          <span className="text-[10px] text-slate-body/50">{t("reports")}</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-white/[0.03] border border-white/[0.04] py-2 px-1">
          <Shield className="h-3.5 w-3.5 text-emerald-400 mb-1" />
          <span className="text-sm font-bold text-offwhite">{verifiedCount}</span>
          <span className="text-[10px] text-slate-body/50">{t("verified")}</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-white/[0.03] border border-white/[0.04] py-2 px-1">
          <Globe className="h-3.5 w-3.5 text-gold mb-1" />
          <span className="text-sm font-bold text-offwhite">{countries.length}</span>
          <span className="text-[10px] text-slate-body/50">{t("countries")}</span>
        </div>
      </div>

      {/* Location badges */}
      {countries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {countries.slice(0, 3).map((c) => (
            <Badge key={c._id} className="bg-white/5 text-slate-body border-white/10 text-xs gap-1">
              <MapPin className="h-2.5 w-2.5" />
              {c.name}
            </Badge>
          ))}
          {countries.length > 3 && (
            <Badge variant="outline" className="text-xs border-white/10 bg-white/5 text-slate-body">
              +{countries.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.04]">
        {(reporter.city || reporter.province) && (
          <div className="flex items-center gap-1 text-xs text-slate-body/50">
            <MapPin className="h-3 w-3 text-gold/60" />
            <span className="truncate">
              {[reporter.city?.name, reporter.province?.name].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-sm font-medium text-crimson opacity-0 transition-all duration-300 group-hover:opacity-100 ms-auto">
          <span className="text-xs">{t("viewProfile")}</span>
        </div>
      </div>
    </Link>
  );
}
