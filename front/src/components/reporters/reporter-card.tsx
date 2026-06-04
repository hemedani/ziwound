"use client";

import { useTranslations } from "next-intl";
import { User, MapPin, FileText, Shield, Globe } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";
import {
  GlassCard,
  GlassCardContent,
  GlassCardBadge,
  GlassCardDescription,
  GlassCardTags,
  GlassCardFooter,
  GlassCardMeta,
  GlassCardCta,
  GlassCardStats,
  GlassCardAvatar,
  type GlassCardStatItem,
} from "@/components/ui/glass-card";
import type { DeepPartial, userSchema } from "@/types/declarations";

interface ReporterCardProps {
  reporter: DeepPartial<userSchema> & {
    reportCount?: number;
    verifiedCount?: number;
    countries?: Array<{ _id?: string; name?: string; english_name?: string }>;
  };
  locale: string;
  index?: number;
}

function getInitials(firstName?: string, lastName?: string): string {
  const f = (firstName || "").charAt(0).toUpperCase();
  const l = (lastName || "").charAt(0).toUpperCase();
  return f + l || "?";
}

export function ReporterCard({ reporter, locale, index }: ReporterCardProps) {
  const t = useTranslations("reporters");
  const adminT = useTranslations("admin");
  const firstName = reporter.first_name || "";
  const lastName = reporter.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const level = reporter.level || "Ordinary";
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
    <GlassCard href={href} animate index={index}>
      <GlassCardContent className="p-6">
        {/* Avatar + Name Row */}
        <div className="flex items-start gap-4 mb-4">
          <GlassCardAvatar
            src={avatarUrl}
            alt={fullName}
            initials={getInitials(firstName, lastName)}
            size="lg"
            verified={!!reporter.verified}
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-offwhite leading-tight group-hover:text-gold transition-colors duration-300 truncate">
              {fullName}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <GlassCardBadge variant="custom" position="inline">
                <span className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  {adminT(`level_${level}`) || level}
                </span>
              </GlassCardBadge>
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
          <GlassCardDescription text={strippedBio} className="mb-4" />
        )}

        {/* Stats */}
        <GlassCardStats
          className="mb-4"
          items={[
            { icon: <FileText className="h-3.5 w-3.5 text-crimson" />, value: reportCount, label: t("reports") },
            { icon: <Shield className="h-3.5 w-3.5 text-emerald-400" />, value: verifiedCount, label: t("verified") },
            { icon: <Globe className="h-3.5 w-3.5 text-gold" />, value: countries.length, label: t("countries") },
          ]}
        />

        {/* Country Tags */}
        {countries.length > 0 && (
          <GlassCardTags
            tags={countries.slice(0, 3).map((c) => ({ _id: c._id, name: c.name, icon: <MapPin className="h-2.5 w-2.5" /> }))}
            max={3}
          />
        )}
        {countries.length > 3 && (
          <span className="inline-flex items-center rounded-full bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[11px] text-slate-body/60 mt-2">
            +{countries.length - 3}
          </span>
        )}
      </GlassCardContent>

      <GlassCardFooter className="px-6">
        <div className="flex items-center gap-3 text-xs text-slate-body/50">
          {(reporter.city || reporter.province) ? (
            <GlassCardMeta icon={<MapPin className="h-3 w-3 text-gold/60" />}>
              <span className="truncate">
                {[reporter.city?.name, reporter.province?.name].filter(Boolean).join(", ")}
              </span>
            </GlassCardMeta>
          ) : (
            <GlassCardMeta icon={<FileText className="h-3 w-3 text-slate-body/30" />}>
              <span>{reportCount} {t("reports")}</span>
            </GlassCardMeta>
          )}
        </div>
        <GlassCardCta text={t("viewProfile") || "View Profile"} />
      </GlassCardFooter>
    </GlassCard>
  );
}
