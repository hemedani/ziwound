"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { User, Building2, MapPin, FileText, ExternalLink } from "lucide-react";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface WarCriminalCardProps {
  warCriminal: {
    _id?: string;
    fullName: string;
    status: string;
    aliases?: string[];
    nationality?: string[];
    affiliation?: string;
    rankOrPosition?: string;
    knownFor?: Record<string, string>;
    description?: Record<string, string>;
    isEntity?: boolean;
    photo?: { _id?: string; name: string; mimeType?: string; type: string };
  };
  locale: string;
  translations: {
    warCriminals: string;
    warCriminalsOrganizations: string;
    warCriminalsAliases: string;
    warCriminalsKnownFor: string;
    description: string;
    warCriminalsStatusAccused: string;
    warCriminalsStatusIndicted: string;
    warCriminalsStatusConvicted: string;
    warCriminalsStatusAtLarge: string;
    warCriminalsStatusDeceased: string;
    warCriminalsStatusUnknown: string;
    warCriminalsStatusSanctioned: string;
    warCriminalsAffiliationMilitary: string;
    warCriminalsAffiliationParamilitary: string;
    warCriminalsAffiliationGovernment: string;
    warCriminalsAffiliationRebelGroup: string;
    warCriminalsAffiliationPrivateMilitaryCompany: string;
    warCriminalsAffiliationPolitical: string;
    warCriminalsAffiliationOther: string;
  };
}

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
  Military: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Paramilitary: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Government: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Rebel Group": "bg-red-500/20 text-red-400 border-red-500/30",
  "Private Military Company": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Political: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Other: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

function getStatusTranslation(status: string, t: WarCriminalCardProps["translations"]): string {
  const map: Record<string, string> = {
    Accused: t.warCriminalsStatusAccused,
    Indicted: t.warCriminalsStatusIndicted,
    Convicted: t.warCriminalsStatusConvicted,
    "At Large": t.warCriminalsStatusAtLarge,
    Deceased: t.warCriminalsStatusDeceased,
    Unknown: t.warCriminalsStatusUnknown,
    Sanctioned: t.warCriminalsStatusSanctioned,
  };
  return map[status] || status;
}

function getAffiliationTranslation(affiliation: string, t: WarCriminalCardProps["translations"]): string {
  const map: Record<string, string> = {
    Military: t.warCriminalsAffiliationMilitary,
    Paramilitary: t.warCriminalsAffiliationParamilitary,
    Government: t.warCriminalsAffiliationGovernment,
    "Rebel Group": t.warCriminalsAffiliationRebelGroup,
    "Private Military Company": t.warCriminalsAffiliationPrivateMilitaryCompany,
    Political: t.warCriminalsAffiliationPolitical,
    Other: t.warCriminalsAffiliationOther,
  };
  return map[affiliation] || affiliation;
}

export function WarCriminalCard({ warCriminal, locale, translations: t }: WarCriminalCardProps) {
  const knownForText = warCriminal.knownFor?.[locale] || warCriminal.knownFor?.en || "";
  const descriptionText = warCriminal.description?.[locale] || warCriminal.description?.en || "";

  return (
    <Link
      href={`/war-criminals/${warCriminal._id}`}
      className="group block rounded-2xl glass-light border border-white/[0.06] overflow-hidden hover:border-crimson/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-crimson/5"
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Photo */}
          <div className="shrink-0">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/[0.08]">
              {warCriminal.photo ? (
                <Image
                  src={getImageUploadUrl(warCriminal.photo.name, warCriminal.photo.type as "image" | "video" | "docs")}
                  alt={warCriminal.fullName}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-crimson/20 via-background to-gold/10">
                  {warCriminal.isEntity ? (
                    <Building2 className="h-10 w-10 text-offwhite/20" />
                  ) : (
                    <User className="h-10 w-10 text-offwhite/20" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name & Status */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg md:text-xl font-bold text-offwhite group-hover:text-crimson-light transition-colors">
                {warCriminal.fullName}
              </h3>
              <ExternalLink className="h-4 w-4 text-slate-body/50 group-hover:text-crimson-light transition-colors shrink-0 mt-1" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={`${statusColors[warCriminal.status] || "bg-slate-500/20 text-slate-400"} border text-xs`}>
                {getStatusTranslation(warCriminal.status, t)}
              </Badge>
              {warCriminal.affiliation && (
                <Badge className={`${affiliationColors[warCriminal.affiliation] || "bg-slate-500/20 text-slate-400"} text-xs`}>
                  {getAffiliationTranslation(warCriminal.affiliation, t)}
                </Badge>
              )}
              {warCriminal.isEntity && (
                <Badge variant="outline" className="border-white/10 text-slate-body text-xs">
                  {t.warCriminalsOrganizations}
                </Badge>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-body/70 mb-3">
              {warCriminal.nationality && warCriminal.nationality.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gold/70" />
                  <span>{warCriminal.nationality.join(", ")}</span>
                </div>
              )}
              {warCriminal.rankOrPosition && (
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-gold/70" />
                  <span>{warCriminal.rankOrPosition}</span>
                </div>
              )}
            </div>

            {/* Aliases */}
            {warCriminal.aliases && warCriminal.aliases.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-slate-body/50 mb-1">{t.warCriminalsAliases}</p>
                <div className="flex flex-wrap gap-1.5">
                  {warCriminal.aliases.slice(0, 3).map((alias, i) => (
                    <Badge key={i} variant="outline" className="border-white/[0.08] text-slate-body text-xs">
                      {alias}
                    </Badge>
                  ))}
                  {warCriminal.aliases.length > 3 && (
                    <span className="text-xs text-slate-body/50">+{warCriminal.aliases.length - 3}</span>
                  )}
                </div>
              </div>
            )}

            {/* Known For */}
            {knownForText && (
              <div className="mb-3">
                <p className="text-xs text-slate-body/50 mb-1">{t.warCriminalsKnownFor}</p>
                <p className="text-sm text-slate-body/70 line-clamp-2">{knownForText}</p>
              </div>
            )}

            {/* Description */}
            {descriptionText && (
              <div>
                <p className="text-xs text-slate-body/50 mb-1">{t.description}</p>
                <p className="text-sm text-slate-body/70 line-clamp-2">{descriptionText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
